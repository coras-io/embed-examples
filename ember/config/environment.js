'use strict';

// Build-time config. Optional backend overrides are read from the shell
// environment here (Ember's config is a plain Node module, evaluated during the
// Embroider build), each falling back to a public default so a fresh clone runs
// with ZERO configuration against the Coras sandbox + CDN. These values are
// serialised into a meta tag and read back at runtime by `app/config/environment.js`.
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
        process.env.CORAS_DISTRIBUTOR_ID || 'a8405267cbcf4bd2b70114e618516645',
      assetsUrl:
        process.env.CORAS_ASSETS_URL || 'https://assets.sandbox.coras.io/shared',
    },
  };

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
