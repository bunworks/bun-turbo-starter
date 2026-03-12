/**
 * API endpoint: GET /api/resume/:responseId/download
 * Скачивание PDF резюме с именем файла ФИО.pdf
 */

import { eq, WorkspaceRepository } from "@acme/db";
import { db } from "@acme/db/client";
import {
  gig,
  response as responseTable,
  vacancy,
} from "@acme/db/schema";
import { getFileStreamFromS3 } from "@acme/lib/s3";
import { Hono } from "hono";
import { auth } from "../auth";

const workspaceRepository = new WorkspaceRepository(db);

function sanitizeFilename(name: string | null): string {
  const base = name?.trim().replace(/[/\\:*?"<>|]/g, "_") || "Кандидат";
  return `${base}.pdf`;
}

/** Формирует Content-Disposition с RFC 5987 для UTF-8 имён */
function contentDisposition(filename: string, inline: boolean): string {
  const disposition = inline ? "inline" : "attachment";
  const asciiFallback = "resume.pdf";
  const utf8Encoded = encodeURIComponent(filename);
  return `${disposition}; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`;
}

const app = new Hono();

app.get("/:responseId/download", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    return c.json({ error: "Требуется авторизация" }, 401);
  }

  const responseId = c.req.param("responseId");

  const responseRecord = await db.query.response.findFirst({
    where: eq(responseTable.id, responseId),
    columns: {
      id: true,
      resumePdfFileId: true,
      candidateName: true,
      entityId: true,
      entityType: true,
    },
  });

  if (!responseRecord) {
    return c.json({ error: "Отклик не найден" }, 404);
  }

  if (!responseRecord.resumePdfFileId) {
    return c.json({ error: "PDF резюме отсутствует" }, 404);
  }

  // Получаем workspaceId через vacancy или gig
  let workspaceId: string | null = null;
  if (responseRecord.entityType === "vacancy") {
    const v = await db.query.vacancy.findFirst({
      where: eq(vacancy.id, responseRecord.entityId),
      columns: { workspaceId: true },
    });
    workspaceId = v?.workspaceId ?? null;
  } else if (responseRecord.entityType === "gig") {
    const g = await db.query.gig.findFirst({
      where: eq(gig.id, responseRecord.entityId),
      columns: { workspaceId: true },
    });
    workspaceId = g?.workspaceId ?? null;
  }

  if (!workspaceId) {
    return c.json({ error: "Отклик не найден" }, 404);
  }

  const access = await workspaceRepository.checkAccess(
    workspaceId,
    session.user.id,
  );

  if (!access) {
    return c.json({ error: "Нет доступа к этому ресурсу" }, 403);
  }

  const resumePdfFileId = responseRecord.resumePdfFileId;
  const fileRecord = resumePdfFileId
    ? await db.query.file.findFirst({
        where: (f, { eq }) => eq(f.id, resumePdfFileId),
        columns: { key: true, mimeType: true },
      })
    : null;

  if (!fileRecord) {
    return c.json({ error: "Файл не найден" }, 404);
  }

  try {
    const { body, contentType } = await getFileStreamFromS3(fileRecord.key);
    const filename = sanitizeFilename(responseRecord.candidateName);
    const openInline = c.req.query("open") === "1";

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/pdf",
        "Content-Disposition": contentDisposition(filename, openInline),
      },
    });
  } catch (error) {
    console.error("[resume-download] Error:", error);
    return c.json({ error: "Ошибка при получении файла" }, 500);
  }
});

export const resumeDownloadRoutes = app;
