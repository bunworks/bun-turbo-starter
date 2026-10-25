---
name: db-change
description: Change the Drizzle schema in packages/db (add a table, column, index, or relation) and sync it to Postgres. Use when the user asks to add or modify a table, column, or database model.
argument-hint: "<what to change>"
---

# Drizzle schema change

Requested change: `$ARGUMENTS`

## 1. Edit the schema

- Domain folders live in `packages/db/src/schema/<domain>/`; each has an
  `index.ts` that re-exports, and `schema/index.ts` re-exports all domains.
  New domain → create the folder and add `export * from "./<domain>";`.
- Auth tables (`schema/auth/`) mirror Better Auth's config. Prefer adding
  fields through the Better Auth config (`packages/auth/src/index.ts`,
  `additionalFields`) and then `bun auth:generate`, rather than hand-editing.
- Follow `schema/post/post.ts`:
  - `pgTable("plural_snake_name", (t) => ({ ... }))`, exported PascalCase.
  - camelCase keys; `drizzle.config.ts` sets `casing: "snake_case"`, so don't
    pass explicit column names in new tables.
  - `id: t.uuid().notNull().primaryKey().defaultRandom()`, `createdAt`,
    `updatedAt` with `$onUpdateFn`.
  - Foreign keys to users: `t.text().references(() => user.id, { onDelete: "cascade" })`
    (`user.id` is `text`, not uuid).
  - Export `Create<Name>Schema` via `createInsertSchema(...).omit({ id, createdAt, updatedAt })`
    for API input.
- Add `relations(...)` if you need `db.query.<Table>.findMany({ with: ... })`.

## 2. Apply

Requires `POSTGRES_URL` in the root `.env` (local: `docker compose up -d postgres`).

- Prototyping / local dev: `bun db:push` (interactive on destructive changes —
  ask the user before confirming data loss).
- Versioned migration: `bun db:generate`, review the SQL in
  `packages/db/migrations/`, then `bun db:migrate`.

Tell the user which one you ran. Never run `drop` scripts.

## 3. Verify

`bun turbo typecheck -F @acme/db -F @acme/api` and `bun test packages/db`.
Then update any API procedures that should expose the change (see the
`new-api-endpoint` skill).
