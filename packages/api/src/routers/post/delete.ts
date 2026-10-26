import { eq, Post } from "@acme/db";
import { z } from "zod";

import { adminProcedure } from "../../orpc";

/**
 * Delete a post by its UUID — admin only.
 *
 * Since posts have no author field in the schema, deletion is restricted
 * to admins to prevent abuse.
 */
export const deletePost = adminProcedure
  .errors({ NOT_FOUND: { message: "Публикация не найдена" } })
  .input(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, input, errors }) => {
    const [deleted] = await context.db
      .delete(Post)
      .where(eq(Post.id, input.id))
      .returning({ id: Post.id });

    if (!deleted) {
      throw errors.NOT_FOUND();
    }

    return { success: true, id: deleted.id };
  });
