import { sendTemplateEmail, type TemplateEmail } from "@acme/emails";

import { hatchet } from "./client";

/**
 * Sends a template email from the worker, with retries.
 *
 * Enqueue it through `dispatchEmail` from `@acme/jobs`, which falls back to
 * sending inline when Hatchet isn't configured.
 */
export const sendEmailTask = hatchet.task({
  name: "send-email",
  retries: 5,
  backoff: { factor: 2, maxSeconds: 300 },
  executionTimeout: "30s",
  fn: async (rawInput) => {
    // Hatchet passes all inputs as JsonObject — cast to the expected shape.
    const input = rawInput as unknown as TemplateEmail;

    await sendTemplateEmail(input);

    return { template: input.template, recipients: input.to.length };
  },
});
