import "server-only";

import { initAuth } from "@acme/auth";
import { env, logger } from "@acme/config";
import { dispatchEmail } from "@acme/jobs";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { after } from "next/server";
import { cache } from "react";

const vercelUrl =
  env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_ENV === "preview" && env.VERCEL_URL
      ? `https://${env.VERCEL_URL}`
      : undefined;

const baseUrl = vercelUrl ?? env.APP_URL;
const productionUrl = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : env.APP_URL;

export const auth = initAuth({
  baseUrl,
  productionUrl,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  extraPlugins: [nextCookies()],
  // Send emails after the response. `after` only works inside a request
  // (route handler, server action); elsewhere the promise, which Better Auth
  // already guards with `.catch`, just runs unawaited.
  runInBackground: (promise) => {
    try {
      after(promise);
    } catch {
      void promise;
    }
  },
  // Used by the emailOTP plugin and password reset. Goes through the Hatchet
  // `send-email` task when HATCHET_CLIENT_TOKEN is set, inline otherwise.
  sendEmail: async ({
    email,
    otp,
    url,
    type,
  }: {
    email: string;
    otp?: string;
    url?: string;
    type: "sign-in" | "email-verification" | "forget-password" | "change-email";
  }) => {
    if (type === "forget-password") {
      if (!url) {
        logger.error("auth.reset_email_missing_url");
        throw new Error(
          "Cannot send password reset email: reset URL is missing",
        );
      }
      await dispatchEmail({
        template: "reset-password",
        to: [email],
        subject: "Сброс пароля",
        props: { resetLink: url },
      });
    } else {
      if (!otp) {
        logger.error("auth.otp_email_missing_otp", undefined, { type });
        throw new Error(`Cannot send ${type} email: OTP is missing`);
      }
      await dispatchEmail({
        template: "otp-sign-in",
        to: [email],
        subject:
          type === "sign-in"
            ? "Ваш код для входа"
            : "Подтвердите адрес электронной почты",
        props: { otp, isSignUp: type !== "sign-in" },
      });
    }
  },
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
