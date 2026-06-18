import { eq, user } from "@acme/db";

import { protectedProcedure } from "../../orpc";

/**
 * Get the current authenticated user's profile.
 */
export const me = protectedProcedure.handler(async ({ context }) => {
  return context.db.query.user.findFirst({
    where: eq(user.id, context.session.user.id),
  });
});
