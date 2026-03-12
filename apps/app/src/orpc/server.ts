import "server-only";

import { appRouter, createORPCContext } from "@acme/api";
import { auth } from "~/auth/server";

/**
 * Server-side oRPC caller
 * Use this in Server Components and Server Actions
 */
export const api = appRouter.createCaller(
  await createORPCContext({
    auth: auth,
    headers: new Headers(),
  }),
);
