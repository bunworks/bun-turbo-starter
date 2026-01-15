import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
