/**
 * Fix the import specifiers the shadcn CLI writes into this package:
 *
 * - `cn` from the bare specifier "cn" (ReUI items; the CLI does not rewrite
 *   it to our `utils` alias and also adds an unrelated `cn` npm package),
 * - sibling components from "src/components//<name>" (the `components`
 *   alias pasted in literally).
 *
 * Both become relative paths to `src/components`, the same way the stock
 * components import `cn` from "." and each other from "./<name>".
 *
 * Run after `shadcn add` (the `ui-add` script does this).
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

const componentsDir = join(import.meta.dir, "..", "src", "components");

const files = (await readdir(componentsDir, { recursive: true })).filter(
  (file) => file.endsWith(".tsx") || file.endsWith(".ts"),
);

for (const file of files) {
  const path = join(componentsDir, file);
  const source = await readFile(path, "utf8");

  const toComponents = relative(dirname(path), componentsDir)
    .split(sep)
    .join("/");
  const resolve = (target: string) => {
    const specifier = [toComponents, target].filter(Boolean).join("/");
    return specifier.startsWith(".") ? specifier : `./${specifier}`;
  };

  const fixed = source
    .replaceAll('from "cn"', `from "${toComponents || "."}"`)
    .replace(
      /from "src\/components\/+([^"]+)"/g,
      (_, target: string) => `from "${resolve(target)}"`,
    );
  if (fixed === source) continue;

  await writeFile(path, fixed);
  console.log(`fixed imports: ${file}`);
}
