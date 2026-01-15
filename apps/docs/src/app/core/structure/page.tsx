import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";
import { DocsMobileToc } from "@/components/docs/docs-mobile-toc";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Project Structure",
  description: "Understanding the Bun Turbo Starter monorepo architecture",
};

export default function ProjectStructurePage() {
  const tocItems = [
    { id: "overview", title: "Overview", level: 2 },
    { id: "apps", title: "Apps", level: 2 },
    { id: "packages", title: "Packages", level: 2 },
    { id: "tooling", title: "Tooling", level: 2 },
  ];

  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Core Concepts
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Project Structure
          </h1>
          <p className="text-xl text-muted-foreground">
            Understanding the monorepo architecture and how packages are
            organized.
          </p>
        </div>

        <DocsMobileToc items={tocItems} />
        <DocsBreadcrumb
          items={[{ title: "Core Concepts" }, { title: "Project Structure" }]}
        />

        <h2 id="overview">Overview</h2>

        <p>
          Bun Turbo Starter uses a <strong>monorepo architecture</strong>{" "}
          powered by <Link href="/core/turborepo">Turborepo</Link>. This allows
          you to share code between multiple applications while maintaining
          clear boundaries and dependencies.
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-6">
          <code>{`.
├── apps/
│   ├── app/              # Main Next.js application
│   └── docs/             # Documentation site
├── packages/
│   ├── api/              # tRPC API routes
│   ├── auth/             # Authentication logic
│   ├── config/           # Environment configuration
│   ├── db/               # Database schema & client
│   ├── emails/           # Email templates
│   ├── lib/              # Shared utilities
│   ├── ui/               # UI components
│   └── validators/       # Zod schemas
├── tooling/
│   ├── tailwind/         # Tailwind configuration
│   └── typescript/       # TypeScript configuration
├── .github/              # GitHub Actions workflows
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json`}</code>
        </pre>

        <h2 id="apps">Apps</h2>

        <p>
          The <code>apps/</code> directory contains deployable applications.
          Each app is a standalone Next.js project that can import shared
          packages.
        </p>

        <h3>apps/app</h3>

        <p>
          The main Next.js 16 application with React 19, Tailwind CSS v4, and
          tRPC integration. This is your production application.
        </p>

        <ul>
          <li>
            <strong>Framework:</strong> Next.js 16 with App Router
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS v4
          </li>
          <li>
            <strong>API:</strong> tRPC client for type-safe API calls
          </li>
          <li>
            <strong>Auth:</strong> Better Auth integration
          </li>
        </ul>

        <h3>apps/docs</h3>

        <p>
          Documentation site built with Next.js. You're reading it right now!
        </p>

        <h2 id="packages">Packages</h2>

        <p>
          The <code>packages/</code> directory contains shared code that can be
          imported by apps. Each package has its own <code>package.json</code>{" "}
          and can be versioned independently.
        </p>

        <h3>@acme/api</h3>

        <p>
          tRPC router definitions and API endpoints. This package exports the
          type-safe API that your frontend consumes.
        </p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/api</code>
          </li>
          <li>
            <strong>Exports:</strong> tRPC routers, procedures, and types
          </li>
          <li>
            <strong>Dependencies:</strong> @acme/db, @acme/auth,
            @acme/validators
          </li>
        </ul>

        <p>
          Learn more in the{" "}
          <Link href="/packages/api">API package documentation</Link>.
        </p>

        <h3>@acme/auth</h3>

        <p>
          Authentication logic using Better Auth. Handles user sessions, OAuth
          providers, and security.
        </p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/auth</code>
          </li>
          <li>
            <strong>Exports:</strong> Auth client, session helpers, middleware
          </li>
        </ul>

        <h3>@acme/db</h3>

        <p>Database schema and Drizzle ORM client for Neon Postgres.</p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/db</code>
          </li>
          <li>
            <strong>Exports:</strong> Database client, schema, types
          </li>
          <li>
            <strong>Scripts:</strong> <code>bun db:push</code>,{" "}
            <code>bun db:studio</code>
          </li>
        </ul>

        <h3>@acme/ui</h3>

        <p>
          Shared UI components built with shadcn/ui and Radix UI primitives.
        </p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/ui</code>
          </li>
          <li>
            <strong>Exports:</strong> Button, Input, Dialog, and more
          </li>
          <li>
            <strong>Add components:</strong> <code>bun ui-add</code>
          </li>
        </ul>

        <h3>@acme/validators</h3>

        <p>Shared Zod validation schemas used across API and frontend.</p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/validators</code>
          </li>
          <li>
            <strong>Exports:</strong> Zod schemas for forms, API inputs
          </li>
        </ul>

        <h3>@acme/emails</h3>

        <p>Email templates built with React Email and sent via Resend.</p>

        <ul>
          <li>
            <strong>Location:</strong> <code>packages/emails</code>
          </li>
          <li>
            <strong>Exports:</strong> Email components and sender functions
          </li>
        </ul>

        <h2 id="tooling">Tooling</h2>

        <p>
          The <code>tooling/</code> directory contains shared configuration that
          can be extended by apps and packages.
        </p>

        <h3>tooling/tailwind</h3>

        <p>Shared Tailwind CSS configuration and theme.</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`// In your app's tailwind.config.ts
import baseConfig from "@acme/tailwind-config";

export default {
  ...baseConfig,
  // Your customizations
};`}</code>
        </pre>

        <h3>tooling/typescript</h3>

        <p>Shared TypeScript configuration with strict type checking.</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`// In your package's tsconfig.json
{
  "extends": "@acme/typescript-config/base.json",
  "compilerOptions": {
    // Your overrides
  }
}`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/quickstart"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Quick Start
          </Link>
          <Link
            href="/core/bun"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Bun Runtime
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>

      <DocsToc items={tocItems} />
    </div>
  );
}
