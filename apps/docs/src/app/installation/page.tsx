import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";
import { DocsMobileToc } from "@/components/docs/docs-mobile-toc";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Installation",
  description: "Install and configure Bun Turbo Starter",
};

export default function InstallationPage() {
  const tocItems = [
    { id: "requirements", title: "Requirements", level: 2 },
    { id: "install-bun", title: "Install Bun", level: 2 },
    { id: "create-project", title: "Create Project", level: 2 },
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
            Installation
          </h1>
          <p className="text-xl text-muted-foreground">
            Install Bun and create your first Bun Turbo Starter project.
          </p>
        </div>

        <DocsMobileToc items={tocItems} />
        <DocsBreadcrumb
          items={[{ title: "Getting Started" }, { title: "Installation" }]}
        />

        <h2 id="requirements">Requirements</h2>

        <p>
          Before installing, make sure your system meets these requirements:
        </p>

        <ul>
          <li>
            <strong>Operating System:</strong> macOS, Linux, or Windows (WSL2
            recommended)
          </li>
          <li>
            <strong>Node.js:</strong> Not required! Bun replaces Node.js
          </li>
          <li>
            <strong>Git:</strong> For cloning repositories
          </li>
        </ul>

        <h2 id="install-bun">Install Bun</h2>

        <p>
          Bun is an all-in-one JavaScript runtime and toolkit. It's 10x faster
          than npm and includes a bundler, test runner, and package manager.
        </p>

        <h3>macOS and Linux</h3>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>curl -fsSL https://bun.sh/install | bash</code>
        </pre>

        <h3>Windows</h3>

        <p>On Windows, use PowerShell:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>powershell -c "irm bun.sh/install.ps1 | iex"</code>
        </pre>

        <p>Or use WSL2 (recommended for best compatibility):</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>curl -fsSL https://bun.sh/install | bash</code>
        </pre>

        <h3>Verify Installation</h3>

        <p>Check that Bun is installed correctly:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`bun --version
# Should output: 1.3.5 or higher`}</code>
        </pre>

        <h2 id="create-project">Create Project</h2>

        <p>There are two ways to create a new project:</p>

        <h3>Option 1: Use GitHub Template</h3>

        <p>
          Click the <strong>"Use this template"</strong> button on{" "}
          <Link
            href="https://github.com/bunworks/bun-turbo-starter"
            target="_blank"
          >
            GitHub
          </Link>{" "}
          to create a new repository from the template.
        </p>

        <p>Then clone your new repository:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`git clone https://github.com/your-username/your-repo.git
cd your-repo
bun install`}</code>
        </pre>

        <h3>Option 2: Clone Directly</h3>

        <p>Clone the starter repository directly:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`git clone https://github.com/bunworks/bun-turbo-starter.git my-project
cd my-project
bun install`}</code>
        </pre>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <p className="font-medium mb-2">💡 Tip: Rename the Project</p>
          <p className="text-sm text-muted-foreground">
            Replace <code>@acme</code> with your organization name using
            find-and-replace across the project.
          </p>
        </div>

        <h2 id="next-steps">Next Steps</h2>

        <p>
          Now that you have the project installed, follow the Quick Start guide
          to configure and run your app:
        </p>

        <div className="my-6">
          <Link
            href="/quickstart"
            className="block p-6 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">Quick Start Guide →</h3>
            <p className="text-sm text-muted-foreground">
              Configure environment variables, set up the database, and start
              developing in 5 minutes.
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
            href="/quickstart"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Quick Start
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
