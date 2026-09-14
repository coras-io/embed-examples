import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    ] as PluginOption[],
    server: {
      allowedHosts,
      watch: {
        usePolling: false,
        interval: 300,
      },
      hmr: {
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
