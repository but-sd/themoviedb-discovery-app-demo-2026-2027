import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  test: {
    include: ["src/back-end/**/*.test.ts"],
    exclude: ["node_modules/**"],
    // environment: 'jsdom',
    coverage: {
      provider: "v8",
      include: ["src/back-end/**/*.ts"],
      exclude: [],
      reporter: ["text", "html"],
    },
  },
});
