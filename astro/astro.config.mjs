import { defineConfig } from "astro/config";

export default defineConfig({
  // The Coras SDK renders web components in the browser only, so there is
  // nothing to server-render: emit a single static `index.html` (deployable to
  // an S3/CDN bucket) and let client-side History-API routing own every
  // `/:locale/:currency/...` URL. Point the bucket's 404/error document at
  // `index.html` so deep links and refreshes load the app.
  output: "static",
});
