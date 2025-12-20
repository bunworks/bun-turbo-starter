import { createJiti } from "jiti";
import { NextConfig } from "next";

export default async function createNextConfig(): Promise<NextConfig> {
  const jiti = createJiti(import.meta.url);

  // Import env files to validate at build time. Use jiti so we can load .ts files in here.
  await jiti.import("./src/env");

  const config: NextConfig = {
    /** Enables hot reloading for local packages without a build step */
    output: "standalone",
    transpilePackages: [
      "@acme/api",
      "@acme/auth",
      "@acme/db",
      "@acme/ui",
      "@acme/validators",
    ],

    /** We already do linting and typechecking as separate tasks in CI */
    typescript: { ignoreBuildErrors: true },
  };

  return config;
}
