import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "UI Components",
  description: "Beautiful, accessible components with shadcn/ui",
};

export default function UiPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            UI Components
          </h1>
          <p className="text-xl text-muted-foreground">
            Beautiful, accessible components built with shadcn/ui and Radix UI.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "UI Components" }]}
        />

        <h2>What is shadcn/ui?</h2>

        <p>
          shadcn/ui is a collection of re-usable components built with Radix UI
          and Tailwind CSS. Components are copied into your project, giving you
          full control.
        </p>

        <h2>Adding Components</h2>

        <p>Use the interactive CLI to add components:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun ui-add</code>
        </pre>

        <p>This will prompt you to select components to install.</p>

        <h2>Available Components</h2>

        <ul>
          <li>Button, Input, Textarea</li>
          <li>Dialog, Sheet, Popover</li>
          <li>Select, Dropdown Menu</li>
          <li>Table, Card, Badge</li>
          <li>And many more...</li>
        </ul>

        <h2>Usage</h2>

        <p>Import and use components in your app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { Button } from "@acme/ui/button";

export default function Page() {
  return <Button>Click me</Button>;
}`}</code>
        </pre>

        <h2>Learn More</h2>

        <p>
          Visit{" "}
          <Link href="https://ui.shadcn.com" target="_blank">
            ui.shadcn.com
          </Link>{" "}
          to browse all available components.
        </p>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/features/authentication"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Authentication
          </Link>
          <Link
            href="/features/emails"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Email Templates
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
