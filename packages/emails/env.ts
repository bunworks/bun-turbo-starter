import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default("Acme <onboarding@resend.dev>"),
    EMAIL_SANDBOX_ENABLED: z.string().optional(),
    EMAIL_SANDBOX_HOST: z.string().optional(),
  },
  runtimeEnv: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SANDBOX_ENABLED: process.env.EMAIL_SANDBOX_ENABLED,
    EMAIL_SANDBOX_HOST: process.env.EMAIL_SANDBOX_HOST,
  },
});
