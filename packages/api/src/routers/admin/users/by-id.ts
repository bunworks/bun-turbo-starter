import { eq, user } from "@acme/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";

import { adminProcedure } from "../../../orpc";

/**
 * Get a single user by their ID.
 *
 * Throws NOT_FOUND when no user matches the given id.
 */
export const byId = adminProcedure
  .input(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, input }) => {
    const found = await context.db.query.user.findFirst({
      where: eq(user.id, input.id),
    });

    if (!found) {
      throw new ORPCError("NOT_FOUND", { message: "User not found" });
    }

    return found;
  });
