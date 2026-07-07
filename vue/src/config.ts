import type { SupportedCurrencies, SupportedLocales } from "@coras-io/embed";

/**
 * Supported locales and currencies, and the defaults used when the visitor's
 * own preference cannot be detected. The lists are handed to the SDK as
 * `allowedLocales` / `allowedCurrencies`, so its built-in switchers only ever
 * offer values this host is prepared to route.
 */
export const config: {
  currency: SupportedCurrencies;
  currencies: SupportedCurrencies[];
  locale: SupportedLocales;
  locales: SupportedLocales[];
} = {
  currency: "EUR",
  currencies: [
    "AED",
    "ALL",
    "AUD",
    "CHF",
    "CNY",
    "DKK",
    "EUR",
    "GBP",
    "HRK",
    "HUF",
    "IDR",
    "ISK",
    "JPY",
    "MAD",
    "MYR",
    "NOK",
    "PHP",
    "PLN",
    "SEK",
    "SGD",
    "THB",
    "TRY",
    "USD",
    "VND",
  ],
  locale: "en-IE",
  locales: [
    "da-DK",
    "de-DE",
    "en-GB",
    "en-IE",
    "en-US",
    "es-ES",
    "fr-FR",
    "fr-MA",
    "is-IS",
    "it-IT",
    "ms-MY",
    "nb-NO",
    "pl-PL",
    "pt-PT",
    "sv-SE",
    "th-TH",
    "tr-TR",
    "zh-CN",
  ],
};
