import type { Locator, Page } from "@playwright/test";
import { test, expect, customer, seed, stored, range, homePrimary } from "./fixtures";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

const shown = (upTo: number) => [1, 7, 14].filter((m) => m <= upTo).map((m) => `day-${m}`);
/** Active day `day` (Days 1..day-1 complete). */
const onDay = (day: number, over: Record<string, unknown> = {}) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1), ...over });
const finished = (over: Record<string, unknown> = {}) =>
  customer({
    completedDays: range(1, 21),
    shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
    ...over,
  });

const reset = (page: Page) => page.getByTestId("path-reset");
const everyday = (page: Page) => page.getByTestId("path-everyday");

/** The control can be brought fully into view (centered) with nothing covering it. */
async function expectUncovered(page: Page, loc: Locator) {
  const hit = await loc.evaluate(async (el) => {
    el.scrollIntoView({ block: "center" });
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!top && (top === el || el.contains(top));
  });
  expect(hit, `${await loc.innerText()} is covered (bottom nav or overlay)`).toBe(true);
}
/** At the very bottom of the page, the last control ends above the fixed navigation. */
async function expectLastClearOfNav(page: Page) {
  const gap = await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const all = [...document.querySelectorAll("main a, main button")];
    const last = all[all.length - 1].getBoundingClientRect();
    const nav = document.querySelector("nav.fixed")!.getBoundingClientRect();
    return nav.top - last.bottom;
  });
  expect(gap, "last control sits behind the bottom nav").toBeGreaterThanOrEqual(0);
}
const noSidewaysScroll = async (page: Page, where: string) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    `${where} scrolls sideways`,
  ).toBeLessThanOrEqual(1);

