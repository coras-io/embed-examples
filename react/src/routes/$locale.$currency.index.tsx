import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

// The page is rendered by the persistent mount in `$locale.$currency.tsx`; this
// route only declares the landing URL's search contract and metadata.

const sortOptions = ["popularity", "lowest_price", "rating"] as const;

const searchParamsSchema = v.object({
  city: v.optional(v.string()),
  country: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  sort: v.optional(v.picklist(sortOptions), "popularity"),
  categories: v.optional(v.string()),
  duration: v.optional(v.string()),
  price: v.optional(v.string()),
});

export const Route = createFileRoute("/$locale/$currency/")({
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
