/**
 * PreToolUse hook: block edits to secrets, lockfiles, generated output, and
 * drizzle-kit migration snapshots. Exit code 2 denies the tool call and shows
 * the reason to Claude.
 */

const PROTECTED: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /(^|\/)\.env(\.[^/]*)?$/,
    reason: "env files hold secrets; edit .env.example instead",
  },
  {
    pattern: /(^|\/)bun\.lockb?$/,
    reason: "the lockfile is managed by `bun install` / `bun add`",
  },
  {
    pattern: /(^|\/)(node_modules|dist|\.next|\.turbo|\.cache)\//,
    reason: "generated or installed output; change the source instead",
  },
  {
    pattern: /packages\/db\/migrations\/meta\//,
    reason:
      "drizzle-kit snapshots are generated; change the schema and run `bun db:generate`",
  },
];

const ALLOWED = [/(^|\/)\.env\.example$/];

const input = (await Bun.stdin.json()) as {
  tool_input?: { file_path?: string };
};

const filePath = input.tool_input?.file_path?.replaceAll("\\", "/");
if (!filePath || ALLOWED.some((re) => re.test(filePath))) process.exit(0);

const hit = PROTECTED.find(({ pattern }) => pattern.test(filePath));
if (hit) {
  console.error(`Blocked edit to ${filePath}: ${hit.reason}.`);
  process.exit(2);
}
