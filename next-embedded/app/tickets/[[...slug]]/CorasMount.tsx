"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  mount,
  type CorasApp,
  type CorasNavigateDetail,
  type CorasStateChangeDetail,
} from "@coras-io/embed";
import { buildCorasUrl, parseCorasUrl } from "@coras-io/embed/url";
import { buildConfig, chrome, ticketsUrlStrategy } from "./coras";

/**
 * Mounts Coras into the host's content region for the `/tickets` sub-tree.
 *
 * The SDK is browser-only, so the mount happens in `useEffect` (never during
 * SSR/prerender) into a container ref, and is torn down on unmount. It is
 * created once and kept in sync with the host URL - path *and* query:
 *
 * - A Coras navigation intent (`onNavigate`) becomes a `/tickets/...` URL pushed
 *   with Next's router; an in-page state change (`onStateChange`, e.g. a search
 *   filter) replaces the current entry instead. An external `href` opens a tab.
 * - Route or query changes (`usePathname` + `useSearchParams`) are reflected back
 *   with `app.update`, which re-renders without re-emitting, so there is no loop.
 */
export function CorasMount() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<CorasApp | null>(null);

  // The router identity can change across renders; route through a ref so the
  // mount effect stays mount-once and never remounts Coras on navigation.
  const routerRef = useRef(router);
  routerRef.current = router;

  // Mount once, in the browser only.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // A navigation pushes a new URL; an in-page state change replaces the
    // current one (so filters don't fill the history). Both carry path + query.
    const syncCoras = (
      detail: CorasNavigateDetail | CorasStateChangeDetail,
      replace: boolean,
    ): void => {
      if ("href" in detail && detail.href) {
        window.open(detail.href, "_blank", "noopener,noreferrer");
        return;
      }
      const to = buildCorasUrl(
        { page: detail.page, params: detail.params ?? {} },
        ticketsUrlStrategy,
      );
      if (replace) routerRef.current.replace(to);
      else routerRef.current.push(to);
    };

    const { page, params } = parseCorasUrl(
      window.location.pathname + window.location.search,
      ticketsUrlStrategy,
    );

    const app = mount({
      container,
      strict: true,
      page,
      params,
      config: buildConfig(),
      chrome,
      onNavigate: (intent) => syncCoras(intent, false),
      onStateChange: (state) => syncCoras(state, true),
    });
    appRef.current = app;

    return () => {
      app.unmount();
      appRef.current = null;
    };
  }, []);

  // Reflect host route + query changes back into the live mount, without
  // remounting. update() re-renders in place and does not re-emit onNavigate.
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    const url = search ? `${pathname}?${search}` : pathname;
    const { page, params } = parseCorasUrl(url, ticketsUrlStrategy);
    app.update({ page, params });
  }, [pathname, search]);

  return <div ref={containerRef} />;
}
