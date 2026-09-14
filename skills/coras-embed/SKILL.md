---
name: coras-embed
description: Integrate the Coras embeddable ticketing SDK (@coras-io/embed) into a web app by porting a working framework example instead of writing the integration from scratch. Use when asked to add Coras, Coras Embed, or Coras ticketing pages (landing, search, details, payment, help) to a site, to embed Coras under a route of an existing app, or to fix routing, theming, or mounting in such an integration.
---

# Coras Embed integration

## Principle: port, do not synthesize

Every framework example in this repository is a complete, working Coras
integration that is built and deployed on every SDK release. Copy the example
that matches the target framework and mode, change the values listed in its
`AGENTS.md`, and keep everything else. Do not rewrite the routing glue, the
mount lifecycle, or the URL handling from a description: that is where
integrations written from scratch have failed.

## Pick the example

| Target                                | Standalone (Coras is the site)               | Embedded (Coras under a route of your app)                           |
| ------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| Vanilla JS / TS, Alpine, Lit, other   | `js`                                         | `embedded`                                                           |
| React (any router)                    | `react`                                      | `react` for the wrapper, `embedded` for the base path and `chrome`   |
| Next.js (App Router)                  | `next-embedded` with managed chrome, no base | `next-embedded`                                                      |
| Vue / Nuxt                            | `vue`                                        | `vue` for the wrapper, `embedded` for the base path and `chrome`     |
| Svelte / SvelteKit                    | `svelte`                                     | `svelte` for the wrapper, `embedded` for the base path and `chrome`  |
| Astro                                 | `astro`                                      | `embedded` inside an Astro client script                             |
| Angular                               | `angular`                                    | `angular` for the wrapper, `embedded` for the base path and `chrome` |
| Ember                                 | `ember`                                      | `ember` for the wrapper, `embedded` for the base path and `chrome`   |
| Solid or a framework without an entry | `js` glue inside the framework's lifecycle   | `embedded` glue inside the framework's lifecycle                     |

Standalone means the SDK renders the whole page (its navbar and footer) and
owns the viewport. Embedded means your app keeps its own navbar, footer, and
routing, and Coras renders page content only into one region under a base
path such as `/tickets`.

## Port it

1. Read the chosen example's `AGENTS.md`. It lists the files to copy, the
   values to change, and the demo-only extras to skip.
2. Copy the listed files into your project, keeping their roles: one module for
   config, chrome, and the URL strategy; one wrapper or entry that owns the
   single mount; the route declarations.
3. Replace the values: `distributorId`, `apiUrl`, `assetsUrl`, the default and
   allowed locales and currencies, `brand.json`, the logo alt text, and (when
   embedded) the base path. Nothing else changes.
4. Declare the routes the example declares, in your router's syntax. The URL
   shape is fixed by the SDK's URL helpers and the strategy in the config
   module; the router must match it, never the other way round.
5. Build, then verify (below).

If the framework has no example, copy the `js` (or `embedded`) glue verbatim
and place its four parts in the framework's lifecycle: create the mount after
the container element exists, call `app.update()` from the router's
route-change hook, call `app.unmount()` on teardown, and turn the
`history.pushState` / `history.replaceState` calls into the router's push and
replace.

## The contract

These hold in every example. Keep them in every port.

- **One persistent mount** per Coras subtree. Route changes call
  `app.update({ page, params, config })`; `app.unmount()` runs only when the
  subtree itself unmounts. Never mount during server-side rendering and never
  twice into the same element.
- **The host owns the URL.** Bind the helpers once with
  `createCorasUrlState(strategy)` and use them for every parse and build.
  `onNavigate` pushes a history entry; `onStateChange` replaces the current one
  (filters, dates, the search query, the help tab). A detail carrying `href`
  is an external link: open it in a new tab and stop. Never hand-roll a path.
- **Locale and currency.** Standalone: in the path (`/:locale/:currency/...`,
  the SDK default strategy); read them from the URL into `config` on every
  update, because the mount switches language and currency only through
  `config`. Embedded: fixed in `config` and kept out of the path with
  `localeInPath: false, currencyInPath: false` and a `basePath`.
