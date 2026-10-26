/**
 * Next.js instrumentation hook.
 *
 * Registers OpenTelemetry so traces/metrics are emitted automatically. On
 * Vercel this is picked up by the platform; self-hosted setups can point
 * `OTEL_EXPORTER_OTLP_ENDPOINT` at any OTLP-compatible collector.
 *
 * `ORPCInstrumentation` adds a span per oRPC call (handler, middlewares,
 * input/output validation) under Next's request span, and propagates trace
 * context between the oRPC client and server. `logger` from `@acme/config`
 * stamps every log line with the active `trace_id` / `span_id`.
 *
 * @see https://nextjs.org/docs/app/guides/open-telemetry
 * @see https://orpc.dev/docs/integrations/opentelemetry
 */
import { ORPCInstrumentation } from "@orpc/opentelemetry";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "acme-app",
    // "auto" keeps @vercel/otel's defaults (fetch); oRPC is added on top.
    instrumentations: ["auto", new ORPCInstrumentation()],
  });
}
