import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

// Rendered by the persistent mount in `$locale.$currency.tsx`.

const searchParamsSchema = v.object({
  content: v.optional(v.string()),
});

export const Route = createFileRoute("/$locale/$currency/help")({
  component: () => null,
  validateSearch: searchParamsSchema,
  head: () => ({
    meta: [
      { title: "Coras Help Centre" },
      {
        name: "description",
        content: "Find answers to common questions and get support",
      },
    ],
  }),
});
