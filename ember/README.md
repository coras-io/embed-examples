# Coras Embed - Ember example

A working [Ember](https://emberjs.com) integration of the Coras embeddable
ticketing SDK (`@coras-io/embed`), built on the current
[Vite](https://vite.dev)-powered app blueprint (Embroider). The SDK is mounted
once with `mount()`, the host owns routing through
[Ember's router](https://guides.emberjs.com/release/routing/), and navigation
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

To point at a different backend, set any of these environment variables before
`pnpm dev` / `pnpm build` (all optional - `config/environment.js` reads them from
the shell). See `.env.example`.

| Variable               | Default                                  | Purpose                                       |
| ---------------------- | ---------------------------------------- | --------------------------------------------- |
| `CORAS_API_HOST`       | `https://sandbox.coras.io`               | Coras API origin, passed as `apiUrl`.         |
| `CORAS_DISTRIBUTOR_ID` | the shared example distributor           | Passed to the SDK as `distributorId`.         |
| `CORAS_ASSETS_URL`     | `https://assets.sandbox.coras.io/shared` | SDK shared-asset base, passed as `assetsUrl`. |

## What it demonstrates

- A single persistent `mount()` for every page under `/:locale/:currency`. Route
  changes call `app.update()`, so the navbar, footer, and chrome stay in place
  and only the page content swaps.
- Host-owned routing: the SDK reports navigation intent through `onNavigate` and
  `onStateChange`, and the app maps those to Ember `RouterService.transitionTo` /
  `replaceWith` (or `window.open` for an external `href`).
- Reading the current page and params from the URL with the SDK URL helper -
  including on deep links and back/forward - then feeding them into
  `mount()` / `update()`. `update()` does not re-emit `onNavigate`, so there is
  no loop.
- Theming from a committed [`brand.json`](brand.json), passed once as
  `config.theme` - the SDK themes only from `config.theme`, never from the API.
- Projecting a host-owned logo into the SDK navbar `brand` slot through the
  `chrome` option.

## How the integration fits together

| File                                                               | Role                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`app/modifiers/coras-mount.js`](app/modifiers/coras-mount.js)     | Element modifier over `mount()` / `update()` / `unmount()` - mount, update, teardown. |
| [`app/components/coras-embed.gjs`](app/components/coras-embed.gjs) | Derives page/params/config from the URL and applies the mount modifier.               |
| [`app/templates/embed.gjs`](app/templates/embed.gjs)               | Layout holding the single persistent mount for all pages.                             |
| [`app/coras.js`](app/coras.js)                                     | Builds the SDK config and chrome, the shared URL strategy, and the navigation glue.   |
| [`app/router.js`](app/router.js)                                   | The routes: landing + details + search + help + payment under `/:locale/:currency`.   |
| [`brand.json`](brand.json)                                         | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.                 |

## Build

```sh
pnpm build   # vite build → dist/
```

## Notes

- **Vite + Embroider.** Dev and build run through Vite (`vite` / `vite build`);
  `ember-cli-build.mjs` hands the classic app tree to Embroider. This is the
  current Ember app blueprint - no webpack, no `ember-auto-import`.
- **Client-only.** The SDK renders web components in the browser; the mount
  happens in an element modifier once the DOM exists, and tears down when the
  element is destroyed. There is no FastBoot/SSR.
- **Plain JavaScript + `.gjs`.** Components and templates use the strict
  template-tag format; the app is authored in JS (with JSDoc types pulling in the
  SDK's TypeScript types) to keep the toolchain light.
- **`brand.json` is imported directly.** The Vite build imports the canonical
  [`brand.json`](brand.json) into [`app/coras.js`](app/coras.js), so there is a
  single source for the theme - edit `brand.json` and the app picks it up.
