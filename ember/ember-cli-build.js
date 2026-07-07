'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { builtinModules } = require('node:module');

// The SDK (@coras-io/embed) is a modern ESM package whose `exports` map only
// defines the `import` condition; ember-auto-import's webpack must be told to
// use it. Its optional wallet/crypto stack (@coinbase/cdp-core) also reaches
// Node-oriented code that references Node builtins the browser lacks — dead code
// in a browser build. Stub those to empty, matching what Vite tree-shakes for
// the other examples.
const nodeBuiltinFallbacks = Object.fromEntries(
  builtinModules.flatMap((m) => [
    [m, false],
    [`node:${m}`, false],
  ]),
);

// The SDK's optional wallet/crypto stack (@coinbase/cdp-core) pulls React (via
// zustand) and x402-fetch. These are lazy paths the ticketing example never
// reaches, and a non-React clone won't have them installed — stub them empty so
// the strict webpack build resolves, exactly as Vite tree-shakes them for the
// other examples.
const optionalSdkPeers = {
  react: false,
  'react-dom': false,
  'x402-fetch': false,
};

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      webpack: {
        resolve: {
          conditionNames: ['import', '...'],
          fallback: { ...nodeBuiltinFallbacks, ...optionalSdkPeers },
        },
      },
    },
  });

  return app.toTree();
};
