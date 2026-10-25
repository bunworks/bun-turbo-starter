# @acme/ui

shadcn/ui components built on **Base UI** (`@base-ui/react`), not Radix —
check the Base UI API (e.g. `render` prop instead of `asChild`) before using
Radix-style props.

- Add components with `bun ui-add` from the repo root (shadcn CLI, config in
  `components.json`), or via the `shadcn` MCP server. Then add
  `export * from "./<name>";` to `src/components/index.ts` — consumers import
  only from `@acme/ui`.
- `cn` lives in `src/components/index.ts`; components import it from `"."`.
- **ReUI** (`@reui` registry in `components.json`, style `base-vega`): add
  with `bun ui-add @reui/<name>` (free components and `c-*` examples need no
  key). Files land in `src/components/reui/` and are imported by subpath,
  `@acme/ui/reui/<name>` — not re-exported from the index, because
  `@reui/badge` / `@reui/alert` clash with the shadcn `Badge` / `Alert`.
  ReUI items import `cn` from a bare `"cn"` and siblings from
  `"src/components//<name>"`: `scripts/fix-imports.ts` (run by `ui-add`)
  rewrites both to relative paths; if the CLI adds a `cn` npm dependency,
  remove it. Items that depend on shadcn components (e.g. `@reui/data-grid`)
  stop at an overwrite prompt unless given `--overwrite`, which replaces those
  components with their upstream `base-vega` versions — review that diff.
  ReUI state tokens (`success`, `info`, `warning`, `invert`, …) are already in
  `tooling/tailwind/theme.css`.
- This package is excluded from Biome. Keep edits close to upstream shadcn so
  future `shadcn add --overwrite` diffs stay readable.
- Theme tokens are in `tooling/tailwind/theme.css`; use semantic classes
  (`bg-background`, `text-muted-foreground`) rather than raw colors.
