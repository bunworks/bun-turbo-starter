import { appRouter, createORPCContext } from "@acme/api";
import { env } from "@acme/config";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";

const app = new Hono();

const corsOrigin = env.APP_URL ?? "http://localhost:3000";

app.use(logger());
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
      console.error(">>> RPCHandler onError:", error);
      console.error(
        ">>> Error stack:",
        error instanceof Error ? error.stack : "No stack",
      );
    }),
  ],
});

app.on(["GET", "POST"], "/api/orpc/*", async (c) => {
  console.log("[oRPC] Incoming request:", c.req.path);
  try {
    const context = await createORPCContext({
      // @ts-expect-error - Type mismatch due to better-auth being in multiple packages
      auth,
      headers: c.req.raw.headers,
    });
    console.log(
      "[oRPC] Context created, session:",
      context.session?.user?.id || "no session",
    );

    const result = await rpcHandler.handle(c.req.raw, {
      prefix: "/api/orpc",
      context,
    });

    if (!result.matched) {
      return c.notFound();
    }

    if (result.response.status >= 400) {
      const responseClone = result.response.clone();
      const body = await responseClone.text();
      console.error(">>> oRPC Error Response:", {
        status: result.response.status,
        path: c.req.path,
        body: body.substring(0, 500),
      });
    }

    return result.response;
  } catch (error) {
    console.error(">>> oRPC Error:", error);
    console.error(
      ">>> Stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    console.error(">>> Path:", c.req.path);
    return c.json({ error: "Internal Server Error" }, 500);
  }
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
      message: "Endpoint не найден",
      path: c.req.path,
    },
    404,
  ),
);

// Error handler
app.onError((err, c) => {
  console.error("App server error:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: "Внутренняя ошибка сервера",
    },
    500,
  );
});

const port = Number(process.env.PORT ?? 7000);

console.log(
  `[app-server] Running on http://localhost:${port} (env: ${process.env.NODE_ENV ?? "development"})`,
);

export default {
  port,
  fetch: app.fetch,
};
