import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Standalone config: the app's vite.config pulls in the Cloudflare/TanStack build plugins.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "jsdom" },
});
