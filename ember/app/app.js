import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';
import config from 'coras-example/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
