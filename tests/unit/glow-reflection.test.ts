import { describe, expect, it } from "vitest";
import {
  buildGlowReflection,
  journalThemes,
  profileFor,
  reflectionText,
  type ReflectionInput,
} from "@/lib/glow-reflection";
import { OUTCOMES, outcomeLabel } from "@/lib/store";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

const ALL = Array.from({ length: 21 }, (_, i) => i + 1);
const entry = (text: string) => ({ prompt: "p", entry: text, response: "", timestamp: "t" });

// Words the brief rules out for the reflection specifically: analysis, medical and causal language.
const REFLECTION_BANNED = [
  /\banaly[sz]/i,
  /\btreat/i,
  /\bdetox/i,
  /inflamm/i,
  /\bheal/i,
  /hormone/i,
  /digestion/i,
  /bloat/i,
  /\bimprov/i,
  /\bcaused?\b/i,
  /because of/i,
  /thanks to/i,
  /\bresults?\b/i,
  /\btypical/i,
  /\bguarantee/i,
  /other (women|people|customers)/i,
  /most women/i,
  /\bdiagnos/i,
  /\bsymptom/i,
  /\bprogram (helped|gave|made)/i,
  /\bsmoothies? (helped|gave|made)/i,
  /radiant reds (helped|gave|made|improved)/i,
];

export const HISTORIES: Record<string, ReflectionInput> = {
  rich: {
    name: "Maya",
    completedDays: ALL,
    outcomesByDay: Object.fromEntries(
      ALL.map((d) => [
        d,
        d <= 7 ? ["Lighter", "Satisfied"] : d <= 14 ? ["Lighter", "Glowy"] : ["Energized", "Glowy"],
      ]),
    ),
    journalEntries: Object.fromEntries(
      ALL.filter((d) => d % 2 === 1).map((d) => [
        d,
        entry(`Slow morning with coffee before the kids woke. My secret: I sang in the car ${d}.`),
      ]),
    ),
    dailyLogs: Object.fromEntries(ALL.map((d) => [d, { reds: d % 3 !== 0, ritual: true }])),
    savedRecipes: ["a", "b"],
  },
  feelingsOnly: {
    name: "Lena",
    completedDays: ALL,
    outcomesByDay: Object.fromEntries(ALL.slice(0, 12).map((d) => [d, ["Clearer mood"]])),
    journalEntries: {},
    dailyLogs: {},
  },
  journalOnly: {
    name: "Rae",
    completedDays: ALL,
    outcomesByDay: { 20: ["Satisfied"] },
    journalEntries: Object.fromEntries(
      ALL.slice(0, 9).map((d) => [
        d,
        entry(`I went for a walk after blending. Private note number ${d}.`),
      ]),
    ),
    dailyLogs: {},
  },
  sparse: {
    name: "Jo",
    completedDays: ALL,
    outcomesByDay: { 2: ["Glowy"], 16: ["Energized"] },
    journalEntries: { 5: entry("short") },
    dailyLogs: {},
  },
  minimal: {
    name: "Sam",
    completedDays: ALL,
    outcomesByDay: {},
    journalEntries: {},
    dailyLogs: {},
  },
  noName: {
    name: null,
    completedDays: ALL,
    outcomesByDay: { 1: [], 3: ["Lighter"] },
    journalEntries: { 1: entry("   ") },
    dailyLogs: {},
  },
};
const cases = Object.entries(HISTORIES);

