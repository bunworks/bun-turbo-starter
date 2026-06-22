import { sql, user } from "@acme/db";
import { z } from "zod";

import { adminProcedure } from "../../../orpc";

/**
 * Search users by name or email (case-insensitive prefix match).
 *
 * Returns up to `limit` results ordered alphabetically by name.
 *
 * @example client.admin.users.search({ query: "alice", limit: 10 })
 */
export const search = adminProcedure
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(10),
    }),
  )
  .handler(async ({ context, input }) => {
    const pattern = `${input.query.toLowerCase()}%`;

    return context.db.query.user.findMany({
      limit: input.limit,
      where: sql`lower(${user.name}) like ${pattern} or lower(${user.email}) like ${pattern}`,
      orderBy: (users, { asc }) => [asc(users.name)],
      columns: {
        id: true,
        name: true,
        email: true,
        username: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  });
