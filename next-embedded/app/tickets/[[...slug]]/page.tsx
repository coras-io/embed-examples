import { Suspense } from "react";
import { CorasMount } from "./CorasMount";

// The catch-all `/tickets/[[...slug]]` route hands its whole sub-tree to Coras.
// This page is a server component that renders nothing but the client mount -
// the SDK is browser-only, so every DOM touch lives inside CorasMount's effect.
//
// CorasMount reads `useSearchParams()`, which opts a client component out of
// prerendering unless it sits under a Suspense boundary. Wrapping it here keeps
// the route statically renderable: the shell prerenders and the mount fills in
// on the client.
export default function TicketsPage() {
  return (
    <Suspense>
      <CorasMount />
    </Suspense>
  );
}
