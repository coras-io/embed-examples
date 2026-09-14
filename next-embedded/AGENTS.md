# Porting guide: Coras Embed Next.js embedded example

This is a working embedded integration of `@coras-io/embed` in a Next.js App Router app that keeps its own navbar, footer, and routing. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                                     | Role                                                                                                                                                                                                                       | Port as                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `app/tickets/[[...slug]]/coras.ts`       | The SDK config with fixed locale and currency, `chrome: false`, and the URL strategy with `basePath: "/tickets"`, `localeInPath: false`, `currencyInPath: false`.                                                          | Copy as is; change the base path if needed. |
| `app/tickets/[[...slug]]/CorasMount.tsx` | The client component: mounts once in `useEffect`, maps `onNavigate` (`router.push`) and `onStateChange` (`router.replace`) to `/tickets` URLs, and reflects `usePathname` + `useSearchParams` changes with `app.update()`. | Copy as is.                                 |
| `app/tickets/[[...slug]]/page.tsx`       | The catch-all server component that renders `<CorasMount />` inside `<Suspense>` (required by `useSearchParams`).                                                                                                          | Copy as is.                                 |
| `app/layout.tsx`                         | The host shell: its own navbar and footer, and the `<main>` content region.                                                                                                                                                | Your app already has this.                  |
| `brand.json`                             | The theme, passed once as `config.theme`.                                                                                                                                                                                  | Replace with your brand file.               |

## Values to change

- `TICKETS_BASE` in `coras.ts` (the route subtree Coras owns) and the directory name under `app/`.
- `site.distributorId` and `site.title` in `coras.ts`.
- `NEXT_PUBLIC_API_HOST`, `NEXT_PUBLIC_DISTRIBUTOR_ID`, `NEXT_PUBLIC_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- `locale` and `currency` in `buildConfig()`.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- The host pages `app/page.tsx` and `app/about/page.tsx`, and the host CSS in `app/globals.css`: they stand in for your app.

## Routes this example declares

`/tickets` (landing), `/tickets/search`, `/tickets/payment`, `/tickets/help`, and `/tickets/:id` (details), all served by the one `[[...slug]]` catch-all, with page params as query parameters.

## Notes

- Never call `mount()` in a Server Component; `CorasMount.tsx` is `"use client"` and mounts in `useEffect`.
- The `useRouter()` identity can change across renders. `CorasMount.tsx` routes it through a ref so the mount effect keeps an empty dependency array and never remounts Coras on navigation.
- Host CSS styles the host shell only and never targets Coras elements; the embed is themed entirely by `config.theme` (ADR 0001).
- For a standalone Next.js site, use the same files with a root catch-all `app/[[...slug]]`, drop `basePath` and the two `InPath: false` flags, and set `chrome` to the managed navbar and footer.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
