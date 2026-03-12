import {
  sanitizeConversationMessage,
  sanitizePromptText,
  truncateText,
} from "@acme/lib";
import { streamText } from "@acme/lib/ai";
import { buildGigPrompt } from "./build-prompt";
import { parseGigAIResponse } from "./parse-ai-response";
import {
  GIG_CHAT_MESSAGE_MAX_LENGTH,
  type GigAIResponse,
  type GigDocument,
} from "./types";

const GIG_FIELD_LIMITS = {
  title: 200,
  description: 5000,
  deliverables: 3000,
  requiredSkills: 1000,
  budgetRange: 100,
  timeline: 100,
} as const;

function filterAIContent(
  value: string | null | undefined,
  maxLength: number,
): string {
  if (value == null || typeof value !== "string") return "";
  return truncateText(sanitizePromptText(value), maxLength);
}

function sanitizeGigDocument(doc: GigDocument | undefined): GigDocument {
  if (!doc) return {};
  const result: GigDocument = {};
  const entries: Array<keyof GigDocument> = [
    "title",
    "description",
    "deliverables",
    "requiredSkills",
    "budgetRange",
    "timeline",
  ];
  for (const key of entries) {
    const val = doc[key];
    if (val) {
      const sanitized = filterAIContent(val, GIG_FIELD_LIMITS[key]);
      if (sanitized) result[key] = sanitized;
    }
  }
  return result;
}

function sanitizeCompanySettings(
  cs:
    | {
        companyName?: string;
        companyDescription?: string;
        botName?: string;
        botRole?: string;
      }
    | null
    | undefined,
): typeof cs {
  if (!cs) return cs;
  return {
    companyName: cs.companyName
      ? filterAIContent(cs.companyName, 500)
      : undefined,
    companyDescription: cs.companyDescription
      ? filterAIContent(cs.companyDescription, 500)
      : undefined,
    botName: cs.botName ? filterAIContent(cs.botName, 200) : undefined,
    botRole: cs.botRole ? filterAIContent(cs.botRole, 500) : undefined,
  };
}

export interface CreateGigStreamParams {
  message: string;
  currentDocument?: GigDocument;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  companySettings?: {
    companyName?: string;
    companyDescription?: string;
    botName?: string;
    botRole?: string;
  } | null;
}

export function createGigStream(params: CreateGigStreamParams): ReadableStream {
  const { message, currentDocument, conversationHistory, companySettings } =
    params;

  const sanitizedMessage = truncateText(
    sanitizePromptText(message),
    GIG_CHAT_MESSAGE_MAX_LENGTH,
  );
  const sanitizedHistory = conversationHistory
    ? conversationHistory
        .slice(0, 10)
        .map((msg) => sanitizeConversationMessage(msg))
    : undefined;
  const sanitizedCurrentDocument = currentDocument
    ? sanitizeGigDocument(currentDocument)
    : undefined;
  const sanitizedCompanySettings = sanitizeCompanySettings(companySettings);

  const prompt = buildGigPrompt(
    sanitizedMessage,
    sanitizedCurrentDocument,
    sanitizedHistory,
    sanitizedCompanySettings,
  );

  let result: ReturnType<typeof streamText>;
  try {
    result = streamText({ prompt });
  } catch (aiError) {
    console.error("[gig-chat-generate] AI error:", aiError);
    throw new Error("Не удалось сгенерировать задание. Попробуйте позже.");
  }

  const encoder = new TextEncoder();
  let fullText = "";
  let lastSentResponse: GigAIResponse | null = null;

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) {
          fullText += chunk;

          const { response: partialResponse } = parseGigAIResponse(
            fullText,
            currentDocument,
          );

          const responseString = JSON.stringify(partialResponse);
          const lastResponseString = JSON.stringify(lastSentResponse);

          if (responseString !== lastResponseString) {
            lastSentResponse = partialResponse;
            const sanitizedDoc = sanitizeGigDocument(partialResponse.document);
            const sanitizedMsg = filterAIContent(
              partialResponse.message,
              GIG_CHAT_MESSAGE_MAX_LENGTH,
            );
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  document: sanitizedDoc,
                  message: sanitizedMsg,
                  partial: true,
                })}\n\n`,
              ),
            );
          }
        }

        const { response: finalResponse } = parseGigAIResponse(
          fullText,
          currentDocument,
        );
        const sanitizedDoc = sanitizeGigDocument(finalResponse.document);
        const sanitizedMsg = filterAIContent(
          finalResponse.message,
          GIG_CHAT_MESSAGE_MAX_LENGTH,
        );
        const sanitizedReplies = (finalResponse.quickReplies ?? [])
          .slice(0, 5)
          .map((r) => filterAIContent(r, 100));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              document: sanitizedDoc,
              message: sanitizedMsg,
              quickReplies: sanitizedReplies,
              done: true,
            })}\n\n`,
          ),
        );

        controller.close();
      } catch (streamError) {
        if (streamError instanceof Error) {
          console.error(
            "[gig-chat-generate] Stream error:",
            streamError,
            streamError.stack,
          );
        } else {
          console.error("[gig-chat-generate] Stream error:", streamError);
        }

        const { response: recoveredResponse } = parseGigAIResponse(
          fullText,
          currentDocument,
        );
        const sanitizedDoc = sanitizeGigDocument(recoveredResponse.document);
        const sanitizedMsg = filterAIContent(
          recoveredResponse.message,
          GIG_CHAT_MESSAGE_MAX_LENGTH,
        );
        const sanitizedReplies = (recoveredResponse.quickReplies ?? [])
          .slice(0, 5)
          .map((r) => filterAIContent(r, 100));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              document: sanitizedDoc,
              message: sanitizedMsg,
              quickReplies: sanitizedReplies,
              error: "Ошибка генерации",
              done: true,
            })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });
}
