/**
 * ReUI registry items import `cn` from the bare specifier "cn", which the
 * shadcn CLI does not rewrite to our `utils` alias (and it also adds an
 * unrelated `cn` npm package). Point those imports at `src/components/index.ts`
 * with a relative path, the same way the stock components import it from ".".
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
  if (!source.includes('from "cn"')) continue;

  const target =
    relative(dirname(path), componentsDir).split(sep).join("/") || ".";
  await writeFile(path, source.replaceAll('from "cn"', `from "${target}"`));
  console.log(`fixed cn import: ${file}`);
}
