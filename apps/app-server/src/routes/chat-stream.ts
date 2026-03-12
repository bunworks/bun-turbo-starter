import { chatMessage, chatSession, eq, gig, vacancy } from "@acme/db";
import { db } from "@acme/db/client";
import { getAIModel, streamText } from "@acme/lib/ai";
import { createUIMessageStream, JsonToSseTransformStream } from "ai";
import type { Context } from "hono";
import { z } from "zod";
import { getSession } from "../auth";

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().min(1).max(10000),
});

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(textPartSchema),
});

const requestSchema = z.object({
  id: z.uuid().optional(),
  message: messageSchema.optional(),
  messages: z.array(messageSchema).optional(),
  chatSessionId: z.string().optional(),
  conversationId: z.string().optional(),
});

function generateUUID(): string {
  return crypto.randomUUID();
}

export async function handleChatStream(c: Context) {
  let requestBody: z.infer<typeof requestSchema>;

  try {
    const json = await c.req.json();
    requestBody = requestSchema.parse(json);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 },
      );
    }
    return c.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const session = await getSession(c.req.raw.headers);
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, messages, chatSessionId, conversationId, id } =
      requestBody;

    const resolvedChatSessionId = chatSessionId ?? conversationId ?? id;
    if (!resolvedChatSessionId) {
      return c.json({ error: "Bad request" }, { status: 400 });
    }

    // Проверка доступа к chatSession
    let chatContext = "";
    let userMessageText = "";
    let userMessageSaved = false;
    let _currentWorkspaceId: string | null = null;
    if (resolvedChatSessionId) {
      const chat = await db.query.chatSession.findFirst({
        where: eq(chatSession.id, resolvedChatSessionId),
      });

      if (!chat) {
        return c.json({ error: "Not found" }, { status: 404 });
      }

      if (chat.userId && chat.userId !== session.user.id) {
        return c.json({ error: "Forbidden" }, { status: 403 });
      }

      // Получаем контекст в зависимости от типа сущности
      if (chat.entityType === "vacancy") {
        const vac = await db.query.vacancy.findFirst({
          where: eq(vacancy.id, chat.entityId),
        });

        if (vac) {
          const workspaceId = vac.workspaceId;
          _currentWorkspaceId = workspaceId;
          if (workspaceId) {
            const member = await db.query.workspaceMember.findFirst({
              where: (wm, { and }) =>
                and(
                  eq(wm.workspaceId, workspaceId),
                  eq(wm.userId, session.user.id),
                ),
            });

            if (!member) {
              return c.json({ error: "Forbidden" }, { status: 403 });
            }
          }

          chatContext = `
Контекст вакансии:
- Название: ${vac.title || "Не указано"}
- Описание: ${vac.description || "Не указано"}
`;
        }
      }

      if (chat.entityType === "gig") {
        const currentGig = await db.query.gig.findFirst({
          where: eq(gig.id, chat.entityId),
        });

        if (currentGig) {
          const workspaceId = currentGig.workspaceId;
          _currentWorkspaceId = workspaceId;
          if (workspaceId) {
            const member = await db.query.workspaceMember.findFirst({
              where: (wm, { and }) =>
                and(
                  eq(wm.workspaceId, workspaceId),
                  eq(wm.userId, session.user.id),
                ),
            });

            if (!member) {
              return c.json({ error: "Forbidden" }, { status: 403 });
            }
          }

          chatContext = `
Контекст задания:
- Название: ${currentGig.title || "Не указано"}
- Описание: ${currentGig.description || "Не указано"}
`;
        }
      }

      const lastUserMessage = message
        ? message
        : messages?.filter((m) => m.role === "user").at(-1);

      userMessageText = lastUserMessage
        ? lastUserMessage.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n")
        : "";

      if (userMessageText) {
        await db.insert(chatMessage).values({
          sessionId: chat.id,
          userId: session.user.id,
          role: "user",
          content: userMessageText,
        });
        userMessageSaved = true;
      }
    }

    // Формируем сообщения для AI
    const uiMessages = messages ?? (message ? [message] : []);

    const historyContext = uiMessages
      .map((m) => {
        const text = m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("\n");
        return `${m.role === "user" ? "Пользователь" : "Ассистент"}: ${text}`;
      })
      .join("\n\n");

    const prompt = `${chatContext}

История диалога:
${historyContext}

Ответь на последнее сообщение пользователя. Будь вежливым и профессиональным.`;

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const result = streamText({
          model: getAIModel(),
          prompt,
        });

        result.consumeStream();

        writer.merge(result.toUIMessageStream());
      },
      generateId: generateUUID,
      onFinish: async ({ messages: finishedMessages }) => {
        const assistant = finishedMessages
          .filter((m) => m.role === "assistant")
          .at(-1);

        const assistantText = assistant?.parts
          ?.filter(
            (p): p is { type: "text"; text: string } =>
              Boolean(p) && p.type === "text" && "text" in p,
          )
          .map((p) => p.text)
          .join("\n");

        if (assistantText) {
          await db.insert(chatMessage).values({
            sessionId: resolvedChatSessionId,
            userId: "system",
            role: "assistant",
            content: assistantText,
          });

          const currentSession = await db.query.chatSession.findFirst({
            where: eq(chatSession.id, resolvedChatSessionId),
          });

          if (currentSession) {
            const increment =
              (userMessageSaved ? 1 : 0) + (assistantText ? 1 : 0);
            await db
              .update(chatSession)
              .set({
                messageCount: currentSession.messageCount + increment,
                lastMessageAt: new Date(),
              })
              .where(eq(chatSession.id, resolvedChatSessionId));
          }
        }
      },
      onError: (error) => {
        console.error("Stream error:", error);
        return error instanceof Error ? error.message : "Unknown error";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat stream error:", error);
    return c.json({ error: "Internal server error" }, { status: 500 });
  }
}
