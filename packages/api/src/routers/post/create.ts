import { CreatePostSchema, Post } from "@acme/db";

import { protectedProcedure } from "../../orpc";

/**
 * Create a new post — authenticated users only.
 *
 * @example client.post.create({ title: "Hello", content: "World" })
 */
export const create = protectedProcedure
  .input(CreatePostSchema)
  .handler(async ({ context, input }) => {
    const [post] = await context.db.insert(Post).values(input).returning();
    return post;
  });
