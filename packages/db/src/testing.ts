import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import type { Database } from "./client";
import { migrationsFolder } from "./migrations";
import * as schema from "./schema";

/**
 * In-memory Postgres (PGlite) with every migration in `migrations/` applied.
 *
 * Tests get a real Postgres dialect without Docker or a running server, and
 * exercise the same SQL that production runs — a migration that drifts from
 * `src/schema` fails here (CI also fails on un-generated schema changes).
 *
 * @example
 *   const { db, close } = await createTestDb();
 *   afterAll(close);
 */
export async function createTestDb() {
  const client = new PGlite();
  const pglite = drizzle({ client, schema, casing: "snake_case" });
  await migrate(pglite, { migrationsFolder });

  const db: Database = pglite;
  return { db, close: () => client.close() };
}
