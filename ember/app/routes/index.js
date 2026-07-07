import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// The root path carries no locale/currency, so send it to the default embedded
// locale + currency. A deep link like `/en-IE/EUR/some-id` skips this and lands
// on the right page directly.
export default class IndexRoute extends Route {
  @service router;

  redirect() {
    this.router.replaceWith('/en-IE/EUR');
  }
}
