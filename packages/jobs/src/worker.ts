import { env, logger } from "@acme/config";

/**
 * Hatchet worker — long-running process that polls the Hatchet engine
 * and executes registered workflows/tasks.
 *
 * ```bash
 * bun jobs:dev        # from the repo root (watch mode, loads the root .env)
 * ```
 *
 * The worker connects to Hatchet using HATCHET_CLIENT_TOKEN.
 * @see https://docs.hatchet.run/home/workers
 */
async function main() {
  if (!env.HATCHET_CLIENT_TOKEN) {
    logger.error("jobs.worker_missing_token", undefined, {
      hint: "Set HATCHET_CLIENT_TOKEN (cloud.onhatchet.run → Settings → API Tokens or a self-hosted engine)",
    });
    process.exit(1);
  }

  // Loaded after the check: creating the Hatchet client throws without a token.
  const {
    hatchet,
    helloWorldTask,
    processDocumentWorkflow,
    scheduledWorkflow,
    sendEmailTask,
  } = await import("./workflows");

  const worker = await hatchet.worker("acme-worker", {
    workflows: [
      sendEmailTask,
      helloWorldTask,
      scheduledWorkflow,
      processDocumentWorkflow,
    ],
    // Maximum number of concurrent task runs this worker will accept.
    // Tune based on the workload's CPU/memory profile.
    slots: 20,
  });

  logger.info("jobs.worker_started", { name: "acme-worker" });
  await worker.start();
}

main().catch((error) => {
  logger.error("jobs.worker_crashed", error);
  process.exit(1);
});
