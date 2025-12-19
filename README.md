# bun-turbo-starter

A modern, high-performance monorepo starter powered by Bun and Turborepo.

## Installation

> [!NOTE]
>
> Make sure you have [Bun](https://bun.sh) installed. This project requires Bun v1.0.0 or higher.

There are two ways of initializing an app using the `bun-turbo-starter`:

### Use as Template

Click the "Use this template" button on GitHub to create a new repository based on this starter.

### Clone Directly

```bash
git clone https://github.com/bunworks/bun-turbo-starter.git
cd bun-turbo-starter
bun install
```

## About

A blazingly fast monorepo starter built with Bun and Turborepo. This starter provides a solid foundation for building full-stack applications with modern tooling and best practices.

It uses [Turborepo](https://turborepo.com) and [Bun](https://bun.sh) and contains:

```text
.github
  └─ workflows
        └─ CI with Bun cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  └─ web
      ├─ Next.js 16
      ├─ React 19
      ├─ Tailwind CSS v4
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  │   └─ tRPC v11 router definition
  ├─ auth
  │   └─ Authentication using better-auth
  ├─ db
  │   └─ Typesafe db calls using Drizzle & Neon
  ├─ ui
  │   └─ UI package for the webapp using shadcn-ui
  └─ validators
      └─ Shared validation schemas
tooling
  ├─ tailwind
  │   └─ Shared Tailwind theme and configuration
  └─ typescript
      └─ Shared tsconfig you can extend from
```

## Key Features

- **⚡ Bun Runtime**: Lightning-fast package management, testing, and bundling
- **🏗️ Turborepo**: Efficient monorepo management with smart caching
- **🔒 Type Safety**: End-to-end type safety with TypeScript and tRPC
- **🎨 Modern UI**: Tailwind CSS v4 and shadcn-ui components
- **🔐 Authentication**: Secure auth with better-auth
- **💾 Database**: Type-safe database queries with Drizzle ORM + Neon
- **📦 Shared Packages**: Reusable code across your monorepo

> In this template, we use `@acme` as a placeholder for package names. Replace it with your own organization or project name using find-and-replace to change all instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use Neon and is **edge-bound** with the [Vercel Postgres](https://github.com/vercel/storage/tree/main/packages/postgres) driver. If you're using something else, make the necessary modifications to the [schema](./packages/db/src/schema.ts) as well as the [client](./packages/db/src/index.ts) and the [drizzle config](./packages/db/drizzle.config.ts). If you want to switch to a non-edge database driver, remove `export const runtime = "edge";` from all pages and API routes.

To get it running, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
bun install

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
bun db:push
```

### 2. Generate Better Auth Schema

This project uses [Better Auth](https://www.better-auth.com) for authentication. The auth schema needs to be generated using the Better Auth CLI before you can use the authentication features.

```bash
# Generate the Better Auth schema
bun --filter @acme/auth generate
```

This command runs the Better Auth CLI with the following configuration:

- **Config file**: `packages/auth/script/auth-cli.ts` - A CLI-only configuration file (isolated from src to prevent imports)
- **Output**: `packages/db/src/auth-schema.ts` - Generated Drizzle schema for authentication tables

The generation process:

1. Reads the Better Auth configuration from `packages/auth/script/auth-cli.ts`
2. Generates the appropriate database schema based on your auth setup
3. Outputs a Drizzle-compatible schema file to the `@acme/db` package

> **Note**: The `auth-cli.ts` file is placed in the `script/` directory (instead of `src/`) to prevent accidental imports from other parts of the codebase. This file is exclusively for CLI schema generation and should **not** be used directly in your application. For runtime authentication, use the configuration from `packages/auth/src/index.ts`.

For more information about the Better Auth CLI, see the [official documentation](https://www.better-auth.com/docs/concepts/cli#generate).

### 3. Start the development server

```bash
bun dev
```

This will start the Next.js development server. Open [http://localhost:3000](http://localhost:3000) to see your app.

### 4. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
bun ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 5. When it's time to add a new package

To add a new package, simply run `bun turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## FAQ

### Why Bun?

Bun is a modern JavaScript runtime that's significantly faster than Node.js for many operations. It includes a built-in package manager, test runner, and bundler, making it an all-in-one solution for JavaScript development. With Bun, you get:

- Faster package installation
- Built-in TypeScript support
- Native test runner
- Better performance for development tasks

### Does this pattern leak backend code to my client applications?

No, it does not. The `api` package should only be a production dependency in the Next.js application where it's served. Any other apps you may add in the future should only add the `api` package as a dev dependency. This lets you have full type safety in your client applications, while keeping your backend code safe.

If you need to share runtime code between the client and server, such as input validation schemas, you can create a separate `shared` package for this and import it on both sides.

## Deployment

### Next.js

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com). If you've never deployed a Turborepo app there, don't worry, the steps are quite straightforward. You can also read the [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) on deploying to Vercel.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory. Vercel's zero-config system should handle all configurations for you.

2. Add your `POSTGRES_URL` environment variable.

3. Done! Your app should successfully deploy.

## Scripts

Here are the main scripts you can run from the root of the monorepo:

```bash
# Start all apps in development mode
bun dev

# Build all apps and packages
bun build

# Run linting across the monorepo
bun lint

# Type check all packages
bun typecheck

# Push database schema changes
bun db:push

# Generate database migrations
bun db:generate

# Open Drizzle Studio
bun db:studio

# Add a new UI component
bun ui-add

# Clean all node_modules and build artifacts
bun clean
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Monorepo**: [Turborepo](https://turborepo.org)
- **Framework**: [Next.js 15](https://nextjs.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **API**: [tRPC v11](https://trpc.io)
- **Database**: [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech)
- **Authentication**: [Better Auth](https://better-auth.com)
- **Validation**: [Zod](https://zod.dev)
- **Linting**: [ESLint](https://eslint.org)
- **Formatting**: [Prettier](https://prettier.io)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

This starter is inspired by [bun-turbo-starter](https://github.com/bunworks/bun-turbo-starter) and optimized for the Bun ecosystem.
