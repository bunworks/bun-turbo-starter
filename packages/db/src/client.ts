import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import {
  drizzle as drizzlePg,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { selectDbDriver } from "./driver";
import * as schema from "./schema";

/**
 * Unified database type used across the codebase.
 *
 * Both the `node-postgres` and `neon-http` drivers produce a structurally
 * compatible relational query API for our schema, so we expose a single type
 * and pick the concrete driver at runtime based on the environment.
 */
export type Database = NodePgDatabase<typeof schema>;

function createDatabase(): Database {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error(
      "POSTGRES_URL environment variable is not set. Please configure it in your environment.",
    );
  }

  const driver = selectDbDriver(connectionString);

  if (driver === "neon-http") {
    const sql = neon(connectionString);
    // Structurally compatible with NodePgDatabase for our query usage.
    return drizzleNeonHttp(sql, {
      schema,
      casing: "snake_case",
    }) as unknown as Database;
  }

  const pool = new Pool({ connectionString });
  return drizzlePg({ client: pool, schema, casing: "snake_case" });
}

export const db: Database = createDatabase();
