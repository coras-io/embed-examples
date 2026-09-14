# Porting guide: Coras Embed Astro example

This is a working standalone integration of `@coras-io/embed` in an Astro site with `output: "static"`. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File                        | Role                                                                                                                                                                                | Port as                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `src/pages/[...path].astro` | The single static page: the `#app` container, the documented standalone reset, and a client `<script>` that imports the entry. `getStaticPaths()` emits only the root `index.html`. | Copy as is, or mount from a `client:only` island. |
| `src/main.ts`               | The whole integration: parse the URL, the one persistent mount, `syncUrl` for `onNavigate` (push) and `onStateChange` (replace), the `popstate` handler, and the logo click.        | Copy as is.                                       |
| `src/coras.ts`              | The SDK config, the managed chrome with a host-owned logo, and the shared URL strategy.                                                                                             | Copy as is.                                       |
| `brand.json`                | The theme, passed once as `config.theme`.                                                                                                                                           | Replace with your brand file.                     |

## Values to change

- `site.distributorId` and `logo.alt` in `src/coras.ts`.
- `PUBLIC_API_HOST`, `PUBLIC_DISTRIBUTOR_ID`, `PUBLIC_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- `DEFAULT_LOCALE` and `DEFAULT_CURRENCY` in `src/coras.ts`: the values used when the URL carries neither. Every other locale and currency comes from the URL and reaches the mount through `config`.
- The navbar's language and currency switchers are on by default and offer everything the SDK supports; pass `allowedLocales` / `allowedCurrencies` in `buildConfig()` to narrow that to what this host is prepared to route.
- `loyaltyPointsEnabled`: keep only if the distributor has loyalty points.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

None. Everything here is part of the integration.

## Routes this example declares

`/` mounts the landing page with the config defaults. Every other URL is `/:locale/:currency`, then `search`, `payment`, `help`, or a bare attraction id for details. History-API routing runs inside the one loaded page, so point the static host's 404 document at `index.html`.

## Notes

- The script must stay client-only. Never call `mount()` in frontmatter or during prerendering.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
