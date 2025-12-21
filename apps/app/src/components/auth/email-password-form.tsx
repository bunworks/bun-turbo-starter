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
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
          name: data.email.split("@")[0] ?? "User",
        });
        toast.success("Account created successfully!");
      } else {
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        toast.success("Signed in successfully!");
      }
      router.push(paths.dashboard.root);
    } catch (error) {
      console.error(error);
      toast.error(
        mode === "signup"
          ? "Failed to create account. Please try again."
          : "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === "signup" ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {mode === "signup"
            ? "Enter your email and password to create an account"
            : "Enter your email and password to sign in"}
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
                  <FormLabel>Email</FormLabel>
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
                  <FormLabel>Password</FormLabel>
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
                  Forgot password?
                </Link>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
