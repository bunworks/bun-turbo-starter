import { logger } from "@acme/config";

import { db } from "../client";
import { baselineMigrations } from "../migrations";

/**
 * One-off for databases created with `db:push` before migrations existed:
 * `bun db:baseline && bun db:migrate`. Safe to re-run.
 */
async function main() {
  try {
    const result = await baselineMigrations(db);
    logger.info("db.baseline.done", { result });
    process.exit(0);
  } catch (error) {
    logger.error("db.baseline.failed", error);
    process.exit(1);
  }
}

main();
