import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// Router devtools are a dev-only aid: lazy-loaded and rendered only outside
// production, so the built site never imports or ships them.
const RouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <Suspense>
        <RouterDevtools />
      </Suspense>
    </>
  ),
});
