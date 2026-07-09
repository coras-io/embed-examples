import type { CorasChrome, CorasConfig } from "@coras-io/embed";
import type { CorasUrlStrategy } from "@coras-io/embed/url";
import theme from "../../../brand.json";

// The host app owns its own navbar, footer and routing; Coras is mounted into
// one section of it. This module holds the pieces that section needs.
const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Riverside Live",
};

// Coras owns only the `/tickets` sub-tree. The URL strategy carries that prefix,
// so buildCorasUrl()/parseCorasUrl() emit and read `/tickets/...` paths and the
// host's other routes (`/`, `/about`) are never mistaken for a Coras page.
// Locale and currency are fixed in config, so they stay out of the path.
export const TICKETS_BASE = "/tickets";
export const ticketsUrlStrategy: CorasUrlStrategy = {
  basePath: TICKETS_BASE,
  localeInPath: false,
  currencyInPath: false,
};

// The defining choice of an embedded integration: no Coras chrome. The host's
// own navbar and footer stay in charge; the SDK renders page content only.
export const chrome: CorasChrome = false;

/** The SDK config. Every value has a public default, so no env is required. */
export function buildConfig(): CorasConfig {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_HOST || "https://sandbox.coras.io",
    distributorId:
      process.env.NEXT_PUBLIC_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      process.env.NEXT_PUBLIC_ASSETS_URL ||
      "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale: "en-IE",
    currency: "EUR",
  };
}
