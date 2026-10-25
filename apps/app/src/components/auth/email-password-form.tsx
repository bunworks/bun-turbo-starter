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
  PasswordInput,
} from "@acme/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "~/auth/client";

const signInSchema = z.object({
  email: z.string().email("Некорректный адрес электронной почты"),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function EmailPasswordForm({
  mode = "signin",
  ...props
}: React.ComponentProps<typeof Card> & {
  mode?: "signin" | "signup";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.email.split("@")[0] ?? "Пользователь",
        });
        toast.success("Аккаунт успешно создан!");
      } else {
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        toast.success("Вы успешно вошли!");
      }
      router.push(paths.dashboard.root);
    } catch (_error) {
      toast.error(
        mode === "signup"
          ? "Не удалось создать аккаунт. Попробуйте ещё раз."
          : "Неверный адрес почты или пароль.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === "signup" ? "Создать аккаунт" : "С возвращением"}
        </CardTitle>
        <CardDescription>
          {mode === "signup"
            ? "Введите адрес почты и пароль для создания аккаунта"
            : "Введите адрес почты и пароль для входа"}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      autoComplete={
                        mode === "signup" ? "new-password" : "current-password"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "signin" && (
              <div className="text-right">
                <Link
                  href={paths.auth.forgotPassword}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "signup"
                  ? "Создание аккаунта…"
                  : "Вход…"
                : mode === "signup"
                  ? "Создать аккаунт"
                  : "Войти"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
