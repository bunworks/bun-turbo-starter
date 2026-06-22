import { hatchet } from "../client";

export interface ProcessDocumentInput {
  documentId: string;
  content: string;
}

/**
 * Multi-step DAG workflow — demonstrates Hatchet's durable execution model.
 *
 * Tasks in a workflow form a directed acyclic graph (DAG). Each task can
 * declare `parents` to express dependencies; Hatchet schedules them
 * automatically and passes outputs downstream via `ctx.parentOutput(...)`.
 *
 * If any step fails, only that step (and its dependants) are retried —
 * already-completed steps are not re-executed.
 *
 * Trigger from your app:
 * ```ts
 * import { processDocumentWorkflow } from "@acme/jobs";
 *
 * const result = await processDocumentWorkflow.run({
 *   documentId: "doc_123",
 *   content: "The quick brown fox...",
 * });
 * ```
 *
 * @see https://docs.hatchet.run/home/dag
 */
export const processDocumentWorkflow = hatchet.workflow({
  name: "process-document",
});

// Step 1 — extract metadata (no parents, runs immediately)
const extractMetadata = processDocumentWorkflow.task({
  name: "extract-metadata",
  retries: 3,
  executionTimeout: "30s",
  fn: async (input: ProcessDocumentInput) => {
    console.log("[jobs] extract-metadata", { documentId: input.documentId });

    // Simulate metadata extraction
    const wordCount = input.content.split(/\s+/).filter(Boolean).length;
    const language = "en"; // placeholder — swap for real detection

    return { wordCount, language };
  },
});

// Step 2 — transform content; depends on step 1
const transformContent = processDocumentWorkflow.task({
  name: "transform-content",
  parents: [extractMetadata],
  retries: 3,
  executionTimeout: "60s",
  fn: async (input: ProcessDocumentInput, ctx) => {
    const { wordCount, language } = await ctx.parentOutput(extractMetadata);

    console.log("[jobs] transform-content", {
      documentId: input.documentId,
      wordCount,
      language,
    });

    // Simulate summarization / tagging — replace with your actual logic
    const summary = `${input.content.slice(0, 80).trim()}…`;
    const tags = [language, wordCount > 100 ? "long" : "short"];

    return { summary, tags };
  },
});

// Step 3 — notify; depends on step 2
processDocumentWorkflow.task({
  name: "notify",
  parents: [transformContent],
  retries: 2,
  executionTimeout: "15s",
  fn: async (input: ProcessDocumentInput, ctx) => {
    const { summary, tags } = await ctx.parentOutput(transformContent);

    console.log("[jobs] notify", {
      documentId: input.documentId,
      summary,
      tags,
    });

    // Placeholder — send an email, push to a webhook, etc.

    return { notifiedAt: new Date().toISOString() };
  },
});
