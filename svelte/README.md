# Coras Embed - SvelteKit example

A working [SvelteKit](https://svelte.dev/docs/kit) integration of the Coras
embeddable ticketing SDK (`@coras-io/embed`). The SDK is mounted once with
`mount()`, the host owns routing through SvelteKit's router, and navigation
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
the values (all optional). SvelteKit only exposes `PUBLIC_`-prefixed vars to the
browser:

| Variable                | Default                                  | Purpose                                       |
| ----------------------- | ---------------------------------------- | --------------------------------------------- |
| `PUBLIC_API_HOST`       | `https://sandbox.coras.io`               | Coras API origin, passed as `apiUrl`.         |
| `PUBLIC_DISTRIBUTOR_ID` | the shared example distributor           | Passed to the SDK as `distributorId`.         |
| `PUBLIC_ASSETS_URL`     | `https://assets.sandbox.coras.io/shared` | SDK shared-asset base, passed as `assetsUrl`. |
| `PUBLIC_ALLOWED_HOSTS`  | -                                        | Comma-separated hosts for the dev server.     |

## What it demonstrates

- A single persistent `mount()` for every page under `/:locale/:currency`. Route
  changes call `app.update()`, so the navbar, footer, and chrome stay in place
  and only the page content swaps.
- Host-owned routing: the SDK reports navigation intent through `onNavigate` and
  `onStateChange`, and the app maps those to `goto()` - a new history entry for a
  navigation, a `replaceState` for an in-page state change.
- Reading the current page and params from the URL with the SDK URL helper, then
  feeding them back into `mount()` / `update()` so deep links and back/forward
  work.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` - the SDK themes only from `config.theme`, never from the API.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option, with its click wired back to the landing page.

## How the integration fits together

| File                                                                                             | Role                                                                    |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [`src/lib/CorasMount.svelte`](src/lib/CorasMount.svelte)                                         | Svelte wrapper over `mount()` / `update()` / `unmount()`.               |
| [`src/routes/[locale]/[currency]/+layout.svelte`](src/routes/[locale]/[currency]/+layout.svelte) | Layout holding the single persistent mount for all pages, and URL sync. |
| [`src/lib/coras.ts`](src/lib/coras.ts)                                                           | Builds the SDK config and chrome, and the shared URL strategy.          |
| [`src/routes/+page.ts`](src/routes/+page.ts)                                                     | Redirects `/` to a detected `/:locale/:currency`.                       |
| [`brand.json`](brand.json)                                                                       | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.   |

## Client-side rendering (SSR/SPA caveats)

The SDK renders web components in the browser only, so the app is a pure
client-rendered SPA:

- `src/routes/+layout.ts` sets `ssr = false` and `prerender = false`, and
  `CorasMount.svelte` calls `mount()` inside `onMount` - never during SSR or in a
  `load`. `src/lib/coras.ts` creates the logo `<img>` lazily in `buildChrome()`
  (called from the client-only mount) so importing the module never touches
  `document`.
- `svelte.config.js` uses `@sveltejs/adapter-static` with an `index.html`
  fallback, so `pnpm build` emits static files for an S3/CDN bucket and the client
  router owns every `/:locale/:currency/...` route. **Point the bucket's
  404/error document at `index.html`** (or a CloudFront custom error response) so
  refreshes and deep links load the SPA instead of a storage 404.

## Build

```sh
pnpm build     # svelte-kit sync + vite build (static output in build/)
pnpm preview   # serve the production bundle
pnpm check     # svelte-check type-check
```
