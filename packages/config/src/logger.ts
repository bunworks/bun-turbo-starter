/**
 * Minimal structured logger.
 *
 * Emits one JSON line per entry so logs are machine-parseable in any
 * environment (Vercel, Docker, etc.) and play nicely with log drains and
 * OpenTelemetry collectors. This is the single sanctioned place in the
 * codebase that is allowed to call `console.*`.
 *
 * Lines written inside a traced operation carry `trace_id` / `span_id`
 * (OpenTelemetry log data model names), so logs and traces can be joined.
 * Only `@opentelemetry/api` is used: without a registered SDK (tests,
 * scripts) there is no active span and the fields are simply omitted.
 */

import { isSpanContextValid, trace } from "@opentelemetry/api";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveMinLevel(): LogLevel {
  const fromEnv = process.env.LOG_LEVEL?.toLowerCase();
  if (fromEnv && fromEnv in LEVEL_PRIORITY) {
    return fromEnv as LogLevel;
  }
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

const minLevel = resolveMinLevel();

function serializeError(error: unknown): LogMeta {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { error: String(error) };
}

function traceFields(): LogMeta {
  const context = trace.getActiveSpan()?.spanContext();
  if (!context || !isSpanContextValid(context)) return {};
  return { trace_id: context.traceId, span_id: context.spanId };
}

function write(level: LogLevel, message: string, meta?: LogMeta): void {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[minLevel]) {
    return;
  }

  const entry = {
    level,
    time: new Date().toISOString(),
    msg: message,
    ...traceFields(),
    ...meta,
  };

  const line = JSON.stringify(entry);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => write("debug", message, meta),
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, error?: unknown, meta?: LogMeta) =>
    write("error", message, {
      ...(error === undefined ? {} : serializeError(error)),
      ...meta,
    }),
};

export type Logger = typeof logger;
