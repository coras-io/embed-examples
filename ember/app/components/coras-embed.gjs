import Component from '@glimmer/component';
import { cached } from '@glimmer/tracking';
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
    handleNavigate(this.router, { page: 'landing', params: {}, locale, currency });
  };

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
    return buildConfig(locale ?? 'en-IE', currency ?? 'EUR');
  }

  onNavigate = (intent) => handleNavigate(this.router, intent);
  onStateChange = (state) => handleStateChange(this.router, state);

  <template>
    <div
      style="display: contents"
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
