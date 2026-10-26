import type { Session } from "@acme/auth";
import { type Database, user } from "@acme/db";
import { createTestDb } from "@acme/db/testing";

import { createORPCContext } from "../src/orpc";

export const ADMIN_EMAIL = "admin@test.local";

/** Inserts a user row and returns a matching Better Auth session. */
export async function createSession(
  db: Database,
  overrides: { email?: string; name?: string; role?: string } = {},
): Promise<Session> {
  const now = new Date();
  const [row] = await db
    .insert(user)
    .values({
      id: crypto.randomUUID(),
      name: overrides.name ?? "Test User",
      email: overrides.email ?? `${crypto.randomUUID()}@test.local`,
      role: overrides.role ?? "user",
    })
    .returning();
  if (!row) throw new Error("Failed to insert test user");

  return {
    user: row,
    session: {
      id: crypto.randomUUID(),
      userId: row.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(now.getTime() + 60_000),
      createdAt: now,
      updatedAt: now,
    },
  };
}

/** Fresh PGlite database plus a context factory bound to it. */
export async function setupTestApi() {
  const { db, close } = await createTestDb();

  const context = (session: Session | null = null) => ({
    ...createORPCContext({ headers: new Headers(), session }),
    db,
  });

  return { db, close, context };
}
