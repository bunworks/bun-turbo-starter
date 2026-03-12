/**
 * oRPC Root Router
 *
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

import { eq, user } from "@acme/db";
import { accountFormSchema, profileFormSchema } from "@acme/validators";
import { protectedProcedure } from "./orpc";

/**
 * User router with all user-related procedures
 */
export const userRouter = {
  me: protectedProcedure.handler(async ({ context }) => {
    return context.db.query.user.findFirst({
      where: eq(user.id, context.session.user.id),
    });
  }),

  updateProfile: protectedProcedure
    .input(profileFormSchema)
    .handler(async ({ context, input }) => {
      await context.db
        .update(user)
        .set({
          username: input.username,
          email: input.email,
          bio: input.bio,
          updatedAt: new Date(),
        })
        .where(eq(user.id, context.session.user.id));

      return { success: true };
    }),

  updateAccount: protectedProcedure
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
    }),
};

/**
 * This is the primary router for your server
 */
export const appRouter = {
  user: userRouter,
};

// Export type definition of API
export type AppRouter = typeof appRouter;
