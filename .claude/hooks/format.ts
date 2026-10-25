/**
 * PostToolUse hook: run Biome (lint fix + format) on the file Claude just
 * edited. Remaining errors are reported back to Claude via exit code 2 so it
 * can fix them right away instead of discovering them in CI.
 */

import { join } from "node:path";

const BIOME_EXTENSIONS = /\.(c|m)?(j|t)sx?$|\.jsonc?$/;

const input = (await Bun.stdin.json()) as {
  tool_input?: { file_path?: string };
};

const filePath = input.tool_input?.file_path;
if (!filePath || !BIOME_EXTENSIONS.test(filePath)) process.exit(0);

const proc = Bun.spawn(
  [
    "bun",
    "x",
    "biome",
    "check",
    "--write",
    "--no-errors-on-unmatched",
    "--files-ignore-unknown=true",
    "--colors=off",
    filePath,
  ],
  {
    // Repo root, so biome.json and .gitignore are picked up.
    cwd: join(import.meta.dir, "..", ".."),
    stdout: "pipe",
    stderr: "pipe",
  },
);

const [stdout, stderr, exitCode] = await Promise.all([
  new Response(proc.stdout).text(),
  new Response(proc.stderr).text(),
  proc.exited,
]);

if (exitCode !== 0) {
  console.error(
    `Biome found problems it could not auto-fix in ${filePath}:\n${stdout}${stderr}`,
  );
  process.exit(2);
}
