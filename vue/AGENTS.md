# Porting guide: Coras Embed Vue example

This is a working standalone integration of `@coras-io/embed` in a Vue 3 app with Vue Router. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                                 | Role                                                                                                                                                | Port as                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `src/CorasMount.vue`                 | The Vue wrapper over `mount()` / `update()` / `unmount()`.                                                                                          | Copy as is.                   |
| `src/views/LocaleCurrencyLayout.vue` | The layout that holds the one persistent mount, derives `page` and `params` from the URL, and maps SDK intents to `router.push` / `router.replace`. | Copy as is.                   |
| `src/views/EmbeddedPage.vue`         | An empty route target: each page is a URL under the layout, not a component.                                                                        | Copy as is.                   |
| `src/coras.ts`                       | The SDK config, chrome with the host logo, and the shared URL strategy.                                                                             | Copy as is.                   |
| `src/router.ts`                      | The `/` redirect and the `/:locale/:currency` routes.                                                                                               | Merge into your router.       |
| `src/config.ts`                      | The default and allowed locales and currencies.                                                                                                     | Copy and edit.                |
| `brand.json`                         | The theme, passed once as `config.theme`.                                                                                                           | Replace with your brand file. |

## Values to change

- `site.distributorId` and `site.title` in `src/coras.ts`.
- `VITE_API_HOST`, `VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- The lists and defaults in `src/config.ts`.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- Locale and currency detection in the `/` redirect (`@coras-io/embed/helpers`): fixed defaults from `config.ts` are fine.

## Routes this example declares

`/` redirects to `/:locale/:currency`. Under it: ``(landing),`search`, `payment`, `help`, and `:id`(details), each pointing at the empty`EmbeddedPage`. Page params are query parameters.

## Notes

- In Nuxt, wrap the layout in `<ClientOnly>` or mount in `onMounted`; the SDK is browser-only.
- The `resolve` block in `vite.config.ts` is monorepo plumbing, not part of the integration. Inside this repo the SDK is a workspace link, so the app and the linked `@coras-io/embed` can resolve different copies of lit; the aliases force one instance. It switches itself off when the sibling package is absent, which is the case in a standalone clone consuming the pre-bundled npm build. Drop it in your app.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
