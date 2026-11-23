import { afterEach, beforeEach, describe, expect, spyOn, test } from "bun:test";

import { type EmailProvider, sendWithFallback } from "./send";

let consoleError: ReturnType<typeof spyOn>;
let consoleWarn: ReturnType<typeof spyOn>;

beforeEach(() => {
  // The fallback logs every failure; keep the test output readable.
  consoleError = spyOn(console, "error").mockImplementation(() => {});
  consoleWarn = spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
  consoleWarn.mockRestore();
});

const email = {
  from: "Acme <no-reply@example.com>",
  to: ["user@example.com"],
  subject: "Hello",
  html: "<p>Hello</p>",
};

function recordingProvider(
  name: string,
  calls: string[],
  error?: Error,
): EmailProvider {
  return {
    name,
    send: async () => {
      calls.push(name);
      if (error) throw error;
    },
  };
}

describe("sendWithFallback", () => {
  test("falls back to the next provider when the primary fails", async () => {
    const calls: string[] = [];
    const providers = [
      recordingProvider("yandex-postbox", calls, new Error("smtp down")),
      recordingProvider("resend", calls),
    ];

    await expect(sendWithFallback(email, providers)).resolves.toBe("resend");
    expect(calls).toEqual(["yandex-postbox", "resend"]);
  });

  test("does not call the fallback when the primary succeeds", async () => {
    const calls: string[] = [];
    const providers = [
      recordingProvider("yandex-postbox", calls),
      recordingProvider("resend", calls),
    ];

    await expect(sendWithFallback(email, providers)).resolves.toBe(
      "yandex-postbox",
    );
    expect(calls).toEqual(["yandex-postbox"]);
  });

  test("throws when every provider fails", async () => {
    const calls: string[] = [];
    const providers = [
      recordingProvider("yandex-postbox", calls, new Error("smtp down")),
      recordingProvider("resend", calls, new Error("api down")),
    ];

    await expect(sendWithFallback(email, providers)).rejects.toThrow(
      "yandex-postbox, resend",
    );
    expect(calls).toEqual(["yandex-postbox", "resend"]);
  });

  test("no-ops when no provider is configured", async () => {
    await expect(sendWithFallback(email, [])).resolves.toBeNull();
  });
});
