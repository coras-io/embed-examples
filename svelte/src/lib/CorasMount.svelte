<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  // Keep this import static: an awaited dynamic import lets destroy race the
  // mount. See AGENTS.md.
  import { mount } from "@coras-io/embed";
  import type {
    CorasApp,
    CorasChrome,
    CorasConfig,
    CorasNavigateDetail,
    CorasPageName,
    CorasPageParams,
    CorasStateChangeDetail,
  } from "@coras-io/embed";

  let {
    page,
    params,
    config,
    chrome,
    onNavigate,
    onStateChange,
  }: {
    page: CorasPageName;
    params?: CorasPageParams;
    config: CorasConfig;
    chrome?: CorasChrome;
    onNavigate?: (intent: CorasNavigateDetail) => void;
    onStateChange?: (state: CorasStateChangeDetail) => void;
  } = $props();

  let container: HTMLDivElement;
  let app: CorasApp | undefined;

  onMount(() => {
    app = mount({
      container,
      strict: true,
      page,
      params,
      config,
      chrome,
      onNavigate: (intent) => onNavigate?.(intent),
      onStateChange: (state) => onStateChange?.(state),
    });
  });

  $effect(() => {
    const next = { page, params, config };
    app?.update(next);
  });

  onDestroy(() => {
    app?.unmount();
    app = undefined;
  });
</script>

<div bind:this={container} style="display: contents"></div>
