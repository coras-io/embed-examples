import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const embedDeps = path.resolve(dirname, "../../../packages/embed/node_modules");
const workspace = fs.existsSync(embedDeps);
const litDeps = ["lit", "@lit/localize", "@lit/context", "@lit/task"];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [sveltekit()],
    server: {
      allowedHosts: env.PUBLIC_ALLOWED_HOSTS
        ? env.PUBLIC_ALLOWED_HOSTS.split(",")
        : [],
    },
    ssr: { external: ["@coras-io/embed"] },
    resolve: workspace
      ? {
          alias: Object.fromEntries(
            litDeps.map((dep) => [dep, path.join(embedDeps, dep)]),
          ),
          dedupe: litDeps,
        }
      : {},
  };
});
