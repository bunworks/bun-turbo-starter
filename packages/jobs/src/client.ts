import { HatchetClient } from "@hatchet-dev/typescript-sdk/v1";

/**
 * Shared Hatchet client instance.
 *
 * Import this wherever you need to define tasks or workflows:
 * ```ts
 * import { hatchet } from "@acme/jobs";
 * ```
 *
 * The client reads credentials from the environment automatically:
 * - HATCHET_CLIENT_TOKEN — JWT token from the Hatchet dashboard
 *
 * Obtain your token at https://cloud.onhatchet.run → Settings → API Tokens,
 * or from your self-hosted Hatchet instance.
 * @see https://docs.hatchet.run/reference/typescript/client
 */
export const hatchet = HatchetClient.init();
