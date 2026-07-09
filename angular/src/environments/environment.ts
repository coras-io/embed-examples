/**
 * Optional deployment overrides. Every value is empty by default, so a fresh
 * clone runs against the public Coras sandbox + CDN with zero configuration -
 * the public defaults live in `app/coras.ts` and are applied with `|| default`.
 *
 * Angular has no `import.meta.env`, so to point at a different backend either
 * fill these in, or wire up Angular's `fileReplacements` to swap this file for a
 * per-environment copy at build time.
 */
export const environment = {
  apiHost: "",
  distributorId: "",
  assetsUrl: "",
};
