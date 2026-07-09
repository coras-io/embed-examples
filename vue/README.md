# Coras Embed - Vue example

A working [Vue 3](https://vuejs.org) integration of the Coras embeddable
ticketing SDK (`@coras-io/embed`). The SDK is mounted once with `mount()`, the
host owns routing through [Vue Router](https://router.vuejs.org), and navigation
updates the mounted app in place instead of remounting it.

Clone it, run it, and adapt the pattern to your own app - every framework uses
the same `mount()` / `update()` / `unmount()` API.

## Run it

```sh
pnpm install
pnpm dev
```

That's it - the example ships pointed at the public Coras sandbox and CDN, so it
renders real content with no configuration. Open the URL Vite prints; the root
path redirects to `/:locale/:currency` and renders the Coras landing page inside
the SDK chrome.

To point at a different backend, copy `.env.example` to `.env` and fill in any of
the values (all optional):

| Variable              | Default                                  | Purpose                                       |
| --------------------- | ---------------------------------------- | --------------------------------------------- |
| `VITE_API_HOST`       | `https://sandbox.coras.io`               | Coras API origin, passed as `apiUrl`.         |
| `VITE_DISTRIBUTOR_ID` | the shared example distributor           | Passed to the SDK as `distributorId`.         |
| `VITE_ASSETS_URL`     | `https://assets.sandbox.coras.io/shared` | SDK shared-asset base, passed as `assetsUrl`. |
| `VITE_ALLOWED_HOSTS`  | -                                        | Comma-separated hosts for the dev server.     |

## What it demonstrates

- A single persistent `mount()` for every page under `/:locale/:currency`. Route
  changes call `app.update()`, so the navbar, footer, and chrome stay in place
  and only the page content swaps.
- Host-owned routing: the SDK reports navigation intent through `onNavigate` and
  `onStateChange`, and the app maps those to Vue Router navigations (`push` for a
  link, `replace` for an in-page state change).
- Reading the current page and params from the URL with the SDK URL helper, then
  feeding them back into `mount()` / `update()` - so deep links and back/forward
  work.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` - the SDK themes only from `config.theme`, never from the API.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option.
- Locale and currency detection on first load.

## How the integration fits together

| File                                                                       | Role                                                                    |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`src/CorasMount.vue`](src/CorasMount.vue)                                 | Vue wrapper over `mount()` / `update()` / `unmount()`.                  |
| [`src/views/LocaleCurrencyLayout.vue`](src/views/LocaleCurrencyLayout.vue) | Layout holding the single persistent mount for all pages.               |
| [`src/coras.ts`](src/coras.ts)                                             | Builds the SDK config and chrome, and the shared URL strategy.          |
| [`src/router.ts`](src/router.ts)                                           | Vue Router setup: locale detection and the `/:locale/:currency` routes. |
| [`src/config.ts`](src/config.ts)                                           | Supported locales and currencies, and site defaults.                    |
| [`brand.json`](brand.json)                                                 | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.   |

## Build

```sh
pnpm build     # vue-tsc -b + vite build
pnpm preview   # serve the production bundle
```
