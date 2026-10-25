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

## 2. Generate a migration

Every schema change ships as a migration — CI fails on schema changes
without one.

1. `bun db:generate --name <short_snake_name>` (works offline; no database
   needed). On a rename it
   asks whether a column/table was renamed or replaced — ask the user; a
   wrong answer drops data.
2. Read the new `packages/db/migrations/NNNN_*.sql`. Watch for `DROP`,
   type changes, and `NOT NULL` columns added to tables that have rows
   (add a default or a backfill by hand-editing the SQL).
3. `bun db:check`.
4. Apply locally: `bun db:migrate` (needs `POSTGRES_URL` in the root `.env`;
   `docker compose up -d postgres`). If the local DB was created with
   `db:push` and migrate fails on existing tables: `bun db:baseline`, then
   `bun db:migrate`.

Commit the SQL together with `migrations/meta/`. Don't use `db:push` except
on a throwaway database, and never edit a migration that is already applied
on a shared environment — add a new one. Never run `drop` scripts.

## 3. Verify

`bun turbo typecheck -F @acme/db -F @acme/api` and
`bun test packages/db packages/api` (PGlite runs the migrations, so a broken
migration fails here).
Then update any API procedures that should expose the change (see the
`new-api-endpoint` skill).
