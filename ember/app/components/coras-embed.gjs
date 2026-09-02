import Component from '@glimmer/component';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import CorasMount from '../modifiers/coras-mount';
import {
  buildConfig,
  corasChrome,
  corasUrl,
  handleNavigate,
  handleStateChange,
  logo,
} from '../coras';

/**
 * @import RouterService from '@ember/routing/router-service'
 */

/**
 * Holds the single persistent mount for every page under `/:locale/:currency`.
 * The page, params, locale, and currency are derived straight from the URL, so
 * navigating between child routes (or using back/forward) recomputes them and
 * updates the mount in place - the navbar, footer, and chrome stay put and only
 * the page content swaps.
 */
export default class CorasEmbed extends Component {
  /** @type {RouterService} */
  @service router;

  chrome = corasChrome;

  constructor(...args) {
    super(...args);
    // The navbar logo is a home link. A slotted brand element owns its own
    // navigation, so wire its click to the landing page for the current
    // locale/currency; remove the listener when the component is torn down.
    logo.addEventListener('click', this.goToLanding);
    registerDestructor(this, () =>
      logo.removeEventListener('click', this.goToLanding),
    );
  }

  goToLanding = () => {
    const { locale, currency } = this.state;
    handleNavigate(this.router, { page: 'landing', params: {}, locale, currency });
  };

  // `router.currentURL` is tracked, so this getter - and everything derived from
  // it - recomputes on every transition and drives `app.update()`.
  get state() {
    return corasUrl.parse(this.router.currentURL ?? '/');
  }

  get page() {
    return this.state.page;
  }

  get params() {
    return this.state.params;
  }

  get config() {
    const { locale, currency } = this.state;
    return buildConfig(locale ?? 'en-IE', currency ?? 'EUR');
  }

  onNavigate = (intent) => handleNavigate(this.router, intent);
  onStateChange = (state) => handleStateChange(this.router, state);

  <template>
    <div
      {{CorasMount
        page=this.page
        params=this.params
        config=this.config
        chrome=this.chrome
        onNavigate=this.onNavigate
        onStateChange=this.onStateChange
      }}
    ></div>
  </template>
}
