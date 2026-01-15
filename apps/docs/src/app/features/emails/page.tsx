import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsFeedback } from "@/components/docs/docs-feedback";

export const metadata = {
  title: "Email Templates",
  description: "Beautiful email templates with React Email and Resend",
};

export default function EmailsPage() {
  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Features
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Email Templates
          </h1>
          <p className="text-xl text-muted-foreground">
            Build beautiful email templates with React Email and send them with
            Resend.
          </p>
        </div>

        <DocsBreadcrumb
          items={[{ title: "Features" }, { title: "Email Templates" }]}
        />

        <h2>React Email</h2>

        <p>
          React Email lets you build email templates using React components.
          Write emails the same way you write your UI.
        </p>

        <h2>Setup</h2>

        <p>
          Get your API key from{" "}
          <Link href="https://resend.com" target="_blank">
            resend.com
          </Link>{" "}
          and add it to your <code>.env</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>RESEND_API_KEY=re_your_api_key</code>
        </pre>

        <h2>Creating Templates</h2>

        <p>
          Create email templates in <code>packages/emails/src</code>:
        </p>

        <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4">
          <code>{`import { Button, Html } from "@react-email/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <h1>Welcome, {name}!</h1>
      <Button href="https://example.com">
        Get Started
      </Button>
    </Html>
  );
}`}</code>
        </pre>

        <h2>Sending Emails</h2>

        <p>Send emails from your API:</p>

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
            href="/features/ui"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            UI Components
          </Link>
          <Link
            href="/features/jobs"
            className="group flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Background Jobs
            <span className="group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </article>
    </div>
  );
}
