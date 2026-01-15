import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Monorepo Architecture",
  description: "Understanding monorepo benefits and best practices",
};

export default function MonorepoPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Core Concepts
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Monorepo Architecture
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn about monorepo benefits and how to structure your codebase.
          </p>
        </div>

        <DocsBreadcrumb
          items={[
            { title: "Core Concepts" },
            { title: "Monorepo Architecture" },
          ]}
        />

        <h2>What is a Monorepo?</h2>

        <p>
          A monorepo is a single repository that contains multiple projects or
          packages. Instead of having separate repositories for each package,
          everything lives together.
        </p>

        <h2>Benefits</h2>

        <ul>
          <li>
            <strong>Code Sharing:</strong> Share code between apps without
            publishing packages
          </li>
          <li>
            <strong>Atomic Changes:</strong> Update multiple packages in a
            single commit
          </li>
          <li>
            <strong>Unified Tooling:</strong> One set of tools for all packages
          </li>
          <li>
            <strong>Better Collaboration:</strong> Easier to see the full
            picture
          </li>
        </ul>

        <h2>Best Practices</h2>

        <h3>Clear Boundaries</h3>

        <p>Each package should have a clear purpose and well-defined API.</p>

        <h3>Dependency Management</h3>

        <p>
          Use workspace dependencies to link packages. Bun automatically handles
          this with the <code>workspace:</code> protocol.
        </p>

        <h3>Build Order</h3>

        <p>
          Turborepo automatically determines the correct build order based on
          package dependencies.
        </p>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/core/turborepo"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Turborepo
          </Link>
          <Link
            href="/features/api"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Type-Safe API
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
