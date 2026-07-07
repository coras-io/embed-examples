import type { NavigateFn } from "@tanstack/react-router";
import type {
  CorasChrome,
  CorasConfig,
  CorasNavigateDetail,
  CorasStateChangeDetail,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import { createCorasUrlState } from "@coras-io/embed/url";
import { config } from "./config.ts";
import { setLastLocation } from "./last-location.ts";
import theme from "../brand.json";

// The shared demo identity. brand.json — imported here as the SDK `config.theme`
// — owns the colours, fonts, and logo, so the embedded pages take their look
// from it, not the SDK's built-in defaults. Every framework example ships the
// same file, and its assets load from the public Coras CDN, so a fresh clone
// renders with no local setup.
export const site = {
  distributorId: "a8405267cbcf4bd2b70114e618516645",
  title: "Coras",
  logo: theme.logo,
  detectLocale: true,
  detectCurrency: true,
};

// Host-owned logo, projected into the SDK navbar's `brand` slot. Built once and
// reused: only one page is mounted at a time, so the SDK moves this element
// between navbars on navigation.
// Exported so the layout route can wire its click to "go to landing".
export const logo = document.createElement("img");
logo.src = site.logo;
logo.alt = site.title;
// No sizing needed: the managed navbar sizes a slotted brand logo by height
// (see --navbar-logo-height). Set CSS on this element only to override.

/** SDK chrome: the Coras navbar (with our logo) and footer. */
export const corasChrome: CorasChrome = {
  navbar: { use: "managed", slots: { brand: logo } },
  footer: "managed",
};

// Default strategy: locale + currency in the path, details as a bare id segment
// — matching this app's TanStack routes. Exported so the layout route can derive
// the current page + params straight from the URL for a single persistent mount.
export const corasUrl = createCorasUrlState();

/** Build the SDK config for the current route's locale/currency. */
export function buildConfig(
  locale: SupportedLocales,
  currency: SupportedCurrencies,
): CorasConfig {
  return {
    apiUrl: import.meta.env.VITE_API_HOST || "https://sandbox.coras.io",
    distributorId: import.meta.env.VITE_DISTRIBUTOR_ID || site.distributorId,
    assetsUrl:
      import.meta.env.VITE_ASSETS_URL || "https://assets.sandbox.coras.io/shared",
    theme: theme as CorasConfig["theme"],
    locale,
    allowedLocales: config.locales,
    currency,
    allowedCurrencies: config.currencies,
    loyaltyPointsEnabled: true,
  };
}

function toTanStackTarget(
  page: CorasNavigateDetail["page"],
  params: Record<string, unknown> | undefined,
  locale: string,
  currency: string,
) {
  const href = corasUrl.build({
    page,
    params: (params ?? {}) as never,
    locale: locale as SupportedLocales,
    currency: currency as SupportedCurrencies,
  });
  const url = new URL(href, window.location.origin);
  return {
    to: url.pathname,
    search: Object.fromEntries(url.searchParams.entries()),
  };
}

/** Host owns routing: map a navigation intent to a TanStack navigation. */
export async function handleNavigate(
  navigate: NavigateFn,
  intent: CorasNavigateDetail,
): Promise<void> {
  if (intent.href) {
    window.open(intent.href, "_blank", "noopener,noreferrer");
    return;
  }

  const { to, search } = toTanStackTarget(
    intent.page,
    intent.params as Record<string, unknown> | undefined,
    intent.locale ?? config.locale,
    intent.currency ?? config.currency,
  );

  await navigate({ to, search: () => search, resetScroll: true });
}

/** Reflect an in-page state change in the URL without adding history entries. */
export async function handleStateChange(
  navigate: NavigateFn,
  state: CorasStateChangeDetail,
): Promise<void> {
  // Remember the landing-page location so a later return without country/city
  // in the URL restores the user's last selection instead of geolocating.
  if (state.page === "landing") {
    const params = state.params as
      | { country?: string; city?: string }
      | undefined;
    if (params?.country || params?.city) {
      setLastLocation({ country: params.country, city: params.city });
    }
  }

  const { to, search } = toTanStackTarget(
    state.page,
    state.params as Record<string, unknown> | undefined,
    state.locale ?? config.locale,
    state.currency ?? config.currency,
  );

  await navigate({ to, search: () => search, replace: true });
}
