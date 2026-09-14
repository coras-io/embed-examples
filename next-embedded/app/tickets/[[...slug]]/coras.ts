import type { CorasChrome, CorasConfig } from "@coras-io/embed";
import type { CorasUrlStrategy } from "@coras-io/embed/url";
import theme from "../../../brand.json";

const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Riverside Live",
};

export const TICKETS_BASE = "/tickets";
export const ticketsUrlStrategy: CorasUrlStrategy = {
  basePath: TICKETS_BASE,
  localeInPath: false,
  currencyInPath: false,
};

export const chrome: CorasChrome = false;

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
