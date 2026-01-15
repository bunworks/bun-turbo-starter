import { Box, Code, Database, Layers, Rocket, Zap } from "lucide-react";
import Link from "next/link";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsCard } from "@/components/docs/docs-card";
import { DocsFeedback } from "@/components/docs/docs-feedback";
import { DocsMobileToc } from "@/components/docs/docs-mobile-toc";
import { DocsToc } from "@/components/docs/docs-toc";

export default function DocsIntroductionPage() {
  const tocItems = [
    { id: "why-bun-turbo", title: "Why Bun Turbo Starter?", level: 2 },
    { id: "key-features", title: "Key Features", level: 2 },
    { id: "getting-started", title: "Getting Started", level: 2 },
  ];

  return (
    <div className="flex gap-12">
      <article className="docs-content flex-1 max-w-3xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            Getting Started
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Bun Turbo Starter
          </h1>
          <p className="text-xl text-muted-foreground">
            A blazingly fast, production-ready monorepo starter built with Bun
            and Turborepo. Get your full-stack TypeScript application running in
            minutes with end-to-end type safety.
          </p>
        </div>

        <DocsMobileToc items={tocItems} />

        <DocsBreadcrumb
          items={[{ title: "Getting Started" }, { title: "Introduction" }]}
        />

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary">
            Getting Started
          </span>
        </div>

        <h1>Introduction</h1>

        <p className="text-lg">
          <strong>Bun Turbo Starter</strong> is a modern, high-performance
          monorepo starter that combines the speed of{" "}
          <Link href="/core/bun">Bun</Link> with the power of{" "}
          <Link href="/core/turborepo">Turborepo</Link>. It includes{" "}
          <Link href="/features/authentication">authentication</Link>,{" "}
          <Link href="/features/database">database</Link>,{" "}
          <Link href="/features/api">type-safe APIs</Link>, and more — all
          pre-configured and ready to deploy.
        </p>

        <h2 id="why-bun-turbo">Why Bun Turbo Starter?</h2>

        <p>
          Building a modern full-stack application requires integrating many
          tools and libraries. Bun Turbo Starter eliminates the setup complexity
          by providing:
        </p>

        <ul>
          <li>
            <strong>10x faster</strong> package installation with Bun
          </li>
          <li>
            <strong>100% type-safe</strong> from database to UI with tRPC and
            Drizzle
          </li>
          <li>
            <strong>Production-ready</strong> authentication, emails, and
            background jobs
          </li>
          <li>
            <strong>Zero-config deployment</strong> to Vercel
          </li>
          <li>
            <strong>Scalable architecture</strong> with monorepo best practices
          </li>
        </ul>

        <h2 id="key-features">Key Features</h2>

        <p>
          Bun Turbo Starter is not just a template — it's a complete development
          platform with everything you need to build and ship production
          applications.
        </p>

        <p>Here are the main features included:</p>

        <ul>
          <li>
            <Link href="/core/bun">Bun Runtime</Link> — Lightning-fast package
            management & bundling
          </li>
          <li>
            <Link href="/core/turborepo">Turborepo</Link> — Smart caching &
            parallel execution
          </li>
          <li>
            <Link href="/features/api">tRPC v11</Link> — Type-safe API without
            code generation
          </li>
          <li>
            <Link href="/features/database">Drizzle ORM</Link> — Type-safe SQL
            queries with Neon Postgres
          </li>
          <li>
            <Link href="/features/authentication">Better Auth</Link> — Modern,
            flexible authentication
          </li>
          <li>
            <Link href="/features/ui">shadcn/ui</Link> — Beautiful, accessible
            components
          </li>
          <li>
            <Link href="/features/emails">React Email</Link> — Email templates
            with Resend
          </li>
        </ul>

        <h2 id="getting-started">Getting Started</h2>

        <p>Choose your path to start building with Bun Turbo Starter:</p>

        <div className="grid gap-4 sm:grid-cols-2 my-6">
          <DocsCard
            title="Quick Start"
            description="Get your app running in 5 minutes with our step-by-step guide"
            href="/quickstart"
            icon={<Zap className="h-5 w-5" />}
          />
          <DocsCard
            title="Project Structure"
            description="Understand the monorepo architecture and package organization"
            href="/core/structure"
            icon={<Layers className="h-5 w-5" />}
          />
          <DocsCard
            title="Core Concepts"
            description="Learn about Bun, Turborepo, and the tech stack"
            href="/core/bun"
            icon={<Box className="h-5 w-5" />}
          />
          <DocsCard
            title="API Development"
            description="Build type-safe APIs with tRPC and integrate with your frontend"
            href="/features/api"
            icon={<Code className="h-5 w-5" />}
          />
          <DocsCard
            title="Database Setup"
            description="Configure Drizzle ORM with Neon Postgres and manage migrations"
            href="/features/database"
            icon={<Database className="h-5 w-5" />}
          />
          <DocsCard
            title="Deployment"
            description="Deploy to Vercel with zero configuration"
            href="/deployment"
            icon={<Rocket className="h-5 w-5" />}
          />
        </div>

        {/* Feedback Component */}
        <div className="my-8">
          <DocsFeedback />
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <div />
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
