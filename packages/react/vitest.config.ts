import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src"],
      exclude: ["src/index.ts"],
    },
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    watch: false,
  },
});
