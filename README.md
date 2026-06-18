# 🚀 Bun Turbo Starter

**A blazingly fast, production-ready monorepo starter**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Bun](https://img.shields.io/badge/Bun-1.3-black?logo=bun)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9-red?logo=turborepo)](https://turborepo.org)
[![oRPC](https://img.shields.io/badge/oRPC-1.x-2596be)](https://orpc.unnoq.com)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

Modern, high-performance monorepo starter built with **Bun** and **Turborepo**. Get your full-stack TypeScript application up and running in minutes with end-to-end type safety, authentication, database, emails, and observability — all pre-configured and ready to deploy.

### Why This Starter?

- ⚡ **10x faster** package installation with Bun
- 🔒 **100% type-safe** from database to UI
- 🎯 **Production-ready** with authentication, emails, tests, and observability
- 🚀 **Zero-config deployment** to Vercel
- 🏗️ **Scalable architecture** with monorepo best practices

## 📦 What's Inside?

This monorepo uses [Turborepo](https://turborepo.com) and [Bun](https://bun.sh) and includes:

```text
.github
  └─ workflows
        └─ CI with Bun cache setup (lint, format, typecheck, test)
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ app
  │   ├─ Next.js 16 (App Router, RSC)
  │   ├─ React 19
  │   ├─ Tailwind CSS v4
  │   ├─ OpenTelemetry via instrumentation.ts
  │   └─ E2E Typesafe API Server & Client (oRPC)
  ├─ app-server
  │   └─ Optional standalone API server (Hono) — run the API separately
  └─ docs
      └─ Documentation site (Next.js)
packages
  ├─ api
  │   └─ oRPC router definition (end-to-end type-safe, no codegen)
  ├─ auth
  │   └─ Authentication using better-auth (single source of truth)
  ├─ config
  │   └─ Type-safe env (@t3-oss/env-core) + structured logger
  ├─ db
  │   └─ Drizzle ORM with an env-aware driver (node-postgres / Neon HTTP)
  ├─ emails
  │   └─ Email templates with React Email + Resend / nodemailer
  ├─ storage
  │   └─ S3-compatible storage (AWS SDK v3, works with MinIO locally)
  ├─ ui
  │   └─ UI package for the webapp using shadcn-ui
  └─ validators
      └─ Shared Zod validation schemas (+ bun:test unit tests)
tooling
  ├─ github
  │   └─ Shared GitHub Actions setup
  ├─ tailwind
  │   └─ Shared Tailwind theme and configuration
  └─ typescript
      └─ Shared tsconfig you can extend from
```

> 💡 **Tip**: Replace `@acme` with your organization name using find-and-replace across the project.

## ✨ Key Features

<table>
<tr>
<td width="50%">

### �  Performance
- **Bun Runtime** — Lightning-fast package management & bundling
- **Turborepo** — Smart caching & parallel execution
- **Edge-ready** — Optimized for Vercel Edge Runtime

### Type Safety
- **End-to-end TypeScript** — From database to UI
- **oRPC** — Type-safe API (RPC + OpenAPI ready) without code generation
- **Zod Validation** — Runtime type checking

### 🎨 Modern UI
- **Tailwind CSS v4** — Latest styling features
- **shadcn/ui** — Beautiful, accessible components
- **React 19** — Latest React features

</td>
<td width="50%">

### 🔐 Authentication
- **Better Auth** — Modern, flexible auth solution
- **Session Management** — Secure, type-safe sessions
- **Social Providers** — Easy OAuth integration

### 💾 Database
- **Drizzle ORM** — Type-safe SQL queries
- **Env-aware driver** — `node-postgres` locally, Neon HTTP auto-detected in the cloud
- **Migrations** — Version-controlled schema changes (`db:generate` / `db:migrate`)

### 📧 Communication & Observability
- **React Email** — Beautiful email templates
- **Resend / Nodemailer** — Reliable email delivery (inbucket sandbox locally)
- **OpenTelemetry** — Built-in tracing via `instrumentation.ts`
- **Structured logging** — JSON logs through a shared logger

</td>
</tr>
</table>

### 🛠️ Developer Experience

- ✅ **Type-safe environment variables** with @t3-oss/env-core
- ✅ **Shared packages** for code reuse across apps
- ✅ **Biome** for fast linting & formatting
- ✅ **GitHub Actions** with Bun caching
- ✅ **VSCode integration** with recommended extensions

## 🚀 Quick Start

### Prerequisites

> [!IMPORTANT]
> Make sure you have [Bun](https://bun.sh) installed. This project requires **Bun v1.3.5** or higher.

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

### Installation

**Option 1: Use as Template** (Recommended)

Click the **"Use this template"** button on GitHub to create a new repository.

**Option 2: Clone Directly**

```bash
git clone https://github.com/bunworks/bun-turbo-starter.git my-project
cd my-project
bun install
```

### Setup

> [!NOTE]
> The database driver is selected automatically: a `*.neon.tech` URL uses the Neon HTTP driver, anything else (local Docker Postgres, Supabase, self-hosted) uses `node-postgres`. Override with `DB_DRIVER=node|neon-http`. A local Postgres, MinIO (S3) and inbucket (email) are provided via `docker-compose.yml`.

**Step 1: Install dependencies & configure environment**

```bash
# Install all dependencies
bun install

# Copy environment variables template
cp .env.example .env

# Edit .env with your credentials
# - POSTGRES_URL (local docker-compose Postgres, or get one from neon.tech)
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - RESEND_API_KEY (optional, get from resend.com)
```

**Step 2: Setup database**

```bash
# Push schema to database
bun db:push

# (Optional) Open Drizzle Studio to view your database
bun db:studio
```

**Step 3: Generate authentication schema**

```bash
# Generate Better Auth schema
bun auth:generate
```

**Step 4: Start development server**

```bash
# Start all apps in watch mode
bun dev

# Or start only Next.js app
bun dev:next
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Adding UI Components

```bash
# Interactive shadcn/ui component installer
bun ui-add
```

### Creating New Packages

```bash
# Generate a new package with Turborepo
bun turbo gen init
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start all apps in development mode with watch |
| `bun dev:next` | Start only Next.js app |
| `bun build` | Build all apps and packages |
| `bun lint` | Run Biome linting |
| `bun lint:fix` | Fix linting issues automatically |
| `bun format` | Check code formatting |
| `bun format:fix` | Fix formatting issues |
| `bun check` | Run both linting and formatting checks |
| `bun check:fix` | Fix all linting and formatting issues |
| `bun typecheck` | Type check all packages |
| `bun test` | Run unit tests (bun:test) |
| `bun db:push` | Push database schema changes |
| `bun db:generate` | Generate SQL migrations from schema |
| `bun db:migrate` | Apply migrations |
| `bun db:studio` | Open Drizzle Studio |
| `bun auth:generate` | Generate Better Auth schema |
| `bun ui-add` | Add new shadcn/ui component |
| `bun clean` | Clean all node_modules |

## 🏗️ Tech Stack

<table>
<tr>
<td>

**Core**
- [Bun](https://bun.sh) — Runtime & package manager
- [Turborepo](https://turborepo.org) — Monorepo build system
- [TypeScript](https://www.typescriptlang.org/) — Type safety

**Frontend**
- [Next.js 16](https://nextjs.org) — React framework
- [React 19](https://react.dev) — UI library
- [Tailwind CSS v4](https://tailwindcss.com) — Styling
- [shadcn/ui](https://ui.shadcn.com) — UI components

</td>
<td>

**Backend**
- [oRPC](https://orpc.unnoq.com) — Type-safe APIs (RPC + OpenAPI)
- [Drizzle ORM](https://orm.drizzle.team) — Database ORM
- [Neon](https://neon.tech) / Postgres — Serverless or self-hosted
- [Better Auth](https://better-auth.com) — Authentication
- [Hono](https://hono.dev) — Optional standalone API server

**Tools**
- [TanStack Query](https://tanstack.com/query) — Data fetching
- [React Hook Form](https://react-hook-form.com) — Forms
- [Zod](https://zod.dev) — Validation
- [Biome](https://biomejs.dev) — Linting & formatting

</td>
</tr>
</table>

## 📊 Comparison with Alternatives

| Feature | This Starter | T3 Stack | Create Next App |
|---------|-------------|----------|-----------------|
| Runtime | **Bun** ⚡ | Node.js | Node.js |
| Monorepo | ✅ Turborepo | ❌ | ❌ |
| Type-safe API | ✅ oRPC | ✅ tRPC | ❌ |
| Database ORM | ✅ Drizzle | ✅ Drizzle/Prisma | ❌ |
| Authentication | ✅ Better Auth | ✅ NextAuth | ❌ |
| Email Templates | ✅ React Email | ❌ | ❌ |
| Observability | ✅ OpenTelemetry | ❌ | ❌ |
| UI Components | ✅ shadcn/ui | ❌ | ❌ |
| Setup Time | ~5 min | ~10 min | ~2 min |

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for **zero-config deployment** on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bunworks/bun-turbo-starter)

**Manual Deployment:**

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com/new)
3. Select `apps/app` as root directory
4. Add environment variables (see below)
5. Deploy! 🎉

**Required Environment Variables:**

```bash
# Database
POSTGRES_URL=postgresql://user:pass@host/db
# Optional: force a driver ("node" or "neon-http"); auto-detected otherwise
# DB_DRIVER=

# Authentication
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=optional-google-oauth-id
AUTH_GOOGLE_SECRET=optional-google-oauth-secret

# Email (optional)
RESEND_API_KEY=re_your_api_key

# API origin (optional) — point the web client at a standalone app-server
# NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Other Platforms

This starter can be deployed to any platform that supports Next.js:
- **Netlify** — Add `apps/app` as base directory
- **Railway** — Auto-detects Next.js configuration
- **Fly.io** — Use provided Dockerfile
- **Self-hosted** — Run `bun build` and serve the output

## 📚 Documentation

### Project Structure

```
├── apps/
│   ├── app/              # Next.js application (serves the API itself)
│   ├── app-server/       # Optional standalone API server (Hono)
│   └── docs/             # Documentation site
├── packages/
│   ├── api/              # oRPC router & procedures
│   ├── auth/             # Authentication logic (better-auth)
│   ├── config/           # Env config + structured logger
│   ├── db/               # Drizzle schema & env-aware client
│   ├── emails/           # Email templates
│   ├── storage/          # S3-compatible storage helpers
│   ├── ui/               # Shared UI components
│   └── validators/       # Shared Zod schemas
└── tooling/
    ├── github/           # Shared GitHub Actions setup
    ├── tailwind/         # Tailwind config
    └── typescript/       # TypeScript config
```

### Key Concepts

**Better Auth Setup**

The `auth:generate` command creates database schema from your Better Auth configuration:
- Config: `packages/auth/script/auth-cli.ts`
- Output: `packages/db/src/auth-schema.ts`
- Runtime config: `packages/auth/src/index.ts`

**Type-safe Environment Variables**

Environment variables are validated using `@t3-oss/env-core`:
- Define schema in `packages/config/src/index.ts`
- Import and use across packages
- Fails fast if variables are missing or invalid

**Shared Packages**

The `api` package should be:
- **Production dependency** in apps that serve the API
- **Dev dependency** in apps that only consume the API

This ensures backend code never leaks to client bundles.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

Please note that this project is released with a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## License

MIT

## Acknowledgments

This starter is inspired by [bun-turbo-starter](https://github.com/bunworks/bun-turbo-starter) and optimized for the Bun ecosystem.
