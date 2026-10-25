import { bigint, integer, pgTable, text } from "drizzle-orm/pg-core";

/**
 * Better Auth rate-limit counters (`rateLimit.storage: "database"`), shared
 * across all app instances instead of living in per-process memory.
 */
export const rateLimit = pgTable("rate_limits", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull(),
  lastRequest: bigint("last_request", { mode: "number" }).notNull(),
});
