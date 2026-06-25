import { NextConfig } from "next";
import "./src/env";

export default async function createNextConfig(): Promise<NextConfig> {
  const config: NextConfig = {
    /** We already do linting and typechecking as separate tasks in CI */
    typescript: { ignoreBuildErrors: true },
  };

  return config;
}
