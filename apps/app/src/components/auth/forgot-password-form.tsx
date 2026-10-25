"use client";

import { paths } from "@acme/config";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@acme/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "~/auth/client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Некорректный адрес электронной почты"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: paths.auth.resetPassword,
      });
      setSent(true);
      toast.success("Ссылка для сброса пароля отправлена! Проверьте почту.");
    } catch (_error) {
      toast.error("Не удалось отправить ссылку. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Card {...props}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Проверьте почту</CardTitle>
          <CardDescription>
            Мы отправили ссылку для сброса пароля на ваш адрес электронной
            почты.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Перейдите по ссылке из письма, чтобы сбросить пароль. Ссылка
              действительна в течение 1 часа.
            </p>
            <Button
              render={<Link href={paths.auth.login} />}
              className="w-full"
              variant="outline"
            >
              Вернуться ко входу
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Забыли пароль?</CardTitle>
        <CardDescription>
          Введите адрес электронной почты, и мы отправим вам ссылку для сброса
          пароля.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Отправка…" : "Отправить ссылку"}
            </Button>
            <Button
              render={<Link href={paths.auth.login} />}
              className="w-full"
              variant="outline"
            >
              Вернуться ко входу
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
