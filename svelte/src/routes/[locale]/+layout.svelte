<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { SupportedCurrencies, SupportedLocales } from "@coras-io/embed";
  import { createCorasRouting } from "@coras-io/embed/url";
  import CorasMount from "$lib/CorasMount.svelte";
  import { buildChrome, buildConfig, defaultCurrency, url } from "$lib/coras";

  let { children } = $props();

  const { chrome, logo } = buildChrome();

  const route = $derived(url.parse(page.url.href));
  // The URL names the locale; the currency only when it is not the locale's default.
  const locale = $derived(
    route.locale ?? (page.params.locale as SupportedLocales),
  );
  const currency = $derived(
    route.currency ?? (defaultCurrency(route.locale) as SupportedCurrencies),
  );
  const config = $derived(buildConfig(locale, currency));

  $effect(() => {
    const goToLanding = () => goto(`/${page.params.locale}`);
    logo.addEventListener("click", goToLanding);
    return () => logo.removeEventListener("click", goToLanding);
  });

  // A navigation is a new history entry, an in-page change replaces it.
  const routing = createCorasRouting({
    url,
    navigate: (href) => void goto(href),
    replace: (href) =>
      void goto(href, { replaceState: true, noScroll: true, keepFocus: true }),
  });
</script>

<CorasMount
  page={route.page}
  params={route.params}
  {config}
  {chrome}
  {...routing}
/>
{@render children()}
