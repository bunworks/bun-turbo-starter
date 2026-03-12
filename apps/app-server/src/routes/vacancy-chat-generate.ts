/**
 * API endpoint: POST /api/vacancy/chat-generate
 * Streaming AI генерация контента вакансии
 */
import { AuditLoggerService } from "@acme/api";
import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import {
  botSettings,
  workspace,
  workspaceMember,
} from "@acme/db/schema";
import {
  checkRateLimit,
  sanitizeConversationMessage,
  sanitizePromptText,
  truncateText,
} from "@acme/lib";
import { streamText } from "@acme/lib/ai";
import type { Context } from "hono";
import { z } from "zod";
import { getSession } from "../auth";

interface VacancyDocument {
  title?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  conditions?: string;
  bonuses?: string;
  customBotInstructions?: string;
  customScreeningPrompt?: string;
  customInterviewQuestions?: string;
  customOrganizationalQuestions?: string;
}

interface QuickReply {
  id: string;
  label: string;
  value: string;
}

interface AIResponse {
  message?: string;
  quickReplies?: QuickReply[];
  isMultiSelect?: boolean;
  document?: VacancyDocument;
}

function extractPartialResponse(
  text: string,
  fallback?: VacancyDocument,
): AIResponse {
  const result: AIResponse = { document: { ...fallback } };

  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const messageMatch = cleanText.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
  if (messageMatch?.[1]) {
    try {
      result.message = JSON.parse(`"${messageMatch[1]}"`);
    } catch {
      result.message = messageMatch[1]
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"');
    }
  }

  const quickRepliesMatch = cleanText.match(
    /"quickReplies"\s*:\s*\[([\s\S]*?)\]/,
  );
  if (quickRepliesMatch?.[1]) {
    try {
      const repliesText = `[${quickRepliesMatch[1]}]`;
      result.quickReplies = JSON.parse(repliesText);
    } catch {
      // Ignore parse errors
    }
  }

  const multiSelectMatch = cleanText.match(
    /"isMultiSelect"\s*:\s*(true|false)/,
  );
  if (multiSelectMatch?.[1]) {
    result.isMultiSelect = multiSelectMatch[1] === "true";
  }

  const docFields = [
    "title",
    "description",
    "requirements",
    "responsibilities",
    "conditions",
    "bonuses",
  ] as const;

  const docMatch = cleanText.match(
    /"document"\s*:\s*\{([\s\S]*?)(?:\}(?=\s*[,}])|$)/,
  );
  const docText = docMatch?.[1] || cleanText;

  for (const field of docFields) {
    const regex = new RegExp(
      `"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)(?:"|$)`,
      "s",
    );
    const match = docText.match(regex);
    if (match?.[1] && result.document) {
      try {
        result.document[field] = JSON.parse(`"${match[1]}"`);
      } catch {
        result.document[field] = match[1]
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, "\\");
      }
    }
  }

  return result;
}

function parseAIResponse(
  text: string,
  fallback?: VacancyDocument,
): { response: AIResponse; isComplete: boolean } {
  let cleanText = text.trim();
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith("```")) {
    cleanText = cleanText.slice(0, -3);
  }
  cleanText = cleanText.trim();

  const startIndex = cleanText.indexOf("{");
  if (startIndex === -1) {
    return {
      response: extractPartialResponse(text, fallback),
      isComplete: false,
    };
  }

  let braceCount = 0;
  let endIndex = -1;

  for (let i = startIndex; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === "{") braceCount++;
    else if (char === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    return {
      response: extractPartialResponse(cleanText, fallback),
      isComplete: false,
    };
  }

  const jsonText = cleanText.substring(startIndex, endIndex + 1);

  try {
    const parsed = JSON.parse(jsonText);
    return {
      response: validateAndNormalizeResponse(parsed, fallback),
      isComplete: true,
    };
  } catch {
    return {
      response: extractPartialResponse(cleanText, fallback),
      isComplete: false,
    };
  }
}

function validateAndNormalizeResponse(
  parsed: unknown,
  fallbackDocument?: VacancyDocument,
): AIResponse {
  if (!parsed || typeof parsed !== "object") {
    return { document: fallbackDocument || {} };
  }

  const data = parsed as Record<string, unknown>;
  const result: AIResponse = {};

  if (typeof data.message === "string") {
    result.message = data.message;
  }

  if (Array.isArray(data.quickReplies)) {
    result.quickReplies = data.quickReplies
      .filter((r): r is Record<string, unknown> => r && typeof r === "object")
      .map((r) => ({
        id: String(r.id || ""),
        label: String(r.label || ""),
        value: String(r.value || ""),
      }))
      .filter((r) => r.label && r.value);
  }

  if (typeof data.isMultiSelect === "boolean") {
    result.isMultiSelect = data.isMultiSelect;
  }

  const docData =
    data.document && typeof data.document === "object"
      ? (data.document as Record<string, unknown>)
      : data;

  const getString = (key: string, fallback: string = ""): string => {
    const value = docData[key];
    if (value === null || value === undefined) return fallback;
    return typeof value === "string" ? value : fallback;
  };

  result.document = {
    title: getString("title", fallbackDocument?.title || ""),
    description: getString("description", fallbackDocument?.description || ""),
    requirements: getString(
      "requirements",
      fallbackDocument?.requirements || "",
    ),
    responsibilities: getString(
      "responsibilities",
      fallbackDocument?.responsibilities || "",
    ),
    conditions: getString("conditions", fallbackDocument?.conditions || ""),
    bonuses: getString("bonuses", fallbackDocument?.bonuses || ""),
    customBotInstructions: fallbackDocument?.customBotInstructions || "",
    customScreeningPrompt: fallbackDocument?.customScreeningPrompt || "",
    customInterviewQuestions: fallbackDocument?.customInterviewQuestions || "",
    customOrganizationalQuestions:
      fallbackDocument?.customOrganizationalQuestions || "",
  };

  return result;
}

