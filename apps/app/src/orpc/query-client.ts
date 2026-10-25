import { createHydrationOptions } from "@orpc/tanstack-query";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";

// oRPC's own serializer keeps Date, Map, Set, BigInt, etc. intact across
// RSC prefetch -> client hydration, matching what RPCLink does on the wire.
const hydration = createHydrationOptions();

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        ...hydration.dehydrate,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
      hydrate: hydration.hydrate,
    },
  });
