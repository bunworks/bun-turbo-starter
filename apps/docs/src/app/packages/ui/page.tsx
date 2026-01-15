import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "@acme/ui Package",
  description: "Shared UI components with shadcn/ui",
};

export default function UiPackagePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">@acme/ui</h1>
          <p className="text-xl text-muted-foreground">
            Shared UI components with shadcn/ui.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "@acme/ui" }]}
        />

        <h2>Overview</h2>

        <p>
          The UI package contains shared components built with shadcn/ui and
          Radix UI.
        </p>

        <h2>Adding Components</h2>

        <p>Use the CLI to add new components:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun ui-add</code>
        </pre>

        <h2>Usage</h2>

        <p>Import components in your app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

export default function Page() {
  return (
    <div>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </div>
  );
}`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/packages/db"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Database Package
          </Link>
          <Link
            href="/packages/emails"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Emails Package
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
