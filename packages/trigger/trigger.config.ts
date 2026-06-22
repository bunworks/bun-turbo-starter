import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // Get your project ref from https://cloud.trigger.dev -> project settings
  project: process.env.TRIGGER_PROJECT_REF!,

  // Max run duration in seconds (up to 1 hour on paid plans)
  maxDuration: 300,

  retries: {
    // Disable retries locally so failures surface immediately
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1_000,
      maxTimeoutInMs: 10_000,
      factor: 2,
    },
  },
});
