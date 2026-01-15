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
          toast.error(error.message || "Invalid code. Please try again.");
          return;
        }
        toast.success("Successfully verified!");
        router.push(paths.dashboard.root);
      } catch (error) {
        console.error(error);
        toast.error("Invalid code. Please try again.");
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
      toast.success("Code sent! Check your email.");
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      console.error(error);
      toast.error("Failed to send code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to {email}.</CardDescription>
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
                    Verification code
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
                    Enter the 6-digit code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying…" : "Verify"}
            </Button>
            <FormDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                className="text-primary underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              >
                {resending
                  ? "Sending…"
                  : countdown > 0
                    ? `Resend (${countdown}s)`
                    : "Resend"}
              </button>
            </FormDescription>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
