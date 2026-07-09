# Coras Embed - embedded-in-an-existing-app example

A working integration of the Coras embeddable ticketing SDK (`@coras-io/embed`)
into a host app that **already has its own navbar, footer, and routing**. This is
the counterpart to the standalone examples: instead of Coras owning the whole
page, it is mounted into one section of a larger site.

The host here is a tiny framework-free site ("Riverside Live") with its own
header, footer, and `/` and `/about` pages. Coras lives under `/tickets`.

## What makes it "embedded"

- **`chrome: false`.** The mount renders Coras page content only - no Coras
  navbar or footer. The host's own header and footer stay in charge. See
  [`src/coras.ts`](src/coras.ts).
- **Mounted into a content region.** Coras renders into the host's `<main>`, not
  the whole viewport. There is no full-bleed reset - the host owns the page frame.
- **Scoped to a route sub-tree with `basePath`.** The URL strategy uses
  `basePath: "/tickets"`, so `buildCorasUrl`/`parseCorasUrl` produce and read
  `/tickets/...` paths and the host's other routes are never touched.
- **Themed from `brand.json`.** Exactly as in the standalone examples: colours,
  fonts, and logo come from [`brand.json`](brand.json) via `config.theme`. The
  only hand-written CSS styles the **host** shell, never Coras content.

## Run it

```sh
pnpm install
pnpm dev
```

Open the URL Vite prints. Click **Tickets** to enter the Coras sub-tree; the host
navbar and footer stay put while Coras renders inside them. Click **Home** or
**About** to leave it - the mount is torn down and the host pages render alone.

The example ships pointed at the public Coras sandbox and CDN, so it renders real
content with no configuration. To point at a different backend, copy
`.env.example` to `.env` and fill in any of the values (all optional):
`VITE_API_HOST`, `VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL`.

## How the integration fits together

| File                           | Role                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| [`index.html`](index.html)     | The host shell: its own navbar, footer, and the `<main>` Coras sits in.  |
| [`src/main.ts`](src/main.ts)   | The host router - renders host pages, and mounts Coras under `/tickets`. |
| [`src/coras.ts`](src/coras.ts) | The SDK config, `chrome: false`, and the `basePath` URL strategy.        |
| [`brand.json`](brand.json)     | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.    |

## Build

```sh
pnpm build     # tsc + vite build
pnpm preview   # serve the production bundle
```
