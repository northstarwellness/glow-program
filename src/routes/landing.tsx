import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../../lovable-landing";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "The Inner Glow Reset — 21-Day Beauty Ritual App | NOURÉ" },
      {
        name: "description",
        content:
          "A 21-day beauty-from-within morning ritual of smoothies, check-ins and reflection. $21, yours forever.",
      },
    ],
  }),
  component: LandingPage,
});
