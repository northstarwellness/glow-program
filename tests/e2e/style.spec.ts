import type { Locator, Page } from "@playwright/test";
import { test, expect, customer, seed, range, homePrimary, rawGoto } from "./fixtures";
import { DAYS, RECIPES } from "../../src/lib/content";
import { dayButtonColors } from "../../src/lib/recipe-button";

// Style pass: one RITUAL APP title; actions tied to a day or smoothie wear a light wash of
// that recipe's colors; general actions are pearl; secondary actions are quiet outlines.

const shown = (upTo: number) => [1, 7, 14].filter((m) => m <= upTo).map((m) => `day-${m}`);
const onDay = (day: number) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1) });
const finished = customer({
  completedDays: range(1, 21),
  shownMilestones: ["day-1", "day-7", "day-14", "day-21"],
});

const rgb = (h: string) =>
  `rgb(${[1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ")})`;
const recipeOfDay = (d: number) => RECIPES.find((r) => r.id === DAYS[d - 1].recipeId)!;

type Look = { bg: string; color: string; border: string; borderStyle: string; shadow: string };
const look = (loc: Locator): Promise<Look> =>
  loc.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundImage,
      color: cs.color,
      border: cs.borderTopColor,
      borderStyle: cs.borderTopStyle,
      shadow: cs.boxShadow,
    };
  });

/** A primary action tied to a day: a light wash of that day's recipe, matching edge and ink. */
async function expectDayButton(loc: Locator, gradient: string) {
  await expect(loc).toBeVisible();
  const c = dayButtonColors(gradient);
  const st = await look(loc);
  for (const s of c.washStops) expect(st.bg).toContain(rgb(s));
  expect(st.color).toBe(rgb(c.ink));
  expect(st.border).toBe(rgb(c.edge));
  expect(st.shadow).not.toBe("none");
  expect((await loc.boundingBox())!.height).toBeGreaterThanOrEqual(43.5);
}
/** A general primary action: pearl with a fine border and dark text. */
async function expectPearl(loc: Locator) {
  await expect(loc).toBeVisible();
  const st = await look(loc);
  expect(st.bg).toContain("rgb(255, 255, 255)");
  expect(st.bg).toContain("rgb(247, 243, 238)");
  // The app's charcoal token (Option B, 2026-09-30: #29282D).
  expect(st.color).toBe("rgb(41, 40, 45)");
  expect(st.shadow).not.toBe("none");
  expect((await loc.boundingBox())!.height).toBeGreaterThanOrEqual(43.5);
}
/** Never a dark slab: the button's fill is light wherever it is filled. */
async function expectNoDarkFill(loc: Locator) {
  const st = await look(loc);
  for (const m of st.bg.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)) {
    const [r, g, b] = [m[1], m[2], m[3]].map(Number);
    expect(r + g + b, `dark stop ${m[0]}`).toBeGreaterThan(560);
  }
}

