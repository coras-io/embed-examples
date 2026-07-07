import { useEffect } from "react";
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
  corasUrl,
  handleNavigate,
  handleStateChange,
  logo,
} from "../utils.ts";

const routeParamsSchema = v.object({
  locale: v.optional(v.picklist(config.locales), config.locale),
  currency: v.optional(v.picklist(config.currencies), config.currency),
});

export const Route = createFileRoute("/$locale/$currency")({
  component: LocaleCurrencyLayout,
  params: { parse: (rawParams) => v.parse(routeParamsSchema, rawParams) },
});

/**
 * Single persistent mount for every page under `/:locale/:currency`. The page
 * and params are derived from the URL so navigation between child routes updates
 * the mount in place (`app.update()`) instead of tearing it down — the navbar,
 * footer, and chrome stay put and only the page content swaps.
 */
function LocaleCurrencyLayout() {
  const { locale, currency } = Route.useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { page, params } = corasUrl.parse(location.href);
  // On landing, restore the previously stored country/city when the URL
  // carries neither — URL-supplied values always win.
  const resolvedParams =
    page === "landing" ? withStoredLocation(params) : params;

  // The navbar logo (host-owned DOM) returns to the landing page on click.
  useEffect(() => {
    const goToLanding = () =>
      navigate({
        to: "/$locale/$currency",
        params: { locale, currency },
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
        onNavigate={(intent) => handleNavigate(navigate, intent)}
        onStateChange={(state) => handleStateChange(navigate, state)}
        onReservationCreated={onReservationCreated}
        onPaymentStatus={onPaymentStatus}
      />
      <Outlet />
    </>
  );
}
