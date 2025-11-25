import { eq } from "@acme/db";
import { user } from "@acme/db/schema";
import { accountFormSchema } from "@acme/validators";

import { protectedProcedure } from "../../trpc";

export const updateAccount = protectedProcedure
  .input(accountFormSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(user)
      .set({
        name: input.name,
        language: input.language,
        updatedAt: new Date(),
      })
      .where(eq(user.id, ctx.session.user.id));

    return { success: true };
  });