const vacancyChatRequestSchema = z.object({
  workspaceId: z.string().min(1, "workspaceId обязателен"),
  message: z
    .string()
    .min(1, "Сообщение не может быть пустым")
    .max(5000, "Сообщение не может превышать 5000 символов"),
  currentDocument: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      requirements: z.string().optional(),
      responsibilities: z.string().optional(),
      conditions: z.string().optional(),
      bonuses: z.string().optional(),
      customBotInstructions: z.string().optional(),
      customScreeningPrompt: z.string().optional(),
      customInterviewQuestions: z.string().optional(),
      customOrganizationalQuestions: z.string().optional(),
    })
    .optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(10, "История диалога не может содержать более 10 сообщений")
    .optional(),
});

function buildVacancyGenerationPrompt(
  message: string,
  currentDocument?: VacancyDocument,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>,
  companySettings?: {
    name: string;
    description?: string | null;
    website?: string | null;
    botName?: string | null;
    botRole?: string | null;
  } | null,
): string {
  const historySection = conversationHistory?.length
    ? `
ИСТОРИЯ ДИАЛОГА:
${conversationHistory
  .map(
    (msg) =>
      `${msg.role === "user" ? "Пользователь" : "Ассистент"}: ${msg.content}`,
  )
  .join("\n")}
`
    : "";

  const documentSection = currentDocument
    ? `
ТЕКУЩИЙ ДОКУМЕНТ ВАКАНСИИ:
${currentDocument.title ? `Название: ${currentDocument.title}` : "(не заполнено)"}
${currentDocument.description ? `Описание вакансии:\n${currentDocument.description}` : "(не заполнено)"}
${currentDocument.requirements ? `Требования:\n${currentDocument.requirements}` : "(не заполнено)"}
${currentDocument.responsibilities ? `Обязанности:\n${currentDocument.responsibilities}` : "(не заполнено)"}
${currentDocument.conditions ? `Условия:\n${currentDocument.conditions}` : "(не заполнено)"}
`
    : "ТЕКУЩИЙ ДОКУМЕНТ: (пусто - ничего не заполнено)";

  const companySection = companySettings
    ? `
НАСТРОЙКИ КОМПАНИИ:
Название компании: ${companySettings.name}
${companySettings.description ? `Описание компании: ${companySettings.description}` : ""}
${companySettings.website ? `Сайт: ${companySettings.website}` : ""}
`
    : "";

  const botPersonality =
    companySettings?.botName && companySettings?.botRole
      ? `Ты — ${companySettings.botName}, ${companySettings.botRole} компании "${companySettings.name}".`
      : companySettings?.name
        ? `Ты — дружелюбный HR-ассистент компании "${companySettings.name}".`
        : "Ты — дружелюбный HR-ассистент, помогающий создавать вакансии.";

  return `${botPersonality}

ЗАДАЧА: Помоги пользователю создать вакансию в интерактивном режиме. Веди диалог, задавай уточняющие вопросы, предлагай варианты для выбора.
${companySection}${historySection}
СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ:
${message}
${documentSection}

ПРАВИЛА ДИАЛОГА:
1. Будь дружелюбным и помогающим
2. Если пользователь дал информацию — обнови соответствующие поля документа
3. После обновления документа — задай следующий логичный вопрос
4. Предлагай 3-5 вариантов для быстрого выбора (quickReplies)
5. Варианты должны быть релевантны текущему этапу создания вакансии
6. Если документ почти готов — предложи финальные штрихи или подтверждение
7. Используй isMultiSelect: true когда пользователь может выбрать НЕСКОЛЬКО вариантов (навыки, технологии, бенефиты)
8. Используй isMultiSelect: false для одиночного выбора (должность, уровень, формат работы)

ФОРМАТ ОТВЕТА (строго JSON):
{
  "message": "Твой ответ пользователю.",
  "isMultiSelect": false,
  "quickReplies": [
    {"id": "1", "label": "Краткий текст кнопки", "value": "Полный текст который отправится как сообщение"}
  ],
  "document": {
    "title": "Название должности или null",
    "description": "Описание или null",
    "requirements": "Требования или null",
    "responsibilities": "Обязанности или null",
    "conditions": "Условия или null",
    "bonuses": "Премии или null"
  }
}

ВАЖНО: Верни ТОЛЬКО валидный JSON`;
}

