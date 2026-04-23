import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
  target: "es2022",
  outDir: "./dist",
  treeshake: false,
  deps: {
    alwaysBundle: [/@acme\/.*/],
    neverBundle: ["sanitize-html"],
  },
});
