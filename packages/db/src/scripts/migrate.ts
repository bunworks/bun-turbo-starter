import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import type { Database } from "../client";
import {
  appliedMigrationCount,
  explainMigrationError,
  migrationsFolder,
} from "../migrations";
import * as schema from "../schema";

/**
 * `bun db:migrate`: applies pending SQL from `packages/db/migrations`.
 *
 * Replaces `drizzle-kit migrate`, which hides the database error behind a
 * spinner and exit code 1. Always uses node-postgres (a TCP connection works
 * for local Postgres and Neon alike), on the direct port like drizzle.config.
 *
 * Plain console output and `process.env` on purpose: this is a CLI for
 * humans, and `@acme/config` is consumed from `dist/`, which would force a
 * build before the first migration on a fresh clone.
 */
async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error("✗ POSTGRES_URL is not set (root .env).");
    return 1;
  }

  const pool = new Pool({
    connectionString: url.replace(":6543", ":5432"),
    // pg waits forever by default; fail fast with a readable error instead.
    connectionTimeoutMillis: 15_000,
  });
  const pg = drizzle({ client: pool, schema, casing: "snake_case" });
  const db: Database = pg;

  try {
    const before = await appliedMigrationCount(db);
    await migrate(pg, { migrationsFolder });
    const applied = (await appliedMigrationCount(db)) - before;

    console.log(
      applied > 0
        ? `✓ Applied ${applied} migration(s).`
        : "✓ Database is up to date.",
    );
    return 0;
  } catch (error) {
    const { message, hint } = explainMigrationError(error);
    console.error(`✗ Migration failed: ${message}`);
    if (hint) console.error(`\n${hint}`);
    return 1;
  } finally {
    await pool.end();
  }
}

process.exit(await main());
