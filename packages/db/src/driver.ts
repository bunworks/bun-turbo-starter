export type DbDriver = "node" | "neon-http";

/**
 * Pure driver-selection logic, extracted so it can be unit tested without
 * triggering any database connection side effects.
 *
 * - Explicit `DB_DRIVER` always wins (`node` | `neon-http`).
 * - Otherwise Neon connection strings (`*.neon.tech`) use the HTTP driver,
 *   which is required for edge runtimes and optimal on serverless.
 * - Everything else (local Docker Postgres, Supabase, self-hosted) uses the
 *   standard `node-postgres` TCP driver so local development works out of
 *   the box.
 */
export function selectDbDriver(
  connectionString: string | undefined,
  override: string | undefined = process.env.DB_DRIVER,
): DbDriver {
  if (override === "node" || override === "neon-http") {
    return override;
  }
  if (connectionString && /\.neon\.tech/i.test(connectionString)) {
    return "neon-http";
  }
  return "node";
}
