import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Node environment
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),

    // Vercel
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
    VERCEL_URL: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),

    // Database
    POSTGRES_URL: z.url().optional(),

    // App
    APP_URL: z.url().default("http://localhost:3000"),

    // Email. Sending order: Yandex Cloud Postbox (HTTPS API), then Resend.
    // Postbox uses a service account static access key (AWS Signature V4).
    YANDEX_POSTBOX_ENDPOINT: z
      .url()
      .default("https://postbox.cloud.yandex.net"),
    YANDEX_POSTBOX_REGION: z.string().default("ru-central1"),
    YANDEX_POSTBOX_ACCESS_KEY_ID: z.string().optional(),
    YANDEX_POSTBOX_SECRET_ACCESS_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_SANDBOX_ENABLED: z.coerce.boolean().optional().default(false),
    EMAIL_SANDBOX_HOST: z.string().default("localhost"),
    EMAIL_FROM: z.string().default("Acme <onboarding@resend.dev>"),

    // Auth
    AUTH_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    // Comma-separated list of emails granted `adminProcedure` access
    ADMIN_EMAILS: z.string().optional(),

    // Hatchet (background jobs). Unset: @acme/jobs runs work inline.
    HATCHET_CLIENT_TOKEN: z.string().optional(),

    // Object storage. Yandex Cloud Object Storage is the primary provider;
    // the AWS_* variables below are the fallback (MinIO locally / AWS S3).
    YANDEX_STORAGE_ENDPOINT: z.url().default("https://storage.yandexcloud.net"),
    YANDEX_STORAGE_REGION: z.string().default("ru-central1"),
    YANDEX_STORAGE_ACCESS_KEY_ID: z.string().optional(),
    YANDEX_STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
    // Defaults to AWS_S3_BUCKET when unset.
    YANDEX_STORAGE_BUCKET: z.string().optional(),

    // AWS S3
    AWS_S3_ENDPOINT: z.string().optional(),
    AWS_S3_FORCE_PATH_STYLE: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default("us-east-1"),
    AWS_S3_BUCKET: z.string().default("acme-bucket"),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("Acme Inc."),
    NEXT_PUBLIC_APP_SHORT_NAME: z.string().default("Acme"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    POSTGRES_URL: process.env.POSTGRES_URL,
    APP_URL: process.env.APP_URL,
    YANDEX_POSTBOX_ENDPOINT: process.env.YANDEX_POSTBOX_ENDPOINT,
    YANDEX_POSTBOX_REGION: process.env.YANDEX_POSTBOX_REGION,
    YANDEX_POSTBOX_ACCESS_KEY_ID: process.env.YANDEX_POSTBOX_ACCESS_KEY_ID,
    YANDEX_POSTBOX_SECRET_ACCESS_KEY:
      process.env.YANDEX_POSTBOX_SECRET_ACCESS_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_SANDBOX_ENABLED: process.env.EMAIL_SANDBOX_ENABLED === "true",
    EMAIL_SANDBOX_HOST: process.env.EMAIL_SANDBOX_HOST,
    EMAIL_FROM: process.env.EMAIL_FROM,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
    HATCHET_CLIENT_TOKEN: process.env.HATCHET_CLIENT_TOKEN,
    YANDEX_STORAGE_ENDPOINT: process.env.YANDEX_STORAGE_ENDPOINT,
    YANDEX_STORAGE_REGION: process.env.YANDEX_STORAGE_REGION,
    YANDEX_STORAGE_ACCESS_KEY_ID: process.env.YANDEX_STORAGE_ACCESS_KEY_ID,
    YANDEX_STORAGE_SECRET_ACCESS_KEY:
      process.env.YANDEX_STORAGE_SECRET_ACCESS_KEY,
    YANDEX_STORAGE_BUCKET: process.env.YANDEX_STORAGE_BUCKET,
    AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
    AWS_S3_FORCE_PATH_STYLE: process.env.AWS_S3_FORCE_PATH_STYLE,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_SHORT_NAME: process.env.NEXT_PUBLIC_APP_SHORT_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
