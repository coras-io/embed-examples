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

export function CorasMount() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<CorasApp | null>(null);

  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    const url = search ? `${pathname}?${search}` : pathname;
    const { page, params } = parseCorasUrl(url, ticketsUrlStrategy);
    app.update({ page, params });
  }, [pathname, search]);

  return <div ref={containerRef} />;
}
