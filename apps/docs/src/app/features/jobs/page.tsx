import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Background Jobs",
  description: "Run background jobs with Inngest or Trigger.dev",
};

export default function JobsPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Background Jobs
          </h1>
          <p className="text-xl text-muted-foreground">
            Run background jobs and scheduled tasks with Inngest or Trigger.dev.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "Background Jobs" }]}
        />

        <h2>Why Background Jobs?</h2>

        <p>
          Background jobs are essential for tasks that shouldn't block your API
          responses:
        </p>

        <ul>
          <li>Sending emails</li>
          <li>Processing images</li>
          <li>Generating reports</li>
          <li>Scheduled tasks</li>
        </ul>

        <h2>Inngest</h2>

        <p>
          <Link href="https://inngest.com" target="_blank">
            Inngest
          </Link>{" "}
          provides a simple way to run background jobs with built-in retries and
          monitoring.
        </p>

        <h2>Trigger.dev</h2>

        <p>
          <Link href="https://trigger.dev" target="_blank">
            Trigger.dev
          </Link>{" "}
          is another great option for background jobs with a focus on developer
          experience.
        </p>

        <h2>Setup</h2>

        <p>
          Choose your preferred service and add the API keys to your
          environment:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Inngest
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key

# Or Trigger.dev
TRIGGER_API_KEY=your_api_key`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/features/emails"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Email Templates
          </Link>
          <Link
            href="/packages"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Packages Overview
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
