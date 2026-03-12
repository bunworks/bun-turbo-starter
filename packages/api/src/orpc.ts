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

import type { Auth } from "@acme/auth";
import { dbEdge as db } from "@acme/db";
import { ORPCError, os } from "@orpc/server";

export async function createORPCContext(opts: {
  headers: Headers;
  auth: Auth;
}) {
  const session = await opts.auth.api.getSession({
    headers: opts.headers,
  });

  return {
    session,
    db,
  };
}

/**
 * 2. INITIALIZATION
 *
 * This is where the oRPC api is initialized, connecting the context
 */
const o = os.$context<Awaited<ReturnType<typeof createORPCContext>>>();

/**
 * Timing middleware
 */
const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  try {
    return await next();
  } finally {
    console.log(`[oRPC] ${path} took ${Date.now() - start}ms to execute`);
  }
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your oRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = o.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `context.session.user` is not null.
 *
 * @see https://orpc.dev/docs/server/procedures
 */
export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: { ...context.session, user: context.session.user },
    },
  });
});

// Export the context type for use in other files
export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>;
