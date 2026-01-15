import { Package } from "lucide-react";
import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Packages Overview",
  description: "Overview of all packages in the monorepo",
};

export default function PackagesPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Packages Overview
          </h1>
          <p className="text-xl text-muted-foreground">
            Shared packages that power your applications.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "Overview" }]}
        />

        <h2>Available Packages</h2>

        <p>
          The monorepo includes several shared packages that can be imported by
          your apps. Each package is focused on a specific concern.
        </p>

        <div className="grid gap-4 my-6">
          <Link
            href="/packages/api"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">@acme/api</h3>
                <p className="text-sm text-muted-foreground">
                  tRPC router definitions and API endpoints
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/packages/auth"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">@acme/auth</h3>
                <p className="text-sm text-muted-foreground">
                  Authentication logic with Better Auth
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/packages/db"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">@acme/db</h3>
                <p className="text-sm text-muted-foreground">
                  Database schema and Drizzle ORM client
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/packages/ui"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">@acme/ui</h3>
                <p className="text-sm text-muted-foreground">
                  Shared UI components with shadcn/ui
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/packages/emails"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">@acme/emails</h3>
                <p className="text-sm text-muted-foreground">
                  Email templates with React Email
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/features/jobs"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Background Jobs
          </Link>
          <Link
            href="/packages/api"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            API Package
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
