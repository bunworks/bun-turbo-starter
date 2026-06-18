import { eq, Post } from "@acme/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

import { publicProcedure } from "../../orpc";

/**
 * Fetch a single post by its UUID — available to everyone.
 *
 * Throws NOT_FOUND when no post matches the given id.
 */
export const byId = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, input }) => {
    const post = await context.db.query.Post.findFirst({
      where: eq(Post.id, input.id),
    });

    if (!post) {
      throw new ORPCError("NOT_FOUND", { message: "Post not found" });
    }

    return post;
  });
