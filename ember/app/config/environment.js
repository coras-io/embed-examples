import loadConfigFromMeta from '@embroider/config-meta-loader';

// The build serialises `config/environment.js` into a meta tag; read it back at
// runtime under the app's module prefix.
export default loadConfigFromMeta('coras-example');
