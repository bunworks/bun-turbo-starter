import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Database (Drizzle ORM)",
  description: "Type-safe database queries with Drizzle ORM",
};

export default function DatabasePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Database (Drizzle ORM)
          </h1>
          <p className="text-xl text-muted-foreground">
            Type-safe SQL queries with Drizzle ORM and Neon Postgres.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "Database" }]}
        />

        <h2>What is Drizzle?</h2>

        <p>
          Drizzle ORM is a TypeScript ORM that provides type-safe database
          queries with a SQL-like syntax. It's lightweight, performant, and
          works great with serverless databases.
        </p>

        <h2>Database Setup</h2>

        <p>The starter is preconfigured for Neon (serverless Postgres):</p>

        <ol>
          <li>
            Create a free account at{" "}
            <Link href="https://neon.tech" target="_blank">
              neon.tech
            </Link>
          </li>
          <li>Create a new project</li>
          <li>Copy the connection string</li>
          <li>
            Add it to <code>.env</code> as <code>POSTGRES_URL</code>
          </li>
        </ol>

        <h2>Schema Definition</h2>

        <p>
          Define your database schema in <code>packages/db/src/schema</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`// packages/db/src/schema/posts.ts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});`}</code>
        </pre>

        <h2>Push Schema</h2>

        <p>Push your schema to the database:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:push</code>
        </pre>

        <h2>Drizzle Studio</h2>

        <p>View and edit your database in a web interface:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:studio</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/features/api"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Type-Safe API
          </Link>
          <Link
            href="/features/authentication"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Authentication
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
