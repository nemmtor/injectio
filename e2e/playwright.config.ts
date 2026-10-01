import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";
const isCI = Boolean(process.env["CI"]);

export default defineConfig({
  testDir: ".",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? [["dot"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command:
      "pnpm turbo run build --filter=react-example && pnpm --filter react-example preview --host 127.0.0.1 --port 4173 --strictPort",
    cwd: process.cwd(),
    reuseExistingServer: !isCI,
    timeout: 120_000,
    url: baseURL,
  },
});
