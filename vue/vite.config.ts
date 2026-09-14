import { defineConfig, loadEnv, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const embedDeps = path.resolve(
  __dirname,
  "../../../packages/embed/node_modules",
);
const workspace = fs.existsSync(embedDeps);
const dedupe = [
  "vue",
  "vue-router",
  "lit",
  "@lit/localize",
  "@lit/context",
  "@lit/task",
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(",")
    : [];

  return {
    plugins: [vue()] as PluginOption[],
    server: { allowedHosts },
    resolve: workspace
      ? {
          alias: {
            vue: path.resolve(__dirname, "node_modules/vue"),
            "vue-router": path.resolve(__dirname, "node_modules/vue-router"),
            lit: path.join(embedDeps, "lit"),
            "@lit/localize": path.join(embedDeps, "@lit/localize"),
            "@lit/context": path.join(embedDeps, "@lit/context"),
            "@lit/task": path.join(embedDeps, "@lit/task"),
          },
          dedupe,
        }
      : {},
    build: { sourcemap: true },
  };
});
