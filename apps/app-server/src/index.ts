/**
 * Optional standalone API server.
 *
 * The Next.js app (`apps/app`) is fully self-contained: it serves `@acme/api`
 * through its own route handler at `/api/orpc`. This Hono server is an
 * *optional* deployment target for teams who want to run the API as a separate
 * service (e.g. for mobile clients, a dedicated container, or to scale the API
 * independently of the web app). Point the web app at it via
 * `NEXT_PUBLIC_API_URL`.
 */

import { appRouter, createORPCContext } from "@acme/api";
import { env, logger } from "@acme/config";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = new Hono();

const corsOrigin = env.APP_URL ?? "http://localhost:3000";

app.use(
  "/*",
  cors({
    origin: corsOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Better Auth
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// oRPC handler
const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      logger.error("orpc.handler_error", error);
    }),
  ],
});

app.on(["GET", "POST"], "/api/orpc/*", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  const result = await rpcHandler.handle(c.req.raw, {
    prefix: "/api/orpc",
    context: createORPCContext({
      headers: c.req.raw.headers,
      session,
    }),
  });

  if (!result.matched) {
    return c.notFound();
  }

  return result.response;
});

// Health check
app.get("/", (c) => c.text("OK"));
app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "app-server",
  }),
);

// 404
app.notFound((c) =>
  c.json(
    {
      error: "Not Found",
      message: "Endpoint not found",
      path: c.req.path,
    },
    404,
  ),
);

// Error handler
app.onError((err, c) => {
  logger.error("app_server.unhandled_error", err, { path: c.req.path });
  return c.json(
    {
      error: "Internal Server Error",
      message: "Internal server error",
    },
    500,
  );
});

const port = Number(process.env.PORT ?? 7000);

logger.info("app_server.started", {
  port,
  env: process.env.NODE_ENV ?? "development",
});

export default {
  port,
  fetch: app.fetch,
};
