import { z } from "zod";

// Data table item validation schema
export const dataTableItemSchema = z.object({
  id: z.number(),
  header: z.string().min(1, "Введите заголовок"),
  type: z.string().min(1, "Выберите тип"),
  status: z.string().min(1, "Выберите статус"),
  target: z.string().min(1, "Укажите цель"),
  limit: z.string().min(1, "Укажите лимит"),
  reviewer: z.string().min(1, "Выберите проверяющего"),
});

export type DataTableItemData = z.infer<typeof dataTableItemSchema>;

// Data table inline edit schemas
export const targetFormSchema = z.object({
  target: z.string().min(1, "Укажите цель"),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;

export const limitFormSchema = z.object({
  limit: z.string().min(1, "Укажите лимит"),
});

export type LimitFormData = z.infer<typeof limitFormSchema>;
