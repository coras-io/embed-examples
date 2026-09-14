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

const route = useRoute();
const router = useRouter();

const parsed = computed(() => url.parse(route.fullPath));
const page = computed(() => parsed.value.page);
const params = computed(() => parsed.value.params);

const config = computed(() =>
  buildConfig(
    route.params.locale as SupportedLocales,
    route.params.currency as SupportedCurrencies,
  ),
);

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
