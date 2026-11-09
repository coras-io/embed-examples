# Coras Embed - vanilla JS example

A working, framework-free integration of the Coras embeddable ticketing SDK
(`@coras-io/embed`). The SDK is mounted once with `mount()`, the host owns
routing through the browser History API, and navigation updates the mounted app
in place instead of remounting it.

This is the smallest possible host: no framework, no router library - just the
SDK and ~50 lines of glue. Every framework example wires up the same
`mount()` / `update()` / `unmount()` contract.

## Run it

```sh
pnpm install
pnpm dev
```

The example ships pointed at the public Coras sandbox and CDN, so it renders real
content with no configuration. Open the URL Vite prints.

To point at a different backend, copy `.env.example` to `.env` and fill in any of
the values (all optional): `VITE_API_HOST` (default `https://sandbox.coras.io`),
`VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL` (default
`https://assets.sandbox.coras.io/shared`), and `VITE_ALLOWED_HOSTS`
(comma-separated extra hosts for the dev server).

## What it demonstrates

- A single persistent `mount()` for every page. Route changes call
  `app.update()`, so the navbar, footer, and chrome stay in place and only the
  page content swaps.
- Host-owned routing with the History API: `createCorasRouting` from the SDK
  URL helper gives the mount its `hrefFor`, `onNavigate` and `onStateChange`;
  the app pushes or replaces the built URL and `popstate` feeds the URL back
  into `app.update()`. With `hrefFor` the embed's cards, breadcrumbs, logo and
  footer links render as real links.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme`.
- `strict: true` on the mount, so an unknown option or param key fails
  loudly here rather than being ignored.
- Projecting a host-owned logo into the SDK navbar `brand` slot.

## How the integration fits together

| File                           | Role                                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| [`src/main.ts`](src/main.ts)   | Mounts once and keeps the URL and the mounted app in sync.            |
| [`src/coras.ts`](src/coras.ts) | Builds the SDK config and chrome, and the shared URL strategy.        |
| [`brand.json`](brand.json)     | The theme (colours, fonts, logo) passed to the SDK as `config.theme`. |

## Build

```sh
pnpm build     # tsc + vite build
pnpm preview   # serve the production bundle
```
