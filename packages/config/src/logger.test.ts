import { afterAll, beforeAll, describe, expect, it, spyOn } from "bun:test";
import { context, TraceFlags, trace } from "@opentelemetry/api";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";

import { logger } from "./logger";

const TRACE_ID = "0af7651916cd43dd8448eb211c80319c";
const SPAN_ID = "b7ad6b7169203331";

function captureLine(fn: () => void) {
  const spy = spyOn(console, "warn").mockImplementation(() => {});
  try {
    fn();
    return JSON.parse(String(spy.mock.calls[0]?.[0]));
  } finally {
    spy.mockRestore();
  }
}

describe("logger trace correlation", () => {
  const manager = new AsyncLocalStorageContextManager();

  beforeAll(() => {
    context.setGlobalContextManager(manager.enable());
  });
  afterAll(() => {
    manager.disable();
    context.disable();
  });

  it("stamps trace_id and span_id inside an active span", () => {
    const span = trace.wrapSpanContext({
      traceId: TRACE_ID,
      spanId: SPAN_ID,
      traceFlags: TraceFlags.SAMPLED,
    });

    const line = captureLine(() =>
      context.with(trace.setSpan(context.active(), span), () =>
        logger.warn("traced", { extra: 1 }),
      ),
    );

    expect(line).toMatchObject({
      msg: "traced",
      trace_id: TRACE_ID,
      span_id: SPAN_ID,
      extra: 1,
    });
  });

  it("omits the fields outside a span", () => {
    const line = captureLine(() => logger.warn("untraced"));

    expect(line.msg).toBe("untraced");
    expect(line).not.toHaveProperty("trace_id");
    expect(line).not.toHaveProperty("span_id");
  });
});
