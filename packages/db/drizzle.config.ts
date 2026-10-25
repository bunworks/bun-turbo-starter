import type { Config } from "drizzle-kit";

/**
 * `generate` and `check` work offline (schema + migrations folder only), so
 * credentials are optional here: CI can verify migrations without a database
 * or a prior build. `push`, `migrate` and `studio` fail fast without a URL.
 *
 * Reads `process.env` directly instead of `@acme/config`, which is consumed
 * from `dist/` and would force a build before every drizzle-kit command.
 */
const url = process.env.POSTGRES_URL;

export default {
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  casing: "snake_case",
  // Use the direct (non-pooling) port for DDL on Supabase-style URLs.
  ...(url && { dbCredentials: { url: url.replace(":6543", ":5432") } }),
} satisfies Config;
