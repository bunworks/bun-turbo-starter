import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Creating Packages",
  description: "How to create new packages in the monorepo",
};

export default function PackagesGuidePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Creating Packages
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate new packages with Turborepo.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Guides" }, { title: "Creating Packages" }]}
        />

        <h2>Using Turborepo Generator</h2>

        <p>Generate a new package with the Turborepo CLI:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun turbo gen init</code>
        </pre>

        <p>Follow the prompts to create your package.</p>

        <h2>Manual Creation</h2>

        <p>
          Create a new directory in <code>packages/</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`packages/
└── my-package/
    ├── src/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json`}</code>
        </pre>

        <h2>Package.json</h2>

        <p>
          Create a <code>package.json</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`{
  "name": "@acme/my-package",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}`}</code>
        </pre>

        <h2>Using Your Package</h2>

        <p>Import it in your apps:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { something } from "@acme/my-package";`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/guides/ui-components"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Adding UI Components
          </Link>
          <Link
            href="/guides/migrations"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Database Migrations
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
