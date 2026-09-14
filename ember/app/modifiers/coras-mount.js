import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';
import { mount } from '@coras-io/embed';

/**
 * @import { CorasApp } from '@coras-io/embed'
 */

export default class CorasMount extends Modifier {
  /** @type {CorasApp | null} */
  #app = null;
  /** @type {Record<string, unknown>} */
  #args = {};

  modify(element, _positional, named) {
    this.#args = named;

    if (this.#app) {
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
