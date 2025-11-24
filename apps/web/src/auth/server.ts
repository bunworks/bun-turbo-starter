import "server-only";

import { initAuth } from "@acme/auth";
import { OtpSignInEmail, sendEmail } from "@acme/emails";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";

import { env } from "~/env";

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
  discordClientId: env.AUTH_DISCORD_ID,
  discordClientSecret: env.AUTH_DISCORD_SECRET,
  extraPlugins: [nextCookies()],
  sendEmail: async ({ email, otp, type }) => {
    await sendEmail({
      to: [email],
      from: "Acme <onboarding@resend.dev>", // TODO: Update with your domain
      subject: type === "sign-in" ? "Your Sign In Code" : "Verify Your Email",
      react: OtpSignInEmail({ otp, isSignUp: type !== "sign-in" }),
    });
  },
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);
