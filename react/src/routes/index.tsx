import { createFileRoute } from "@tanstack/react-router";
import { getLocale } from "@coras-io/embed/helpers";
import { redirect } from "@tanstack/react-router";
import { config } from "../config.ts";
import { site } from "../utils.ts";

// The currency is the locale's default, so the URL does not name it.
export const Route = createFileRoute("/")({
  loader: async () => {
    const locale = site.detectLocale ? getLocale() : config.locale;

    redirect({
      to: "/$locale",
      params: { locale },
      throw: true,
      statusCode: 307,
      replace: true,
    });
  },
});
