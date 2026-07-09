import type {
  CorasChrome,
  CorasConfig,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import { config } from "./config.ts";
import theme from "../brand.json";

// The shared demo identity. brand.json - passed to the SDK as `config.theme` -
// owns the colours, fonts, and logo, and its assets load from the public Coras
// CDN, so a fresh clone renders with no local setup.
const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
};

// Host-owned logo, projected into the SDK navbar's `brand` slot. Built once and
// reused: only one page is mounted at a time, so the SDK moves this element
// between navbars on navigation. Exported so the layout can wire its click.
export const logo = document.createElement("img");
logo.src = theme.logo;
logo.alt = site.title;

/** SDK chrome: the managed Coras navbar (with our logo) and footer. */
export const chrome: CorasChrome = {
  navbar: { use: "managed", slots: { brand: logo } },
  footer: "managed",
};

// Locale + currency in the path, details as a bare id segment (the SDK default)
// - matching this app's `/:locale/:currency` routes. Shared so build and parse
// always agree on the shape of a URL.
export const url = createCorasUrlState();

/** Build the SDK config for the current route's locale/currency. */
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
