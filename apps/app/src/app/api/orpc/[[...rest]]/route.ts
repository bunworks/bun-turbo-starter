import { appRouter, createORPCContext } from "@acme/api";
import { RPCHandler } from "@orpc/server/fetch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleRequest(request: Request) {
  const { auth } = await import("~/auth/server");

  const handler = new RPCHandler(appRouter, {
    interceptors: [
      async ({ next }) => {
        try {
          return await next();
        } catch (error) {
          console.error(">>> oRPC Error", error);
          throw error;
        }
      },
    ],
  });

  const { response } = await handler.handle(request, {
    prefix: "/api/orpc",
    context: await createORPCContext({
      auth: auth,
      headers: request.headers,
    }),
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
