<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { SupportedCurrencies, SupportedLocales } from "@coras-io/embed";
import { createCorasRouting } from "@coras-io/embed/url";
import CorasMount from "../CorasMount.vue";
import { buildConfig, chrome, defaultCurrency, logo, url } from "../coras.ts";

const route = useRoute();
const router = useRouter();

const parsed = computed(() => url.parse(route.fullPath));
const page = computed(() => parsed.value.page);
const params = computed(() => parsed.value.params);

// The URL names the locale; the currency only when it is not the locale's default.
const config = computed(() =>
  buildConfig(
    parsed.value.locale ?? (route.params.locale as SupportedLocales),
    parsed.value.currency ??
      (defaultCurrency(parsed.value.locale) as SupportedCurrencies),
  ),
);

// A navigation pushes a history entry, an in-page change replaces it.
const routing = createCorasRouting({
  url,
  navigate: (href) => void router.push(href),
  replace: (href) => void router.replace(href),
});

function goToLanding(): void {
  void router.push(`/${route.params.locale}`);
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
    :href-for="routing.hrefFor"
    @navigate="routing.onNavigate"
    @state-change="routing.onStateChange"
  />
  <RouterView />
</template>
