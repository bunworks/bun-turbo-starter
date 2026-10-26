import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { call, isDefinedError } from "@orpc/server";

import { createSession, setupTestApi } from "../../../test/helpers";
import { userRouter } from ".";

let api: Awaited<ReturnType<typeof setupTestApi>>;

beforeAll(async () => {
  api = await setupTestApi();
});
afterAll(() => api.close());

describe("user.me", () => {
  it("rejects anonymous callers", async () => {
    const promise = call(userRouter.me, undefined, {
      context: api.context(),
    });

    await expect(promise).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns the session user's row", async () => {
    const session = await createSession(api.db, { name: "Ada" });
    const me = await call(userRouter.me, undefined, {
      context: api.context(session),
    });

    expect(me?.id).toBe(session.user.id);
    expect(me?.name).toBe("Ada");
  });
});

describe("user.updateAccount", () => {
  it("updates only the caller's row", async () => {
    const caller = await createSession(api.db, { name: "Before" });
    const other = await createSession(api.db, { name: "Untouched" });

    await call(
      userRouter.updateAccount,
      { name: "After", language: "ru" },
      { context: api.context(caller) },
    );

    const updated = await call(userRouter.me, undefined, {
      context: api.context(caller),
    });
    const untouched = await call(userRouter.me, undefined, {
      context: api.context(other),
    });

    expect(updated).toMatchObject({ name: "After", language: "ru" });
    expect(untouched?.name).toBe("Untouched");
  });
});

describe("user.updateProfile", () => {
  it("returns a typed CONFLICT when the email is taken", async () => {
    const caller = await createSession(api.db);
    const other = await createSession(api.db);

    const error = await call(
      userRouter.updateProfile,
      { username: "caller", email: other.user.email },
      { context: api.context(caller) },
    ).catch((e) => e);

    expect(isDefinedError(error)).toBe(true);
    expect(error.code).toBe("CONFLICT");
    expect(error.data).toEqual({ field: "email" });
  });

  it("updates the profile when the email is free", async () => {
    const caller = await createSession(api.db);

    await call(
      userRouter.updateProfile,
      { username: "renamed", email: `${crypto.randomUUID()}@test.local` },
      { context: api.context(caller) },
    );

    const me = await call(userRouter.me, undefined, {
      context: api.context(caller),
    });
    expect(me?.username).toBe("renamed");
  });
});