- **The router matches the helpers.** Landing is the subtree root; `search`,
  `payment`, `help` are reserved segments; a details page is a bare id
  segment; page params travel as query parameters. Declare every query param
  a page reads on its route: typed routers such as TanStack drop undeclared
  search params. The list is in `references/pages.md`.
- **Validate locale and currency leniently.** Fall back to your default; never
  throw. A typed router runs its param parser before its route guards, so a
  redirect declared in a guard never fires and the visitor gets the router's
  error screen (in TanStack, `params.parse` runs ahead of `beforeLoad`). Parse
  the resolved path, not the raw one: the helpers read the first segment they
  do not recognise as a details id, so an unsupported locale renders the wrong
  page rather than the fallback one.
- **Theme only from `brand.json`,** passed once as `config.theme`. Never write
  CSS against Coras content or recreate the brand by hand. The file is
  imported as a JSON module; enable `resolveJsonModule` if the project lacks
  it.
- **Chrome by mode.** Standalone: managed navbar and footer, the mount owns the
  viewport, and any starter-template CSS (a centered or max-width root, demo
  colour variables) is removed. Embedded: `chrome: false`, the mount sits in
  the host's content region, no full-bleed reset. See `references/chrome.md`.
- **The host styles only its own elements.** The mount and the page inside it
  lay themselves out, so a managed footer reaches the bottom with no rule that
  names a Coras element. Those names are internal and change without a major
  version, so a selector such as `coras-landing-page` or `coras-footer` in host
  CSS is a defect, not a workaround. Standalone hosts need the full-bleed reset
  on `html`, `body` and their own container, and nothing else; where a framework
  wrapper sits between that container and the mount (a React
  `<div ref={containerRef} />`, say), give it `display: contents`.
- **Errors surface** through `onError` and `APIError` from
  `@coras-io/embed/errors`. Import only the documented entry points:
  `@coras-io/embed`, `@coras-io/embed/url`, `@coras-io/embed/helpers`,
  `@coras-io/embed/errors`.
- **`strict: true` while developing.** It rejects unknown options and logs
  diagnostics (unreachable assets, an unthemed brand, a constrained
  container). They are warnings, not failures.

## Verify

Keep this to one pass. Do not install a browser, Playwright, Puppeteer, or
test tooling for it, and do not write tests.

1. Build and typecheck; fix every error.
2. Check the routes statically against the example: every route pattern exists
   in the router, a details id is one path segment, every listed query param is
   declared, and `onNavigate`, `onStateChange`, and the route-change hook are
   wired to the one mount.
3. Start the dev server and confirm it serves the page without errors. If a
   browser is already available, walk it once: open the landing route, pick an
   attraction (the URL becomes the details route and only the page content
   swaps), press back, then open the search route with `?search=museum`
   directly and change a filter (the URL follows without a new history entry).
   Stop the server.

The public sandbox (`https://sandbox.coras.io`, distributor
`a8405267cbcf4bd2b70114e618516645`, assets at
`https://assets.sandbox.coras.io/shared`) needs no key and returns live demo
data. If a request fails against it, the cause is the integration (a mount
during SSR, wrong `page` or `params`, a `config` not reused), never the
connection.

## Done when

- The project builds and typechecks, and the dev server starts clean.
- One persistent mount drives every Coras page through `app.update()`.
- Every URL goes through the bound helpers with the example's strategy.
- `onNavigate` pushes, `onStateChange` replaces, `href` opens externally, and
  locale and currency reach `config`.
- One route per page in the example's shape, with its query params declared.
- `brand.json` is the only source of styling.

## References

- `references/pages.md`: every page, its route segment, and its params.
- `references/chrome.md`: navbar and footer options, slots, `chrome: false`.
- Full documentation: <https://embed.coras.io/> (plain text for assistants at
  <https://embed.coras.io/llms-full.txt>).
