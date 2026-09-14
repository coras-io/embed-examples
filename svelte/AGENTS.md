# Porting guide: Coras Embed SvelteKit example

This is a working standalone integration of `@coras-io/embed` in a SvelteKit app built as a static SPA. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                                                                     | Role                                                                                                                                                           | Port as                              |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src/lib/CorasMount.svelte`                                              | The Svelte wrapper over `mount()` / `update()` / `unmount()`.                                                                                                  | Copy as is.                          |
| `src/lib/coras.ts`                                                       | The SDK config and the shared URL strategy. `buildChrome()` is a function, not a module constant, so importing the module never touches `document` during SSR. | Copy as is.                          |
| `src/routes/+layout.ts`                                                  | `ssr = false`, `prerender = false`: the SDK is browser-only.                                                                                                   | Keep for the Coras subtree at least. |
| `src/routes/+page.ts`                                                    | Redirects `/` to `/:locale/:currency`.                                                                                                                         | Copy as is.                          |
| `src/routes/[locale]/[currency]/+layout.svelte`                          | The layout that holds the one persistent mount, derives `page` and `params` from the URL, and maps SDK intents to `goto` (push or `replaceState`).             | Copy as is.                          |
| `src/routes/[locale]/[currency]/{+page.svelte,search,payment,help,[id]}` | One empty route per page: each page is a URL under the layout.                                                                                                 | Copy as is.                          |
| `brand.json`                                                             | The theme, passed once as `config.theme`.                                                                                                                      | Replace with your brand file.        |

## Values to change

- `site.distributorId` and `site.title` in `src/lib/coras.ts`.
- `PUBLIC_API_HOST`, `PUBLIC_DISTRIBUTOR_ID`, `PUBLIC_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points; add `allowedLocales` / `allowedCurrencies` to enable the switchers.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- Locale and currency detection in `src/routes/+page.ts` (`@coras-io/embed/helpers`): fixed defaults are fine.

## Routes this example declares

`/` redirects to `/:locale/:currency`. Under it: ``(landing),`search`, `payment`, `help`, and `[id]` (details). Page params are query parameters.

## Notes

- Keep the `@coras-io/embed` import in `src/lib/CorasMount.svelte` static. `ssr = false` and the `ssr.external` entry already keep it out of the server build, and an awaited dynamic import would let destroy race the mount.
- `vite.config.ts` marks `@coras-io/embed` external to the SSR build. SvelteKit still runs an SSR pass to build the prerendered shell, and a workspace-linked SDK would otherwise be force-bundled into it, pulling in the Node-oriented corners of its dependency tree (the optional crypto and wallet libraries). The SDK only ever runs in the browser; the client build bundles it normally.
- The `resolve` block in `vite.config.ts` is monorepo plumbing, not part of the integration. Inside this repo the SDK is a workspace link, so the app and the linked `@coras-io/embed` can resolve different copies of lit; the aliases force one instance. It switches itself off when the sibling package is absent, which is the case in a standalone clone consuming the pre-bundled npm build. Drop it in your app.
- The static `search`, `payment`, and `help` segments win over `[id]`, which matches the SDK's URL shape: details is the bare id segment.
- `tsconfig.json` needs `resolveJsonModule` for the `brand.json` import used as `config.theme`. It extends `.svelte-kit/tsconfig.json`, which `svelte-kit sync` generates, so that file is absent until the first `pnpm dev`, `build`, or `check`.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
