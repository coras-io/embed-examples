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

const props = defineProps<{
  page: CorasPageName;
  params?: CorasPageParams;
  config: CorasConfig;
  chrome?: CorasChrome;
}>();

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
    strict: true,
    page: props.page,
    params: props.params,
    config: props.config,
    chrome: props.chrome,
    onNavigate: (detail) => emit("navigate", detail),
    onStateChange: (detail) => emit("stateChange", detail),
  });
});

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
  <div ref="container" style="display: contents" />
</template>
