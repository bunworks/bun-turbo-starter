import { defineConfig } from "tsdown";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  dts: false,
  sourcemap: false,
  clean: true,
  minify: isProduction,
});
