import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import {
  buildConfig,
  corasChrome,
  corasUrl,
  handleNavigate,
  handleStateChange,
} from '../coras';

/**
 * Holds the single persistent mount for every page under `/:locale/:currency`.
 * The page, params, locale, and currency are derived straight from the URL, so
 * navigating between child routes (or using back/forward) recomputes them and
 * updates the mount in place — the navbar, footer, and chrome stay put and only
 * the page content swaps.
 */
export default class EmbedController extends Controller {
  @service router;

  chrome = corasChrome;

  // `router.currentURL` is tracked, so these getters recompute on every
  // transition and re-render the mount's arguments (driving `app.update()`).
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
    return buildConfig(this.state.locale ?? 'en-IE', this.state.currency ?? 'EUR');
  }

  @action
  onNavigate(intent) {
    handleNavigate(this.router, intent);
  }

  @action
  onStateChange(state) {
    handleStateChange(this.router, state);
  }
}
