import { z } from "zod";

import { publicProcedure } from "../../orpc";

/**
 * List posts with pagination — available to everyone.
 *
 * @example client.post.list({ limit: 10, offset: 0 })
 */
export const list = publicProcedure
  .input(
    z.object({
      /** Number of items per page (1–100, default 20) */
      limit: z.number().min(1).max(100).default(20),
      /** Zero-based offset */
      offset: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ context, input }) => {
    return context.db.query.Post.findMany({
      limit: input.limit,
      offset: input.offset,
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  });
