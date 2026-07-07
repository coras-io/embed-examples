# Coras Embed — React example

A working [React](https://react.dev) integration of the Coras embeddable
ticketing SDK (`@coras-io/embed`). The SDK is mounted once with `mount()`, the
host owns routing through [TanStack Router](https://tanstack.com/router), and
navigation updates the mounted app in place instead of remounting it.

Clone it, run it, and adapt the pattern to your own app — every framework uses
the same `mount()` / `update()` / `unmount()` API.

## Run it

```sh
pnpm install
pnpm dev
```

That's it — the example ships pointed at the public Coras sandbox and CDN, so it
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
| `VITE_ALLOWED_HOSTS`  | —                                        | Comma-separated hosts for the dev server.     |

## What it demonstrates

- A single persistent `mount()` for every page under `/:locale/:currency`. Route
  changes call `app.update()`, so the navbar, footer, and chrome stay in place
  and only the page content swaps.
- Host-owned routing: the SDK reports navigation intent through `onNavigate` and
  `onStateChange`, and the app maps those to TanStack Router navigations.
- Reading the current page and params from the URL with the SDK URL helper, then
  feeding them back into `mount()` / `update()`.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` — the SDK themes only from `config.theme`, never from the API.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option.
- Locale and currency detection on first load.

## How the integration fits together

| File                                                                   | Role                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`src/CorasMount.tsx`](src/CorasMount.tsx)                             | React wrapper over `mount()` / `update()` / `unmount()`.                             |
| [`src/routes/$locale.$currency.tsx`](src/routes/$locale.$currency.tsx) | Layout route holding the single persistent mount for all pages.                      |
| [`src/utils.ts`](src/utils.ts)                                         | Builds the SDK config and chrome, and maps SDK navigation intent to TanStack Router. |
| [`src/config.ts`](src/config.ts)                                       | Supported locales and currencies, and site defaults.                                 |
| [`brand.json`](brand.json)                                             | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.                |
| [`src/main.tsx`](src/main.tsx)                                         | App entry and router setup.                                                          |

## Build

```sh
pnpm build     # tsc -b + vite build
pnpm preview   # serve the production bundle
```
