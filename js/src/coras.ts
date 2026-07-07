import type { CorasChrome, CorasConfig } from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import theme from "../brand.json";

// The shared demo identity. brand.json — passed to the SDK as `config.theme` —
// owns the colours, fonts, and logo, and its assets load from the public Coras
// CDN, so a fresh clone renders with no local setup.
const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
};

// Host-owned logo, projected into the SDK navbar's `brand` slot. The SDK moves
// this one element between navbars on navigation (only one page is mounted).
const logo = document.createElement("img");
logo.src = theme.logo;
logo.alt = site.title;

/** SDK chrome: the managed Coras navbar (with our logo) and footer. */
export const chrome: CorasChrome = {
  navbar: { use: "managed", slots: { brand: logo } },
  footer: "managed",
};

// Locale + currency in the path, details as a bare id segment (the SDK default).
// Shared so build and parse always agree on the shape of a URL.
export const url = createCorasUrlState();

/** The SDK config. Every value has a public default, so no env is required. */
export function buildConfig(): CorasConfig {
  return {
    apiUrl: import.meta.env.VITE_API_HOST || "https://sandbox.coras.io",
    distributorId: import.meta.env.VITE_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.VITE_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale: "en-IE",
    currency: "EUR",
    loyaltyPointsEnabled: true,
  };
}
