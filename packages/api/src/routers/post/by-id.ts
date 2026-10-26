import { eq, Post } from "@acme/db";
import { z } from "zod";

import { publicProcedure } from "../../orpc";

/**
 * Fetch a single post by its UUID — available to everyone.
 *
 * Throws NOT_FOUND when no post matches the given id.
 */
export const byId = publicProcedure
  .errors({ NOT_FOUND: { message: "Публикация не найдена" } })
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, input, errors }) => {
    const post = await context.db.query.Post.findFirst({
      where: eq(Post.id, input.id),
    });

    if (!post) {
      throw errors.NOT_FOUND();
    }

    return post;
  });
