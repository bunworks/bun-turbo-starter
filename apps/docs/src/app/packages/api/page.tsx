import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "@acme/api Package",
  description: "tRPC API router definitions",
};

export default function ApiPackagePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">@acme/api</h1>
          <p className="text-xl text-muted-foreground">
            tRPC router definitions and API endpoints.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "@acme/api" }]}
        />

        <h2>Overview</h2>

        <p>
          The API package contains all your tRPC router definitions. It exports
          type-safe procedures that your frontend can consume.
        </p>

        <h2>Structure</h2>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`packages/api/
├── src/
│   ├── router/
│   │   ├── post.ts      # Post-related procedures
│   │   └── user.ts      # User-related procedures
│   ├── root.ts          # Root router
│   └── trpc.ts          # tRPC setup
└── package.json`}</code>
        </pre>

        <h2>Usage</h2>

        <p>Import the API in your Next.js app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { api } from "~/trpc/react";

export default function Page() {
  const { data } = api.post.list.useQuery();
  return <div>{/* Use data */}</div>;
}`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/packages"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Packages Overview
          </Link>
          <Link
            href="/packages/auth"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Auth Package
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
