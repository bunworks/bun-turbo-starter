"use client";

import type { AppRouter } from "@acme/api";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import { env } from "~/env";
import { createQueryClient } from "./query-client";

/**
 * Create the oRPC client
 */
const createORPCClientInstance = () => {
  const link = new RPCLink({
    url: `${getBaseUrl()}/api/orpc`,
    headers: () => ({
      "x-orpc-source": "nextjs-react",
    }),
  });

  return createORPCClient<AppRouter>(link);
};

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  } else {
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export function ORPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [orpcClient] = useState(() => createORPCClientInstance());

  // Store client in global for hooks
  if (typeof window !== "undefined") {
    (window as any).__orpcClient = orpcClient;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

export const useORPC = () => {
  if (typeof window === "undefined") {
    throw new Error("useORPC can only be used in client components");
  }
  return (window as any).__orpcClient as ReturnType<
    typeof createORPCClientInstance
  >;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return `http://localhost:${env.PORT}`;
};
