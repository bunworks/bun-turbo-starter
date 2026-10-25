import { PGlite } from "@electric-sql/pglite";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/pglite";

import type { Database } from "./client";
import * as schema from "./schema";

/**
 * In-memory Postgres (PGlite) with the current Drizzle schema applied.
 *
 * Tests get a real Postgres dialect without Docker or a running server.
 * The schema is diffed from an empty snapshot on every call, so each test
 * database starts clean and always matches `src/schema`.
 *
 * @example
 *   const { db, close } = await createTestDb();
 *   afterAll(close);
 */
export async function createTestDb() {
  const client = new PGlite();
  const db: Database = drizzle({ client, schema, casing: "snake_case" });

  const empty = generateDrizzleJson({});
  const current = generateDrizzleJson(
    schema,
    empty.id,
    undefined,
    "snake_case",
  );
  for (const statement of await generateMigration(empty, current)) {
    await client.exec(statement);
  }

  return { db, close: () => client.close() };
}
