import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Database Migrations",
  description: "Managing database schema changes with Drizzle",
};

export default function MigrationsGuidePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Database Migrations
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage database schema changes with Drizzle ORM.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Guides" }, { title: "Database Migrations" }]}
        />

        <h2>Push vs Generate</h2>

        <p>Drizzle provides two ways to manage schema changes:</p>

        <h3>Push (Development)</h3>

        <p>
          Use <code>db:push</code> during development to quickly sync your
          schema:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:push</code>
        </pre>

        <p>This directly applies changes without generating migration files.</p>

        <h3>Generate (Production)</h3>

        <p>For production, generate migration files:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:generate</code>
        </pre>

        <p>This creates SQL migration files that can be version controlled.</p>

        <h2>Viewing Your Database</h2>

        <p>Open Drizzle Studio to view and edit your database:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:studio</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/guides/packages"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Creating Packages
          </Link>
          <Link
            href="/guides/testing"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Testing
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
