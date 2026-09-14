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

  const { chrome, logo } = buildChrome();

  const locale = $derived(page.params.locale as SupportedLocales);
  const currency = $derived(page.params.currency as SupportedCurrencies);

  const route = $derived(url.parse(page.url.href));
  const config = $derived(buildConfig(locale, currency));

  $effect(() => {
    const goToLanding = () => goto(`/${locale}/${currency}`);
    logo.addEventListener("click", goToLanding);
    return () => logo.removeEventListener("click", goToLanding);
  });

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
