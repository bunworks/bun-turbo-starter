/**
 * Test setup API (только в dev): POST/DELETE /api/test/setup
 */
import { eq } from "@acme/db";
import { db } from "@acme/db/client";
import {
  organization,
  organizationMember,
  user,
  workspace,
} from "@acme/db/schema";
import { Hono } from "hono";
import { auth } from "../auth";

const app = new Hono();

const isProduction = process.env.NODE_ENV === "production";

app.post("/setup", async (c) => {
  if (isProduction) {
    return c.json({ error: "Test API is only available in development" }, 403);
  }

  try {
    const body = (await c.req.json()) as Record<string, unknown>;
    const { email, password, name, orgName, workspaceName } = body as {
      email?: string;
      password?: string;
      name?: string;
      orgName?: string;
      workspaceName?: string;
    };

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split("@")[0],
      },
    });

    if (!signUpResult) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.email, email as string))
      .limit(1);

    if (!userRecord[0]) {
      return c.json({ error: "User not found after creation" }, 500);
    }

    const userId = userRecord[0].id;
    const timestamp = Date.now();
    const orgSlug = `test-org-${timestamp}`;

    const orgResult = await db
      .insert(organization)
      .values({
        name: (orgName as string) || "Test Organization",
        slug: orgSlug,
      })
      .returning();

    const org = orgResult[0];
    if (!org) {
      return c.json({ error: "Failed to create organization" }, 500);
    }

    await db.insert(organizationMember).values({
      organizationId: org.id,
      userId,
      role: "owner",
    });

    const workspaceSlug = `test-workspace-${timestamp}`;

    const wsResult = await db
      .insert(workspace)
      .values({
        name: (workspaceName as string) || "Test Workspace",
        slug: workspaceSlug,
        organizationId: org.id,
      })
      .returning();

    const ws = wsResult[0];
    if (!ws) {
      return c.json({ error: "Failed to create workspace" }, 500);
    }

    return c.json({
      success: true,
      user: {
        id: userId,
        email: userRecord[0].email,
        name: userRecord[0].name,
      },
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
      },
      workspace: {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
      },
      dashboardUrl: `/orgs/${org.slug}/workspaces/${ws.slug}`,
    });
  } catch (error) {
    console.error("Test setup error:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

app.delete("/setup", async (c) => {
  if (isProduction) {
    return c.json({ error: "Test API is only available in development" }, 403);
  }

  try {
    const body = (await c.req.json()) as { email?: string };
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (userRecord[0]) {
      const userOrgs = await db
        .select({ organizationId: organizationMember.organizationId })
        .from(organizationMember)
        .where(eq(organizationMember.userId, userRecord[0].id));

      for (const { organizationId } of userOrgs) {
        await db
          .delete(workspace)
          .where(eq(workspace.organizationId, organizationId));
        await db
          .delete(organizationMember)
          .where(eq(organizationMember.organizationId, organizationId));
        await db
          .delete(organization)
          .where(eq(organization.id, organizationId));
      }

      await db.delete(user).where(eq(user.id, userRecord[0].id));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Test cleanup error:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export const testSetupRoutes = app;
