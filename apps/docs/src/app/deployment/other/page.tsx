import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Deploy to Other Platforms",
  description: "Deploy Bun Turbo Starter to Netlify, Railway, and more",
};

export default function OtherPlatformsPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Deployment
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Other Platforms
          </h1>
          <p className="text-xl text-muted-foreground">
            Deploy to Netlify, Railway, Fly.io, and other platforms.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Deployment" }, { title: "Other Platforms" }]}
        />

        <h2>Netlify</h2>

        <p>Deploy to Netlify with these settings:</p>

        <ul>
          <li>
            <strong>Base directory:</strong> <code>apps/app</code>
          </li>
          <li>
            <strong>Build command:</strong> <code>bun run build</code>
          </li>
          <li>
            <strong>Publish directory:</strong> <code>apps/app/.next</code>
          </li>
        </ul>

        <h2>Railway</h2>

        <p>
          Railway auto-detects Next.js projects. Just connect your repository
          and deploy.
        </p>

        <h2>Fly.io</h2>

        <p>Use the provided Dockerfile to deploy to Fly.io:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`fly launch
fly deploy`}</code>
        </pre>

        <h2>Self-Hosted</h2>

        <p>Build and run the app on your own server:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`bun install
bun run build
bun run start`}</code>
        </pre>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/deployment/env"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Environment Variables
          </Link>
          <Link
            href="/guides/ui-components"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Adding UI Components
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
