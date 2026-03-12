import type { Auth } from "@acme/auth";
import { dbEdge as db } from "@acme/db";
import { ORPCError, os } from "@orpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for an oRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://orpc.dev/docs/server/context
 */
export const createORPCContext = async (opts: {
  headers: Headers;
  auth: Auth;
}) => {
  const authApi = opts.auth.api;
  const session = await authApi.getSession({
    headers: opts.headers,
  });
  return {
    authApi,
    session,
    db: db,
  };
};

/**
 * 2. ERROR FORMATTER
 *
 * This is the error formatter used to format errors before sending them to the client.
 * It mirrors the one used in the tRPC setup.
 */
export const oRPCErrorFormatter = ({
  shape,
  error,
}: {
  shape: any;
  error: any;
}) => ({
  ...shape,
  data: {
    ...shape.data,
    zodError:
      error.cause instanceof ZodError
        ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
        : null,
  },
});

/**
 * 3. INITIALIZATION
 *
 * This is where the orpc api is initialized, connecting the context and
 * transformer
 */
const base = os.$context<typeof createORPCContext>();

/**
 * 4. PROCEDURES
 *
 * These are the base procedures for building queries and mutations.
 */
export const publicProcedure = base.procedure;

export const protectedProcedure = base.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new ORPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

// Export the context type for use in other files
export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>;
