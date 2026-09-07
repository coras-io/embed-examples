<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type {
    CorasApp,
    CorasChrome,
    CorasConfig,
    CorasNavigateDetail,
    CorasPageName,
    CorasPageParams,
    CorasStateChangeDetail,
  } from "@coras-io/embed";

  // Thin Svelte wrapper around the SDK `mount()` contract. It mounts once (in
  // `onMount`, so the client-side web components never run during SSR), reflects
  // page/params/config changes with `app.update()` instead of remounting, and
  // tears the app down on destroy. This is host integration code, not a
  // published wrapper: every framework uses the same
  // `mount()` / `update()` / `unmount()` API.
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

  // Mount once. The callback props are read through the closure, so the latest
  // handler always runs even if the parent passes a new function identity.
  onMount(async () => {
    // Import the SDK lazily, on the client only. A static import would pull the
    // browser-only SDK (and its transitive deps) into SvelteKit's server build.
    const { mount } = await import("@coras-io/embed");
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

  // Reflect page/params/config changes in place. `update` re-renders without
  // re-emitting `onNavigate`, so the URL-driven updates below cannot loop.
  $effect(() => {
    // Reference the reactive props so the effect re-runs when they change.
    const next = { page, params, config };
    app?.update(next);
  });

  onDestroy(() => {
    app?.unmount();
    app = undefined;
  });
</script>

<div bind:this={container}></div>