describe("Glow Reflection engine", () => {
  it.each(cases)("%s: produces every section", (_, h) => {
    const r = buildGlowReflection(h);
    expect(r.opening.title).toBeTruthy();
    expect(r.opening.body).toBeTruthy();
    expect(r.rhythm.lines.length).toBeGreaterThan(0);
    expect(r.noticed.lines.length).toBeGreaterThan(0);
    expect(r.reflection.length).toBeGreaterThan(0);
    expect(r.carryForward.length).toBeGreaterThanOrEqual(2);
    expect(r.carryForward.length).toBeLessThanOrEqual(3);
    expect(r.closing).toBeTruthy();
  });

  it.each(cases)("%s: no prohibited claim, testimonial or medical language", (_, h) => {
    const t =
      reflectionText(buildGlowReflection(h)) + "\n" + JSON.stringify(buildGlowReflection(h).card);
    for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT, ...REFLECTION_BANNED])
      expect(t, `matches ${re}`).not.toMatch(re);
  });

  it.each(cases)("%s: identical history gives identical output", (_, h) => {
    const a = buildGlowReflection(structuredClone(h));
    const b = buildGlowReflection(structuredClone(h));
    expect(a).toEqual(b);
  });

  it("different histories give meaningfully different reflections", () => {
    // One history per profile; the two near-empty histories are compared separately below.
    const distinct = cases.filter(([k]) => k !== "noName");
    const texts = distinct.map(([, h]) => reflectionText(buildGlowReflection(h)));
    const profiles = new Set(cases.map(([, h]) => buildGlowReflection(h).profile));
    expect(profiles).toEqual(new Set(["rich", "feelings", "writing", "steady", "quiet"]));
    for (let i = 0; i < texts.length; i++)
      for (let j = i + 1; j < texts.length; j++) {
        const a = new Set(texts[i].split("\n"));
        const shared = texts[j].split("\n").filter((l) => a.has(l)).length;
        expect(shared / a.size, `${distinct[i][0]} vs ${distinct[j][0]}`).toBeLessThan(0.5);
      }
    // Even two near-empty histories differ where their data differs.
    const a = buildGlowReflection(HISTORIES.minimal);
    const b = buildGlowReflection(HISTORIES.noName);
    expect(a.noticed.lines).not.toEqual(b.noticed.lines);
    expect(a.rhythm.lines).not.toEqual(b.rhythm.lines);
  });

  it("reports only counts and feelings that exist in the history", () => {
    for (const [, h] of cases) {
      const r = buildGlowReflection(h);
      const by = (h.outcomesByDay ?? {}) as Record<string, string[]>;
      const chosen = new Set(
        Object.values(by)
          .flat()
          .filter((o) => (OUTCOMES as readonly string[]).includes(o))
          .map(outcomeLabel),
      );
      const text = reflectionText(r);
      for (const o of OUTCOMES) {
        const label = outcomeLabel(o);
        if (!chosen.has(label)) expect(text).not.toContain(`“${label}”`);
      }
      for (const t of r.noticed.top) expect(chosen.has(t.label)).toBe(true);
      expect(r.rhythm.checkInDays).toBe(
        Object.values(by).filter((v) => v.some((o) => (OUTCOMES as readonly string[]).includes(o)))
          .length,
      );
      expect(r.rhythm.daysCompleted).toBe(21);
    }
  });

  it("rich: reports her own week-by-week choices without claiming a change was caused", () => {
    const r = buildGlowReflection(HISTORIES.rich);
    expect(r.profile).toBe("rich");
    expect(r.noticed.weeks.map((w) => w.top)).toEqual([
      ["Lighter", "Satisfied"],
      ["Lighter", "Glowy"],
      ["Energized", "Glowy"],
    ]);
    expect(r.noticed.lines.join(" ")).toContain("changed between Week 1");
    expect(r.rhythm.redsDays).toBe(14);
    expect(r.themes).toContain("your mornings");
    expect(r.carryForward.map((c) => c.id)).toEqual(["check-in", "journal", "mornings"]);
  });

  it("minimal: sparse participation is described without judgement", () => {
    const r = buildGlowReflection(HISTORIES.minimal);
    const t = reflectionText(r);
    expect(r.profile).toBe("quiet");
    expect(t).not.toMatch(/\b(only|failed|missed|should have|didn't manage|behind|incomplete)\b/i);
    expect(r.noticed.top).toEqual([]);
    expect(r.card.topFeelings).toEqual([]);
  });

  it("sparse: a single check-in in each of two weeks is reported honestly", () => {
    const r = buildGlowReflection(HISTORIES.sparse);
    expect(r.profile).toBe("steady");
    expect(r.rhythm.checkInDays).toBe(2);
    expect(r.noticed.weeks.map((w) => w.checkInDays)).toEqual([1, 0, 1]);
    // One choice each is not a pattern: no "most often", no week-to-week trend.
    const t = reflectionText(r);
    expect(t).not.toMatch(/most often|reached for most|changed between/);
    expect(t).toContain("each once");
    expect(r.card.feelingsHeading).toBe("The words I chose");
  });

  it("ignores empty day lists and blank entries", () => {
    const r = buildGlowReflection(HISTORIES.noName);
    expect(r.rhythm.checkInDays).toBe(1);
    expect(r.rhythm.journalDays).toBe(0);
    expect(r.opening.title).toBe("This is your Glow Reflection.");
  });

  it("profile thresholds", () => {
    expect(profileFor(10, 7)).toBe("rich");
    expect(profileFor(9, 7)).toBe("feelings");
    expect(profileFor(3, 8)).toBe("writing");
    expect(profileFor(1, 2)).toBe("steady");
    expect(profileFor(0, 2)).toBe("quiet");
  });
});

describe("journal privacy", () => {
  it.each(cases)("%s: the card carries no journal text or journal topics", (_, h) => {
    const r = buildGlowReflection(h);
    const card = JSON.stringify(r.card);
    const entries = Object.values((h.journalEntries ?? {}) as Record<string, { entry: string }>);
    for (const e of entries)
      for (const word of e.entry.split(/\W+/).filter((w) => w.length > 3))
        expect(card.toLowerCase()).not.toContain(word.toLowerCase());
    for (const th of r.themes) expect(card).not.toContain(th);
    expect(Object.keys(r.card).sort()).toEqual(
      [
        "checkInDays",
        "daysCompleted",
        "feelingsHeading",
        "journalDays",
        "line",
        "name",
        "topFeelings",
      ].sort(),
    );
    expect(card).not.toMatch(/https?:|workers\.dev|glow\.nourewellness|@/);
  });

  it("never quotes her private writing anywhere in the reflection", () => {
    const r = buildGlowReflection(HISTORIES.rich);
    const t = reflectionText(r);
    expect(t).not.toMatch(/\b(secret|sang|kids|car)\b/i);
  });

  it("only surfaces a topic after 3 separate days, and ignores the tap-in nudges", () => {
    expect(journalThemes({ 1: entry("morning walk"), 2: entry("morning") })).toEqual([]);
    expect(
      journalThemes({ 1: entry("morning"), 2: entry("morning"), 3: entry("a morning") }),
    ).toEqual(["your mornings"]);
    const nudged = Object.fromEntries(
      [1, 2, 3, 4].map((d) => [d, entry("What helped me stay consistent: nothing much")]),
    );
    expect(journalThemes(nudged)).toEqual([]);
  });
});
