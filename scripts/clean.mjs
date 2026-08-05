import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targetNames = new Set([
  ".cache",
  ".turbo",
  ".dist",
  ".node_modules",
  "dist",
  "node_modules",
]);
const ignoredNames = new Set([".git"]);

async function findTargets(directory) {
  const targets = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoredNames.has(entry.name)) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    const isDirectory = entry.isDirectory() || entry.isSymbolicLink();

    if (isDirectory && targetNames.has(entry.name)) {
      targets.push(entryPath);
      continue;
    }

    if (entry.isDirectory()) {
      targets.push(...(await findTargets(entryPath)));
    }
  }

  return targets;
}

const targets = await findTargets(root);

if (targets.length === 0) {
  console.log("Nothing to clean.");
  process.exit(0);
}

for (const target of targets) {
  await rm(target, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });
  console.log(`Removed ${path.relative(root, target)}`);
}

console.log(`Cleaned ${targets.length} directories.`);
