import { workspaceIdSchema } from "@acme/validators";
import { z } from "zod";

/** Максимальная длина сообщения в запросе gig-chat (должна совпадать в schema и truncate) */
export const GIG_CHAT_MESSAGE_MAX_LENGTH = 2000;

export interface GigDocument {
  title?: string;
  description?: string;
  deliverables?: string;
  requiredSkills?: string;
  budgetRange?: string;
  timeline?: string;
}

export interface GigAIResponse {
  message?: string;
  quickReplies?: string[];
  document?: GigDocument;
}

export const gigAIResponseSchema = z.object({
  document: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      deliverables: z.string().optional(),
      requiredSkills: z.string().optional(),
      budgetRange: z.string().optional(),
      timeline: z.string().optional(),
    })
    .optional(),
  message: z.string().optional(),
  quickReplies: z.array(z.string().max(100)).max(5).optional(),
});

export const gigChatRequestSchema = z.object({
  workspaceId: workspaceIdSchema,
  message: z
    .string()
    .trim()
    .min(1, "Сообщение не должно быть пустым")
    .max(GIG_CHAT_MESSAGE_MAX_LENGTH),
  currentDocument: z
    .object({
      title: z.string().max(200).optional(),
      description: z.string().max(5000).optional(),
      deliverables: z.string().max(3000).optional(),
      requiredSkills: z.string().max(1000).optional(),
      budgetRange: z.string().max(100).optional(),
      timeline: z.string().max(100).optional(),
    })
    .optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(GIG_CHAT_MESSAGE_MAX_LENGTH),
      }),
    )
    .max(20)
    .optional(),
});

export type GigChatRequest = z.infer<typeof gigChatRequestSchema>;
