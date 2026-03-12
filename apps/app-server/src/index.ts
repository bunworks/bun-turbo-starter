import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter, createContext } from "@acme/api";
import { env } from "@acme/config";
import {
  addAPISecurityHeaders,
  captureExceptionToPostHog,
} from "@acme/server-utils";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";
import { handleChatStream } from "./routes/chat-stream";
import { extensionTokenRoutes } from "./routes/extension-token";
import { handleGigChatGenerate } from "./routes/gig-chat-generate";
import { googleCalendarRoutes } from "./routes/google-calendar";
import { resumeDownloadRoutes } from "./routes/resume-download";
import { testSetupRoutes } from "./routes/test-setup";
import { handleVacancyChatGenerate } from "./routes/vacancy-chat-generate";

const app = new Hono();

const corsOrigin = env.CORS_ORIGIN ?? env.APP_URL ?? "http://localhost:3000";

app.use(logger());
app.use(
  "/*",
  cors({
    origin: corsOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-ORPC-Source",
      "x-interview-token",
    ],
    credentials: true,
  }),
);

// Google Calendar OAuth + Extension token (до Better Auth catch-all)
app.route("/api/auth", googleCalendarRoutes);
app.route("/api/auth", extensionTokenRoutes);

// Better Auth — все оставшиеся пути /api/auth/*
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// Вспомогательная функция для отправки ошибок в PostHog
function captureError(error: unknown, context?: Record<string, unknown>) {
  const isORPC = error && typeof error === "object" && "code" in error;
  const err = error instanceof Error ? error : new Error(String(error));
  captureExceptionToPostHog({
    message: err.message,
    type: isORPC ? "ORPCError" : err.name || "Error",
    stack: err.stack,
    context,
    level: isORPC ? "error" : "fatal",
  });
}

// oRPC handler
const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(">>> RPCHandler onError:", error);
      console.error(
        ">>> Error stack:",
        error instanceof Error ? error.stack : "No stack",
      );
      captureError(error, { source: "orpc", service: "app-server" });
    }),
  ],
});

app.on(["GET", "POST"], "/api/orpc/*", async (c) => {
  console.log("[oRPC] Incoming request:", c.req.path);
  try {
    const context = await createContext({
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

    // Проверяем статус ответа (ошибки API уже зафиксированы в onError)
    if (result.response.status >= 400) {
      const responseClone = result.response.clone();
      const body = await responseClone.text();
      console.error(">>> oRPC Error Response:", {
        status: result.response.status,
        path: c.req.path,
        body: body.substring(0, 500),
      });
    }

    const modifiedResponse = addAPISecurityHeaders(result.response);
    return modifiedResponse;
  } catch (error) {
    console.error(">>> oRPC Error:", error);
    console.error(
      ">>> Stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    console.error(">>> Path:", c.req.path);
    captureError(error, {
      source: "orpc-catch",
      service: "app-server",
      path: c.req.path,
    });
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Chat stream (streaming)
app.post("/api/chat/stream", handleChatStream);

// Vacancy chat generate (streaming)
app.post("/api/vacancy/chat-generate", handleVacancyChatGenerate);

// Gig chat generate (streaming)
app.post("/api/gig/chat-generate", handleGigChatGenerate);

// Resume PDF download (с именем ФИО.pdf)
app.route("/api/resume", resumeDownloadRoutes);

// Test setup (только в dev)
app.route("/api/test", testSetupRoutes);

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
  captureError(err, {
    source: "hono",
    service: "app-server",
    path: c.req.path,
  });
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
  // Длинные запросы (parseResume: Docling + LLM) могут занимать 60–90 сек.
  // По умолчанию Bun закрывает соединение через 10 сек «неактивности»,
  // включая время, пока handler ещё не отправил ни байта. max 255.
  idleTimeout: 120,
};
