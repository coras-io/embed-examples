import type {
  CorasChrome,
  CorasConfig,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import theme from "../brand.json";

const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
};

export const logo = document.createElement("img");
logo.src = theme.logo;
logo.alt = site.title;

export const chrome: CorasChrome = {
  navbar: { use: "managed", slots: { brand: logo } },
  footer: "managed",
};

export const url = createCorasUrlState();

export const DEFAULT_LOCALE: SupportedLocales = "en-IE";
export const DEFAULT_CURRENCY: SupportedCurrencies = "EUR";

export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: import.meta.env.PUBLIC_API_HOST || "https://sandbox.coras.io",
    distributorId:
      import.meta.env.PUBLIC_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.PUBLIC_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    currency,
    loyaltyPointsEnabled: true,
  };
}
