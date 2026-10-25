import { logger } from "@acme/config";
import { sql } from "drizzle-orm";
import { db } from "../client";

async function dropSchema() {
  try {
    logger.info("db.drop_schema.start");

    // Drop all tables in the public schema
    await db.execute(sql`DROP SCHEMA public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public`);

    logger.info("db.drop_schema.done");
    process.exit(0);
  } catch (error) {
    logger.error("db.drop_schema.failed", error);
    process.exit(1);
  }
}

dropSchema();
