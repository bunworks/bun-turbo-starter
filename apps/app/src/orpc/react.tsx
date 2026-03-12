"use client";

import type { AppRouter } from "@acme/api";
import { createORPCClient, httpBatchStreamLink } from "@orpc/client";
import { createORPCReact } from "@orpc/tanstack-query/react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import { env } from "~/env";
import { createQueryClient } from "./query-client";

/**
 * Create the oRPC client with HTTP batch stream link
 */
const createORPCClientInstance = () => {
  return createORPCClient<AppRouter>({
    links: [
      httpBatchStreamLink({
        transformer: SuperJSON,
        url: `${getBaseUrl()}/api/orpc`,
        headers() {
          const headers = new Headers();
          headers.set("x-orpc-source", "nextjs-react");
          return headers;
        },
      }),
    ],
  });
};

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

/**
 * Create React hooks for oRPC
 */
export const { useORPC, ORPCProvider } = createORPCReact<AppRouter>();

export function ORPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [orpcClient] = useState(() => createORPCClientInstance());

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCProvider client={orpcClient} queryClient={queryClient}>
        {props.children}
      </ORPCProvider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return `http://localhost:${env.PORT}`;
};
