import {
  mount,
  type CorasApp,
  type CorasNavigateDetail,
  type CorasStateChangeDetail,
} from "@coras-io/embed";
import { buildConfig, chrome, logo, url } from "./coras.ts";

// Client-only entry. Astro bundles this for the browser and it never runs during
// SSR/prerender, so the SDK's web components only render once the container
// exists. The page ships a single `#app` container; History-API routing (below)
// drives every `/:locale/:currency/...` URL within this one loaded page.
const container = document.getElementById("app")!;

// Derive the initial page + params from the URL, so a deep link or a refresh
// lands on the right page rather than always the landing page.
const initial = url.parse(location.href);

// Host owns routing. Turn a navigation *intent* from the SDK into a real URL,
// push it to the browser, then reflect it back into the mounted app. `update`
// re-renders in place without re-emitting `onNavigate`, so there is no loop.
function syncUrl(
  detail: CorasNavigateDetail | CorasStateChangeDetail,
  replace: boolean,
): void {
  if ("href" in detail && detail.href) {
    window.open(detail.href, "_blank", "noopener,noreferrer");
    return;
  }
  const href = url.build({
    page: detail.page,
    params: detail.params ?? {},
    locale: detail.locale,
    currency: detail.currency,
  });
  history[replace ? "replaceState" : "pushState"](null, "", href);
  const next = url.parse(href);
  app.update({ page: next.page, params: next.params });
}

// One persistent mount for every page. Route changes call `app.update()`, so the
// navbar, footer, and chrome stay in place and only the page content swaps.
const app: CorasApp = mount({
  container,
  strict: true,
  page: initial.page,
  params: initial.params,
  config: buildConfig(),
  chrome,
  // A link/selection to another page: push a new history entry.
  onNavigate: (intent) => syncUrl(intent, false),
  // An in-page state change (e.g. a filter): reflect it without a new entry.
  onStateChange: (state) => syncUrl(state, true),
});

// Back / forward: re-read the URL and update the mounted app in place.
addEventListener("popstate", () => {
  const { page, params } = url.parse(location.href);
  app.update({ page, params });
});

// The navbar logo is a home link. A slotted brand element owns its own
// navigation, so wire its click to the landing page for the URL's current
// locale/currency.
logo.addEventListener("click", () => {
  const { locale, currency } = url.parse(location.href);
  syncUrl({ page: "landing", params: {}, locale, currency }, false);
});
