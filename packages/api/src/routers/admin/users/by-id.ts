import { eq, user } from "@acme/db";
import { z } from "zod";

import { adminProcedure } from "../../../orpc";

/**
 * Get a single user by their ID.
 *
 * Throws NOT_FOUND when no user matches the given id.
 */
export const byId = adminProcedure
  .errors({ NOT_FOUND: { message: "Пользователь не найден" } })
  .input(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, input, errors }) => {
    const found = await context.db.query.user.findFirst({
      where: eq(user.id, input.id),
    });

    if (!found) {
      throw errors.NOT_FOUND();
    }

    return found;
  });
