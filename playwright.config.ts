import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Runs against the real production Worker bundle (wrangler dev --local), not the Vite dev server.
export default defineConfig({
  testDir: "tests/e2e",
  // Per-day journey tests make 10+ real navigations each; 60s was too tight on a busy machine
  // (every failure it produced was a timeout, never a wrong result).
  timeout: 150_000,
  expect: { timeout: 12_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: `npm run build && npx wrangler dev -c dist/server/wrangler.json --ip 127.0.0.1 --port ${PORT} --local`,
    url: `http://127.0.0.1:${PORT}/home`,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
