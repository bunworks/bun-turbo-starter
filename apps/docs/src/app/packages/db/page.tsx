import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "@acme/db Package",
  description: "Database schema and Drizzle ORM client",
};

export default function DbPackagePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">@acme/db</h1>
          <p className="text-xl text-muted-foreground">
            Database schema and Drizzle ORM client.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "@acme/db" }]}
        />

        <h2>Overview</h2>

        <p>
          The database package contains your Drizzle schema and database client.
        </p>

        <h2>Scripts</h2>

        <ul>
          <li>
            <code>bun db:push</code> — Push schema changes to database
          </li>
          <li>
            <code>bun db:studio</code> — Open Drizzle Studio
          </li>
        </ul>

        <h2>Usage</h2>

        <p>Import the database client:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { db } from "@acme/db";

const posts = await db.query.posts.findMany();`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/packages/auth"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Auth Package
          </Link>
          <Link
            href="/packages/ui"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            UI Package
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
