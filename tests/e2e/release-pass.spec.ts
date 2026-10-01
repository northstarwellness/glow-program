import { test, expect, customer, seed, range, stored } from "./fixtures";
import { RECIPES } from "../../src/lib/content";
import { REDS_BY_RECIPE } from "../../src/lib/recipe-reds";

const shown = (n: number) => [1, 7, 14].filter((d) => d <= n).map((d) => `day-${d}`);
const onDay = (day: number) =>
  customer({ completedDays: range(1, day - 1), shownMilestones: shown(day - 1) });

test.describe("sounds", () => {
  const snd = (page: import("@playwright/test").Page) =>
    page.evaluate(
      () =>
        (window as unknown as { __ritualSound?: Record<string, unknown> }).__ritualSound ?? null,
    );
  const row = (page: import("@playwright/test").Page, name: string) =>
    page.getByTestId("sound-row").filter({ hasText: name });

  test("three bundled CC0 sounds: nothing loads or plays until Play is tapped", async ({
    page,
  }) => {
    const audio: string[] = [];
    page.on("request", (r) => {
      if (/\.(m4a|mp3|wav|ogg)(\?|$)|pixabay|freesound/i.test(r.url())) audio.push(r.url());
    });
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=sound");
    for (const n of ["Soft Rain", "Morning Birds", "Gentle Waves", "Quiet Piano", "Soft Ambient"])
      await expect(row(page, n)).toContainText("Plays on a loop");
    await expect(page.getByTestId("sounds-unavailable")).toHaveCount(0);
    await page.waitForTimeout(800);
    expect(audio).toEqual([]);
    expect(await snd(page)).toBeNull();
  });

  test("play, switch without overlap, pause and resume, volume, looping", async ({ page }) => {
    const audio: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/sounds/")) audio.push(`${r.status()} ${new URL(r.url()).pathname}`);
    });
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=sound");
    await row(page, "Soft Rain").getByRole("button", { name: "Play Soft Rain" }).click();
    await expect(row(page, "Soft Rain")).toContainText("Playing");
    await expect.poll(async () => (await snd(page))?.playing).toBe(true);
    expect((await snd(page))?.loop).toBe(true);
    expect((await snd(page))?.contextState).toBe("running");
    // Switch: the rain stops first, then the birds start. Only one ever plays.
    await row(page, "Morning Birds").getByRole("button", { name: "Play Morning Birds" }).click();
    await expect(row(page, "Morning Birds")).toContainText("Playing");
    await expect(row(page, "Soft Rain")).toContainText("Plays on a loop");
    await expect(page.getByRole("button", { name: /^Pause / })).toHaveCount(1);
    expect(audio).toEqual(["200 /sounds/soft-rain.m4a", "200 /sounds/morning-birds.m4a"]);
    // Volume: applied through the gain node and remembered.
    const vol = page.getByTestId("sound-volume");
    await vol.fill("30");
    await expect.poll(async () => Number((await snd(page))?.volume)).toBeCloseTo(0.3, 1);
    expect(await page.evaluate(() => localStorage.getItem("noure_sound_volume"))).toBe("0.3");
    // Pause and resume.
    await row(page, "Morning Birds").getByRole("button", { name: "Pause Morning Birds" }).click();
    await expect(row(page, "Morning Birds")).toContainText("Paused");
    await expect.poll(async () => (await snd(page))?.playing).toBe(false);
    await row(page, "Morning Birds").getByRole("button", { name: "Play Morning Birds" }).click();
    await expect(row(page, "Morning Birds")).toContainText("Playing");
  });

  test("a file that fails to load shows an error, never 'Playing'", async ({ page, errors }) => {
    await page.route("**/sounds/gentle-waves.m4a", (r) => r.fulfill({ status: 404, body: "" }));
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=sound");
    await row(page, "Gentle Waves").getByRole("button", { name: "Play Gentle Waves" }).click();
    await expect(row(page, "Gentle Waves")).toContainText("Couldn't play this sound");
    expect((await snd(page))?.playing).toBe(false);
    // The 404 is this test's own doing; anything else still fails the test.
    const unexpected = errors.filter(
      (e) =>
        !/gentle-waves\.m4a|Failed to load resource: the server responded with a status of 404/.test(
          e,
        ),
    );
    errors.splice(0, errors.length, ...unexpected);
  });

  test("leaving the screen or hiding the page stops the sound", async ({ page }) => {
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=sound");
    await row(page, "Soft Rain").getByRole("button", { name: "Play Soft Rain" }).click();
    await expect.poll(async () => (await snd(page))?.playing).toBe(true);
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(row(page, "Soft Rain")).toContainText("Paused");
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    });
    await row(page, "Soft Rain").getByRole("button", { name: "Play Soft Rain" }).click();
    await expect.poll(async () => (await snd(page))?.playing).toBe(true);
    await page.getByRole("link", { name: /Today/ }).first().click();
    await expect(page).toHaveURL(/\/home/);
    await expect.poll(async () => (await snd(page))?.playing).toBe(false);
  });

  test("each Day page offers an optional sound that never autoplays or blocks completion", async ({
    page,
  }) => {
    await seed(page, onDay(3));
    for (const [d, name] of [
      [1, "Soft Rain"],
      [2, "Morning Birds"],
      [3, "Gentle Waves"],
    ] as const) {
      await page.goto(`/day/${d}`);
      const card = page.getByTestId("daily-sound");
      await expect(card).toContainText("Optional · Sound for this morning");
      await expect(card).toContainText(name);
      await expect(card.getByRole("button", { name: `Play ${name}` })).toBeVisible();
    }
    expect(await snd(page)).toBeNull();
    const card = page.getByTestId("daily-sound");
    await card.getByRole("button", { name: "Play Gentle Waves" }).click();
    await expect(card).toContainText("Playing");
    await card.getByRole("button", { name: "Choose another sound" }).click();
    await card.getByRole("button", { name: "Soft Rain" }).click();
    await expect(card).toContainText("Soft Rain");
    await expect(card).toContainText("Playing");
    await expect(page.getByRole("button", { name: /^Pause / })).toHaveCount(1);
    // Completing the day works with or without sound, and stops the sound on the way out.
    await page.getByTestId("complete-day").click();
    await expect.poll(async () => (await stored(page))?.completedDays).toEqual([1, 2, 3]);
    await expect.poll(async () => (await snd(page))?.playing ?? false).toBe(false);
  });
});

