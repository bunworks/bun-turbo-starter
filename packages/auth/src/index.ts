import { db } from "@acme/db/client";
import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, oAuthProxy } from "better-auth/plugins";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;
  googleClientId?: string;
  googleClientSecret?: string;
  sendEmail?: (data: {
    email: string;
    otp: string;
    type: "sign-in" | "email-verification" | "forget-password";
  }) => Promise<void>;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      emailOTP({
        async sendVerificationOTP(data) {
          if (options.sendEmail) {
            await options.sendEmail(data);
          }
        },
      }),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders:
      options.googleClientId && options.googleClientSecret
        ? {
            google: {
              clientId: options.googleClientId,
              clientSecret: options.googleClientSecret,
              redirectURI: `${options.productionUrl}/api/auth/callback/google`,
            },
          }
        : {},
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
