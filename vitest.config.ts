import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "culori/fn": path.resolve(
        __dirname,
        "node_modules/culori/src/index-fn.js"
      ),
    },
  },
});
