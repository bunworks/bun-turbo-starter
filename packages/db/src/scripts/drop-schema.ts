import { sql } from "@vercel/postgres";

async function dropSchema() {
  try {
    // biome-ignore lint/suspicious/noConsole: CLI script output
    console.log("🗑️  Dropping database schema...");

    // Drop all tables in the public schema
    await sql`DROP SCHEMA public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO public`;

    // biome-ignore lint/suspicious/noConsole: CLI script output
    console.log("✅ Database schema dropped successfully!");
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: CLI error output
    console.error("❌ Error dropping schema:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

dropSchema();
