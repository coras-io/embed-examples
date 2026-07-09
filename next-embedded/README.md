# Coras Embed - embedded in an existing Next.js app

A working integration of the Coras embeddable ticketing SDK (`@coras-io/embed`)
into a **Next.js App Router** host that **already has its own navbar, footer, and
routing**. This is the counterpart to the standalone examples: instead of Coras
owning the whole page, it is mounted into one section of a larger site.

The host here is a tiny Next.js site ("Riverside Live") with its own header,
footer, and `/` and `/about` pages. Coras lives under `/tickets`.

## What makes it "embedded"

- **`chrome: false`.** The mount renders Coras page content only - no Coras
  navbar or footer. The host's own header and footer stay in charge. See
  [`app/tickets/[[...slug]]/coras.ts`](app/tickets/%5B%5B...slug%5D%5D/coras.ts).
- **Mounted into a content region.** Coras renders into the host layout's
  `<main>`, not the whole viewport. There is no full-bleed reset - the host owns
  the page frame.
- **Scoped to a route sub-tree with `basePath`.** A catch-all route,
  `app/tickets/[[...slug]]/page.tsx`, hands the sub-tree to Coras. The URL
  strategy uses `basePath: "/tickets"`, so `buildCorasUrl`/`parseCorasUrl`
  produce and read `/tickets/...` paths and the host's other routes are never
  touched. Locale and currency stay out of the path (fixed in config).
- **Themed from `brand.json`.** Exactly as in the standalone examples: colours,
  fonts, and logo come from [`brand.json`](brand.json) via `config.theme`. The
  only hand-written CSS ([`app/globals.css`](app/globals.css)) styles the
  **host** shell, never Coras content.

## How the SDK stays out of SSR

The SDK is browser-only. The catch-all page is a server component that renders
just one client component, `CorasMount`. That component calls `mount()` inside a
`useEffect` - so it runs only in the browser, after hydration - into a container
`ref`, and calls `app.unmount()` on cleanup. Nothing touches `window`,
`document`, or `mount()` during SSR/prerender, so `next build` prerenders
`/tickets` to an empty container that Coras fills on the client.

The mount is created **once**. Host navigation and Coras navigation are kept in
sync without a loop:

- Coras emits an `onNavigate` intent → `buildCorasUrl` turns it into a
  `/tickets/...` path → `useRouter().push(...)`.
- A host route change (`usePathname()`) → `app.update(...)`, which re-renders in
  place and does **not** re-emit `onNavigate`.

## Run it

```sh
pnpm install
pnpm dev
```

Open the URL Next prints. Click **Tickets** to enter the Coras sub-tree; the host
navbar and footer stay put while Coras renders inside them. Click **Home** or
**About** to leave it - Next unmounts the route and the host pages render alone.

The example ships pointed at the public Coras sandbox and CDN, so it renders real
content with no configuration. To point at a different backend, copy
`.env.example` to `.env` and fill in any of the values (all optional, and all
prefixed `NEXT_PUBLIC_` so the client can read them).

## How the integration fits together

| File                                                                                       | Role                                                                    |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [`app/layout.tsx`](app/layout.tsx)                                                         | The host shell: its own navbar, footer, and the `<main>` Coras sits in. |
| [`app/page.tsx`](app/page.tsx), [`app/about/page.tsx`](app/about/page.tsx)                 | Plain host pages - no Coras.                                            |
| [`app/tickets/[[...slug]]/page.tsx`](app/tickets/%5B%5B...slug%5D%5D/page.tsx)             | The catch-all route that hands `/tickets` to Coras.                     |
| [`app/tickets/[[...slug]]/CorasMount.tsx`](app/tickets/%5B%5B...slug%5D%5D/CorasMount.tsx) | The client mount: `useEffect` mount/unmount + host-router sync.         |
| [`app/tickets/[[...slug]]/coras.ts`](app/tickets/%5B%5B...slug%5D%5D/coras.ts)             | The SDK config, `chrome: false`, and the `basePath` URL strategy.       |
| [`brand.json`](brand.json)                                                                 | The theme (colours, fonts, logo) passed to the SDK as `config.theme`.   |

## Build

```sh
pnpm build     # next build
pnpm start     # serve the production build
```
