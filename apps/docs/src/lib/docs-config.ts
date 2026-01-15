export interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
  label?: string;
  external?: boolean;
}

export interface DocsConfig {
  sidebarNav: NavItem[];
}

export const docsConfig: DocsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", href: "/" },
        { title: "Quick Start", href: "/quickstart" },
        { title: "Installation", href: "/installation" },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        { title: "Bun Runtime", href: "/core/bun" },
        { title: "Turborepo", href: "/core/turborepo" },
        { title: "Project Structure", href: "/core/structure" },
        { title: "Monorepo Architecture", href: "/core/monorepo" },
      ],
    },
    {
      title: "Features",
      items: [
        { title: "Type-Safe API (tRPC)", href: "/features/api" },
        { title: "Database (Drizzle)", href: "/features/database" },
        { title: "Authentication", href: "/features/authentication" },
        { title: "UI Components", href: "/features/ui" },
        { title: "Email Templates", href: "/features/emails" },
        { title: "Background Jobs", href: "/features/jobs" },
      ],
    },
    {
      title: "Packages",
      items: [
        { title: "Overview", href: "/packages" },
        { title: "@acme/api", href: "/packages/api" },
        { title: "@acme/auth", href: "/packages/auth" },
        { title: "@acme/db", href: "/packages/db" },
        { title: "@acme/ui", href: "/packages/ui" },
        { title: "@acme/emails", href: "/packages/emails" },
      ],
    },
    {
      title: "Deployment",
      items: [
        { title: "Vercel", href: "/deployment/vercel" },
        { title: "Environment Variables", href: "/deployment/env" },
        { title: "Other Platforms", href: "/deployment/other" },
      ],
    },
    {
      title: "Guides",
      items: [
        { title: "Adding UI Components", href: "/guides/ui-components" },
        { title: "Creating Packages", href: "/guides/packages" },
        { title: "Database Migrations", href: "/guides/migrations" },
        { title: "Testing", href: "/guides/testing" },
      ],
    },
  ],
};
