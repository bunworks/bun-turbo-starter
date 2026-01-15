import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "@acme/emails Package",
  description: "Email templates with React Email",
};

export default function EmailsPackagePage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Packages
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            @acme/emails
          </h1>
          <p className="text-xl text-muted-foreground">
            Email templates with React Email.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Packages" }, { title: "@acme/emails" }]}
        />

        <h2>Overview</h2>

        <p>
          The emails package contains React Email templates and sending
          utilities.
        </p>

        <h2>Creating Templates</h2>

        <p>
          Create email templates in <code>packages/emails/src</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { Html, Button } from "@react-email/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <h1>Welcome, {name}!</h1>
      <Button href="https://example.com">Get Started</Button>
    </Html>
  );
}`}</code>
        </pre>

        <h2>Sending Emails</h2>

        <p>Use the send function:</p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { sendEmail } from "@acme/emails";
import { WelcomeEmail } from "@acme/emails/welcome";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome!",
  react: <WelcomeEmail name="John" />,
});`}</code>
        </pre>

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
            href="/deployment/vercel"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Deploy to Vercel
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
