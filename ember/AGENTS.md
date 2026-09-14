# Porting guide: Coras Embed Ember example

This is a working standalone integration of `@coras-io/embed` in an Ember app on Embroider and Vite. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                             | Role                                                                                                                                     | Port as                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `app/modifiers/coras-mount.js`   | The element modifier over `mount()` / `update()` / `unmount()`.                                                                          | Copy as is.                   |
| `app/components/coras-embed.gjs` | Derives `page`, `params`, and `config` from `router.currentURL` and applies the modifier; wires the logo click.                          | Copy as is.                   |
| `app/templates/embed.gjs`        | The `/:locale/:currency` template that renders the one persistent mount.                                                                 | Copy as is.                   |
| `app/coras.js`                   | The SDK config, chrome with the host logo, the shared URL strategy, and `handleNavigate` / `handleStateChange` over the `RouterService`. | Copy as is.                   |
| `app/router.js`                  | The `embed` route at `/:locale/:currency` with `search`, `help`, `payment`, and `details` (`/:id`) children.                             | Merge into your router map.   |
| `app/routes/index.js`            | Redirects `/` to the default `/:locale/:currency`.                                                                                       | Copy as is.                   |
| `config/environment.js`          | The `coras` block: `apiUrl`, `distributorId`, `assetsUrl`.                                                                               | Merge into your environment.  |
| `brand.json`                     | The theme, passed once as `config.theme`.                                                                                                | Replace with your brand file. |

## Values to change

- The `coras` block in `config/environment.js`, and `logo.alt` in `app/coras.js`.
- The redirect target in `app/routes/index.js` and `locale` / `currency` passed to `buildConfig()`.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points; add `allowedLocales` / `allowedCurrencies` to enable the switchers.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

None. Everything here is part of the integration.

## Routes this example declares

`/` redirects to the default `/:locale/:currency`. Under it: the index (landing), `search`, `payment`, `help`, and `details` at `/:id`. The bare id segment is the SDK's default shape for a details URL. The child routes have no templates; the mounted app reads the URL.

## Notes

- `router.currentURL` is tracked, so the `state` getter in `app/components/coras-embed.gjs` and everything derived from it recompute on every transition and drive `app.update()`. `@cached` keeps that to one URL parse per transition.
- The modifier's `modify` hook re-runs because it reads `page`, `params`, and `config` from its named args. Read them there or updates stop arriving.
- `config/environment.js` is a plain Node module evaluated during the Embroider build. Its values are serialised into a meta tag that `app/config/environment.js` reads back at runtime.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
