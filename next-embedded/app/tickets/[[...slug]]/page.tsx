import { Suspense } from "react";
import { CorasMount } from "./CorasMount";

export default function TicketsPage() {
  return (
    <Suspense>
      <CorasMount />
    </Suspense>
  );
}
