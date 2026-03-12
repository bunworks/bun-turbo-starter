/**
 * API endpoint: POST /api/gig/chat-generate
 * Streaming AI генерация ТЗ разового задания
 */
import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import {
  botSettings,
  workspace,
  workspaceMember,
} from "@acme/db/schema";
import { getRateLimiter } from "@acme/lib";
import type { Context } from "hono";
import { getSession } from "../../auth";
import { createGigStream } from "./create-stream";
import { gigChatRequestSchema } from "./types";

export async function handleGigChatGenerate(c: Context) {
  try {
    const session = await getSession(c.req.raw.headers);
    if (!session?.user) {
      return c.json({ error: "Не авторизован" }, 401);
    }

    let body: unknown;
    try {
      body = await c.req.json();
    } catch (parseError) {
      return c.json(
        {
          error: "Ошибка парсинга запроса",
          details:
            parseError instanceof Error ? parseError.message : "Неверный JSON",
        },
        400,
      );
    }

    const validationResult = gigChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "Ошибка валидации",
          details: validationResult.error.flatten(),
        },
        400,
      );
    }

    const { workspaceId, message, currentDocument, conversationHistory } =
      validationResult.data;

    const workspaceData = await db.query.workspace.findFirst({
      where: eq(workspace.id, workspaceId),
      with: {
        members: {
          where: eq(workspaceMember.userId, session.user.id),
        },
      },
    });

    if (
      !workspaceData ||
      !workspaceData.members ||
      workspaceData.members.length === 0
    ) {
      return c.json({ error: "Нет доступа к рабочему пространству" }, 403);
    }

    // Rate limit after validation — use validated workspaceId to prevent bypass
    const workspaceIdForLimit = workspaceId;
    const rateLimitKey = `gig-chat:${session.user.id}:${workspaceIdForLimit}`;
    const rateLimitResult = getRateLimiter().check(rateLimitKey, 10, 60_000);
    if (!rateLimitResult.allowed) {
      const resetInSeconds = Math.max(
        1,
        Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      );
      return c.json(
        {
          error: "Превышен лимит запросов",
          retryAfter: resetInSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": resetInSeconds.toString(),
          },
        },
      );
    }

    const botSettingsRow = await db.query.botSettings.findFirst({
      where: eq(botSettings.workspaceId, workspaceId),
    });

    const companySettings = botSettingsRow
      ? {
          companyName: botSettingsRow.companyName,
          companyDescription: botSettingsRow.companyDescription ?? undefined,
          botName: botSettingsRow.botName ?? undefined,
          botRole: botSettingsRow.botRole ?? undefined,
        }
      : null;

    try {
      const stream = createGigStream({
        message,
        currentDocument,
        conversationHistory,
        companySettings,
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось сгенерировать задание";
      return c.json({ error: message }, 500);
    }
  } catch (error) {
    console.error("[gig-chat-generate] API error:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
}
