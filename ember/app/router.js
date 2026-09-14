import EmberRouter from '@embroider/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('embed', { path: '/:locale/:currency' }, function () {
    this.route('search');
    this.route('help');
    this.route('payment');
    this.route('details', { path: '/:id' });
  });
});
