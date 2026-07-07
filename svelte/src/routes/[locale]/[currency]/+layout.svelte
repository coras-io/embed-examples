<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type {
    CorasNavigateDetail,
    CorasStateChangeDetail,
    SupportedCurrencies,
    SupportedLocales,
  } from "@coras-io/embed";
  import CorasMount from "$lib/CorasMount.svelte";
  import { buildChrome, buildConfig, url } from "$lib/coras";

  let { children } = $props();

  // Host-owned logo, built once (client-only) and reused. Its click returns to
  // the landing page for the current locale/currency.
  const { chrome, logo } = buildChrome();

  const locale = $derived(page.params.locale as SupportedLocales);
  const currency = $derived(page.params.currency as SupportedCurrencies);

  // A single persistent mount serves every page under `/:locale/:currency`. Read
  // the current page + params straight from the URL, so a link, deep link,
  // refresh, or back/forward all resolve to `app.update()` in place — the
  // navbar, footer, and chrome stay put and only the page content swaps.
  const route = $derived(url.parse(page.url.href));
  const config = $derived(buildConfig(locale, currency));

  $effect(() => {
    const goToLanding = () => goto(`/${locale}/${currency}`);
    logo.addEventListener("click", goToLanding);
    return () => logo.removeEventListener("click", goToLanding);
  });

  // Host owns routing. Turn a navigation *intent* from the SDK into a real URL
  // and push it to SvelteKit's router; the URL change flows back through `route`
  // above into `app.update()`. An `href` intent is an external link.
  function syncUrl(
    detail: CorasNavigateDetail | CorasStateChangeDetail,
    replace: boolean,
  ): void {
    if ("href" in detail && detail.href) {
      window.open(detail.href, "_blank", "noopener,noreferrer");
      return;
    }
    const href = url.build({
      page: detail.page,
      params: detail.params ?? {},
      locale: detail.locale,
      currency: detail.currency,
    });
    // navigate: a new history entry. state-change: replace it in place.
    goto(href, { replaceState: replace, noScroll: replace, keepFocus: replace });
  }
</script>

<CorasMount
  page={route.page}
  params={route.params}
  {config}
  {chrome}
  onNavigate={(intent) => syncUrl(intent, false)}
  onStateChange={(state) => syncUrl(state, true)}
/>
{@render children()}
