# CLAUDE.md

Bun + Turborepo monorepo: a Next.js 16 app with an end-to-end typed oRPC API,
Drizzle ORM (Postgres), Better Auth, React Email, and shadcn/ui.

## Commands

Run from the repo root. **Use `bun run <script>` for `build` and `test`**: bare
`bun build` / `bun test` invoke Bun's built-in bundler / test runner, not the
package scripts.

```bash
bun dev                  # Next.js app on :3000 (turbo watch, @acme/app + deps)
bun run build            # turbo build of everything
bun typecheck            # tsc across all workspaces (needs ^build)
bun check                # biome lint + format check
bun check:fix            # biome auto-fix (lint + format)
bun test                 # Bun's test runner over all *.test.ts (fast, what CI runs)
bun test packages/validators   # single package / file
bun lint:ws              # sherif: workspace package.json consistency
```

Scope turbo to one workspace with `-F`: `bun turbo typecheck -F @acme/api`.

Database / auth (need `.env` with `POSTGRES_URL`; local services via
`docker compose up -d` — Postgres :5432, MinIO :9001/:9002, inbucket :9000):

```bash
bun db:push              # sync schema to DB (dev)
bun db:generate          # create SQL migration in packages/db/migrations
bun db:migrate           # apply migrations
bun auth:generate        # regenerate Better Auth schema from config
```

## Before declaring work done

`bun check:fix && bun typecheck && bun test` — the same gates as CI
(`.github/workflows/ci.yml`: build, lint + sherif, format, typecheck, test).

## Layout

```
apps/app            Next.js 16 App Router (RSC). Serves the API itself.
  src/app/api/orpc  oRPC HTTP handler    src/app/api/auth  Better Auth handler
  src/orpc/server.ts  RSC caller `api` (server-only)
  src/orpc/react.tsx  browser client + `orpc` TanStack Query utils
  src/proxy.ts      optimistic auth redirect (Next 16 "proxy", ex-middleware)
packages/api        oRPC procedures + router (`appRouter`)
packages/auth       Better Auth `initAuth()` — single source of auth config
packages/config     @t3-oss/env-core `env`, structured `logger`, `paths`
packages/db         Drizzle schema, env-aware client (node-postgres / Neon HTTP)
packages/emails     React Email templates + send (Resend / nodemailer)
packages/storage    S3 helpers (MinIO locally)
packages/jobs       Hatchet worker     packages/trigger  Trigger.dev tasks
packages/ui         shadcn/ui components (Base UI), `cn`
packages/validators shared Zod form schemas (+ bun:test tests)
tooling/*           shared tsconfig, tailwind theme, GitHub Action setup
```

Packages that compile to `dist/` (`config`, `emails`, `storage`) must be built
before dependents typecheck — turbo's `^build` handles this; if you edit them
and run `tsc` by hand, build them first.

## Conventions

- TypeScript strict with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`:
  use `import type` for type-only imports (Biome enforces `useImportType`).
- Biome style: 2 spaces, double quotes, semicolons, trailing commas, 80 cols.
  `packages/ui` and `tooling` are excluded from Biome — don't reformat them.
- Files kebab-case; components PascalCase; functions camelCase.
- Internal imports use workspace names (`@acme/db`, `@acme/ui`); inside
  `apps/app` use the `~/` alias for `src/`.
- Server Components by default; add `"use client"` only when needed.
- Env vars: add to the Zod schema in `packages/config/src/env.ts` (or
  `apps/app/src/env.ts` for app-only / `NEXT_PUBLIC_*`), to `runtimeEnv`, to
  `.env.example`, and to `globalEnv` in `turbo.json` if it affects builds.
  Never read `process.env` directly in new code.
- Log with `logger` from `@acme/config`, not `console.log`.
- Conventional Commits: `feat(api): …`, `fix(db): …`.

## Key patterns

- **New API procedure**: one file per procedure under
  `packages/api/src/routers/<domain>/`, built from `publicProcedure`,
  `protectedProcedure`, or `adminProcedure` (`packages/api/src/orpc.ts`),
  exported through the domain `index.ts` and wired into
  `routers/index.ts`. Clients get types automatically — no codegen.
  Use the `/new-api-endpoint` skill.
- **Calling the API**: in RSC `await api.post.list({...})` from
  `~/orpc/server`; in client components
  `useQuery(orpc.post.list.queryOptions({ input }))` from `~/orpc/react`.
- **Schema change**: edit `packages/db/src/schema/<domain>/`, export from the
  domain `index.ts`, then `bun db:push` (dev) or `bun db:generate`. Use the
  `/db-change` skill. Columns are camelCase in TS, `casing: "snake_case"` in SQL.
- **Admin access** is `ADMIN_EMAILS` (comma-separated) checked in
  `adminProcedure`.
- `@acme/api` stays free of the concrete `Auth` type: callers resolve the
  session via `auth.api.getSession` and pass it into `createORPCContext`.

## Gotchas

- `.env` lives at the repo root; package scripts load it with
  `bun --env-file=../../.env`. Never commit it or print its values.
- `src/proxy.ts` is only an optimistic redirect — always enforce auth in the
  procedure / page (`protectedProcedure`, session check).
- `README.md` mentions `apps/app-server` and `apps/docs`; they are not in this
  repo. `CONTRIBUTING.md` still says tRPC in places — the API is oRPC.
- Windows dev machine is common here: prefer cross-platform scripts (Bun/TS)
  over bash-only one-liners in package scripts and hooks.
