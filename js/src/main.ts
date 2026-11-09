import { mount, type CorasApp } from "@coras-io/embed";
import { createCorasRouting } from "@coras-io/embed/url";
import {
  buildConfig,
  chrome,
  DEFAULT_LOCALE,
  defaultCurrency,
  logo,
  url,
} from "./coras.ts";

const container = document.getElementById("app")!;

const initial = url.parse(location.href);

// The History API is the router: a navigation pushes an entry, an in-page
// change replaces it, and either way the new URL is parsed back into the mount.
function show(href: string, replace: boolean): void {
  history[replace ? "replaceState" : "pushState"](null, "", href);
  const next = url.parse(href);
  app.update({
    page: next.page,
    params: next.params,
    config: buildConfig(
      next.locale ?? DEFAULT_LOCALE,
      next.currency ?? defaultCurrency(next.locale),
    ),
  });
}

const app: CorasApp = mount({
  container,
  strict: true,
  page: initial.page,
  params: initial.params,
  config: buildConfig(
    initial.locale ?? DEFAULT_LOCALE,
    initial.currency ?? defaultCurrency(initial.locale),
  ),
  chrome,
  ...createCorasRouting({
    url,
    navigate: (href) => show(href, false),
    replace: (href) => show(href, true),
  }),
});

addEventListener("popstate", () => {
  const { page, params, locale, currency } = url.parse(location.href);
  app.update({
    page,
    params,
    config: buildConfig(
      locale ?? DEFAULT_LOCALE,
      currency ?? defaultCurrency(locale),
    ),
  });
});

logo.addEventListener("click", () => {
  const { locale, currency } = url.parse(location.href);
  show(url.build({ page: "landing", params: {}, locale, currency }), false);
});
