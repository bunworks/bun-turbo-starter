import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: "es2022",
  outDir: "./dist",
  treeshake: true,
  deps: {
    neverBundle: true,
    alwaysBundle: [/@acme\/.*/],
  },
});
