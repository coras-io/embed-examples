import type {
  CorasChrome,
  CorasConfig,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import { env } from "$env/dynamic/public";
import theme from "../../brand.json";

// The shared demo identity. brand.json — passed to the SDK as `config.theme` —
// owns the colours, fonts, and logo, and its assets load from the public Coras
// CDN, so a fresh clone renders with no local setup.
const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
};

// Locale + currency in the path, details as a bare id segment (the SDK default)
// — matching this app's `[locale]/[currency]` routes. Shared so build and parse
// always agree on the shape of a URL.
export const url = createCorasUrlState();

/**
 * SDK chrome: the managed Coras navbar (with our logo) and footer.
 *
 * Built lazily from a function rather than at module scope like the vanilla
 * example: this module is imported by SvelteKit route modules, and creating the
 * logo `<img>` at import time would touch `document`. Calling `buildChrome()`
 * only from inside the client-only mount keeps the module import SSR-safe.
 * Returns the logo too, so the host can wire its click to "go to landing".
 */
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

/** The SDK config for the current route's locale/currency. Every value has a
 * public default, so the app runs with no env. */
export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: env.PUBLIC_API_HOST || "https://sandbox.coras.io",
    distributorId: env.PUBLIC_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl: env.PUBLIC_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    currency,
    loyaltyPointsEnabled: true,
  };
}
