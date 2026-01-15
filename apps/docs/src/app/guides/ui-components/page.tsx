import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Adding UI Components",
  description: "How to add shadcn/ui components to your project",
};

export default function UiComponentsGuidePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Guides
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Adding UI Components
          </h1>
          <p className="text-xl text-muted-foreground">
            Install shadcn/ui components with the interactive CLI.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Guides" }, { title: "Adding UI Components" }]}
        />

        <h2>Using the CLI</h2>

        <p>Run the interactive component installer:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun ui-add</code>
        </pre>

        <p>This will prompt you to select components to install.</p>

        <h2>Manual Installation</h2>

        <p>You can also add components manually from the shadcn/ui website:</p>

        <ol>
          <li>
            Visit{" "}
            <Link href="https://ui.shadcn.com" target="_blank">
              ui.shadcn.com
            </Link>
          </li>
          <li>Browse components</li>
          <li>Copy the component code</li>
          <li>
            Paste into <code>packages/ui/src/components</code>
          </li>
        </ol>

        <h2>Using Components</h2>

        <p>Import and use components in your app:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { Button } from "@acme/ui/button";
import { Input } from "@acme/ui/input";

export default function Page() {
  return (
    <form>
      <Input placeholder="Email" />
      <Button type="submit">Submit</Button>
    </form>
  );
}`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/deployment/other"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Other Platforms
          </Link>
          <Link
            href="/guides/packages"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Creating Packages
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
