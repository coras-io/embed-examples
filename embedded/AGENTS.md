# Porting guide: Coras Embed embedded (vanilla host) example

This is a working embedded integration of `@coras-io/embed` in an existing app that keeps its own navbar, footer, and routing, shown here as a dependency-free vanilla host. It is built and deployed on every SDK release, so it is the reference to port into your own app rather than a pattern to reimplement. The rules that apply to every framework live in the `coras-embed` skill at `../skills/coras-embed/SKILL.md`; this file covers what is specific to this example.

## Files to port

| File           | Role                                                                                                                                                                                                                                                                   | Port as                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/coras.ts` | The SDK config with fixed locale and currency, `chrome: false`, and the URL strategy with `basePath: "/tickets"`, `localeInPath: false`, `currencyInPath: false`.                                                                                                      | Copy as is; change the base path if needed.                             |
| `src/main.ts`  | The host router: host pages render into `<main>`; a `/tickets` URL mounts Coras there once, later `/tickets` URLs call `app.update()`, and leaving the subtree calls `app.unmount()`. `syncCoras` maps `onNavigate` (push) and `onStateChange` (replace) to host URLs. | Port the Coras parts into your router; the host pages are placeholders. |
| `index.html`   | The host shell: its own navbar and footer, and the `<main id="app">` content region Coras sits in.                                                                                                                                                                     | Your app already has this.                                              |
| `brand.json`   | The theme, passed once as `config.theme`.                                                                                                                                                                                                                              | Replace with your brand file.                                           |

## Values to change

- `TICKETS_BASE` in `src/coras.ts` (the route subtree Coras owns).
- `site.distributorId` and `site.title` in `src/coras.ts`.
- `VITE_API_HOST`, `VITE_DISTRIBUTOR_ID`, `VITE_ASSETS_URL`, or the literal fallbacks in `buildConfig()`.
- `locale` and `currency` in `buildConfig()`.

Nothing else changes. The routing glue, the mount lifecycle, and the URL strategy are the integration.

## Demo-only extras

- The host pages (`renderHostPage`) and the host CSS in `index.html`: they stand in for your app.

## Routes this example declares

`/tickets` (landing), `/tickets/search`, `/tickets/payment`, `/tickets/help`, and `/tickets/:id` (details), with page params as query parameters. Everything outside `/tickets/*` belongs to the host and is never touched.

## Notes

- Do not apply a full-bleed reset: the mount sizes to the host's content region. Host CSS styles the host shell only and never targets Coras elements; the embed is themed entirely by `config.theme` (ADR 0001).
- The host's global `a[data-link]` click interceptor never sees a Coras link. Coras internal links arrive as `onNavigate` intents instead, which is why `syncCoras` is the only path back into the mount.

## Run it

```sh
pnpm install
pnpm dev
```

It renders against the public Coras sandbox with no configuration. See `README.md` for the environment variables and the build.
