import { createCorasUrlState } from '@coras-io/embed/url';
import brand from '../brand.json';
import ENV from './config/environment';

/**
 * @import { CorasChrome, CorasConfig, CorasNavigateDetail, CorasStateChangeDetail } from '@coras-io/embed'
 * @import RouterService from '@ember/routing/router-service'
 */

// The shared demo identity, passed to the SDK as `config.theme` - colours,
// fonts, and logo, with assets served from the public Coras CDN so a fresh
// clone renders with no local setup. `brand.json` is the canonical file every
// framework example ships; the Vite build imports it directly here.
const theme = /** @type {CorasConfig['theme']} */ (brand);

// Host-owned logo, projected into the SDK navbar's `brand` slot. The SDK moves
// this one element between navbars on navigation (only one page is mounted).
const logo = document.createElement('img');
logo.src = brand.logo;
logo.alt = 'Coras';

/**
 * SDK chrome: the managed Coras navbar (with our logo) and footer.
 * @type {CorasChrome}
 */
export const corasChrome = {
  navbar: { use: 'managed', slots: { brand: logo } },
  footer: 'managed',
};

// Locale + currency in the path, details as a bare id segment (the SDK default).
// Shared so build and parse always agree on the shape of a URL - and it matches
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
    theme,
    locale,
    currency,
    loyaltyPointsEnabled: true,
  };
}

/**
 * Host owns routing: turn a navigation intent into a real Ember transition. An
 * external `href` opens in a new tab; otherwise build a canonical URL and push
 * it. The URL change feeds back into `app.update()` - which does not re-emit
 * `onNavigate` - so there is no loop.
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
