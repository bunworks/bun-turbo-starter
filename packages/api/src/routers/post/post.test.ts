import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { call, ORPCError } from "@orpc/server";

import {
  ADMIN_EMAIL,
  createSession,
  setupTestApi,
} from "../../../test/helpers";
import { postRouter } from ".";

let api: Awaited<ReturnType<typeof setupTestApi>>;

beforeAll(async () => {
  api = await setupTestApi();
});
afterAll(() => api.close());

describe("post.create", () => {
  it("rejects anonymous callers", async () => {
    const promise = call(
      postRouter.create,
      { title: "Hi", content: "There" },
      { context: api.context() },
    );

    await expect(promise).rejects.toBeInstanceOf(ORPCError);
    await expect(promise).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("creates a post that list and byId return", async () => {
    const session = await createSession(api.db);
    const created = await call(
      postRouter.create,
      { title: "Hello", content: "World" },
      { context: api.context(session) },
    );

    expect(created?.title).toBe("Hello");

    const list = await call(postRouter.list, {}, { context: api.context() });
    expect(list.map((p) => p.id)).toContain(created?.id ?? "");

    const found = await call(
      postRouter.byId,
      { id: created?.id ?? "" },
      { context: api.context() },
    );
    expect(found.content).toBe("World");
  });

  it("validates input", async () => {
    const session = await createSession(api.db);
    const promise = call(
      postRouter.create,
      { title: "x".repeat(300), content: "y" },
      { context: api.context(session) },
    );

    await expect(promise).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("post.byId", () => {
  it("throws NOT_FOUND for an unknown id", async () => {
    const promise = call(
      postRouter.byId,
      { id: crypto.randomUUID() },
      { context: api.context() },
    );

    await expect(promise).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("post.delete", () => {
  it("is forbidden for non-admins", async () => {
    const session = await createSession(api.db);
    const promise = call(
      postRouter.delete,
      { id: crypto.randomUUID() },
      { context: api.context(session) },
    );

    await expect(promise).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("lets admins delete a post", async () => {
    const admin = await createSession(api.db, { email: ADMIN_EMAIL });
    const post = await call(
      postRouter.create,
      { title: "Doomed", content: "Post" },
      { context: api.context(admin) },
    );

    const result = await call(
      postRouter.delete,
      { id: post?.id ?? "" },
      { context: api.context(admin) },
    );
    expect(result).toEqual({ success: true, id: post?.id ?? "" });
  });
});
