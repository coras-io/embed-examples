# Coras Embed - Angular example

A working [Angular](https://angular.dev) integration of the Coras embeddable
ticketing SDK (`@coras-io/embed`). The SDK is mounted once with `mount()`, the
host owns routing through [Angular Router](https://angular.dev/guide/routing),
and navigation updates the mounted app in place instead of remounting it.

Clone it, run it, and adapt the pattern to your own app - every framework uses
the same `mount()` / `update()` / `unmount()` API.

## Run it

```sh
pnpm install
pnpm dev
```

That's it - the example ships pointed at the public Coras sandbox and CDN, so it
renders real content with no configuration. Open the URL Angular prints; the root
path redirects to `/:locale/:currency` and renders the Coras landing page inside
the SDK chrome.

To point at a different backend, edit
[`src/environments/environment.ts`](src/environments/environment.ts) - Angular
has no `import.meta.env`, so this example takes its overrides from that file
(each value is optional and falls back to the public default):

| Field           | Default                                  | Purpose                                       |
| --------------- | ---------------------------------------- | --------------------------------------------- |
| `apiHost`       | `https://sandbox.coras.io`               | Coras API origin, passed as `apiUrl`.         |
| `distributorId` | the shared example distributor           | Passed to the SDK as `distributorId`.         |
| `assetsUrl`     | `https://assets.sandbox.coras.io/shared` | SDK shared-asset base, passed as `assetsUrl`. |

## What it demonstrates

- A single persistent `mount()` for every page under `/:locale/:currency`. Route
  changes call `app.update()`, so the navbar, footer, and chrome stay in place
  and only the page content swaps.
- Host-owned routing: the SDK reports navigation intent through `onNavigate` and
  `onStateChange`, and the app maps those to Angular Router navigations
  (`navigateByUrl` for a link, `replaceUrl: true` for an in-page state change).
- Reading the current page and params from the URL with the SDK URL helper, then
  feeding them back into `mount()` / `update()` - so deep links and back/forward
  work.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` - the SDK themes only from `config.theme`, never from the API.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option.
- Locale and currency detection on first load.

## How the integration fits together

| File                                                                                         | Role                                                                  |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [`src/app/coras-mount.component.ts`](src/app/coras-mount.component.ts)                       | Angular wrapper over `mount()` / `update()` / `unmount()`.            |
| [`src/app/locale-currency-layout.component.ts`](src/app/locale-currency-layout.component.ts) | Layout holding the single persistent mount for all pages.             |
| [`src/app/coras.ts`](src/app/coras.ts)                                                       | Builds the SDK config and chrome, and the shared URL strategy.        |
| [`src/app/app.routes.ts`](src/app/app.routes.ts)                                             | Router setup: locale detection and the `:locale/:currency` routes.    |
| [`src/app/config.ts`](src/app/config.ts)                                                     | Supported locales and currencies, and site defaults.                  |
| [`src/environments/environment.ts`](src/environments/environment.ts)                         | Optional backend overrides (Angular's stand-in for `.env`).           |
| [`brand.json`](brand.json)                                                                   | The theme (colours, fonts, logo) passed to the SDK as `config.theme`. |

## Notes on the Angular setup

- **Standalone components**, bootstrapped with `bootstrapApplication` - no
  `NgModule`.
- **Client-side SPA only** (the [application
  builder](https://angular.dev/tools/cli/build), `@angular-devkit/build-angular:application`,
  no SSR). The SDK renders web components in the browser, so the mount runs in
  `ngAfterViewInit`, never on a server. `CorasMountComponent` also declares
  `CUSTOM_ELEMENTS_SCHEMA`.
- The mount reads the current view from the URL on every `NavigationEnd`, so
  navigating between child routes updates the one mount in place rather than
  recreating it.

## Build

```sh
pnpm build     # ng build
pnpm preview   # serve with production optimizations
```

Both production scripts set `NG_BUILD_OPTIMIZE_CHUNKS=false`. Angular's
experimental chunk optimizer re-bundles the SDK's emitted chunks through Rollup,
which rejects a `super` reference in that output (`Invalid access to super`).
Disabling the pass only skips merging lazy chunks; it has no effect on behaviour.
