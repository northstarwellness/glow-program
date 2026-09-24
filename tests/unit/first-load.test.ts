import { it, expect } from "vitest";

// The store reads noure_app_v1 synchronously when the module first loads (app start).
// Seed storage BEFORE importing, exactly like a returning customer opening the app.
it("a returning customer's saved progress loads on app start, with no backup key written", async () => {
  localStorage.clear();
  const saved = JSON.stringify({
    state: {
      verifiedEmail: "q@x.test",
      name: "Kara",
      completedDays: [1, 2, 3, 4],
      seenWelcome: true,
    },
    version: 0,
  });
  localStorage.setItem("noure_app_v1", saved);
  const { useApp, activeDay } = await import("@/lib/store");
  const s = useApp.getState();
  expect(s.name).toBe("Kara");
  expect(s.completedDays).toEqual([1, 2, 3, 4]);
  expect(activeDay(s.completedDays)).toBe(5);
  expect(localStorage.getItem("noure_app_v1_unreadable_backup")).toBeNull();
  expect(localStorage.getItem("noure_app_v1")).toBe(saved); // loading alone never rewrites it
});
