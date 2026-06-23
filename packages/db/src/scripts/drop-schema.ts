import { sql } from "@vercel/postgres";

async function dropSchema() {
  try {
    console.log("🗑️  Dropping database schema...");

    // Drop all tables in the public schema
    await sql`DROP SCHEMA public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO public`;

    console.log("✅ Database schema dropped successfully!");
  } catch (error) {
    console.error("❌ Error dropping schema:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

dropSchema();
