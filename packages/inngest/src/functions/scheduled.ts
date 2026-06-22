import { inngest } from "../client";

/**
 * Scheduled (cron) function — runs every hour at :00.
 *
 * The cron expression is managed entirely through code; no dashboard
 * configuration required. Change the `cron` value and redeploy to
 * update the schedule.
 *
 * Common patterns:
 * - Every hour:         "0 * * * *"
 * - Every day at 9am:  "0 9 * * *"
 * - Every Mon at 8am:  "0 8 * * 1"
 */
export const scheduledFunction = inngest.createFunction(
  {
    id: "scheduled-example",
    name: "Scheduled Example",
    triggers: [{ cron: "0 * * * *" }],
  },
  async ({ step }) => {
    const result = await step.run("do-periodic-work", async () => {
      // Place your periodic logic here:
      // - clean up stale records
      // - send digest emails
      // - sync with external APIs
      console.log(
        "[inngest] scheduled-example running at",
        new Date().toISOString(),
      );

      return {
        processedAt: new Date().toISOString(),
        status: "ok" as const,
      };
    });

    return result;
  },
);
