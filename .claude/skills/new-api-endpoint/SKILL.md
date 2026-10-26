---
name: new-api-endpoint
description: Add an oRPC procedure to packages/api end to end — input schema, handler, router wiring, and client usage in apps/app. Use when the user asks for a new API endpoint, query, mutation, or procedure.
argument-hint: "<domain>.<procedure> [public|protected|admin]"
---

# New oRPC endpoint

Target: `$ARGUMENTS` (e.g. `post.update protected`). Ask only if the domain or
access level can't be inferred.

## 1. Pick the base procedure (`packages/api/src/orpc.ts`)

| Access         | Base                 | Context guarantees              |
| -------------- | -------------------- | ------------------------------- |
| anyone         | `publicProcedure`    | `context.session` may be `null` |
| signed-in user | `protectedProcedure` | `context.session.user` non-null |
| `ADMIN_EMAILS` | `adminProcedure`     | as protected + admin check      |

## 2. Input schema

- Insert/update shapes for a table: derive from Drizzle with `drizzle-zod`
  next to the table (see `CreatePostSchema` in
  `packages/db/src/schema/post/post.ts`) and export it from `@acme/db`.
- Schemas shared with a frontend form: put them in `packages/validators/src/`,
  export from its `index.ts`, add a test case to `validators.test.ts`.
- One-off params: inline `z.object({...})` in the procedure.

## 3. Procedure file

One file per procedure: `packages/api/src/routers/<domain>/<kebab-name>.ts`.
Follow the existing style — JSDoc with an `@example`, `context.db` for queries,
and **expected failures declared with `.errors()`** and thrown via `errors.*`:

```ts
import { eq, Post } from "@acme/db";
import { z } from "zod";

import { protectedProcedure } from "../../orpc";

/**
 * Rename a post — authenticated users only.
 *
 * @example client.post.rename({ id, title: "New title" })
 */
export const rename = protectedProcedure
  .errors({ NOT_FOUND: { message: "Публикация не найдена" } })
  .input(z.object({ id: z.uuid(), title: z.string().max(256) }))
  .handler(async ({ context, input, errors }) => {
    const [post] = await context.db
      .update(Post)
      .set({ title: input.title })
      .where(eq(Post.id, input.id))
      .returning();

    if (!post) throw errors.NOT_FOUND();
    return post;
  });
```

Declared errors are part of the procedure's type: the client narrows them
with `isDefinedError(error)` (from `@orpc/client`) and gets `error.code` and
schema-typed `error.data` (see `user/update-profile.ts` + `profile-form.tsx`,
which maps `CONFLICT` to a form field). Don't `throw new ORPCError(...)` for
expected cases — it reaches the client untyped. `UNAUTHORIZED` and
`FORBIDDEN` are already declared on `protectedProcedure` / `adminProcedure`.
Codes map to HTTP status by name (`NOT_FOUND` → 404, `CONFLICT` → 409, …);
DB unique violations: `isUniqueViolation(error, "<constraint>")` from
`@acme/db`. Never return another user's data from a `protectedProcedure`
without an ownership check.

## 4. Wire it up

1. Add to `packages/api/src/routers/<domain>/index.ts` (reserved words like
   `delete` are aliased: `delete: deletePost`).
2. New domain → add it to `appRouter` in `packages/api/src/routers/index.ts`
   and update the route map comment at the top of that file.

## 5. Use it in apps/app

- Server Component: `const data = await api.<domain>.<proc>(input)` from
  `~/orpc/server`.
- Client Component:
  - query: `useQuery(orpc.<domain>.<proc>.queryOptions({ input }))`
  - mutation: `useMutation({ ...orpc.<domain>.<proc>.mutationOptions(), onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.<domain>.key() }) })`
  - `orpc` from `~/orpc/react` (see `components/settings/profile-form.tsx`).

## 6. Verify

`bun turbo typecheck -F @acme/api -F @acme/app` then `bun check`. If you added
validators, `bun test packages/validators`.
