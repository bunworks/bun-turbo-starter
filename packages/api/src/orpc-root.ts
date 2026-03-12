/**
 * oRPC Root Router
 *
 * Simple oRPC implementation for migration.
 * This is a simplified version that mirrors the tRPC API.
 */

import { accountFormSchema, profileFormSchema } from "@acme/validators";
import { os } from "@orpc/server";
import superjson from "superjson";
import type { ORPCContext } from "./orpc";
import {
  createORPCContext,
  oRPCErrorFormatter,
  protectedProcedure,
} from "./orpc";

/**
 * User router with all user-related procedures
 */
export const userRouter = {
  me: protectedProcedure.handler(async ({ context }) => {
    const ctx = context;
    const { eq, user } = await import("@acme/db");

    return ctx.db.query.user.findFirst({
      where: eq(user.id, ctx.session!.user.id),
    });
  }),

  updateProfile: protectedProcedure
    .input(profileFormSchema)
    .handler(async ({ context, input }) => {
      const ctx = context;
      const { eq, user } = await import("@acme/db");

      await ctx.db
        .update(user)
        .set({
          username: input.username,
          email: input.email,
          bio: input.bio,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session!.user.id));

      return { success: true };
    }),

  updateAccount: protectedProcedure
    .input(accountFormSchema)
    .handler(async ({ context, input }) => {
      const ctx = context;
      const { eq, user } = await import("@acme/db");

      await ctx.db
        .update(user)
        .set({
          name: input.name,
          language: input.language,
          updatedAt: new Date(),
        })
        .where(eq(user.id, ctx.session!.user.id));

      return { success: true };
    }),
};

/**
 * Main oRPC router using os.router
 */
export const appRouter = os
  .router({
    context: createORPCContext,
  })
  .user(userRouter);

// Export type definition of API
export type AppRouter = typeof appRouter;
