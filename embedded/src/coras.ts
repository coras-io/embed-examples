import type { CorasChrome, CorasConfig } from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import theme from "../brand.json";

const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Riverside Live",
};

export const TICKETS_BASE = "/tickets";
export const corasUrl = createCorasUrlState({
  basePath: TICKETS_BASE,
  localeInPath: false,
  currencyInPath: false,
});

export const chrome: CorasChrome = false;

export function buildConfig(): CorasConfig {
  return {
    apiUrl: import.meta.env.VITE_API_HOST || "https://sandbox.coras.io",
    distributorId: import.meta.env.VITE_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.VITE_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale: "en-IE",
    currency: "EUR",
  };
}
