import type {
  CorasChrome,
  CorasConfig,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { getCurrency } from "@coras-io/embed/helpers";
import { createCorasUrlState } from "@coras-io/embed/url";
import { env } from "$env/dynamic/public";
import theme from "../../brand.json";

const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
};

export const DEFAULT_LOCALE: SupportedLocales = "en-IE";

/** The currency a URL without one means: the locale's. */
export function defaultCurrency(
  locale: string = DEFAULT_LOCALE,
): SupportedCurrencies {
  return getCurrency(locale);
}

// The URL shape the Coras hosts share, and the one we recommend: a lower-case
// locale segment and the currency as a query param only when it is not the
// locale's default. The SDK default (`/en-IE/EUR/...`) and any other strategy
// stay available.
export const url = createCorasUrlState({
  localeCase: "lower",
  currencyInPath: false,
  defaultCurrency,
});

export function buildChrome(): { chrome: CorasChrome; logo: HTMLImageElement } {
  const logo = document.createElement("img");
  logo.src = theme.logo;
  logo.alt = site.title;
  return {
    chrome: {
      navbar: { use: "managed", slots: { brand: logo } },
      footer: "managed",
    },
    logo,
  };
}

export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: env.PUBLIC_API_HOST || "https://sandbox.coras.io",
    distributorId: env.PUBLIC_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      env.PUBLIC_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    currency,
    loyaltyPointsEnabled: true,
  };
}
