import type { appRouter } from "@acme/api";
import type { RouterClient } from "@orpc/server";

declare global {
  // eslint-disable-next-line no-var
  var $client: RouterClient<typeof appRouter> | undefined;
}