test.describe("buttons: day actions wear their day's recipe; general actions are pearl", () => {
  for (const day of [1, 3, 6] as const) {
    test(`Day ${day} (${recipeOfDay(day).name}): Home, Day and guided recipe share its palette`, async ({
      page,
    }) => {
      const g = recipeOfDay(day).gradient;
      await seed(page, onDay(day));
      await page.goto("/home");
      await expectDayButton(homePrimary(page), g);
      await expectNoDarkFill(homePrimary(page));
      await page.goto(`/day/${day}`);
      await expectDayButton(page.getByTestId("complete-day"), g);
      // "Open full recipe" is the quieter recipe action: same edge and ink, no fill.
      const open = page.getByTestId("open-recipe");
      const o = await look(open);
      expect(o.bg).toBe("none");
      expect(o.shadow).toBe("none");
      expect(o.border).toBe(rgb(dayButtonColors(g).edge));
      await open.click();
      await expectDayButton(
        page.getByRole("link", { name: new RegExp(`^Continue Day ${day}`) }),
        g,
      );
    });
  }

  test("a completed day is unmistakable: no fill, a check mark, still tappable", async ({
    page,
  }) => {
    await seed(page, onDay(4));
    await page.goto("/day/2");
    const done = page.getByTestId("complete-day");
    await expect(done).toHaveText(/Day 2 complete/);
    await expect(done.locator("svg")).toHaveCount(1);
    const st = await look(done);
    expect(st.bg).toBe("none");
    expect(st.shadow).toBe("none");
  });

  test("general actions are pearl; secondary outlines are quieter", async ({ page }) => {
    await seed(page, finished);
    await page.goto("/home");
    await expectPearl(
      page.getByTestId("path-everyday").getByRole("link", { name: /^Browse recipes/ }),
    );
    const reflection = page.getByRole("link", { name: "Your Reflection", exact: true });
    const r = await look(reflection);
    expect(r.bg).toBe("none");
    expect(r.shadow).toBe("none");
    await page.goto("/reflection");
    await expectPearl(page.getByRole("button", { name: "Save My Reflection Card" }));
  });

  test("in progress, Everyday's Browse recipes stays a quiet outline", async ({ page }) => {
    await seed(page, onDay(6));
    await page.goto("/home");
    const browse = page.getByTestId("path-everyday").getByRole("link", { name: /^Browse recipes/ });
    const st = await look(browse);
    expect(st.bg).toBe("none");
    expect(st.shadow).toBe("none");
  });

  test("disabled is clearly inactive (flat, dashed edge, dimmed), then pearl once enabled", async ({
    page,
  }) => {
    await rawGoto(page, "/verify");
    await page.waitForSelector("html[data-hydrated]", { state: "attached" });
    const btn = page.getByRole("button", { name: "Unlock My Reset" });
    await expect(btn).toBeDisabled();
    const d = await look(btn);
    expect(d.shadow).toBe("none");
    expect(d.borderStyle).toBe("dashed");
    expect(Number(await btn.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(0.5);
    // Typed but never submitted: the purchase check itself is not called here.
    await page.getByRole("textbox").first().fill("someone@example.test");
    await expect(btn).toBeEnabled();
    await page.mouse.move(0, 0);
    await expectPearl(btn);
  });

  test("keyboard focus shows a clear ring in the recipe ink; Enter works and keeps progress", async ({
    page,
  }) => {
    await seed(page, onDay(5));
    await page.goto("/home");
    const btn = homePrimary(page);
    await btn.focus();
    const ring = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`;
    });
    expect(ring).toBe(`solid 2px ${rgb(dayButtonColors(recipeOfDay(5).gradient).ink)}`);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/day\/5$/);
  });
});

test.describe("RITUAL APP header on every in-app page", () => {
  const PAGES = [
    "/home",
    "/day/6",
    "/recipes",
    "/grocery",
    "/journal",
    "/progress",
    "/bonuses",
    "/reflection",
  ];
  for (const width of [320, 375, 390, 412]) {
    test(`${width}px: one clear RITUAL APP title, no clipping or overlap`, async ({ page }) => {
      test.setTimeout(240_000);
      await page.setViewportSize({ width, height: 720 });
      for (const [path, data] of PAGES.map(
        (p) => [p, p === "/reflection" ? finished : onDay(6)] as const,
      )) {
        await rawGoto(page, "/manifest.webmanifest");
        await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(data));
        await page.goto(path);
        const title = page.getByRole("link", { name: "Ritual App, home" });
        await expect(title, path).toHaveText("RITUAL APP");
        await expect(page.getByText(/^NOURÉ$/)).toHaveCount(0);
        const geo = await title.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const sib = el.nextElementSibling?.getBoundingClientRect();
          return {
            clipped: el.scrollWidth > el.clientWidth + 1,
            size: parseFloat(getComputedStyle(el).fontSize),
            overlap:
              !!sib &&
              sib.width > 0 &&
              sib.left < r.right - 0.5 &&
              sib.top < r.bottom &&
              sib.bottom > r.top,
            offscreen: r.right > window.innerWidth,
          };
        });
        expect(geo, `${path} @${width}`).toEqual({
          clipped: false,
          size: width < 360 ? 18 : 21,
          overlap: false,
          offscreen: false,
        });
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
          `${path} @${width} scrolls sideways`,
        ).toBeLessThanOrEqual(1);
      }
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
    const load = async (v: object, path: string) => {
      await rawGoto(page, "/manifest.webmanifest");
      await page.evaluate((x) => localStorage.setItem("noure_app_v1", x), JSON.stringify(v));
      await page.goto(path);
    };
    const kara = (v: { state: object }) => ({ ...v, state: { ...v.state, name: "Kara" } });
    const center = (l: Locator) => l.evaluate((el) => el.scrollIntoView({ block: "center" }));
    for (const [d, tag] of [
      [1, "day1-pomegranate"],
      [6, "day6-fig-almond"],
      [3, "day3-cherry-cacao-deep"],
    ] as const) {
      await load(kara(onDay(d) as { state: object }), "/home");
      await center(homePrimary(page));
      await shot(`${tag}-a-home`);
      await page.goto(`/day/${d}`);
      await center(page.getByTestId("open-recipe"));
      await shot(`${tag}-b-day-open-recipe`);
      await center(page.getByTestId("complete-day"));
      await shot(`${tag}-c-day-complete`);
      await page.getByTestId("open-recipe").click();
      await center(page.getByRole("link", { name: new RegExp(`^Continue Day ${d}`) }));
      await shot(`${tag}-d-guided-recipe`);
    }
    await load(kara(onDay(4) as { state: object }), "/day/2");
    await center(page.getByTestId("complete-day"));
    await shot("general-a-completed-day");
    await load(kara(finished as { state: object }), "/home");
    await center(page.getByTestId("path-everyday"));
    await shot("general-b-day21-browse-pearl");
    await page.goto("/reflection");
    await center(page.getByRole("button", { name: "Save My Reflection Card" }));
    await shot("general-c-reflection-save-pearl");
    for (const w of [320, 412]) {
      await page.setViewportSize({ width: w, height: 700 });
      await load(kara(onDay(6) as { state: object }), "/home");
      await center(homePrimary(page));
      await shot(`width-${w}px-home-day6`);
    }
  });
});
