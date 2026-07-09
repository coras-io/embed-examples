<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  CorasNavigateDetail,
  CorasStateChangeDetail,
  SupportedCurrencies,
  SupportedLocales,
} from "@coras-io/embed";
import CorasMount from "../CorasMount.vue";
import { buildConfig, chrome, logo, url } from "../coras.ts";

/**
 * Single persistent mount for every page under `/:locale/:currency`. The page
 * and params are derived from the URL, so navigating between child routes (and
 * back/forward) updates the mount in place instead of tearing it down - the
 * navbar, footer, and chrome stay put and only the page content swaps.
 */
const route = useRoute();
const router = useRouter();

// Deep links and refreshes just work: the current view is read straight from
// the URL rather than tracked in component state.
const parsed = computed(() => url.parse(route.fullPath));
const page = computed(() => parsed.value.page);
const params = computed(() => parsed.value.params);

const config = computed(() =>
  buildConfig(
    route.params.locale as SupportedLocales,
    route.params.currency as SupportedCurrencies,
  ),
);

// Host owns routing. Turn an SDK navigation *intent* into a real URL and hand
// it to the router; the route change flows back through `parsed` into the
// mount. `push` adds a history entry (a link/selection), `replace` does not (an
// in-page state change such as a filter).
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
  void router[replace ? "replace" : "push"](href);
}

// The navbar logo is host-owned DOM (slotted into the SDK navbar), so its click
// is wired here: return to the landing page for the current locale/currency.
function goToLanding(): void {
  void router.push(`/${route.params.locale}/${route.params.currency}`);
}
onMounted(() => logo.addEventListener("click", goToLanding));
onUnmounted(() => logo.removeEventListener("click", goToLanding));
</script>

<template>
  <CorasMount
    :page="page"
    :params="params"
    :config="config"
    :chrome="chrome"
    @navigate="syncUrl($event, false)"
    @state-change="syncUrl($event, true)"
  />
  <RouterView />
</template>
