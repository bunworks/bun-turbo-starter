import { db } from "../client";
import { baselineMigrations } from "../migrations";

/**
 * One-off for databases created with `db:push` before migrations existed:
 * `bun db:baseline && bun db:migrate`. Safe to re-run.
 *
 * Plain console output, like `migrate.ts`: a CLI that must run before
 * `@acme/config` is built.
 */
async function main() {
  try {
    const result = await baselineMigrations(db);
    console.log(
      result === "baselined"
        ? "✓ Recorded 0000_init as applied. Now run `bun db:migrate`."
        : "✓ Migrations are already tracked here; nothing to do.\n" +
            "  If `bun db:migrate` still fails with “already exists”, the " +
            "migrations table may belong to another app sharing this " +
            "database — use a dedicated database.",
    );
    return 0;
  } catch (error) {
    console.error(
      `✗ Baseline failed: ${error instanceof Error ? error.message : error}`,
    );
    return 1;
  }
}

process.exit(await main());
