import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { eq, user } from "@acme/db";
import { createTestDb } from "@acme/db/testing";

import { initAuth } from ".";
import { hasAdminRole, isAdmin } from "./roles";

// ADMIN_EMAILS is pinned by test/setup.ts (and packages/api/test/setup.ts).
const ADMIN_EMAIL = "admin@test.local";
const PASSWORD = "test-password-123";

describe("hasAdminRole / isAdmin", () => {
  it("reads comma-separated Better Auth roles", () => {
    expect(hasAdminRole("admin")).toBe(true);
    expect(hasAdminRole("editor, admin")).toBe(true);
    expect(hasAdminRole("user")).toBe(false);
    expect(hasAdminRole(null)).toBe(false);
  });

  it("treats ADMIN_EMAILS as admins regardless of role", () => {
    expect(isAdmin({ email: "ADMIN@test.local", role: "user" })).toBe(true);
    expect(isAdmin({ email: "someone@test.local", role: "user" })).toBe(false);
  });
});

describe("ADMIN_EMAILS bootstrap hooks", () => {
  let testDb: Awaited<ReturnType<typeof createTestDb>>;
  let auth: ReturnType<typeof initAuth>;

  beforeAll(async () => {
    testDb = await createTestDb();
    auth = initAuth({
      baseUrl: "http://localhost:3000",
      productionUrl: "http://localhost:3000",
      secret: "test-secret-0123456789-0123456789-abcdef",
      database: testDb.db,
    });
  });
  afterAll(() => testDb.close());

  async function roleOf(email: string) {
    const [row] = await testDb.db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.email, email));
    return row?.role;
  }

  it("gives new users the default role and listed emails the admin role", async () => {
    await auth.api.signUpEmail({
      body: { email: "regular@test.local", password: PASSWORD, name: "R" },
    });
    await auth.api.signUpEmail({
      body: { email: ADMIN_EMAIL, password: PASSWORD, name: "A" },
    });

    expect(await roleOf("regular@test.local")).toBe("user");
    expect(await roleOf(ADMIN_EMAIL)).toBe("admin");
  });

  it("promotes a listed account on sign-in", async () => {
    await testDb.db
      .update(user)
      .set({ role: "user" })
      .where(eq(user.email, ADMIN_EMAIL));

    await auth.api.signInEmail({
      body: { email: ADMIN_EMAIL, password: PASSWORD },
    });

    expect(await roleOf(ADMIN_EMAIL)).toBe("admin");
  });
});