test.describe("Home: the two paths", () => {
  test("before starting: Reset leads with Begin Day 1; Everyday is visible too", async ({
    page,
  }) => {
    await seed(page, onDay(1));
    await page.goto("/home");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your morning ritual.");
    await expect(page.getByText(/Good morning, QA/)).toBeVisible();
    await expect(homePrimary(page)).toHaveText(/^Begin Day 1/);
    await expect(homePrimary(page)).toHaveAttribute("href", "/day/1");
    await expect(everyday(page).getByRole("link", { name: /^Browse recipes/ })).toBeVisible();
    // Reset comes first while the program is in progress.
    const order = await page
      .locator('[data-testid^="path-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
    expect(order).toEqual(["path-reset", "path-everyday"]);
  });

  test("in progress (Day 6): Continue Day 6, real day content, today's recipe block", async ({
    page,
  }) => {
    await seed(page, onDay(6));
    await page.goto("/home");
    await expect(homePrimary(page)).toHaveText(/^Continue Day 6/);
    await expect(reset(page)).toContainText("06");
    await expect(reset(page)).toContainText("5 of 21 complete");
    await expect(reset(page)).toContainText("Foundation · Week 1");
    await expect(reset(page)).toContainText("The Quiet Build");
    const block = reset(page).getByRole("link", { name: /^Day 6 recipe: Fig & Almond/ });
    await expect(block).toHaveAttribute("href", /\/recipes\/fig-almond\?source=day&day=6/);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");
  });

  test("after Day 21: Everyday leads; the Reset stays reachable with the Glow Reflection", async ({
    page,
  }) => {
    await seed(page, finished());
    await page.goto("/home");
    const order = await page
      .locator('[data-testid^="path-"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
    expect(order).toEqual(["path-everyday", "path-reset"]);
    await expect(everyday(page).getByRole("link", { name: /^Browse recipes/ })).toHaveClass(
      /\bink-btn\b/,
    );
    await expect(reset(page)).toContainText("Complete · 21 of 21");
    await reset(page).getByRole("link", { name: "Your Reflection", exact: true }).click();
    await expect(page).toHaveURL(/\/reflection$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("21-day reflection");
    await page.goto("/home");
    await reset(page).getByRole("link", { name: "All 21 days" }).click();
    await expect(page).toHaveURL(/\/rituals$/);
  });

  test("Everyday Mornings opens the library and never changes Reset progress", async ({ page }) => {
    await seed(page, onDay(6));
    await page.goto("/home");
    const before = await stored(page);
    await everyday(page)
      .getByRole("link", { name: /^Browse recipes/ })
      .click();
    await expect(page).toHaveURL(/\/recipes$/);
    // Open a recipe from the library, as an everyday morning would.
    await page.locator('main a[href^="/recipes/cherry-cacao"]').first().click();
    await expect(page).toHaveURL(/\/recipes\/cherry-cacao/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Cherry Cacao");
    await expect(page.getByRole("button", { name: /^Mark Day/ })).toHaveCount(0);
    await page.goto("/home");
    await expect(homePrimary(page)).toHaveText(/^Continue Day 6/);
    const after = await stored(page);
    expect(after.completedDays).toEqual(before.completedDays);
    expect(after.dailyLogs).toEqual(before.dailyLogs);
    expect(after.outcomesByDay).toEqual(before.outcomesByDay);
    expect(after.journalEntries).toEqual(before.journalEntries);
  });

  test("rows reach Journal (today's prompt), Progress, Glow Guide; Reds keeps its shop link", async ({
    page,
  }) => {
    await seed(page, onDay(3));
    const nav = page.getByRole("navigation", { name: "More in your ritual" });
    for (const [name, url, landed] of [
      [/^Morning Journal/, /\/journal\/3$/, "Optional · How this morning felt · Day 3"],
      [/^Progress/, /\/progress$/, "Every morning you've kept."],
    ] as const) {
      await page.goto("/home");
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByText(landed)).toBeVisible();
    }
    // The Ritual Guide now has its own tiles below the rows.
    await page.goto("/home");
    await page
      .getByTestId("knowledge-tiles")
      .getByRole("link", { name: /^Ritual Guide/ })
      .click();
    await expect(page).toHaveURL(/\/bonuses\?section=guide$/);
    await expect(page.getByText("Everything inside.")).toBeVisible();
    await page.goto("/home");
    await expect(nav.getByRole("link", { name: /^Radiant Reds/ })).toHaveAttribute(
      "href",
      /nourewellness\.com/,
    );
  });

  test("legacy progress (strings, gaps, duplicates) shows the true active day and nothing is rewritten", async ({
    page,
  }) => {
    await seed(
      page,
      customer({
        completedDays: ["1", 2, 2, 4],
        shownMilestones: ["day-1"],
        savedRecipes: ["pomegranate-elixir"],
      }),
    );
    await page.goto("/home");
    await expect(homePrimary(page)).toHaveText(/^Continue Day 3/);
    await expect(reset(page)).toContainText("3 of 21 complete");
    const s = await stored(page);
    expect(s.savedRecipes).toEqual(["pomegranate-elixir"]);
    expect(s.journalEntries[2].entry).toBe("keep-me");
    expect(s.outcomesByDay).toEqual({ 3: ["Glowy"] });
  });

  test("copy on Home is claim-safe in every state", async ({ page }) => {
    for (const v of [onDay(1), onDay(12), finished()]) {
      await page.context().clearCookies();
      await page.goto("/");
      await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(v));
      await page.goto("/home");
      const text = await page.locator("main").innerText();
      for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(text).not.toMatch(re);
    }
  });
});

test.describe("Home: counters, weeks, Quick Mornings, recipe colors", () => {
  const counter = (page: Page, label: string) =>
    page.getByTestId("counters").locator("div", { hasText: label }).locator("p").first();

  for (const [name, v, mornings, second, secondLabel] of [
    ["untouched profile", () => onDay(1), "0", "Day 1", "Next morning"],
    ["Day 6 in progress", () => onDay(6), "5", "Day 6", "Next morning"],
    ["Day 21 complete", () => finished(), "21", "1", "Journal entry"],
    [
      "legacy gap (1,2,4 done)",
      () => customer({ completedDays: [1, 2, 4], shownMilestones: ["day-1"] }),
      "3",
      "Day 3",
      "Next morning",
    ],
  ] as const) {
    test(`Mornings complete and next morning: ${name}`, async ({ page }) => {
      await seed(page, v());
      await page.goto("/home");
      await expect(counter(page, "complete")).toHaveText(mornings);
      await expect(counter(page, secondLabel)).toHaveText(second);
      await expect(page.getByText(/Glow Score|streak/i)).toHaveCount(0);
    });
  }

  test("Foundation, Build and Glow show done, today and upcoming dots from real progress", async ({
    page,
  }) => {
    await seed(page, onDay(9));
    await page.goto("/home");
    const states = (w: number) =>
      page
        .getByTestId(`week-${w}`)
        .locator("[data-state]")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-state")));
    expect(await states(1)).toEqual(Array(7).fill("done"));
    expect(await states(2)).toEqual([
      "done",
      "today",
      "upcoming",
      "upcoming",
      "upcoming",
      "upcoming",
      "upcoming",
    ]);
    expect(await states(3)).toEqual(Array(7).fill("upcoming"));
    for (const [w, label] of [
      [1, "Foundation"],
      [2, "Build"],
      [3, "Glow"],
    ] as const)
      await expect(page.getByTestId(`week-${w}`)).toContainText(label);
    // Shape, not only color: done, today and upcoming dots have different sizes and borders.
    const shape = await page
      .getByTestId("week-2")
      .locator("[data-state]")
      .evaluateAll((els) =>
        els.slice(0, 3).map((e) => {
          const cs = getComputedStyle(e);
          return `${cs.width}/${cs.borderTopWidth}`;
        }),
      );
    expect(new Set(shape).size).toBe(3);
    await expect(page.getByTestId("week-2")).toContainText("Day 9 is today");
  });

  test("Quick Mornings keeps its own section, wording and Open the set link", async ({ page }) => {
    await seed(page, onDay(4));
    await page.goto("/home");
    const q = page.getByTestId("quick-glow");
    await expect(q).toContainText("Quick Mornings.");
    await expect(q).toContainText("Short on time? Choose a simple smoothie for this morning.");
    await expect(q).toContainText("Open the set");
    await expect(q).not.toContainText("Everyday");
    await expect(q).toHaveAttribute("href", "/recipes#quick-glow");
    await expect(everyday(page)).not.toContainText("Quick Mornings");
  });

  for (const [day, id] of [
    [3, "cherry-cacao"],
    [4, "plum-rose"],
    [6, "fig-almond"],
    [5, "watermelon-reds"],
  ] as const) {
    test(`Day ${day}: Home paints ${id} with the exact gradient the Smoothies library uses`, async ({
      page,
    }) => {
      await seed(page, onDay(day));
      await page.goto("/home");
      const bgHome = await page
        .getByTestId("today-recipe")
        .locator("div")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      await page.goto("/recipes");
      const bgLibrary = await page
        .locator(`main a[href="/recipes/${id}"], main a[href^="/recipes/${id}?"]`)
        .first()
        .locator("div div")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bgHome).toContain("linear-gradient");
      expect(bgHome).toBe(bgLibrary);
    });
  }
});

test.describe("Home: accessibility and layout", () => {
  test("keyboard: Tab reaches the primary action with a visible focus ring, Enter opens the day", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/home");
    const primary = homePrimary(page);
    // Safari (WebKit) skips links on plain Tab by default (Option-Tab reaches them), so there
    // the link is focused directly; the focus ring and Enter are still checked on both engines.
    if (test.info().project.name.includes("webkit")) {
      await primary.focus();
    } else {
      let reached = false;
      for (let i = 0; i < 12 && !reached; i++) {
        await page.keyboard.press("Tab");
        reached = await primary.evaluate((el) => el === document.activeElement);
      }
      expect(reached, "primary action reachable by Tab").toBe(true);
    }
    await expect(primary).toBeFocused();
    const outline = await primary.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/day\/4$/);
  });

  for (const width of [320, 375, 390, 412]) {
    test(`${width}px: no sideways scroll, 44px targets, nothing hidden behind the nav`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 720 });
      for (const v of [onDay(6), finished()]) {
        await page.context().clearCookies();
        await page.goto("/");
        await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(v));
        await page.goto("/home");
        await noSidewaysScroll(page, `/home @${width}`);
        const targets = page.locator("main a, main button");
        const n = await targets.count();
        for (let i = 0; i < n; i++) {
          const t = targets.nth(i);
          const box = await t.boundingBox();
          expect(box, `target ${i}`).not.toBeNull();
          expect(box!.height, `${await t.innerText()} is shorter than 44px`).toBeGreaterThanOrEqual(
            43.5, // sub-pixel layout rounding; the controls are styled at 44px
          );
          await expectUncovered(page, t);
        }
        await expectLastClearOfNav(page);
        // No text is cut off inside a card (cards clip, so page scroll alone can't catch it).
        const clipped = await page.evaluate(() => {
          const out: string[] = [];
          for (const el of document.querySelectorAll("main *")) {
            const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
            if (!own || el.closest(".sr-only")) continue; // screen-reader text is 1px by design
            const r = el.getBoundingClientRect();
            for (let p = el.parentElement; p && p.tagName !== "MAIN"; p = p.parentElement) {
              const cs = getComputedStyle(p);
              if (cs.overflow === "visible" && cs.overflowX === "visible") continue;
              const pr = p.getBoundingClientRect();
              if (r.right > pr.right + 1 || r.left < pr.left - 1)
                out.push(el.textContent!.trim().slice(0, 30));
              break;
            }
            if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "visible")
              out.push(`scroll:${el.textContent!.trim().slice(0, 30)}`);
          }
          return out;
        });
        expect(clipped, `clipped text @${width}`).toEqual([]);
      }
    });
  }

  test("text contrast on Home meets 4.5:1 for every visible text element", async ({ page }) => {
    await seed(page, onDay(6));
    await page.goto("/home");
    const failures = await page.evaluate(() => {
      const parse = (c: string) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const [r, g, b, a = "1"] = m[1].split(/[ ,/]+/).filter(Boolean);
        return [+r, +g, +b, +a];
      };
      const lum = ([r, g, b]: number[]) => {
        const f = (v: number) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      /** Gradient stops behind the element, if any (text on a gradient is checked against each). */
      const gradientStops = (el: Element | null): number[][] => {
        for (let e = el; e; e = e.parentElement) {
          const img = getComputedStyle(e).backgroundImage;
          if (img.includes("gradient"))
            // Solid stops only; translucent glint overlays are covered by the unit contrast test.
            return [...img.matchAll(/rgba?\([^)]+\)/g)]
              .map((m) => parse(m[0])!)
              .filter((c) => c && c[3] === 1);
        }
        return [];
      };
      const bgOf = (el: Element | null): number[] => {
        let base = [255, 255, 255];
        const stack: number[][] = [];
        for (let e = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor);
          if (c && c[3] > 0) stack.push(c);
          if (c && c[3] === 1) break;
        }
        for (const c of stack.reverse())
          base = base.map((v, i) => v * (1 - c[3]) + c[i] * c[3]) as number[];
        return base;
      };
      const out: string[] = [];
      for (const el of document.querySelectorAll("main *")) {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
        if (!own) continue;
        const cs = getComputedStyle(el);
        const fg = parse(cs.color);
        if (!fg) continue;
        const stops = gradientStops(el);
        const backs = stops.length ? stops : [bgOf(el)];
        let ratio = Infinity;
        for (const bg of backs) {
          // Blend translucent text over its background.
          const c = bg.slice(0, 3).map((v, i) => v * (1 - fg[3]) + fg[i] * fg[3]);
          const [a, b] = [lum(c), lum(bg)].sort((x, y) => y - x);
          ratio = Math.min(ratio, (a + 0.05) / (b + 0.05));
        }
        if (ratio < 4.5) out.push(`${ratio.toFixed(2)} "${el.textContent!.trim().slice(0, 40)}"`);
      }
      return out;
    });
    expect(failures).toEqual([]);
  });

  for (const [day, name, tone] of [
    [6, "Fig & Almond", "pale"],
    [3, "Cherry Cacao", "dark"],
    [4, "Plum & Rose", "pale"],
  ] as const) {
    test(`recipe block on Day ${day} (${tone}) keeps its own color and readable caption`, async ({
      page,
    }) => {
      await seed(page, onDay(day));
      await page.goto("/home");
      const link = reset(page).getByRole("link", {
        name: new RegExp(`^Day ${day} recipe: ${name}`),
      });
      await expect(link).toBeVisible();
      const bg = await link
        .locator("div")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      expect(bg).toContain("linear-gradient");
      // The caption sits on the paper, not on the color, so it reads the same on pale and dark blocks.
      await expect(link).toContainText(name);
    });
  }
});

