"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { mount, type CorasApp } from "@coras-io/embed";
import {
  buildCorasUrl,
  createCorasRouting,
  parseCorasUrl,
} from "@coras-io/embed/url";
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

    // Locale and currency are fixed in `config`, so a URL carries page and params only.
    const routing = createCorasRouting({
      url: {
        build: ({ page, params }) =>
          buildCorasUrl({ page, params }, ticketsUrlStrategy),
      },
      navigate: (href) => routerRef.current.push(href),
      replace: (href) => routerRef.current.replace(href),
    });

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
      ...routing,
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
