/**
 * API endpoint: GET /api/auth/extension-token
 * Токен для расширения (расширенная сессия)
 */
import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import { user as userTable } from "@acme/db/schema";
import { Hono } from "hono";
import { auth } from "../auth";

const app = new Hono();

app.get("/extension-token", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.session?.id || !session?.user) {
    return c.json({ error: "Необходима авторизация" }, 401);
  }

  const { session: sessionTable } = await import("@acme/db/schema");
  const sess = await db.query.session.findFirst({
    where: eq(sessionTable.id, session.session.id),
    columns: { token: true, expiresAt: true },
  });

  if (!sess || new Date(sess.expiresAt) < new Date()) {
    return c.json({ error: "Сессия истекла" }, 401);
  }

  const userRecord = await db.query.user.findFirst({
    where: eq(userTable.id, session.user.id),
    columns: {
      id: true,
      email: true,
      lastActiveOrganizationId: true,
      lastActiveWorkspaceId: true,
    },
  });

  if (!userRecord) {
    return c.json({ error: "Пользователь не найден" }, 404);
  }

  return c.json({
    token: sess.token,
    user: {
      id: userRecord.id,
      email: userRecord.email,
      organizationId: userRecord.lastActiveOrganizationId ?? undefined,
      workspaceId: userRecord.lastActiveWorkspaceId ?? undefined,
    },
  });
});

export const extensionTokenRoutes = app;
