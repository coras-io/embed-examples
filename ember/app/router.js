import EmberRouter from '@ember/routing/router';
import config from 'coras-example/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// Every embedded page lives under `/:locale/:currency`, so the SDK's locale and
// currency are part of the URL. One persistent mount (in `embed.hbs`) serves the
// index (landing) and every child route; the child routes only own their URL
// segment — the mounted app reads the URL and updates itself in place.
Router.map(function () {
  this.route('embed', { path: '/:locale/:currency' }, function () {
    this.route('search');
    this.route('help');
    this.route('payment');
    // A bare id segment is the SDK's default shape for a details page.
    this.route('details', { path: '/:id' });
  });
});
