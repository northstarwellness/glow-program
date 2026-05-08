import { createFileRoute } from "@tanstack/react-router";
import { DayView } from "./today";

export const Route = createFileRoute("/day/$n")({
  head: () => ({ meta: [{ title: "Your day — NOURÉ Inner Glow" }] }),
  component: Day,
});

function Day() {
  const { n } = Route.useParams();
  const day = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  return <DayView day={day} />;
}
