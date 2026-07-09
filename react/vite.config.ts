import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In the monorepo the SDK is a workspace link, so the app and the linked
// `@coras-io/embed` can resolve different copies of lit; we force a single
// instance below. A standalone clone consumes the pre-bundled npm build, where
// lit is internal and this does not apply - detected by the absence of the
// sibling package, so the same config works in both places with no flag.
const embedDeps = path.resolve(__dirname, "../../../packages/embed/node_modules");
const workspace = fs.existsSync(embedDeps);
const dedupe = ["react", "react-dom", "lit", "@lit/localize", "@lit/context", "@lit/task"];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(",")
    : [];

  return {
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      // Cast bridges duplicate vite versions in the tree (a plugin resolves a
      // different vite than this config), whose `Plugin` types are structurally
      // identical but nominally distinct. Type-only; no runtime effect.
    ] as PluginOption[],
    server: {
      allowedHosts,
      watch: {
        // Debounce file changes to avoid multiple reloads when tsc emits many files
        usePolling: false,
        interval: 300,
      },
      hmr: {
        // Increase timeout for HMR to handle slower rebuilds
        timeout: 5000,
      },
    },
    resolve: workspace
      ? {
          alias: {
            react: path.resolve(__dirname, "node_modules/react"),
            "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
            lit: path.join(embedDeps, "lit"),
            "@lit/localize": path.join(embedDeps, "@lit/localize"),
            "@lit/context": path.join(embedDeps, "@lit/context"),
            "@lit/task": path.join(embedDeps, "@lit/task"),
          },
          dedupe,
        }
      : {},
    build: {
      sourcemap: true,
    },
  };
});
