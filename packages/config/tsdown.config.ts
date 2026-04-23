import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
  deps: {
    neverBundle: ["@t3-oss/env-core", "zod"],
  },
});
