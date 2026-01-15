import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Testing",
  description: "Testing your application with Bun's built-in test runner",
};

export default function TestingGuidePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Testing</h1>
          <p className="text-xl text-muted-foreground">
            Test your application with Bun's built-in test runner.
          </p>
        </div>

        <DocsBreadcrumb items={[{ title: "Guides" }, { title: "Testing" }]} />

        <h2>Bun Test Runner</h2>

        <p>Bun includes a fast, Jest-compatible test runner built-in.</p>

        <h2>Writing Tests</h2>

        <p>
          Create test files with <code>.test.ts</code> or <code>.spec.ts</code>{" "}
          extension:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { describe, it, expect } from "bun:test";

describe("Math", () => {
  it("adds numbers", () => {
    expect(1 + 1).toBe(2);
  });
});`}</code>
        </pre>

        <h2>Running Tests</h2>

        <p>Run tests with Bun:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun test</code>
        </pre>

        <h2>Watch Mode</h2>

        <p>Run tests in watch mode during development:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun test --watch</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/guides/migrations"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Database Migrations
          </Link>
          <div />
        </div>
      </article>
    </div>
  );
}
