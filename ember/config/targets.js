'use strict';

// Modern evergreen browsers only — the SDK ships native web components and the
// app is client-only (no FastBoot/SSR).
const browsers = [
  'last 2 Chrome versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  'last 2 Edge versions',
];

module.exports = {
  browsers,
};
