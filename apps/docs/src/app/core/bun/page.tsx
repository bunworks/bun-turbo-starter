import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Bun Runtime",
  description: "Understanding Bun and its benefits",
};

export default function BunPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Core Concepts
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Bun Runtime
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn about Bun and why it's the foundation of this starter.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Core Concepts" }, { title: "Bun Runtime" }]}
        />

        <h2>What is Bun?</h2>

        <p>
          Bun is an all-in-one JavaScript runtime and toolkit designed for
          speed. It's a drop-in replacement for Node.js that includes:
        </p>

        <ul>
          <li>
            <strong>Package Manager:</strong> 10x faster than npm
          </li>
          <li>
            <strong>Bundler:</strong> Built-in bundling and transpilation
          </li>
          <li>
            <strong>Test Runner:</strong> Jest-compatible testing
          </li>
          <li>
            <strong>Runtime:</strong> Execute JavaScript and TypeScript directly
          </li>
        </ul>

        <h2>Why Bun?</h2>

        <p>
          Bun offers significant performance improvements over traditional
          Node.js tooling:
        </p>

        <ul>
          <li>
            <strong>Fast Installation:</strong> Install dependencies 10x faster
            than npm
          </li>
          <li>
            <strong>Native TypeScript:</strong> Run .ts files without
            compilation
          </li>
          <li>
            <strong>Built-in APIs:</strong> Web-standard APIs like fetch,
            WebSocket
          </li>
          <li>
            <strong>Low Memory:</strong> Uses less memory than Node.js
          </li>
        </ul>

        <h2>Learn More</h2>

        <p>
          Visit the official{" "}
          <Link href="https://bun.sh" target="_blank">
            Bun documentation
          </Link>{" "}
          for more information.
        </p>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/core/structure"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Project Structure
          </Link>
          <Link
            href="/core/turborepo"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Turborepo
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
