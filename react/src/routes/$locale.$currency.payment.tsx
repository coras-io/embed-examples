import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

// Rendered by the persistent mount in `$locale.$currency.tsx`.

// The payment page carries no URL search params. `metadata` is host context
// (not shareable URL state), so it is supplied to `mount()` directly, not here.
const searchParamsSchema = v.object({});

export const Route = createFileRoute("/$locale/$currency/payment")({
  component: () => null,
  validateSearch: searchParamsSchema,
  head: () => ({
    meta: [
      { title: "Coras Tickets" },
      {
        name: "description",
        content: "Book tickets to West End Shows, Concerts and more",
      },
    ],
  }),
});
