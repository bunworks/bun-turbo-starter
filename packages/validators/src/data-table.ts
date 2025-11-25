import { z } from "zod/v4";

// Data table item validation schema
export const dataTableItemSchema = z.object({
  id: z.number(),
  header: z.string().min(1, "Header is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  target: z.string().min(1, "Target is required"),
  limit: z.string().min(1, "Limit is required"),
  reviewer: z.string().min(1, "Reviewer is required"),
});

export type DataTableItemData = z.infer<typeof dataTableItemSchema>;

// Data table inline edit schemas
export const targetFormSchema = z.object({
  target: z.string().min(1, "Target is required"),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;

export const limitFormSchema = z.object({
  limit: z.string().min(1, "Limit is required"),
});

export type LimitFormData = z.infer<typeof limitFormSchema>;
