import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// In the monorepo the SDK is a workspace link, so the app and the linked
// `@coras-io/embed` can resolve different copies of lit; we force a single
// instance below. A standalone clone consumes the pre-bundled npm build, where
// lit is internal and this does not apply — detected by the absence of the
// sibling package, so the same config works in both places with no flag.
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
    // This app is a pure client-side SPA (`ssr = false`). SvelteKit still runs
    // an SSR pass to build the prerendered shell, and because the SDK is a
    // workspace link it would otherwise be force-bundled into that SSR pass —
    // pulling in the Node-oriented corners of its dependency tree (the optional
    // crypto/wallet libs) that reference Node builtins the SSR bundler can't
    // resolve. The SDK only ever runs in the browser, so keep it external to the
    // SSR build. The client build bundles it normally and tree-shakes the dead
    // Node paths, exactly as the React/Vue examples do.
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
