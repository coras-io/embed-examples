# Porting guide: Coras Embed Vanilla JS/TS example

This is a working standalone integration of `@coras-io/embed` in a plain JavaScript or TypeScript app (Vite here, any bundler works). It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File           | Role                                                                                                                                                                                | Port as                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src/coras.ts` | The SDK config, the managed chrome with a host-owned logo, and the shared URL strategy (`createCorasUrlState()`: locale and currency in the path).                                  | Copy as is; it is framework-free.                     |
| `src/main.ts`  | The whole integration: parse the URL, create the one persistent mount, `syncUrl` for `onNavigate` (push) and `onStateChange` (replace), the `popstate` handler, and the logo click. | Copy as is into your entry module.                    |
| `index.html`   | The `#app` container the SDK owns, plus the documented standalone reset that lets it fill the viewport.                                                                             | Copy the reset; add nothing that styles Coras itself. |
| `brand.json`   | The theme, passed once as `config.theme`.                                                                                                                                           | Replace with your brand file.                         |

## Values to change

- `site.distributorId` and `logo.alt` in `src/coras.ts`.
- `VITE_API_HOST`, `VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- `DEFAULT_LOCALE` and `DEFAULT_CURRENCY` in `src/coras.ts`: the values used when the URL carries neither. Every other locale and currency comes from the URL and reaches the mount through `config`.
- The navbar's language and currency switchers are on by default and offer everything the SDK supports; pass `allowedLocales` / `allowedCurrencies` in `buildConfig()` to narrow that to what this host is prepared to route.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

None. Everything here is part of the integration.

## Routes this example declares

`/` mounts the landing page with the config defaults. Every other URL is `/:locale/:currency`, then `search`, `payment`, `help`, or a bare attraction id for details, with page params as query parameters. There is no router: `main.ts` handles every URL in the one loaded page, so the static host must serve `index.html` for every path.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
