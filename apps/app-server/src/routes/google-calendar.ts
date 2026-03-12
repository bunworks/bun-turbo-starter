/**
 * Google Calendar OAuth flow: init + callback
 * Пути: /api/auth/google-calendar, /api/auth/google-calendar/callback
 */
import { createHash, randomBytes } from "node:crypto";
import { env } from "@acme/config";
import { upsertUserIntegration } from "@acme/db";
import { db } from "@acme/db/client";
import type { Context } from "hono";
import { Hono } from "hono";
import { getSession } from "../auth";

const app = new Hono();

app.get("/google-calendar", async (c: Context) => {
  const session = await getSession(c.req.raw.headers);

  if (!session?.user) {
    return c.redirect(
      `${env.APP_URL}/auth/sign-in?callbackUrl=/account/settings/integrations`,
      302,
    );
  }

  const clientId = env.GOOGLE_CALENDAR_CLIENT_ID ?? env.AUTH_GOOGLE_ID;
  const clientSecret =
    env.GOOGLE_CALENDAR_CLIENT_SECRET ?? env.AUTH_GOOGLE_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "[Google Calendar OAuth] GOOGLE_CALENDAR_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_SECRET not configured",
    );
    return c.redirect(
      `${env.APP_URL}/account/settings/integrations?error=config`,
      302,
    );
  }

  const state = randomBytes(32).toString("hex");
  const stateHash = createHash("sha256")
    .update(state + session.user.id)
    .digest("hex");

  const redirectUri = `${env.APP_URL}/api/auth/google-calendar/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "email",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
    state: `${state}:${stateHash}`,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return c.redirect(authUrl, 302);
});

app.get("/google-calendar/callback", async (c: Context) => {
  const session = await getSession(c.req.raw.headers);

  if (!session?.user) {
    return c.redirect(
      `${env.APP_URL}/auth/sign-in?callbackUrl=/account/settings/integrations`,
      302,
    );
  }

  const searchParams = new URL(c.req.url).searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const successUrl = `${env.APP_URL}/account/settings/integrations?google_calendar=connected`;
  const errorUrl = `${env.APP_URL}/account/settings/integrations?error=google_calendar_failed`;

  if (errorParam) {
    console.error("[Google Calendar OAuth] Error from Google:", errorParam);
    return c.redirect(errorUrl, 302);
  }

  if (!code || !state) {
    return c.redirect(errorUrl, 302);
  }

  const [stateNonce, stateHash] = state.split(":");
  if (!stateNonce || !stateHash) {
    return c.redirect(errorUrl, 302);
  }

  const expectedHash = createHash("sha256")
    .update(stateNonce + session.user.id)
    .digest("hex");

  if (stateHash !== expectedHash) {
    console.error("[Google Calendar OAuth] Invalid state");
    return c.redirect(errorUrl, 302);
  }

  const clientId = env.GOOGLE_CALENDAR_CLIENT_ID ?? env.AUTH_GOOGLE_ID;
  const clientSecret =
    env.GOOGLE_CALENDAR_CLIENT_SECRET ?? env.AUTH_GOOGLE_SECRET;

  if (!clientId || !clientSecret) {
    return c.redirect(errorUrl, 302);
  }

  const redirectUri = `${env.APP_URL}/api/auth/google-calendar/callback`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    console.error("[Google Calendar OAuth] Token exchange failed:", {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      error: errText,
      redirectUri,
      clientId: `${clientId.substring(0, 20)}...`,
    });
    return c.redirect(errorUrl, 302);
  }

  const tokens = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const expiryDate = tokens.expires_in
    ? Date.now() + tokens.expires_in * 1000
    : undefined;

  await upsertUserIntegration(db, {
    userId: session.user.id,
    type: "google_calendar",
    name: "Google Calendar",
    credentials: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? "",
      ...(expiryDate !== undefined && {
        expiry_date: String(expiryDate),
      }),
    },
    metadata: { email: session.user.email ?? undefined },
    isActive: true,
  });

  return c.redirect(successUrl, 302);
});

export const googleCalendarRoutes = app;
