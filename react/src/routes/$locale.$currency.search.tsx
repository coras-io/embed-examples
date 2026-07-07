import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

// Rendered by the persistent mount in `$locale.$currency.tsx`.

const searchParamsSchema = v.object({
  startDate: v.optional(v.string()),
  search: v.optional(v.string()),
});

export const Route = createFileRoute("/$locale/$currency/search")({
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
