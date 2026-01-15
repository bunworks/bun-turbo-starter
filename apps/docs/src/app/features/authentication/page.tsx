import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Authentication",
  description: "Secure authentication with Better Auth",
};

export default function AuthenticationPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Authentication
          </h1>
          <p className="text-xl text-muted-foreground">
            Modern, flexible authentication with Better Auth.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "Authentication" }]}
        />

        <h2>What is Better Auth?</h2>

        <p>
          Better Auth is a modern authentication library for TypeScript that
          provides a flexible, type-safe API for handling user authentication
          and sessions.
        </p>

        <h2>Features</h2>

        <ul>
          <li>
            <strong>Email/Password:</strong> Traditional authentication
          </li>
          <li>
            <strong>OAuth Providers:</strong> Google, GitHub, and more
          </li>
          <li>
            <strong>Session Management:</strong> Secure, type-safe sessions
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support
          </li>
        </ul>

        <h2>Setup</h2>

        <p>Generate the authentication schema:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun auth:generate</code>
        </pre>

        <p>
          Configure your authentication in{" "}
          <code>packages/auth/src/index.ts</code>.
        </p>

        <h2>Usage</h2>

        <p>Use authentication in your app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { auth } from "@acme/auth";

// Get current session
const session = await auth.api.getSession({ headers });

// Sign in
await auth.api.signIn.email({
  body: { email, password }
});`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/features/database"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Database
          </Link>
          <Link
            href="/features/ui"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            UI Components
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
