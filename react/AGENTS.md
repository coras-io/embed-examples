# Porting guide: Coras Embed React example

This is a working standalone integration of `@coras-io/embed` in a React app; this one uses TanStack Router with file-based routes. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                                                               | Role                                                                                                                              | Port as                                                                       |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/CorasMount.tsx`                                               | The React wrapper over `mount()` / `update()` / `unmount()`: mounts once, updates in place, tears down on unmount.                | Copy as is. It has no router dependency.                                      |
| `src/routes/$locale.$currency.tsx`                                 | The layout route that holds the one persistent mount for every page and derives `page` and `params` from the URL.                 | Port to your router's layout route.                                           |
| `src/utils.ts`                                                     | The SDK config, chrome, and URL strategy, plus `handleNavigate` / `handleStateChange` that map SDK intents to router navigations. | Keep the logic; swap the `navigate` calls for your router's push and replace. |
| `src/routes/index.tsx`                                             | Redirects `/` to `/:locale/:currency`.                                                                                            | Port to your router.                                                          |
| `src/routes/$locale.$currency.{index,search,$id,payment,help}.tsx` | One route per page. They render nothing; they declare the URL shape and the search params each page reads.                        | Declare the same routes and params in your router.                            |
| `src/config.ts`                                                    | The default and allowed locales and currencies.                                                                                   | Copy and edit.                                                                |
| `src/main.tsx`                                                     | Router bootstrap.                                                                                                                 | Your app already has one.                                                     |
| `brand.json`                                                       | The theme, passed once as `config.theme`.                                                                                         | Replace with your brand file.                                                 |

## Values to change

- `site.distributorId` and `site.title` in `src/utils.ts`.
- `VITE_API_HOST`, `VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- The lists and defaults in `src/config.ts`.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- `src/last-location.ts` and `withStoredLocation()` in the layout: remembers the last landing-page city in `localStorage`. Skip it unless you want that behaviour.
- `site.detectLocale` / `site.detectCurrency` and the `@coras-io/embed/helpers` detection in `src/routes/index.tsx`: fixed defaults from `config.ts` are fine.
- The router devtools in `src/routes/__root.tsx` and the `console.info` calls for reservation and payment callbacks.

## Routes this example declares

`/` redirects to `/:locale/:currency`. Under it: ``(landing),`search`, `payment`, `help`, and `:id` (details). Page params are search params, declared per route with valibot schemas; keep those declarations, because TanStack drops undeclared search params.

## Notes

- With React Router: the layout route uses `useLocation` and `useNavigate`; `handleNavigate` becomes `navigate(href)` and `handleStateChange` becomes `navigate(href, { replace: true })`.
- The `resolve` block in `vite.config.ts` is monorepo plumbing, not part of the integration. Inside this repo the SDK is a workspace link, so the app and the linked `@coras-io/embed` can resolve different copies of lit; the aliases force one instance. It switches itself off when the sibling package is absent, which is the case in a standalone clone consuming the pre-bundled npm build. Drop it in your app.
- The navbar sizes a slotted brand logo by height (`--navbar-logo-height`), so the host logo element needs no CSS of its own.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
