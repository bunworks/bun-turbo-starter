import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Environment Variables",
  description: "Managing environment variables with type safety",
};

export default function EnvPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Deployment
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Environment Variables
          </h1>
          <p className="text-xl text-muted-foreground">
            Type-safe environment variables with @t3-oss/env-core.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Deployment" }, { title: "Environment Variables" }]}
        />

        <h2>Type-Safe Environment Variables</h2>

        <p>
          The starter uses <code>@t3-oss/env-core</code> to validate environment
          variables at build time. This ensures your app never runs with missing
          or invalid configuration.
        </p>

        <h2>Configuration</h2>

        <p>
          Environment variables are defined in{" "}
          <code>packages/config/src/index.ts</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: process.env,
});`}</code>
        </pre>

        <h2>Usage</h2>

        <p>Import and use environment variables:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { env } from "@acme/config";

// Fully typed and validated
const dbUrl = env.POSTGRES_URL;`}</code>
        </pre>

        <h2>Required Variables</h2>

        <p>These environment variables are required for the app to run:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Database
POSTGRES_URL=postgresql://user:pass@host/db

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-domain.com

# Optional: Email
RESEND_API_KEY=re_your_api_key`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/deployment/vercel"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Deploy to Vercel
          </Link>
          <Link
            href="/deployment/other"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Other Platforms
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
