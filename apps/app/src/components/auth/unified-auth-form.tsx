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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@acme/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "~/auth/client";

const emailPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const emailOtpSchema = z.object({
  email: z.email("Invalid email address"),
});

type EmailPasswordData = z.infer<typeof emailPasswordSchema>;
type EmailOtpData = z.infer<typeof emailOtpSchema>;

export function UnifiedAuthForm({
  mode = "signin",
  ...props
}: React.ComponentProps<typeof Card> & {
  mode?: "signin" | "signup";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordForm = useForm<EmailPasswordData>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: "", password: "" },
  });

  const otpForm = useForm<EmailOtpData>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { email: "" },
  });

  const onPasswordSubmit = async (data: EmailPasswordData) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.email.split("@")[0] ?? "User",
        });
        if (error) {
          if (error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            toast.error("User already exists. Use another email.");
          } else {
            toast.error(
              error.message || "Failed to create account. Please try again.",
            );
          }
          return;
        }
        toast.success("Account created successfully!");
      } else {
        const { error } = await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        if (error) {
          toast.error(error.message || "Invalid email or password.");
          return;
        }
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

  const onOtpSubmit = async (data: EmailOtpData) => {
    setLoading(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
      });
      if (error) {
        toast.error(error.message || "Failed to send code. Please try again.");
        return;
      }
      localStorage.setItem("otp_email", data.email);
      toast.success("Code sent! Check your email.");
      router.push(paths.auth.otp);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    authClient.signIn.social({ provider: "google" });
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === "signup" ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription>
          {mode === "signup"
            ? "Choose your preferred sign up method"
            : "Choose your preferred sign in method"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              aria-label="Google logo"
            >
              <title>Google logo</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">Email code</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
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
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            autoComplete={
                              mode === "signup"
                                ? "new-password"
                                : "current-password"
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
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              <Form {...otpForm}>
                <form
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={otpForm.control}
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending code…" : "Send code"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <Link
                  href={paths.auth.login}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href={paths.auth.signup}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
