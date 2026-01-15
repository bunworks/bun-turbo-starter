import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";
import { DocsMobileToc } from "@/components/docs/docs-mobile-toc";
import { DocsToc } from "@/components/docs/docs-toc";

export const metadata = {
  title: "Deploy to Vercel",
  description: "Zero-config deployment of Bun Turbo Starter to Vercel",
};

export default function VercelDeploymentPage() {
  const tocItems = [
    { id: "quick-deploy", title: "Quick Deploy", level: 2 },
    { id: "manual-setup", title: "Manual Setup", level: 2 },
    { id: "environment-variables", title: "Environment Variables", level: 2 },
    { id: "troubleshooting", title: "Troubleshooting", level: 2 },
  ];

  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Deployment
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Deploy to Vercel
          </h1>
          <p className="text-xl text-muted-foreground">
            Deploy your Bun Turbo Starter application to Vercel with zero
            configuration.
          </p>
        </div>

        <DocsMobileToc items={tocItems} />
        <DocsBreadcrumb
          items={[{ title: "Deployment" }, { title: "Vercel" }]}
        />

        <h2 id="quick-deploy">Quick Deploy</h2>

        <p>
          The fastest way to deploy is using the Vercel Deploy Button. This will
          automatically:
        </p>

        <ul>
          <li>Fork the repository to your GitHub account</li>
          <li>Create a new Vercel project</li>
          <li>Configure build settings</li>
          <li>Prompt you for environment variables</li>
        </ul>

        <div className="my-6">
          <Link
            href="https://vercel.com/new/clone?repository-url=https://github.com/bunworks/bun-turbo-starter"
            target="_blank"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            Deploy with Vercel
          </Link>
        </div>

        <h2 id="manual-setup">Manual Setup</h2>

        <p>For more control over the deployment process, follow these steps:</p>

        <h3>1. Push to GitHub</h3>

        <p>Make sure your code is pushed to a GitHub repository:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main`}</code>
        </pre>

        <h3>2. Import to Vercel</h3>

        <ol>
          <li>
            Go to{" "}
            <Link href="https://vercel.com/new" target="_blank">
              vercel.com/new
            </Link>
          </li>
          <li>Select your repository</li>
          <li>
            Set <strong>Root Directory</strong> to <code>apps/app</code>
          </li>
          <li>Vercel will auto-detect Next.js and configure build settings</li>
        </ol>

        <h3>3. Configure Environment Variables</h3>

        <p>
          Add your environment variables in the Vercel dashboard (see below for
          required variables).
        </p>

        <h3>4. Deploy</h3>

        <p>Click "Deploy" and Vercel will build and deploy your application!</p>

        <h2 id="environment-variables">Environment Variables</h2>

        <p>
          Configure these environment variables in your Vercel project settings:
        </p>

        <h3>Required Variables</h3>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Database
POSTGRES_URL=postgresql://user:pass@host/db

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://your-domain.vercel.app`}</code>
        </pre>

        <h3>Optional Variables</h3>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`# Email (Resend)
RESEND_API_KEY=re_your_api_key

# Background Jobs (Inngest)
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key`}</code>
        </pre>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <p className="font-medium mb-2">💡 Tip: Generate Secrets</p>
          <p className="text-sm text-muted-foreground mb-2">
            Generate a secure secret for <code>BETTER_AUTH_SECRET</code>:
          </p>
          <pre className="bg-background rounded p-3 overflow-x-auto text-sm">
            <code>openssl rand -base64 32</code>
          </pre>
        </div>

        <h3>Database Connection</h3>

        <p>
          For production, we recommend using{" "}
          <Link href="https://neon.tech" target="_blank">
            Neon
          </Link>{" "}
          (serverless Postgres):
        </p>

        <ol>
          <li>Create a Neon account</li>
          <li>Create a new project</li>
          <li>Copy the connection string</li>
          <li>
            Add it as <code>POSTGRES_URL</code> in Vercel
          </li>
        </ol>

        <h2 id="troubleshooting">Troubleshooting</h2>

        <h3>Build Fails</h3>

        <p>If your build fails, check:</p>

        <ul>
          <li>
            Root directory is set to <code>apps/app</code>
          </li>
          <li>All required environment variables are configured</li>
          <li>Database is accessible from Vercel's network</li>
        </ul>

        <h3>Database Connection Issues</h3>

        <p>
          Make sure your database allows connections from Vercel's IP ranges.
          Neon and most serverless databases work out of the box.
        </p>

        <h3>Authentication Not Working</h3>

        <p>
          Verify that <code>BETTER_AUTH_URL</code> matches your production
          domain (e.g., <code>https://your-app.vercel.app</code>).
        </p>

        <div className="my-6 rounded-lg border border-border bg-muted/50 p-4">
          <p className="font-medium mb-2">Need Help?</p>
          <p className="text-sm text-muted-foreground">
            Check the{" "}
            <Link href="https://vercel.com/docs" target="_blank">
              Vercel documentation
            </Link>{" "}
            or open an issue on{" "}
            <Link
              href="https://github.com/bunworks/bun-turbo-starter/issues"
              target="_blank"
            >
              GitHub
            </Link>
            .
          </p>
        </div>

        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/packages/ui"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            UI Package
          </Link>
          <Link
            href="/deployment/env"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Environment Variables
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
