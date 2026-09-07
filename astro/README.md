# Coras Embed - Astro example

A working [Astro](https://astro.build) integration of the Coras embeddable
ticketing SDK (`@coras-io/embed`). The SDK is mounted once with `mount()`, the
host owns routing through the browser History API, and navigation updates the
mounted app in place instead of remounting it.

Clone it, run it, and adapt the pattern to your own app - every framework uses
the same `mount()` / `update()` / `unmount()` API.

## Run it

```sh
pnpm install
pnpm dev
```

That's it - the example ships pointed at the public Coras sandbox and CDN, so it
renders real content with no configuration. Open the URL Astro prints; it loads
the Coras landing page inside the SDK chrome, and the SDK's own navigation moves
you to `/:locale/:currency/...` URLs from there.

To point at a different backend, copy `.env.example` to `.env` and fill in any of
the values (all optional). Astro only exposes `PUBLIC_`-prefixed vars to the
browser:

| Variable                | Default                                  | Purpose                                       |
| ----------------------- | ---------------------------------------- | --------------------------------------------- |
| `PUBLIC_API_HOST`       | `https://sandbox.coras.io`               | Coras API origin, passed as `apiUrl`.         |
| `PUBLIC_DISTRIBUTOR_ID` | the shared example distributor           | Passed to the SDK as `distributorId`.         |
| `PUBLIC_ASSETS_URL`     | `https://assets.sandbox.coras.io/shared` | SDK shared-asset base, passed as `assetsUrl`. |

## What it demonstrates

- A single persistent `mount()` for every page. Route changes call
  `app.update()`, so the navbar, footer, and chrome stay in place and only the
  page content swaps - no remount.
- Host-owned routing with the History API: `onNavigate` / `onStateChange` push
  the SDK's navigation intent to the URL via the SDK URL helper (`pushState` for
  a navigation, `replaceState` for an in-page state change), and `popstate`
  feeds the URL back into `app.update()`. `update` does not re-emit `onNavigate`,
  so there is no loop.
- Reading the current page and params from the URL with the SDK URL helper, so
  deep links and refreshes land on the right page.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` - the SDK themes only from `config.theme`, never from the API.
- `strict: true` on the mount, so an unknown option or param key fails
  loudly here rather than being ignored.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option.

## How the integration fits together

| File                                                         | Role                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [`src/pages/[...path].astro`](src/pages/%5B...path%5D.astro) | The single static page: a `#app` container plus the client `<script>` that owns the mount. |
| [`src/main.ts`](src/main.ts)                                 | Mounts once and keeps the URL and the mounted app in sync via the History API.             |
| [`src/coras.ts`](src/coras.ts)                               | Builds the SDK config and chrome, and the shared URL strategy.                             |
| [`brand.json`](brand.json)                                   | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.                      |

## Static output & client-side rendering (SSR caveats)

The SDK renders web components in the browser only, so this app never
server-renders SDK markup. It is a static shell that mounts the SDK on the
client:

- `astro.config.mjs` sets `output: "static"`, so `pnpm build` emits a single
  `index.html` (plus its bundled JS) - deployable straight to an S3/CDN bucket.
- `src/pages/[...path].astro` is a catch-all route. Under static output a
  dynamic route needs `getStaticPaths()`, so it returns a single root page. The
  client `<script>` (which Astro bundles for the browser and never runs during
  SSR/prerender) mounts the SDK into `#app` and drives History-API routing for
  every `/:locale/:currency/...` URL within that one loaded page.
- **Point the bucket's 404/error document at `index.html`** (or add a
  CloudFront custom error response) so deep links and refreshes to a deeper URL
  load the app instead of a storage 404.
- `src/coras.ts` and `src/main.ts` are imported only from that client
  `<script>`, so touching `document` at module scope is safe - never import them
  from Astro frontmatter, which runs during the build.

## Build

```sh
pnpm build     # astro build (static output in dist/)
pnpm preview   # serve the production bundle
```
