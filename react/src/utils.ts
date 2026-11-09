import type { NavigateFn } from "@tanstack/react-router";
import type {
  CorasChrome,
  CorasConfig,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { getCurrency } from "@coras-io/embed/helpers";
import {
  createCorasRouting,
  createCorasUrlState,
  type CorasRouting,
} from "@coras-io/embed/url";
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

/** The site locale a URL segment names, in any case; the default for any other value. */
export function siteLocale(segment: string): SupportedLocales {
  const wanted = segment.toLowerCase();
  return (
    config.locales.find((locale) => locale.toLowerCase() === wanted) ??
    config.locale
  );
}

/** The currency a URL without one means: the locale's, or the configured default. */
export function defaultCurrency(
  locale: string = config.locale,
): SupportedCurrencies {
  return site.detectCurrency ? getCurrency(locale) : config.currency;
}

// The URL shape the Coras hosts share, and the one we recommend: a lower-case
// locale segment and the currency as a query param only when it is not the
// locale's default. The SDK default (`/en-IE/EUR/...`) and any other strategy
// stay available.
export const corasUrl = createCorasUrlState({
  localeCase: "lower",
  currencyInPath: false,
  defaultCurrency,
});

export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: import.meta.env.VITE_API_HOST || "https://sandbox.coras.io",
    distributorId: import.meta.env.VITE_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.VITE_ASSETS_URL ||
      "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    allowedLocales: config.locales,
    currency,
    allowedCurrencies: config.currencies,
    loyaltyPointsEnabled: true,
  };
}

function toTanStackTarget(href: string) {
  const url = new URL(href, window.location.origin);
  return {
    to: url.pathname,
    search: Object.fromEntries(url.searchParams.entries()),
  };
}

// The routing mount options bound to TanStack Router: a navigation pushes a
// history entry, an in-page change replaces it and remembers the location.
export function corasRouting(navigate: NavigateFn): CorasRouting {
  return createCorasRouting({
    url: corasUrl,
    navigate: (href) => {
      const { to, search } = toTanStackTarget(href);
      void navigate({ to, search: () => search, resetScroll: true });
    },
    replace: (href, state) => {
      if (state.page === "landing") {
        const params = state.params as
          | { country?: string; city?: string }
          | undefined;
        if (params?.country || params?.city) {
          setLastLocation({ country: params.country, city: params.city });
        }
      }
      const { to, search } = toTanStackTarget(href);
      void navigate({ to, search: () => search, replace: true });
    },
  });
}
