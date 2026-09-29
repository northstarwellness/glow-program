import { test as base, expect, type Page } from "@playwright/test";

export const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
export const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export function customer(over: Record<string, unknown> = {}) {
  return {
    state: {
      verifiedEmail: "qa@example.test",
      name: "QA",
      startDate: daysAgo(0),
      completedDays: [],
      journalEntries: { 2: { prompt: "p", entry: "keep-me", response: "r", timestamp: "t" } },
      dailyLogs: {},
      savedRecipes: ["pomegranate-elixir"],
      photos: {},
      notificationTime: "07:00",
      badgesEarned: [],
      seenWelcome: true,
      shownMilestones: [],
      groceryChecked: { beet: true },
      outcomesByDay: { 3: ["Glowy"] },
      ...over,
    },
    version: 0,
  };
}

/** Seeds noure_app_v1 once per browser context (reopen keeps what the app wrote). */
export async function seed(page: Page, value: object) {
  await page.context().addInitScript((v) => {
    if (!localStorage.getItem("noure_app_v1")) localStorage.setItem("noure_app_v1", v);
  }, JSON.stringify(value));
}

export const stored = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("noure_app_v1") || "null")?.state);

/** Wait until React has hydrated — a real tap can't land before the app is interactive, so tests shouldn't either. */
export const ready = (page: Page) =>
  page.waitForSelector("html[data-hydrated]", { state: "attached", timeout: 20_000 });

/** Navigate without waiting for hydration (for tests that hold scripts back on purpose). */
export const rawGoto = (page: Page, url: string, opts?: Parameters<Page["goto"]>[1]) =>
  (page as unknown as { rawGoto: Page["goto"] }).rawGoto(url, opts);

const PRELOAD_TIMING_NOTICE =
  /^The resource http:\/\/127\.0\.0\.1:\d+\/assets\/[\w.-]+\.js was preloaded using link preload but not used within a few seconds/;

export const test = base.extend<{ errors: string[] }>({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    (page as unknown as { rawGoto: Page["goto"] }).rawGoto = goto;
    const reload = page.reload.bind(page);
    page.goto = async (...args: Parameters<Page["goto"]>) => {
      const r = await goto(...args);
      await ready(page);
      return r;
    };
    page.reload = async (...args: Parameters<Page["reload"]>) => {
      const r = await reload(...args);
      await ready(page);
      return r;
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright's fixture callback, not React's use()
    await use(page);
  },
  errors: [
    async ({ page }, use) => {
      const errs: string[] = [];
      page.on("pageerror", (e) => errs.push(`pageerror/unhandled: ${e.message}`));
      page.on("console", (m) => {
        if (m.type() !== "error" && m.type() !== "warning") return;
        // WebKit's preload *timing* notice fires when a CPU-starved test machine hydrates a few
        // seconds late; the app's own chunks are always used. Every other warning still fails.
        if (m.type() === "warning" && PRELOAD_TIMING_NOTICE.test(m.text())) return;
        errs.push(`console ${m.type()}: ${m.text()}`);
      });
      page.on("response", (r) => {
        if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`);
      });
      await use(errs);
      expect(errs, "console errors/warnings, unhandled rejections or failed requests").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

/** Home's primary Reset action: "Begin Day 1" before starting, "Continue Day N" after. */
export const homePrimary = (page: Page) =>
  page.getByRole("link", { name: /^(Begin|Continue) Day \d+/ });

export async function openTodaysRitual(page: Page) {
  await page.goto("/home");
  await homePrimary(page).click();
}

/**
 * Taps "Mark Day N Complete". The app ignores a completion tap within 800ms of the previous
 * completion (accidental double-tap guard) — a real customer can't finish two days that fast,
 * so the helper waits that window out before tapping.
 */
export async function markComplete(page: Page, n: number) {
  await page.waitForTimeout(850);
  await page.getByRole("button", { name: new RegExp(`^Mark Day ${n} Complete`) }).click();
}
