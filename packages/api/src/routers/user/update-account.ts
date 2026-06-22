import { eq, user } from "@acme/db";
import { accountFormSchema } from "@acme/validators";

import { protectedProcedure } from "../../orpc";

/**
 * Update account settings: display name, preferred language.
 */
export const updateAccount = protectedProcedure
  .input(accountFormSchema)
  .handler(async ({ context, input }) => {
    await context.db
      .update(user)
      .set({
        name: input.name,
        language: input.language,
        updatedAt: new Date(),
      })
      .where(eq(user.id, context.session.user.id));

    return { success: true };
  });
