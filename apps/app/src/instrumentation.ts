/**
 * Next.js instrumentation hook.
 *
 * Registers OpenTelemetry so traces/metrics are emitted automatically. On
 * Vercel this is picked up by the platform; self-hosted setups can point
 * `OTEL_EXPORTER_OTLP_ENDPOINT` at any OTLP-compatible collector.
 *
 * @see https://nextjs.org/docs/app/guides/open-telemetry
 */
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({ serviceName: "acme-app" });
}
