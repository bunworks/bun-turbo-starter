---
name: verify
description: Run the same quality gates as CI (biome, sherif, typecheck, tests, optionally build) and fix what fails. Use before committing, before opening a PR, or when the user asks to check, verify, or make CI green.
argument-hint: "[--build]"
---

# Verify like CI

Run in order from the repo root; stop and fix at the first failing step, then
re-run that step before moving on.

1. `bun check:fix` — Biome lint + format with auto-fix. Then `bun check` must
   pass. Warnings are fine; errors are not.
2. `bun lint:ws` — sherif workspace consistency (matching dependency versions
   across `package.json` files, sorted fields). Then `bun lint:deps` — knip:
   unused files and dependencies, imports of undeclared packages (errors);
   unused exports are warnings. Fix by declaring / removing the dependency,
   or teach `knip.json` about an entry point it can't see — don't blanket
   ignore.
3. `bun typecheck` — turbo runs `^build` first, so `config`, `emails`,
   `storage` get built. Scope with `bun turbo typecheck -F <pkg>` while
   iterating on one package.
4. `bun test` — Bun's runner over all `*.test.ts`.
5. Only if `$ARGUMENTS` contains `--build` or the change touches Next config,
   env schemas, or route files: `bun run build` (uses `cp .env.example .env`
   values in CI; locally it reads the root `.env`).

Report a short table: step → pass/fail, plus what you fixed. Don't silence
errors with `// @ts-ignore`, `biome-ignore`, or `any` without telling the user
why.
