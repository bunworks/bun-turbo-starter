import { Post, sql, user } from "@acme/db";

import { adminProcedure } from "../../../orpc";

/**
 * High-level system overview: total user count, total post count.
 *
 * Uses COUNT(*) aggregates for efficiency — no full table scans.
 *
 * @example client.admin.stats.overview()
 */
export const overview = adminProcedure.handler(async ({ context }) => {
  const [userRow] = await context.db
    .select({ count: sql<number>`count(*)::int` })
    .from(user);

  const [postRow] = await context.db
    .select({ count: sql<number>`count(*)::int` })
    .from(Post);

  return {
    users: userRow?.count ?? 0,
    posts: postRow?.count ?? 0,
  };
});