export async function handleVacancyChatGenerate(c: Context) {
  let workspaceId: string | undefined;
  let userId: string | undefined;

  try {
    const session = await getSession(c.req.raw.headers);
    if (!session?.user) {
      return c.json({ error: "Не авторизован" }, 401);
    }

    userId = session.user.id;

    let body: unknown;
    try {
      body = await c.req.json();
    } catch (parseError) {
      return c.json(
        {
          error: "Ошибка парсинга запроса",
          details:
            parseError instanceof Error ? parseError.message : "Invalid JSON",
        },
        400,
      );
    }

    const validationResult = vacancyChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return c.json(
        {
          error: "Ошибка валидации",
          details: validationResult.error.flatten(),
        },
        400,
      );
    }

    const {
      workspaceId: wsId,
      message,
      currentDocument,
      conversationHistory,
    } = validationResult.data;

    workspaceId = wsId;

    const rateLimitResult = checkRateLimit(workspaceId, 10, 60_000);
    if (!rateLimitResult.allowed) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000,
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
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
          },
        },
      );
    }

    const sanitizedMessage = truncateText(sanitizePromptText(message), 5000);
    const sanitizedHistory = conversationHistory
      ? conversationHistory
          .slice(0, 10)
          .map((msg) => sanitizeConversationMessage(msg))
      : undefined;

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
      return c.json({ error: "Нет доступа к workspace" }, 403);
    }

    let companySettingsData = null;
    try {
      const botSettingsRow = await db.query.botSettings.findFirst({
        where: eq(botSettings.workspaceId, workspaceId),
      });

      companySettingsData = botSettingsRow
        ? {
            name: botSettingsRow.companyName,
            description: botSettingsRow.companyDescription,
            website: botSettingsRow.companyWebsite,
            botName: botSettingsRow.botName,
            botRole: botSettingsRow.botRole,
          }
        : null;
    } catch {
      companySettingsData = null;
    }

    try {
      const auditLogger = new AuditLoggerService(db);
      await auditLogger.logAccess({
        userId: session.user.id,
        action: "ACCESS",
        resourceType: "VACANCY",
        resourceId: "00000000-0000-0000-0000-000000000000",
        metadata: {
          action: "vacancy_ai_generation_started",
          workspaceId,
          messageLength: sanitizedMessage.length,
          hasConversationHistory: !!sanitizedHistory?.length,
        },
      });
    } catch {
      /* non-blocking */
    }

    const prompt = buildVacancyGenerationPrompt(
      sanitizedMessage,
      currentDocument,
      sanitizedHistory,
      companySettingsData,
    );

    let result: ReturnType<typeof streamText>;
    try {
      result = streamText({ prompt });
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      return c.json(
        { error: "Не удалось сгенерировать вакансию. Попробуйте позже." },
        500,
      );
    }

    const encoder = new TextEncoder();
    let fullText = "";
    let lastSentResponse: AIResponse | null = null;
    let chunkCounter = 0;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            fullText += chunk;
            chunkCounter++;

            if (chunkCounter % 3 === 0) {
              const { response: partialResponse } = parseAIResponse(
                fullText,
                currentDocument,
              );

              const responseString = JSON.stringify(partialResponse);
              const lastResponseString = JSON.stringify(lastSentResponse);

              if (responseString !== lastResponseString) {
                lastSentResponse = partialResponse;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      document: partialResponse.document,
                      message: partialResponse.message,
                      partial: true,
                    })}\n\n`,
                  ),
                );
              }
            }
          }

          const { response: finalResponse, isComplete } = parseAIResponse(
            fullText,
            currentDocument,
          );

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                document: finalResponse.document,
                message: finalResponse.message,
                quickReplies: finalResponse.quickReplies,
                isMultiSelect: finalResponse.isMultiSelect ?? false,
                done: true,
              })}\n\n`,
            ),
          );

          if (userId && workspaceId) {
            try {
              const auditLogger = new AuditLoggerService(db);
              await auditLogger.logAccess({
                userId,
                action: "ACCESS",
                resourceType: "VACANCY",
                resourceId: "00000000-0000-0000-0000-000000000000",
                metadata: {
                  action: "vacancy_ai_generation_completed",
                  workspaceId,
                  documentComplete: isComplete,
                  responseLength: fullText.length,
                },
              });
            } catch {
              /* non-blocking */
            }
          }

          controller.close();
        } catch (streamError) {
          console.error("Streaming error:", streamError);

          const { response: recoveredResponse } = parseAIResponse(
            fullText,
            currentDocument,
          );

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                document: recoveredResponse.document,
                message: recoveredResponse.message,
                error:
                  streamError instanceof Error
                    ? streamError.message
                    : "Ошибка генерации",
                done: true,
              })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return c.json({ error: "Внутренняя ошибка сервера" }, 500);
  }
}
