"use client";

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
  toast,
} from "@acme/ui";
import { Alert, AlertDescription, AlertTitle } from "@acme/ui/reui/alert";
import {
  type ChangePasswordFormValues,
  changePasswordFormSchema,
  PASSWORD_MIN_LENGTH,
} from "@acme/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { authClient } from "~/auth/client";

const defaultValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  revokeOtherSessions: true,
};

export function PasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues,
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    setServerError(null);

    // Better Auth resolves with `{ error }` instead of throwing.
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: values.revokeOtherSessions,
    });

    if (error) {
      setServerError(error.message || "Не удалось изменить пароль");
      return;
    }

    toast.success("Пароль успешно изменён");
    form.reset(defaultValues);
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {serverError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Не удалось изменить пароль</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Текущий пароль
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Новый пароль
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Используйте не менее {PASSWORD_MIN_LENGTH} символов.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Подтвердите новый пароль
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="revokeOtherSessions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3">
              <Checkbox
                id="revoke-other-sessions"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <FormLabel
                  htmlFor="revoke-other-sessions"
                  className="text-foreground font-medium"
                >
                  Выйти на других устройствах
                </FormLabel>
                <FormDescription>
                  Завершает все остальные сеансы, чтобы вход остался только на
                  этом устройстве.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Изменение пароля…" : "Изменить пароль"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
