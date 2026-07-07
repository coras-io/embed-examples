<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from "vue";
import {
  mount,
  type CorasApp,
  type CorasChrome,
  type CorasConfig,
  type CorasNavigateDetail,
  type CorasPageName,
  type CorasPageParams,
  type CorasStateChangeDetail,
} from "@coras-io/embed";

/**
 * Thin Vue wrapper around the SDK `mount()` contract. It mounts once in
 * `onMounted`, reflects page/params/config changes with `app.update()` (never a
 * remount), and tears the app down in `onUnmounted`.
 *
 * This is host integration code, not a published wrapper: every framework uses
 * the same `mount()` / `update()` / `unmount()` API.
 */
const props = defineProps<{
  page: CorasPageName;
  params?: CorasPageParams;
  config: CorasConfig;
  chrome?: CorasChrome;
}>();

// The host owns routing: the SDK reports intent, the parent turns it into a
// real navigation. `emit` identity is stable, so the mount's callbacks always
// reach the latest handler without re-mounting.
const emit = defineEmits<{
  navigate: [detail: CorasNavigateDetail];
  stateChange: [detail: CorasStateChangeDetail];
}>();

const container = useTemplateRef<HTMLDivElement>("container");
let app: CorasApp | null = null;

onMounted(() => {
  if (!container.value) return;
  app = mount({
    container: container.value,
    page: props.page,
    params: props.params,
    config: props.config,
    chrome: props.chrome,
    onNavigate: (detail) => emit("navigate", detail),
    onStateChange: (detail) => emit("stateChange", detail),
  });
});

// Reflect page/params/config changes in place. `update` does not re-emit
// `onNavigate`, so feeding a URL-derived page back in cannot loop.
watch(
  () => [props.page, props.params, props.config],
  () => {
    app?.update({
      page: props.page,
      params: props.params,
      config: props.config,
    });
  },
  { deep: true },
);

onUnmounted(() => {
  app?.unmount();
  app = null;
});
</script>

<template>
  <div ref="container" />
</template>
