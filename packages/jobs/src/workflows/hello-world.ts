import { hatchet } from "../client";

export interface HelloWorldInput {
  name: string;
}

/**
 * Simple standalone task — the basic unit of work in Hatchet.
 *
 * Tasks run reliably with automatic retries, timeouts, and full
 * observability built in. Trigger from anywhere in your app:
 *
 * ```ts
 * import { helloWorldTask } from "@acme/jobs";
 *
 * // Fire-and-forget (returns a run reference)
 * const ref = await helloWorldTask.runNoWait({ name: "World" });
 *
 * // Wait for the result
 * const result = await helloWorldTask.run({ name: "World" });
 * console.log(result.message); // "Hello, World!"
 * ```
 *
 * @see https://docs.hatchet.run/tasks/your-first-task
 */
export const helloWorldTask = hatchet.task({
  name: "hello-world",
  retries: 3,
  executionTimeout: "60s",
  fn: async (rawInput) => {
    // Hatchet passes all inputs as JsonObject — cast to the expected shape.
    const input = rawInput as unknown as HelloWorldInput;

    const message = `Hello, ${input.name}!`;

    return { message };
  },
});
