import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { mount } from '@coras-io/embed';

/**
 * @import { CorasApp } from '@coras-io/embed'
 */

/**
 * Element modifier wrapping the SDK `mount()` contract: it mounts once when the
 * element is inserted, calls `app.update()` in place whenever `page`, `params`,
 * or `config` change, and tears the app down when the element is destroyed.
 *
 * Callbacks are read from the latest args on every event, so navigation always
 * runs the current handler. This is host integration code, not a published
 * wrapper - every framework drives the same mount / update / unmount API.
 */
export default class CorasMount extends Modifier {
  /** @type {CorasApp | null} */
  #app = null;
  /** @type {Record<string, unknown>} */
  #args = {};

  modify(element, _positional, named) {
    // Keep the latest args so the callbacks below always call the current handler.
    this.#args = named;

    if (this.#app) {
      // Reading page/params/config here re-runs this on any of their changes.
      this.#app.update({
        page: named.page,
        params: named.params,
        config: named.config,
      });
      return;
    }

    this.#app = mount({
      container: element,
      strict: true,
      page: named.page,
      params: named.params,
      config: named.config,
      chrome: named.chrome,
      onNavigate: (intent) => this.#args.onNavigate?.(intent),
      onStateChange: (state) => this.#args.onStateChange?.(state),
    });

    registerDestructor(this, () => {
      this.#app?.unmount();
      this.#app = null;
    });
  }
}
