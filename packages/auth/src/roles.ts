import { env } from "@acme/config";

/**
 * Role checks shared by Better Auth (`initAuth`) and `@acme/api`
 * (`adminProcedure`). Kept free of `better-auth` imports so the API can use
 * it without pulling in the auth runtime (`@acme/auth/roles`).
 */

export const ADMIN_ROLE = "admin";

/**
 * Bootstrap admins from ADMIN_EMAILS (comma-separated): they get the `admin`
 * role on sign-up, and keep admin access even on accounts created before
 * roles existed. Everyone else is promoted through the admin plugin
 * (`authClient.admin.setRole`).
 */
const adminEmails = new Set(
  (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export function isAdminEmail(email: string) {
  return adminEmails.has(email.toLowerCase());
}

/** Better Auth stores multiple roles as a comma-separated string. */
export function hasAdminRole(role: unknown) {
  return typeof role === "string"
    ? role.split(",").some((r) => r.trim() === ADMIN_ROLE)
    : false;
}

export function isAdmin(user: { email: string; role?: string | null }) {
  return hasAdminRole(user.role) || isAdminEmail(user.email);
}
