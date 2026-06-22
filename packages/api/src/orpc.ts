/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for an oRPC context. The API handler and RSC clients each
 * wrap this and provide the required context.
 *
 * The context is intentionally decoupled from any concrete `better-auth` instance: callers resolve
 * the session themselves (via `auth.api.getSession`) and pass it in. This keeps `@acme/api` free of
 * the `Auth` type, which previously caused cross-package type mismatches when `better-auth` resolved
 * to more than one instance in the workspace.
 *
 * @see https://orpc.dev/docs/server/context
 */

import type { Session } from "@acme/auth";
import { logger } from "@acme/config";
import { db } from "@acme/db";
import { ORPCError, os } from "@orpc/server";

export interface CreateORPCContextOptions {
  /** Request headers, kept on the context for procedures that need them. */
  headers: Headers;
  /** Pre-resolved session (or `null` for anonymous requests). */
  session: Session | null;
}

export function createORPCContext(opts: CreateORPCContextOptions) {
  return {
    session: opts.session,
    headers: opts.headers,
    db,
  };
}

/**
 * 2. INITIALIZATION
 *
 * This is where the oRPC api is initialized, connecting the context
 */
const o = os.$context<ReturnType<typeof createORPCContext>>();

/**
 * Timing middleware
 *
 * Emits a structured log line per request instead of a raw `console.log`.
 */
const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  try {
    return await next();
  } finally {
    logger.info("orpc.request", {
      path: Array.isArray(path) ? path.join(".") : path,
      durationMs: Date.now() - start,
    });
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

/**
 * Admin (privileged) procedure
 *
 * Builds on `protectedProcedure` and additionally verifies that the
 * authenticated user has admin privileges.
 *
 * Admin access is granted to emails listed in the ADMIN_EMAILS environment
 * variable (comma-separated).
 *
 * @example ADMIN_EMAILS=admin@example.com,ops@example.com
 */
export const adminProcedure = protectedProcedure.use(({ context, next }) => {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(context.session.user.email.toLowerCase())) {
    throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
  }

  return next();
});

// Export the context type for use in other files
export type ORPCContext = ReturnType<typeof createORPCContext>;
