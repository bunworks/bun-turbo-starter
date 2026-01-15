import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "@acme/auth Package",
  description: "Authentication logic with Better Auth",
};

export default function AuthPackagePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">@acme/auth</h1>
          <p className="text-xl text-muted-foreground">
            Authentication logic with Better Auth.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "@acme/auth" }]}
        />

        <h2>Overview</h2>

        <p>
          The auth package provides authentication functionality using Better
          Auth.
        </p>

        <h2>Configuration</h2>

        <p>
          Configure authentication in <code>packages/auth/src/index.ts</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  // Add OAuth providers here
});`}</code>
        </pre>

        <h2>Usage</h2>

        <p>Use authentication in your app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { auth } from "@acme/auth";

const session = await auth.api.getSession({ headers });`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/packages/api"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            API Package
          </Link>
          <Link
            href="/packages/db"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Database Package
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
