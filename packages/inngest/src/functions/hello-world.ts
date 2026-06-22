import { inngest } from "../client";

export interface HelloWorldEventData {
  name: string;
}

/**
 * Simple Inngest function triggered by the "demo/hello.world" event.
 *
 * Trigger from your app:
 * ```ts
 * import { inngest } from "@acme/inngest";
 *
 * await inngest.send({
 *   name: "demo/hello.world",
 *   data: { name: "World" },
 * });
 * ```
 */
export const helloWorldFunction = inngest.createFunction(
  {
    id: "hello-world",
    name: "Hello World",
    retries: 3,
    triggers: [{ event: "demo/hello.world" }],
  },
  async ({ event, step }) => {
    const data = event.data as HelloWorldEventData;

    // Steps are individually retriable and their results are memoised
    // across retries — no duplicate work if a later step fails.
    const message = await step.run("create-greeting", async () => {
      return `Hello, ${data.name}!`;
    });

    await step.sleep("brief-pause", "1s");

    const result = await step.run("log-result", async () => {
      console.log("[inngest] hello-world completed:", message);
      return { message, completedAt: new Date().toISOString() };
    });

    return result;
  },
);
