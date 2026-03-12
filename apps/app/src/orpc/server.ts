import "server-only";

import { appRouter, createORPCContext } from "@acme/api";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "~/auth/server";

const createServerContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-orpc-source", "rsc");

  return createORPCContext({
    headers: heads,
    auth,
  });
});

/**
 * This is part of the Optimize SSR setup.
 *
 * @see {@link https://orpc.dev/docs/adapters/next#optimize-ssr}
 */
globalThis.$client = createRouterClient(appRouter, {
  context: createServerContext,
});

export const api = globalThis.$client;

const getClient = () => {
  const client = globalThis.$client;
  if (!client) throw new Error("oRPC client not initialized");
  return client;
};

export const orpc = createTanstackQueryUtils(getClient());
