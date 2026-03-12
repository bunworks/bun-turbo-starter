import { appRouter, createORPCContext } from "@acme/api";
import { toFetchHandler } from "@orpc/next/fetch";
import type { NextRequest } from "next/server";

import { auth } from "~/auth/server";

/**
 * Configure basic CORS headers
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = toFetchHandler(appRouter, {
  context: async ({ req }) => {
    return createORPCContext({
      auth: auth,
      headers: req.headers,
    });
  },
  onError({ error, path }) {
    console.error(`>>> oRPC Error on '${path}'`, error);
  },
});

export { handler as GET, handler as POST };
