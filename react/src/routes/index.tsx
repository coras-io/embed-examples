import { createFileRoute } from "@tanstack/react-router";
import { getLocale, getCurrency } from "@coras-io/embed/helpers";
import { redirect } from "@tanstack/react-router";
import { config } from "../config.ts";
import { site } from "../utils.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    const locale = site.detectLocale ? getLocale() : config.locale;
    const currency = site.detectCurrency
      ? getCurrency(locale)
      : config.currency;

    redirect({
      to: "/$locale/$currency",
      params: { locale, currency },
      throw: true,
      statusCode: 307,
      replace: true,
    });
  },
});
