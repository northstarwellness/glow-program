import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../../lovable-landing";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "The Inner Glow Reset — 21-Day Beauty Ritual App | NOURÉ" },
      {
        name: "description",
        content:
          "A 21-day morning ritual for radiant skin, a calm gut, and steady energy. $21 — yours forever.",
      },
    ],
  }),
  component: LandingPage,
});
