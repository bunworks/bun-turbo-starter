import { Inngest } from "inngest";

/**
 * Shared Inngest client instance.
 *
 * Import this wherever you need to trigger events or define functions:
 * ```ts
 * import { inngest } from "@acme/inngest";
 * ```
 *
 * In production, set the following environment variables:
 * - INNGEST_EVENT_KEY  — key for sending events
 * - INNGEST_SIGNING_KEY — key for verifying webhook signatures
 *
 * In local development, the Inngest Dev Server handles everything
 * automatically without any keys.
 * @see https://www.inngest.com/docs/sdk/client
 */
export const inngest = new Inngest({
  id: "acme",
  eventKey: process.env.INNGEST_EVENT_KEY,
});
