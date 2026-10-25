# @acme/ui

shadcn/ui components built on **Base UI** (`@base-ui/react`), not Radix —
check the Base UI API (e.g. `render` prop instead of `asChild`) before using
Radix-style props.

- Add components with `bun ui-add` from the repo root (shadcn CLI, config in
  `components.json`), or via the `shadcn` MCP server. Then add
  `export * from "./<name>";` to `src/components/index.ts` — consumers import
  only from `@acme/ui`.
- `cn` lives in `src/components/index.ts`; components import it from `"."`.
- This package is excluded from Biome. Keep edits close to upstream shadcn so
  future `shadcn add --overwrite` diffs stay readable.
- Theme tokens are in `tooling/tailwind/theme.css`; use semantic classes
  (`bg-background`, `text-muted-foreground`) rather than raw colors.
