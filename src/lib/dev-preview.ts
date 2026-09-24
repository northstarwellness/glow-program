import { useApp } from "./store";

/** Local-development-only gate bypass: open any page with ?devPreview=1
 *  to enter the app as a mid-reset preview user.
 *  import.meta.env.DEV is statically false in production builds, so this
 *  entire block is stripped from the deployed bundle — the Shopify
 *  purchase gate is untouched in production. */
if (
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("devPreview")
) {
  const s = useApp.getState();
  if (!s.verifiedEmail) s.setVerifiedEmail("dev@local.test");
  if (!s.name) s.setName("Karac");
  if (!s.seenWelcome) s.setSeenWelcome();
  if (!s.startDate) {
    useApp.setState({
      startDate: new Date(Date.now() - 8 * 86400000).toISOString(),
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8],
      shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
    });
  }
}
