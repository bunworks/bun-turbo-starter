import { z } from "zod";

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "Имя пользователя должно содержать не менее 2 символов")
    .max(30, "Имя пользователя не должно быть длиннее 30 символов"),
  email: z.string().email("Некорректный адрес электронной почты"),
  bio: z.string().max(160, "О себе: не более 160 символов").optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
