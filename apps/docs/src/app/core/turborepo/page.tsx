import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Turborepo",
  description: "Understanding Turborepo and monorepo architecture",
};

export default function TurborepoPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Core Concepts
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Turborepo</h1>
          <p className="text-xl text-muted-foreground">
            High-performance build system for JavaScript and TypeScript
            monorepos.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Core Concepts" }, { title: "Turborepo" }]}
        />

        <h2>What is Turborepo?</h2>

        <p>
          Turborepo is a high-performance build system that makes working with
          monorepos fast and efficient. It provides:
        </p>

        <ul>
          <li>
            <strong>Smart Caching:</strong> Never build the same thing twice
          </li>
          <li>
            <strong>Parallel Execution:</strong> Run tasks across packages
            simultaneously
          </li>
          <li>
            <strong>Task Pipelines:</strong> Define dependencies between tasks
          </li>
          <li>
            <strong>Remote Caching:</strong> Share cache across team and CI
          </li>
        </ul>

        <h2>Key Features</h2>

        <h3>Incremental Builds</h3>

        <p>
          Turborepo only rebuilds what changed. If a package hasn't changed, it
          uses the cached result from the last build.
        </p>

        <h3>Task Pipelines</h3>

        <p>
          Define task dependencies in <code>turbo.json</code>. For example,
          build must complete before deploy.
        </p>

        <h3>Parallel Execution</h3>

        <p>
          Run independent tasks in parallel to maximize CPU usage and minimize
          build time.
        </p>

        <h2>Learn More</h2>

        <p>
          Visit the official{" "}
          <Link href="https://turborepo.org" target="_blank">
            Turborepo documentation
          </Link>{" "}
          for more information.
        </p>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/core/bun"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Bun Runtime
          </Link>
          <Link
            href="/core/monorepo"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Monorepo Architecture
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
