import type { NavigateFn } from "@tanstack/react-router";
import type {
  CorasChrome,
  CorasConfig,
  CorasNavigateDetail,
  CorasStateChangeDetail,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import { config } from "./config.ts";
import { setLastLocation } from "./last-location.ts";
import theme from "../brand.json";

export const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
  logo: theme.logo,
  detectLocale: true,
  detectCurrency: true,
};

export const logo = document.createElement("img");
logo.src = site.logo;
logo.alt = site.title;

export const corasChrome: CorasChrome = {
  navbar: { use: "managed", slots: { brand: logo } },
  footer: "managed",
};

export const corasUrl = createCorasUrlState();

export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: import.meta.env.VITE_API_HOST || "https://sandbox.coras.io",
    distributorId: import.meta.env.VITE_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.VITE_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    allowedLocales: config.locales,
    currency,
    allowedCurrencies: config.currencies,
    loyaltyPointsEnabled: true,
  };
}

function toTanStackTarget(
  page: CorasNavigateDetail["page"],
  params: Record<string, unknown> | undefined,
  locale: string,
  currency: string,
) {
  const href = corasUrl.build({
    page,
    params: (params ?? {}) as never,
    locale: locale as SupportedLocales,
    currency: currency as SupportedCurrencies,
  });
  const url = new URL(href, window.location.origin);
  return {
    to: url.pathname,
    search: Object.fromEntries(url.searchParams.entries()),
  };
}

export async function handleNavigate(
  navigate: NavigateFn,
  intent: CorasNavigateDetail,
): Promise<void> {
  if (intent.href) {
    window.open(intent.href, "_blank", "noopener,noreferrer");
    return;
  }

  const { to, search } = toTanStackTarget(
    intent.page,
    intent.params as Record<string, unknown> | undefined,
    intent.locale ?? config.locale,
    intent.currency ?? config.currency,
  );

  await navigate({ to, search: () => search, resetScroll: true });
}

export async function handleStateChange(
  navigate: NavigateFn,
  state: CorasStateChangeDetail,
): Promise<void> {
  if (state.page === "landing") {
    const params = state.params as
      | { country?: string; city?: string }
      | undefined;
    if (params?.country || params?.city) {
      setLastLocation({ country: params.country, city: params.city });
    }
  }

  const { to, search } = toTanStackTarget(
    state.page,
    state.params as Record<string, unknown> | undefined,
    state.locale ?? config.locale,
    state.currency ?? config.currency,
  );

  await navigate({ to, search: () => search, replace: true });
}
