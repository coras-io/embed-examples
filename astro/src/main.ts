import {
  mount,
  type CorasApp,
  type CorasNavigateDetail,
  type CorasStateChangeDetail,
} from "@coras-io/embed";
import {
  buildConfig,
  chrome,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  logo,
  url,
} from "./coras.ts";

const container = document.getElementById("app")!;

const initial = url.parse(location.href);

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
  app.update({
    page: next.page,
    params: next.params,
    config: buildConfig(
      next.locale ?? DEFAULT_LOCALE,
      next.currency ?? DEFAULT_CURRENCY,
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
    initial.currency ?? DEFAULT_CURRENCY,
  ),
  chrome,
  onNavigate: (intent) => syncUrl(intent, false),
  onStateChange: (state) => syncUrl(state, true),
});

addEventListener("popstate", () => {
  const { page, params, locale, currency } = url.parse(location.href);
  app.update({
    page,
    params,
    config: buildConfig(locale ?? DEFAULT_LOCALE, currency ?? DEFAULT_CURRENCY),
  });
});

logo.addEventListener("click", () => {
  const { locale, currency } = url.parse(location.href);
  syncUrl({ page: "landing", params: {}, locale, currency }, false);
});
