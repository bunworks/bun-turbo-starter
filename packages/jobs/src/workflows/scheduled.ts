import { hatchet } from "../client";

/**
 * Cron-triggered workflow — runs every hour at :00.
 *
 * The schedule is declared directly in code via the `on.cron` property.
 * Update the expression and redeploy to change the schedule — no dashboard
 * configuration needed.
 *
 * Common cron patterns:
 * - Every hour:        "0 * * * *"
 * - Every day at 9am:  "0 9 * * *"
 * - Every Mon at 8am:  "0 8 * * 1"
 *
 * @see https://docs.hatchet.run/home/triggers#cron-triggers
 */
export const scheduledWorkflow = hatchet.workflow({
  name: "scheduled-example",
  on: {
    cron: "0 * * * *",
  },
});

scheduledWorkflow.task({
  name: "do-periodic-work",
  retries: 2,
  executionTimeout: "120s",
  fn: async () => {
    // Place your periodic logic here:
    // - clean up stale records
    // - send digest emails
    // - sync with external APIs

    return {
      processedAt: new Date().toISOString(),
      status: "ok" as const,
    };
  },
});
