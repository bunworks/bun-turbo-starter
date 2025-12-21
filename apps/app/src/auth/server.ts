import "server-only";

import { initAuth } from "@acme/auth";
import { env } from "@acme/config";
import { OtpSignInEmail, ResetPasswordEmail, sendEmail } from "@acme/emails";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

const baseUrl =
  env.VERCEL_ENV === "production"
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview"
      ? `https://${env.VERCEL_URL}`
      : "http://localhost:3000";

export const auth = initAuth({
  baseUrl,
  productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "turbo.t3.gg"}`,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  extraPlugins: [nextCookies()],
  // sendEmail is used by the internal emailOTP plugin and password reset
  sendEmail: async ({
    email,
    otp,
    url,
    type,
  }: {
    email: string;
    otp?: string;
    url?: string;
    type: "sign-in" | "email-verification" | "forget-password";
  }) => {
    if (type === "forget-password" && url) {
      await sendEmail({
        to: [email],
        subject: "Reset Your Password",
        react: ResetPasswordEmail({ resetLink: url }),
      });
    } else if (otp) {
      await sendEmail({
        to: [email],
        subject: type === "sign-in" ? "Your Sign In Code" : "Verify Your Email",
        react: OtpSignInEmail({ otp, isSignUp: type !== "sign-in" }),
      });
    }
  },
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
