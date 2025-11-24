import "server-only";

import { initAuth } from "@acme/auth";
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
    // TODO: Implement actual email sending (e.g. Resend, Nodemailer)
    console.log(
      `[EMAIL OTP] Sending ${type} email to ${email} with OTP: ${otp}`
    );
  },
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);
