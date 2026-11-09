import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import CorasMount from '../modifiers/coras-mount';
import {
  buildConfig,
  corasChrome,
  corasRouting,
  corasUrl,
  DEFAULT_LOCALE,
  defaultCurrency,
  logo,
} from '../coras';

/**
 * @import RouterService from '@ember/routing/router-service'
 */

export default class CorasEmbed extends Component {
  /** @type {RouterService} */
  @service router;

  chrome = corasChrome;

  constructor(...args) {
    super(...args);
    logo.addEventListener('click', this.goToLanding);
    registerDestructor(this, () =>
      logo.removeEventListener('click', this.goToLanding),
    );
  }

  goToLanding = () => {
    const { locale, currency } = this.state;
    this.routing.onNavigate({ page: 'landing', params: {}, locale, currency, source: 'host' });
  };

  @cached
  get routing() {
    return corasRouting(this.router);
  }

  @cached
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
    return buildConfig(locale ?? DEFAULT_LOCALE, currency ?? defaultCurrency(locale));
  }

  <template>
    <div
      style="display: contents"
      {{CorasMount
        page=this.page
        params=this.params
        config=this.config
        chrome=this.chrome
        hrefFor=this.routing.hrefFor
        onNavigate=this.routing.onNavigate
        onStateChange=this.routing.onStateChange
      }}
    ></div>
  </template>
}
