import { describe, expect, test } from "bun:test";
import { selectDbDriver } from "./driver";

describe("selectDbDriver", () => {
  test("defaults to node-postgres for a local connection string", () => {
    expect(
      selectDbDriver(
        "postgres://postgres:password@localhost:5432/acme",
        undefined,
      ),
    ).toBe("node");
  });

  test("auto-detects neon-http for *.neon.tech URLs", () => {
    expect(
      selectDbDriver(
        "postgres://user:pass@ep-cool-name-123456.eu-central-1.aws.neon.tech/db",
        undefined,
      ),
    ).toBe("neon-http");
  });

  test("explicit override wins over auto-detection", () => {
    expect(
      selectDbDriver("postgres://user:pass@something.neon.tech/db", "node"),
    ).toBe("node");
    expect(
      selectDbDriver("postgres://postgres@localhost:5432/acme", "neon-http"),
    ).toBe("neon-http");
  });

  test("ignores an unknown override value", () => {
    expect(
      selectDbDriver("postgres://postgres@localhost:5432/acme", "bogus"),
    ).toBe("node");
  });

  test("falls back to node when no connection string is given", () => {
    expect(selectDbDriver(undefined, undefined)).toBe("node");
  });
});
