import { getCurrency } from '@coras-io/embed/helpers';
import { createCorasRouting, createCorasUrlState } from '@coras-io/embed/url';
import brand from '../brand.json';
import ENV from './config/environment';

/**
 * @import { CorasChrome, CorasConfig } from '@coras-io/embed'
 * @import RouterService from '@ember/routing/router-service'
 */

const theme = /** @type {CorasConfig['theme']} */ (brand);

export const logo = document.createElement('img');
logo.src = brand.logo;
logo.alt = 'Coras';

/** @type {CorasChrome} */
export const corasChrome = {
  navbar: { use: 'managed', slots: { brand: logo } },
  footer: 'managed',
};

export const DEFAULT_LOCALE = 'en-IE';

/**
 * The currency a URL without one means: the locale's.
 * @param {string} [locale]
 */
export function defaultCurrency(locale = DEFAULT_LOCALE) {
  return getCurrency(locale);
}

// The URL shape the Coras hosts share, and the one we recommend: a lower-case
// locale segment and the currency as a query param only when it is not the
// locale's default. The SDK default (`/en-IE/EUR/...`) and any other strategy
// stay available.
export const corasUrl = createCorasUrlState({
  localeCase: 'lower',
  currencyInPath: false,
  defaultCurrency,
});

/**
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
 * The routing mount options bound to Ember's router: a navigation transitions,
 * an in-page change replaces the current entry.
 * @param {RouterService} router
 */
export function corasRouting(router) {
  return createCorasRouting({
    url: corasUrl,
    navigate: (href) => router.transitionTo(href),
    replace: (href) => router.replaceWith(href),
  });
}
