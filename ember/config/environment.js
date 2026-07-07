'use strict';

// Ember has no `import.meta.env`. Optional backend overrides are read here from
// the shell environment at build time, each falling back to a public default so
// a fresh clone runs with ZERO configuration against the Coras sandbox + CDN.
module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'coras-example',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {},
    },

    APP: {},

    // Consumed by app/coras.js when building the SDK config.
    coras: {
      apiUrl: process.env.CORAS_API_HOST || 'https://sandbox.coras.io',
      distributorId:
        process.env.CORAS_DISTRIBUTOR_ID ||
        'a8405267cbcf4bd2b70114e618516645',
      assetsUrl: process.env.CORAS_ASSETS_URL || 'https://assets.sandbox.coras.io/shared',
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
