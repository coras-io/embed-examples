import * as v from "valibot";
import { createFileRoute } from "@tanstack/react-router";

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
