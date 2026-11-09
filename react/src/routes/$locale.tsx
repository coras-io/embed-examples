import { useEffect, useMemo } from "react";
import * as v from "valibot";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import type {
  CorasPageParamsByPage,
  CorasPaymentStatusDetail,
  CorasReservationCreatedDetail,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { config } from "../config.ts";
import { CorasMount } from "../CorasMount.tsx";
import { withStoredLocation } from "../last-location.ts";
import {
  buildConfig,
  corasChrome,
  corasRouting,
  corasUrl,
  defaultCurrency,
  logo,
  siteLocale,
} from "../utils.ts";

const searchParamsSchema = v.object({
  currency: v.fallback(v.optional(v.picklist(config.currencies)), undefined),
});

export const Route = createFileRoute("/$locale")({
  component: LocaleLayout,
  // Never throws: parse runs before beforeLoad, so a bad locale falls back.
  params: {
    parse: ({ locale }) => ({ locale: siteLocale(locale) }),
    stringify: ({ locale }) => ({ locale: locale.toLowerCase() }),
  },
  validateSearch: searchParamsSchema,
});

function LocaleLayout() {
  const { locale } = Route.useParams();
  const { currency = defaultCurrency(locale) } = Route.useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const routing = useMemo(() => corasRouting(navigate), [navigate]);

  const { page, params } = corasUrl.parse(location.href);
  const resolvedParams =
    page === "landing" ? withStoredLocation(params) : params;

  useEffect(() => {
    const goToLanding = () =>
      navigate({
        to: "/$locale",
        params: { locale },
        resetScroll: true,
      });
    logo.addEventListener("click", goToLanding);
    return () => logo.removeEventListener("click", goToLanding);
  }, [navigate, locale, currency]);

  const onReservationCreated = (detail: CorasReservationCreatedDetail) => {
    console.info("Reservation created:", detail);
  };

  const onPaymentStatus = (detail: CorasPaymentStatusDetail) => {
    console.info("Payment status:", detail.status, detail.reference);
  };

  return (
    <>
      <CorasMount
        page={page}
        params={resolvedParams as CorasPageParamsByPage[typeof page]}
        chrome={corasChrome}
        config={buildConfig(
          locale as SupportedLocales,
          currency as SupportedCurrencies,
        )}
        {...routing}
        onReservationCreated={onReservationCreated}
        onPaymentStatus={onPaymentStatus}
      />
      <Outlet />
    </>
  );
}
