# Porting guide: Coras Embed Angular example

This is a working standalone integration of `@coras-io/embed` in an Angular app with standalone components and the Angular Router. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                                          | Role                                                                                                                                                              | Port as                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `src/app/coras-mount.component.ts`            | The Angular wrapper over `mount()` / `update()` / `unmount()`.                                                                                                    | Copy as is.                   |
| `src/app/locale-currency-layout.component.ts` | The layout that holds the one persistent mount, re-reads the URL on every `NavigationEnd`, and maps SDK intents to `router.navigateByUrl` (push or `replaceUrl`). | Copy as is.                   |
| `src/app/embedded-page.component.ts`          | An empty route target: each page is a URL under the layout.                                                                                                       | Copy as is.                   |
| `src/app/coras.ts`                            | The SDK config, chrome with the host logo, and the shared URL strategy.                                                                                           | Copy as is.                   |
| `src/app/app.routes.ts`                       | The `/` redirect and the `:locale/:currency` routes.                                                                                                              | Merge into your routes.       |
| `src/app/config.ts`                           | The default and allowed locales and currencies.                                                                                                                   | Copy and edit.                |
| `src/environments/environment.ts`             | Optional backend overrides.                                                                                                                                       | Merge into your environments. |
| `brand.json`                                  | The theme, passed once as `config.theme`.                                                                                                                         | Replace with your brand file. |

## Values to change

- `site.distributorId` and `site.title` in `src/app/coras.ts`.
- `apiHost`, `distributorId`, `assetsUrl` in `src/environments/environment.ts`, or the literal fallbacks in `buildConfig()`.
- The lists and defaults in `src/app/config.ts`.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- Locale and currency detection in the `/` guard (`@coras-io/embed/helpers`): fixed defaults from `config.ts` are fine.

## Routes this example declares

`/` redirects to `/:locale/:currency`. Under it: ``(landing),`search`, `payment`, `help`, and `:id`(details), each pointing at the empty`EmbeddedPageComponent`. Page params are query parameters.

## Notes

- `brand.json` is imported as a module: keep `resolveJsonModule` on in `tsconfig`.
- `ngOnChanges` runs before `ngAfterViewInit`, so the first change set arrives with no app yet. The initial state is passed straight to `mount()`; `app?.update()` covers every later change.
- `angular.json` lists `react` under `build.options.externalDependencies`. It is a build-tool workaround for an optional peer dependency, not part of the integration: the SDK lazily loads `@coinbase/cdp-core`, which pulls in `zustand`, whose entry re-exports a React binding that a plain Angular app never installs. Without the entry the builder stops with `Could not resolve "react"`. `angular.json` is JSON and cannot carry the comment itself, so it lives here.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
