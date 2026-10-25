import { z } from "zod";

// Mirrors Better Auth's `emailAndPassword` limits (8-128 characters).
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Пароль должен содержать не менее ${PASSWORD_MIN_LENGTH} символов`,
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `Пароль не должен быть длиннее ${PASSWORD_MAX_LENGTH} символов`,
      ),
    confirmPassword: z.string().min(1, "Подтвердите новый пароль"),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