test.describe("knowledge tiles and sheets (phase 2)", () => {
  test("Home shows five distinct tiles that open the right section", async ({ page }) => {
    await seed(page, onDay(2));
    await page.goto("/home");
    const tiles = page.getByTestId("knowledge-tiles").getByRole("link");
    await expect(tiles).toHaveCount(5);
    for (const name of ["Ritual Guide", "Bonus recipes", "Polyphenols", "Ingredients", "Sounds"])
      await expect(tiles.filter({ has: page.getByText(name, { exact: true }) })).toHaveCount(1);
    for (const t of await tiles.all())
      expect(Math.round((await t.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    await tiles.filter({ hasText: "Bonus recipes" }).click();
    await expect(page).toHaveURL(/\/bonuses\?section=recipes/);
    await expect(page.getByRole("link", { name: /Spiced Hot Cacao/ })).toBeVisible();
  });

  test("a Guide topic opens in a sheet with takeaways, Read more and sources; Escape and Close return focus", async ({
    page,
    browserName,
  }) => {
    await seed(page, onDay(2));
    await page.goto("/bonuses?section=guide");
    const tile = page.getByTestId("guide-topics").getByRole("button", { name: /^Polyphenols/ });
    await tile.click();
    const sheet = page.getByRole("dialog", {
      name: "What Polyphenols Are, and Where to Find Them",
    });
    await expect(sheet).toBeVisible();
    await expect(sheet.locator("ul").first().locator("li")).toHaveCount(3);
    await expect(sheet.getByText("Sources", { exact: true })).toBeHidden();
    await sheet.getByText("Read more").click();
    await expect(sheet.getByText("Sources", { exact: true })).toBeVisible();
    await expect(sheet.getByRole("link", { name: /Manach/ })).toHaveAttribute(
      "href",
      "https://pubmed.ncbi.nlm.nih.gov/15113710/",
    );
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    if (browserName !== "webkit") await expect(tile).toBeFocused();
    await tile.click();
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("bonus tiles are readable on light gradients", async ({ page }) => {
    await seed(page, onDay(2));
    await page.goto("/bonuses?section=recipes");
    const spritz = page.getByRole("link", { name: /Strawberry Rose Spritz/ });
    const color = await spritz.locator("h3").evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toBe("rgb(250, 247, 243)");
  });
});

test.describe("day card, Elixir and Radiant Reds (phases 3 and 4)", () => {
  test("all 21 days share the refined title card without overflow", async ({ page }) => {
    await seed(page, customer({ completedDays: range(1, 20), shownMilestones: shown(20) }));
    for (let d = 1; d <= 21; d++) {
      await page.goto(`/day/${d}`);
      const hero = page.getByTestId("day-hero");
      await expect(hero).toBeVisible();
      await expect(hero).toHaveClass(/day-hero/);
      await expect(page.getByTestId("todays-ritual")).toHaveClass(/reading-card/);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `day ${d}`).toBeLessThanOrEqual(0);
    }
  });

  test("Pomegranate & Raspberry Elixir keeps its id and saved state", async ({ page }) => {
    await seed(page, onDay(2));
    await page.goto("/recipes/pomegranate-elixir");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Pomegranate & Raspberry Elixir",
    );
    // The seeded customer already saved this recipe under its id.
    await expect(
      page.getByTestId("recipe-header").getByRole("button", { name: "Save recipe" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("every recipe's Radiant Reds card: heading, headline, 2 or 3 points, complete-without line, one link, closed details", async ({
    page,
  }) => {
    await seed(page, onDay(2));
    for (const r of RECIPES) {
      await page.goto(`/recipes/${r.id}`);
      const reds = page.getByTestId("optional-reds");
      await expect(
        reds.getByRole("heading", { name: "Add Radiant Reds · optional" }),
      ).toBeVisible();
      await expect(reds).toContainText(REDS_BY_RECIPE[r.id].headline);
      const n = await reds.getByTestId("reds-points").locator("li").count();
      expect(n, r.id).toBeGreaterThanOrEqual(2);
      expect(n, r.id).toBeLessThanOrEqual(3);
      await expect(reds).toContainText("This recipe is complete without it.");
      await expect(reds.getByRole("link")).toHaveCount(1);
      await expect(reds.getByRole("button", { name: "Label details" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    }
  });
});

test.describe("morning flow (phase 5)", () => {
  test("Day page lists the morning in order, and each step leads to its section", async ({
    page,
  }) => {
    await seed(page, onDay(2));
    await page.goto("/day/2");
    const steps = page.getByTestId("morning-steps").getByRole("link");
    await expect(steps).toHaveText([
      /Make Berry & Chia\s*3 min/,
      /Play a sound\s*Optional/,
      /Read today's ritual/,
      /Write in your journal\s*Optional/,
    ]);
    const top = (id: string) =>
      page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const [recipe, ritual, journal] = await Promise.all([
      top("day-recipe"),
      top("day-ritual"),
      top("day-journal"),
    ]);
    expect(recipe).toBeLessThan(ritual);
    expect(ritual).toBeLessThan(journal);
  });

  test("a day completes without the Radiant Reds check-in, and old records stay intact", async ({
    page,
  }) => {
    await seed(
      page,
      customer({
        completedDays: [1],
        shownMilestones: [],
        dailyLogs: { 1: { reds: true, ritual: true } },
      }),
    );
    await page.goto("/day/2");
    await expect(page.getByRole("button", { name: /Radiant Reds/ })).toContainText("Optional");
    await page.getByTestId("complete-day").click();
    await expect.poll(async () => (await stored(page))?.completedDays).toEqual([1, 2]);
    const s = await stored(page);
    expect(s.dailyLogs[2]?.reds).toBeFalsy();
    expect(s.dailyLogs[1]).toEqual({ reds: true, ritual: true });
    expect(s.journalEntries[2].entry).toBe("keep-me");
  });
});

test.describe("copy and legacy routes", () => {
  test("the retired /boosts page lands on Home", async ({ page }) => {
    await seed(page, onDay(3));
    await page.goto("/boosts");
    await expect(page).toHaveURL(/\/home$/);
  });

  test("Day ritual texts and Grocery treat Radiant Reds as optional and carry no dashes", async ({
    page,
  }) => {
    await seed(page, customer({ completedDays: range(1, 20), shownMilestones: shown(20) }));
    for (let d = 1; d <= 21; d++) {
      await page.goto(`/day/${d}`);
      const text = await page.getByTestId("todays-ritual").innerText();
      expect(text, `day ${d}`).not.toMatch(/[—–]|your reds|prepare your Radiant Reds/i);
      const title = await page.getByTestId("day-hero").innerText();
      expect(title, `day ${d} title`).not.toMatch(/[—–]/);
    }
    await page.goto("/grocery");
    await expect(page.getByText("Radiant Reds, if you’d like it with your glass.")).toBeVisible();
    await expect(page.getByText(/base of every ritual/)).toHaveCount(0);
  });
});

test.describe("final refinement: new sounds, bonus cards, feelings", () => {
  const snd = (page: import("@playwright/test").Page) =>
    page.evaluate(
      () =>
        (window as unknown as { __ritualSound?: Record<string, unknown> }).__ritualSound ?? null,
    );

  test("Quiet Piano and Soft Ambient play from bundled files, one at a time", async ({ page }) => {
    const audio: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/sounds/")) audio.push(`${r.status()} ${new URL(r.url()).pathname}`);
    });
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=sound");
    const row = (n: string) => page.getByTestId("sound-row").filter({ hasText: n });
    await expect(page.getByTestId("sound-row")).toHaveCount(5);
    await row("Quiet Piano").getByRole("button", { name: "Play Quiet Piano" }).click();
    await expect(row("Quiet Piano")).toContainText("Playing");
    await row("Soft Ambient").getByRole("button", { name: "Play Soft Ambient" }).click();
    await expect(row("Soft Ambient")).toContainText("Playing");
    await expect(page.getByRole("button", { name: /^Pause / })).toHaveCount(1);
    await expect.poll(async () => (await snd(page))?.loop).toBe(true);
    expect(audio).toEqual(["200 /sounds/quiet-piano.m4a", "200 /sounds/soft-ambient.m4a"]);
    await expect(page.getByText(/not available yet/i)).toHaveCount(0);
  });

  test("Bonus recipes: five compact colorful cards in two columns, each opens its recipe", async ({
    page,
  }) => {
    await seed(page, onDay(3));
    await page.goto("/bonuses?section=recipes");
    const cards = page.getByTestId("bonus-card");
    await expect(cards).toHaveCount(5);
    const boxes = await cards.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
    expect(new Set(boxes.map((b) => Math.round(b.left))).size).toBe(2); // two columns
    for (const b of boxes) expect(b.height).toBeLessThan(170);
    const bonus = RECIPES.filter((r) => r.bonus);
    for (const r of bonus) {
      const card = cards.filter({ hasText: r.name });
      await expect(card).toContainText(r.benefitTag);
      await expect(card).toContainText(r.prep);
      // Background still uses the recipe's own gradient colors.
      const bg = await card
        .locator("div")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundImage);
      const first = r.gradient.match(/#[0-9A-Fa-f]{6}/)![0];
      const [x, y, z] = [1, 3, 5].map((i) => parseInt(first.slice(i, i + 2), 16));
      expect(bg, r.id).toContain(`rgb(${x}, ${y}, ${z})`);
    }
    await cards.filter({ hasText: bonus[0].name }).click();
    await expect(page).toHaveURL(new RegExp(`/recipes/${bonus[0].id}`));
  });

  test("feelings: eight chips, clear selection, new values saved alongside old ones", async ({
    page,
  }) => {
    await seed(
      page,
      customer({
        completedDays: range(1, 4),
        shownMilestones: shown(4),
        outcomesByDay: { 2: ["Glowy"] },
      }),
    );
    await page.goto("/day/5");
    const chips = page.locator("#feelings button[aria-pressed]");
    await expect(chips).toHaveText([
      "Rested",
      "Energized",
      "Calm",
      "Focused",
      "Satisfied",
      "Just okay",
      "Tired",
      "Overwhelmed",
    ]);
    for (const c of await chips.all())
      expect(Math.round((await c.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
    await chips.filter({ hasText: "Calm" }).click();
    await chips.filter({ hasText: "Overwhelmed" }).click();
    await expect(chips.filter({ hasText: "Calm" })).toHaveAttribute("aria-pressed", "true");
    await expect(chips.filter({ hasText: "Rested" })).toHaveAttribute("aria-pressed", "false");
    await expect
      .poll(async () => (await stored(page))?.outcomesByDay)
      .toEqual({
        2: ["Glowy"],
        5: ["Calm", "Overwhelmed"],
      });
  });

  test("Label details include the caution from the label, still closed by default", async ({
    page,
  }) => {
    await seed(page, onDay(3));
    await page.goto("/recipes/pomegranate-elixir");
    const reds = page.getByTestId("optional-reds");
    await expect(reds).not.toContainText("Caution on the label");
    await reds.getByRole("button", { name: "Label details" }).click();
    await expect(reds).toContainText("Caution on the label");
    await expect(reds).toContainText("Keep out of reach of children.");
    await expect(reds.getByRole("link")).toHaveCount(1);
  });
});

test("the pressed Save pill shows a readable 'Saved' on dark and light recipes", async ({
  page,
}) => {
  await seed(page, customer({ savedRecipes: ["pomegranate-elixir", "cherry-cacao", "plum-rose"] }));
  for (const id of ["pomegranate-elixir", "cherry-cacao", "plum-rose"]) {
    await page.goto(`/recipes/${id}`);
    const btn = page.getByTestId("recipe-header").getByRole("button", { name: "Save recipe" });
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    await expect(btn).toContainText("Saved");
    const ratio = await btn.evaluate((el) => {
      const cv = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      const rgb = (c: string) => {
        cv.clearRect(0, 0, 1, 1);
        cv.fillStyle = c;
        cv.fillRect(0, 0, 1, 1);
        return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const lum = (c: number[]) => {
        const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const cs = getComputedStyle(el);
      const [a, b] = [lum(rgb(cs.color)), lum(rgb(cs.backgroundColor))].sort((x, y) => y - x);
      return (a + 0.05) / (b + 0.05);
    });
    expect(ratio, id).toBeGreaterThanOrEqual(4.5);
  }
});
