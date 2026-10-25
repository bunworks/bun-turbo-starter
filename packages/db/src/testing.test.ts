import { afterAll, describe, expect, it } from "bun:test";

import { Post } from "./schema";
import { createTestDb } from "./testing";

describe("createTestDb", () => {
  const ready = createTestDb();
  afterAll(async () => (await ready).close());

  it("applies the schema with snake_case columns", async () => {
    const { db } = await ready;
    const [post] = await db
      .insert(Post)
      .values({ title: "Hello", content: "World" })
      .returning();

    expect(post?.id).toBeString();
    expect(post?.createdAt).toBeInstanceOf(Date);
  });
});
