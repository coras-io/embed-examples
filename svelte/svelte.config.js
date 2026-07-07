import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // The SDK renders web components client-side only, so this app is a pure
    // client-rendered SPA (`ssr = false` in the root layout). `adapter-static`
    // emits plain files for an S3/CDN bucket; the `index.html` fallback lets the
    // client router own every `/:locale/:currency/...` deep link. Point the
    // bucket's 404/error document at that fallback so refreshes and deep links
    // load the SPA instead of a storage 404.
    adapter: adapter({ fallback: "index.html" }),
  },
};

export default config;
