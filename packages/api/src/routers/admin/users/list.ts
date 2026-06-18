import { z } from "zod";

import { adminProcedure } from "../../../orpc";

/**
 * List all registered users with pagination.
 *
 * @example client.admin.users.list({ limit: 20, offset: 0 })
 */
export const list = adminProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ context, input }) => {
    return context.db.query.user.findMany({
      limit: input.limit,
      offset: input.offset,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      columns: {
        id: true,
        name: true,
        email: true,
        username: true,
        emailVerified: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
