import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

// Rendered by the persistent mount in `$locale.$currency.tsx`; this route owns
// the `id` path segment and the details URL's search contract.

const routeParamsSchema = v.object({
  id: v.string(),
});

const searchParamsSchema = v.object({
  date: v.optional(v.string()),
});

export const Route = createFileRoute("/$locale/$currency/$id")({
  component: () => null,
  params: { parse: (rawParams) => v.parse(routeParamsSchema, rawParams) },
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
