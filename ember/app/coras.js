import { createCorasUrlState } from '@coras-io/embed/url';
import ENV from 'coras-example/config/environment';

/**
 * @import { CorasChrome, CorasConfig, CorasNavigateDetail, CorasStateChangeDetail } from '@coras-io/embed'
 * @import RouterService from '@ember/routing/router-service'
 */

// The shared demo identity. This object — passed to the SDK as `config.theme` —
// owns the colours, fonts, and logo, and its assets load from the public Coras
// CDN, so a fresh clone renders with no local setup.
//
// It is a VERBATIM copy of `brand.json` at the app root (the canonical file every
// framework example ships). Ember's classic build does not import JSON from the
// app tree, so the same values are inlined here; edit `brand.json` and mirror it.
const theme = {
  schemaVersion: 1,
  primary: '#4657d4',
  secondary: '#161c44',
  textButton: '#ffffff',
  font: 'Inter, sans-serif',
  logo: 'https://assets.sandbox.coras.io/brands/8cffaf2d-26d2-4c84-bb1d-3f417e0cb8c1/assets/images/logo.svg',
  success: '#00ad8f',
  error: '#c9224a',
};

const site = {
  title: 'Coras',
};

// Host-owned logo, projected into the SDK navbar's `brand` slot. The SDK moves
// this one element between navbars on navigation (only one page is mounted).
const logo = document.createElement('img');
logo.src = theme.logo;
logo.alt = site.title;

/**
 * SDK chrome: the managed Coras navbar (with our logo) and footer.
 * @type {CorasChrome}
 */
export const corasChrome = {
  navbar: { use: 'managed', slots: { brand: logo } },
  footer: 'managed',
};

// Locale + currency in the path, details as a bare id segment (the SDK default).
// Shared so build and parse always agree on the shape of a URL — and it matches
// the Ember router map in `app/router.js`.
export const corasUrl = createCorasUrlState();

/**
 * The SDK config for the current route's locale/currency. Every value has a
 * public default (from `config/environment.js`), so no env is required.
 * @param {string} locale
 * @param {string} currency
 * @returns {CorasConfig}
 */
export function buildConfig(locale, currency) {
  return {
    apiUrl: ENV.coras.apiUrl,
    distributorId: ENV.coras.distributorId,
    assetsUrl: ENV.coras.assetsUrl,
    theme: /** @type {CorasConfig['theme']} */ (theme),
    locale,
    currency,
    loyaltyPointsEnabled: true,
  };
}

/**
 * Host owns routing: turn a navigation intent into a real Ember transition. An
 * external `href` opens in a new tab; otherwise build a canonical URL and push
 * it. The URL change feeds back into `app.update()` — which does not re-emit
 * `onNavigate` — so there is no loop.
 * @param {RouterService} router
 * @param {CorasNavigateDetail} intent
 */
export function handleNavigate(router, intent) {
  if (intent.href) {
    window.open(intent.href, '_blank', 'noopener,noreferrer');
    return;
  }
  router.transitionTo(hrefFor(intent));
}

/**
 * Reflect an in-page state change in the URL without adding a history entry.
 * @param {RouterService} router
 * @param {CorasStateChangeDetail} state
 */
export function handleStateChange(router, state) {
  if (state.href) {
    window.open(state.href, '_blank', 'noopener,noreferrer');
    return;
  }
  router.replaceWith(hrefFor(state));
}

/**
 * @param {CorasNavigateDetail | CorasStateChangeDetail} detail
 * @returns {string}
 */
function hrefFor(detail) {
  return corasUrl.build({
    page: detail.page,
    params: detail.params ?? {},
    locale: detail.locale,
    currency: detail.currency,
  });
}
