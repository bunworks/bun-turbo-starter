import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { migrate as migrateNeon } from "drizzle-orm/neon-serverless/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import ws from "ws";

import type { Database } from "../client";
import { selectDbDriver } from "../driver";
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
 * spinner and exit code 1. Follows the app's driver choice (`selectDbDriver`):
 * - Neon: WebSocket pool over 443 — works where outbound 5432 is blocked
 *   (the app's neon-http driver would, but it can't run a transaction);
 * - everything else: node-postgres over TCP, on the direct port.
 * Both migrators apply pending migrations in a single transaction.
 *
 * Plain console output and `process.env` on purpose: this is a CLI for
 * humans, and `@acme/config` is consumed from `dist/`, which would force a
 * build before the first migration on a fresh clone.
 */
function connect(url: string) {
  // pg / Neon wait forever by default; fail fast with a readable error.
  const connectionTimeoutMillis = 15_000;
  const options = { schema, casing: "snake_case" } as const;

  if (selectDbDriver(url) === "neon-http") {
    neonConfig.webSocketConstructor = ws;
    const pool = new NeonPool({
      connectionString: url,
      connectionTimeoutMillis,
    });
    // A dropped connection also rejects the running query; that rejection is
    // reported below. Without a listener the pool would crash the process.
    pool.on("error", () => {});
    const db = drizzleNeon({ client: pool, ...options });
    return {
      db: db as Database,
      migrate: () => migrateNeon(db, { migrationsFolder }),
      close: () => pool.end(),
    };
  }

  const pool = new Pool({
    connectionString: url.replace(":6543", ":5432"),
    connectionTimeoutMillis,
  });
  pool.on("error", () => {});
  const db = drizzlePg({ client: pool, ...options });
  return {
    db: db as Database,
    migrate: () => migratePg(db, { migrationsFolder }),
    close: () => pool.end(),
  };
}

async function main() {
  const url = process.env.POSTGRES_URL;
  if (!url) {
    console.error("✗ POSTGRES_URL is not set (root .env).");
    return 1;
  }

  const { db, migrate, close } = connect(url);

  try {
    const before = await appliedMigrationCount(db);
    await migrate();
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
    await close();
  }
}

process.exit(await main());