// ---------------- Review evidence (only when EVIDENCE_DIR is set) ----------------

test.describe("review evidence", () => {
  test.skip(!process.env.EVIDENCE_DIR, "set EVIDENCE_DIR to capture review screenshots");
  const dir = process.env.EVIDENCE_DIR ?? "";

  test("screenshots", async ({ page }, info) => {
    test.setTimeout(300_000);
    const shot = async (name: string, full = false) => {
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${dir}/${info.project.name}/${name}.png`, fullPage: full });
    };
    const load = async (v: object) => {
      await page.goto("/");
      await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(v));
      await page.goto("/home");
    };
    const top = () => page.evaluate(() => window.scrollTo(0, 0));
    const into = async (testId: string) => {
      await page.getByTestId(testId).evaluate((el) => el.scrollIntoView({ block: "center" }));
    };
    await load(onDay(1, { name: "Kara" }));
    await shot("01-home-day1-top");
    await load(onDay(6, { name: "Kara" }));
    await shot("02-home-day6-top");
    await into("week-1");
    await shot("03-home-day6-week-dots");
    await into("path-everyday");
    await shot("04-home-day6-everyday-mornings");
    await into("quick-glow");
    await shot("05-home-day6-quick-glow");
    await shot("06-home-day6-full", true);
    for (const [d, tone] of [
      [3, "dark-cherry-cacao"],
      [4, "pale-plum-rose"],
      [5, "mid-watermelon"],
      [7, "dark-beet"],
    ] as const) {
      await load(onDay(d, { name: "Kara" }));
      await top();
      await shot(`07-home-day${d}-${tone}`);
    }
    await load(onDay(9, { name: "Kara" }));
    await into("week-2");
    await shot("08-home-day9-build-week");
    await load(finished({ name: "Kara" }));
    await top();
    await shot("09-home-day21-top");
    await shot("10-home-day21-full", true);
    await page.goto("/recipes");
    await shot("11-smoothies-library-unchanged");
    await page.goto("/bonuses");
    await page.getByRole("button", { name: "Ingredients", exact: true }).click();
    await shot("12-glow-guide-ingredient-cards");
    await page.goto("/recipes/beet-glow");
    await page.locator('button[aria-controls][aria-expanded][aria-label^="Why "]').first().click();
    await page
      .locator('[role="region"][aria-label^="Why "]')
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    await shot("13-recipe-ingredient-why-card");
    await load(onDay(6, { name: "Kara" }));
    await page.goto("/day/6");
    await page.getByRole("button", { name: /^Mark Day 6 Complete/ }).scrollIntoViewIfNeeded();
    await shot("14-day-page-ink-button");
    for (const w of [320, 375, 412]) {
      await page.setViewportSize({ width: w, height: 720 });
      await load(onDay(6, { name: "Kara" }));
      await shot(`15-home-day6-${w}px-full`, true);
    }
  });
});
