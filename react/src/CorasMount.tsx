import { useEffect, useRef } from "react";
import {
  mount,
  type CorasApp,
  type CorasCallbacks,
  type CorasChrome,
  type CorasConfig,
  type CorasPageName,
  type CorasPageParamsByPage,
} from "@coras-io/embed";

type CorasMountProps<P extends CorasPageName> = {
  page: P;
  config: CorasConfig;
  params?: CorasPageParamsByPage[P];
  chrome?: CorasChrome;
} & CorasCallbacks;

/**
 * Thin React wrapper around the SDK `mount()` contract. It mounts once, keeps
 * the latest callbacks in a ref (so identity changes do not remount), updates
 * the app when page/params/config change, and tears the app down on unmount.
 *
 * This is host integration code, not a published wrapper: every framework uses
 * the same `mount()`/`update()`/`unmount()` API (ADR 0002).
 */
export function CorasMount<P extends CorasPageName>(
  props: CorasMountProps<P>,
): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<CorasApp | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // Mount once; route callbacks through the ref so the latest handler runs.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const app = mount({
      container,
      strict: true,
      page: propsRef.current.page,
      config: propsRef.current.config,
      params: propsRef.current.params,
      chrome: propsRef.current.chrome,
      onReady: (detail) => propsRef.current.onReady?.(detail),
      onNavigate: (detail) => propsRef.current.onNavigate?.(detail),
      onStateChange: (detail) => propsRef.current.onStateChange?.(detail),
      onReservationCreated: (detail) =>
        propsRef.current.onReservationCreated?.(detail),
      onPaymentStatus: (detail) => propsRef.current.onPaymentStatus?.(detail),
      onError: (detail) => propsRef.current.onError?.(detail),
      onObservability: (event) => propsRef.current.onObservability?.(event),
    });
    appRef.current = app;

    return () => {
      app.unmount();
      appRef.current = null;
    };
  }, []);

  // Reflect page/params/config changes without remounting.
  useEffect(() => {
    appRef.current?.update({
      page: props.page,
      params: props.params,
      config: props.config,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.page, JSON.stringify(props.params), JSON.stringify(props.config)]);

  return <div ref={containerRef} />;
}
