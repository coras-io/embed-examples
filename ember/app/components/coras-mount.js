import Component from '@glimmer/component';
import { action } from '@ember/object';
import { mount } from '@coras-io/embed';

/**
 * @import { CorasApp } from '@coras-io/embed'
 */

/**
 * Thin Ember wrapper around the SDK `mount()` contract. It mounts once when its
 * element is inserted, updates the app in place when `page`/`params`/`config`
 * change, and tears the app down when destroyed. Callbacks are read from `args`
 * on every call, so the latest handler always runs.
 *
 * This is host integration code, not a published wrapper: every framework uses
 * the same `mount()` / `update()` / `unmount()` API.
 */
export default class CorasMount extends Component {
  /** @type {CorasApp | null} */
  app = null;

  // Mount once, after the DOM exists (client-only — the SDK renders web
  // components in the browser; there is no FastBoot/SSR here).
  @action
  insert(element) {
    this.app = mount({
      container: element,
      page: this.args.page,
      params: this.args.params,
      config: this.args.config,
      chrome: this.args.chrome,
      onNavigate: (intent) => this.args.onNavigate?.(intent),
      onStateChange: (state) => this.args.onStateChange?.(state),
    });
  }

  // Reflect page/params/config changes without remounting. Wired to the args in
  // the template, so a route change (link or back/forward) re-runs this.
  @action
  update() {
    this.app?.update({
      page: this.args.page,
      params: this.args.params,
      config: this.args.config,
    });
  }

  @action
  teardown() {
    this.app?.unmount();
    this.app = null;
  }
}
