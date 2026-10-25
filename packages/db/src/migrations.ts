import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { readMigrationFiles } from "drizzle-orm/migrator";

import type { Database } from "./client";

/** Absolute path to the drizzle-kit `out` folder (`packages/db/migrations`). */
export const migrationsFolder = fileURLToPath(
  new URL("../migrations", import.meta.url),
);

// Same bookkeeping table drizzle-kit / drizzle-orm's migrator use.
const MIGRATIONS_SCHEMA = sql.identifier("drizzle");
const MIGRATIONS_TABLE = sql.identifier("__drizzle_migrations");

async function rows<T>(db: Database, query: ReturnType<typeof sql>) {
  const result: unknown = await db.execute(query);
  // node-postgres, neon-http and PGlite all expose `rows`.
  return (result as { rows: T[] }).rows;
}

/**
 * Adopts migrations on a database whose schema was created with
 * `drizzle-kit push` before `packages/db/migrations` existed.
 *
 * Records `0000_init` as applied without running it, so `db:migrate` only
 * applies the migrations after it. The migrator decides what to run by
 * comparing timestamps, so one row is enough.
 *
 * - Fresh database (no `users` table): throws — run `db:migrate` instead.
 * - Migrations already tracked: does nothing and returns `"already-tracked"`.
 */
export async function baselineMigrations(
  db: Database,
  folder = migrationsFolder,
): Promise<"baselined" | "already-tracked"> {
  const [init] = readMigrationFiles({ migrationsFolder: folder });
  if (!init) throw new Error(`No migrations found in ${folder}`);

  const [existing] = await rows<{ table: string | null }>(
    db,
    sql`select to_regclass('public.users')::text as "table"`,
  );
  if (!existing?.table) {
    throw new Error(
      "No existing schema found (public.users is missing). " +
        "This is a fresh database: run `bun db:migrate` instead.",
    );
  }

  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${MIGRATIONS_SCHEMA}`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  const [tracked] = await rows<{ count: number }>(
    db,
    sql`select count(*)::int as "count" from ${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE}`,
  );
  if (tracked && tracked.count > 0) return "already-tracked";

  await db.execute(sql`
    insert into ${MIGRATIONS_SCHEMA}.${MIGRATIONS_TABLE} ("hash", "created_at")
    values (${init.hash}, ${init.folderMillis})
  `);
  return "baselined";
}
