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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@acme/ui";
import { type OTPFormData, otpFormSchema } from "@acme/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "~/auth/client";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("otp_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push(paths.auth.login);
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmit = useCallback(
    async (data: OTPFormData) => {
      setLoading(true);
      try {
        const { error } = await authClient.signIn.emailOtp({
          email,
          otp: data.otp,
        });
        if (error) {
          toast.error(error.message || "Неверный код. Попробуйте ещё раз.");
          return;
        }
        toast.success("Код подтверждён!");
        router.push(paths.dashboard.root);
      } catch (_error) {
        toast.error("Неверный код. Попробуйте ещё раз.");
      } finally {
        setLoading(false);
      }
    },
    [email, router],
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "otp" && value.otp?.length === 6) {
        form.handleSubmit(onSubmit)();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  const handleResend = async () => {
    if (!email || countdown > 0) return;
    setResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      toast.success("Код отправлен! Проверьте почту.");
      setCountdown(60); // 60 second cooldown
    } catch (_error) {
      toast.error("Не удалось отправить код. Попробуйте ещё раз.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Введите код подтверждения</CardTitle>
        <CardDescription>
          Мы отправили 6-значный код на {email}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="otp" className="sr-only">
                    Код подтверждения
                  </FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} id="otp" {...field}>
                      <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="text-center">
                    Введите 6-значный код, отправленный на вашу почту.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Проверка…" : "Подтвердить"}
            </Button>
            <FormDescription className="text-center">
              Не получили код?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="text-primary underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {resending
                  ? "Отправка…"
                  : countdown > 0
                    ? `Отправить повторно (${countdown} с)`
                    : "Отправить повторно"}
              </button>
            </FormDescription>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
