'use strict';

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
