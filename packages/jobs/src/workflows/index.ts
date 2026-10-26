/**
 * Hatchet client and task declarations (`@acme/jobs/workflows`).
 *
 * Importing this module creates the Hatchet client, which throws without
 * HATCHET_CLIENT_TOKEN. App code should go through `@acme/jobs` instead.
 */
export { hatchet } from "./client";
export type { HelloWorldInput } from "./hello-world";
export { helloWorldTask } from "./hello-world";
export type { ProcessDocumentInput } from "./multi-step";
export { processDocumentWorkflow } from "./multi-step";
export { scheduledWorkflow } from "./scheduled";
export { sendEmailTask } from "./send-email";
