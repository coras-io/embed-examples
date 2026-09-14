import type { SupportedCurrencies, SupportedLocales } from "@coras-io/embed";

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
