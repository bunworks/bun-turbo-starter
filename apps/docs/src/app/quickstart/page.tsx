import { Database, Rocket, Terminal } from "lucide-react";
import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";
import { DocsMobileToc } from "@/components/docs/docs-mobile-toc";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Quick Start",
  description: "Get your Bun Turbo Starter app running in 5 minutes",
};

export default function QuickStartPage() {
  const tocItems = [
    { id: "prerequisites", title: "Prerequisites", level: 2 },
    { id: "installation", title: "Installation", level: 2 },
    { id: "setup", title: "Setup", level: 2 },
    { id: "development", title: "Development", level: 2 },
    { id: "next-steps", title: "Next Steps", level: 2 },
  ];

  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Getting Started
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Quick Start
          </h1>
          <p className="text-xl text-muted-foreground">
            Get your full-stack TypeScript application running in 5 minutes with
            this step-by-step guide.
          </p>
        </div>

        <DocsMobileToc items={tocItems} />
        <DocsBreadcrumb
          items={[{ title: "Getting Started" }, { title: "Quick Start" }]}
        />

        <h2 id="prerequisites">Prerequisites</h2>

        <p>Before you begin, make sure you have the following installed:</p>

        <ul>
          <li>
            <strong>Bun v1.3.5 or higher</strong> — Install from{" "}
            <Link href="https://bun.sh" target="_blank">
              bun.sh
            </Link>
          </li>
          <li>
            <strong>Git</strong> — For cloning the repository
          </li>
          <li>
            <strong>Code editor</strong> — VS Code recommended
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <Terminal className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-2">Install Bun</p>
              <pre className="bg-background rounded p-3 overflow-x-auto">
                <code>curl -fsSL https://bun.sh/install | bash</code>
              </pre>
            </div>
          </div>
        </div>

        <h2 id="installation">Installation</h2>

        <p>You can start with Bun Turbo Starter in two ways:</p>

        <h3>Option 1: Use as Template (Recommended)</h3>

        <p>
          Click the <strong>"Use this template"</strong> button on the{" "}
          <Link
            href="https://github.com/bunworks/bun-turbo-starter"
            target="_blank"
          >
            GitHub repository
          </Link>{" "}
          to create a new repository.
        </p>

        <h3>Option 2: Clone Directly</h3>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`git clone https://github.com/bunworks/bun-turbo-starter.git my-project
cd my-project
bun install`}</code>
        </pre>

        <h2 id="setup">Setup</h2>

        <p>Follow these steps to configure your application:</p>

        <h3>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-2">
            1
          </span>
          Environment Variables
        </h3>

        <p>Copy the example environment file and configure your credentials:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>cp .env.example .env</code>
        </pre>

        <p>
          Edit <code>.env</code> with your credentials:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Database (get from neon.tech)
POSTGRES_URL=postgresql://user:pass@host/db

# Authentication (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000

# Email (optional - get from resend.com)
RESEND_API_KEY=re_your_api_key`}</code>
        </pre>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-2">Database Setup</p>
              <p className="text-sm text-muted-foreground">
                The starter is preconfigured for{" "}
                <Link href="https://neon.tech" target="_blank">
                  Neon
                </Link>{" "}
                (serverless Postgres). Create a free account and copy your
                connection string.
              </p>
            </div>
          </div>
        </div>

        <h3>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-2">
            2
          </span>
          Database Schema
        </h3>

        <p>Push the database schema to your Postgres database:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:push</code>
        </pre>

        <p>
          Optionally, open Drizzle Studio to view your database in a web
          interface:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun db:studio</code>
        </pre>

        <h3>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-2">
            3
          </span>
          Authentication Schema
        </h3>

        <p>Generate the Better Auth database schema:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>bun auth:generate</code>
        </pre>

        <h2 id="development">Development</h2>

        <p>Start the development server:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Start all apps in watch mode
bun dev

# Or start only Next.js app
bun dev:next`}</code>
        </pre>

        <p>
          Open{" "}
          <Link href="http://localhost:3000" target="_blank">
            http://localhost:3000
          </Link>{" "}
          in your browser. You should see your application running! 🎉
        </p>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <Rocket className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium mb-2">Hot Reload</p>
              <p className="text-sm text-muted-foreground">
                Turborepo watches for changes across all packages. Edit any file
                and see changes instantly.
              </p>
            </div>
          </div>
        </div>

        <h2 id="next-steps">Next Steps</h2>

        <p>Now that your app is running, here's what you can do next:</p>

        <div className="grid gap-4 my-6">
          <Link
            href="/core/structure"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-1">Explore Project Structure</h3>
            <p className="text-sm text-muted-foreground">
              Understand the monorepo architecture and package organization
            </p>
          </Link>

          <Link
            href="/features/api"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-1">Build Type-Safe APIs</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to create tRPC endpoints with end-to-end type safety
            </p>
          </Link>

          <Link
            href="/features/ui"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-1">Add UI Components</h3>
            <p className="text-sm text-muted-foreground">
              Install shadcn/ui components with the interactive CLI
            </p>
          </Link>

          <Link
            href="/deployment/vercel"
            className="block p-4 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="font-semibold mb-1">Deploy to Vercel</h3>
            <p className="text-sm text-muted-foreground">
              Zero-config deployment with automatic environment setup
            </p>
          </Link>
        </div>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Introduction
          </Link>
          <Link
            href="/core/structure"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Project Structure
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>

      <DocsToc items={tocItems} />
    </div>
  );
}
