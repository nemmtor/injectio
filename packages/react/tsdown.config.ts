import { defineConfig } from "tsdown";

export default defineConfig((options) => ({
  entry: "src/index.ts",
  format: ["esm"],
  target: "es2022",
  clean: !options.watch,
  fixedExtension: false,
  sourcemap: true,
  treeshake: true,
  dts: true,
  unbundle: true,
  logLevel: "error",
}));
