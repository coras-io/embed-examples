import { createCorasUrlState } from '@coras-io/embed/url';
import brand from '../brand.json';
import ENV from './config/environment';

/**
 * @import { CorasChrome, CorasConfig, CorasNavigateDetail, CorasStateChangeDetail } from '@coras-io/embed'
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

export const corasUrl = createCorasUrlState();

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
 * @param {RouterService} router
 * @param {CorasStateChangeDetail} state
 */
export function handleStateChange(router, state) {
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
