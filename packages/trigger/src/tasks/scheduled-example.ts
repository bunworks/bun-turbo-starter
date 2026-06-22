import { logger, schedules } from "@trigger.dev/sdk";

/**
 * Scheduled (cron) task example.
 * Runs every hour at :00.
 *
 * The schedule is registered via the trigger.dev dashboard or
 * programmatically via the SDK:
 * ```ts
 * import { schedules } from "@trigger.dev/sdk";
 *
 * await schedules.create({
 *   task: "scheduled-example",
 *   cron: "0 * * * *",
 *   timezone: "Europe/Moscow",
 * });
 * ```
 */
export const scheduledExampleTask = schedules.task({
  id: "scheduled-example",
  // Every hour
  cron: "0 * * * *",
  maxDuration: 120,
  run: async (payload) => {
    logger.log("Running scheduled task", {
      timestamp: payload.timestamp,
      lastRun: payload.lastTimestamp ?? "first run",
      upcoming: payload.upcoming,
    });

    // Place your periodic logic here:
    // - clean up stale records
    // - send digest emails
    // - sync with external APIs
    const result = {
      processedAt: new Date().toISOString(),
      status: "ok" as const,
    };

    logger.log("Scheduled task completed", result);

    return result;
  },
});
