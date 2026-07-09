import EmberApp from "ember-cli/lib/broccoli/ember-app.js";
import { compatBuild } from "@embroider/compat";

// The classic ember-cli tree is handed to Embroider, which Vite consumes. This
// app has no data store or extra build options, so the tree is empty - the
// integration lives entirely in the app modules.
export default async function (defaults) {
  const { buildOnce } = await import("@embroider/vite");
  const app = new EmberApp(defaults, {});
  return compatBuild(app, buildOnce);
}
