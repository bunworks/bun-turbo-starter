import { helloWorldFunction, inngest, scheduledFunction } from "@acme/inngest";
import { serve } from "inngest/next";

/**
 * Inngest HTTP endpoint — handles syncing, event delivery, and execution.
 * GET  /api/inngest  — introspection (dev server discovery)
 * POST /api/inngest  — function execution & event delivery
 * PUT  /api/inngest  — registration sync
 *
 * @see https://www.inngest.com/docs/sdk/serve
 */

// Allow functions to run up to 5 minutes (adjust per plan limits)
export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorldFunction, scheduledFunction],
});
