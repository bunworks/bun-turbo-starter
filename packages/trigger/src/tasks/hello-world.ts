import { logger, task } from "@trigger.dev/sdk";

export interface HelloWorldPayload {
  name: string;
}

/**
 * Simple example trigger.dev task.
 *
 * Trigger from your app:
 * ```ts
 * import { tasks } from "@trigger.dev/sdk/v4";
 * import type { helloWorldTask } from "@acme/trigger";
 *
 * await tasks.trigger<typeof helloWorldTask>("hello-world", { name: "World" });
 * ```
 */
export const helloWorldTask = task({
  id: "hello-world",
  maxDuration: 60,
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: HelloWorldPayload) => {
    logger.log("Running hello-world task", { payload });

    // Simulate useful work
    const message = `Hello, ${payload.name}!`;

    logger.log("Task completed", { message });

    return { message };
  },
});
