import { describe, expect, it } from "vitest";
import { buildGlowReflection, reflectionText } from "@/lib/glow-reflection";
import { candidateExcerpts, latestIntention, selectExcerpts } from "@/lib/journal-excerpts";
import { journalTextForDay } from "@/lib/reflections";
import { DAY_RESULT, PROHIBITED, TESTIMONIAL } from "../claim-patterns";

const ALL = Array.from({ length: 21 }, (_, i) => i + 1);
const entry = (text: string) => ({ prompt: "p", entry: text, response: "", timestamp: "t" });

/** 21 written days, one distinctive line per day plus filler the rules must skip. */
const maya: Record<number, ReturnType<typeof entry>> = Object.fromEntries(
  ALL.map((d) => [
    d,
    entry(
      {
        2: "Slow start today. I noticed the kitchen is quiet before anyone else wakes up.",
        5: "My skin felt so much clearer today after the smoothie.",
        6: "I felt rushed and nearly skipped it. The blender is loud.",
        9: "Making it is getting easier than the first week, I barely think about it now.",
        11: "I blended it faster because I prepped the fruit the night before.",
        13: "My doctor appointment was stressful and my stomach hurt.",
        17: "I enjoy the ten minutes more than I expected when I started.",
        20: "I want to keep a slow first ten minutes even after day 21.",
        21: "Last day. I feel proud that I finished all of it.",
      }[d] ?? `Day ${d}. Ordinary morning, nothing much to say.`,
    ),
  ]),
);
const rae: Record<number, ReturnType<typeof entry>> = Object.fromEntries(
  ALL.map((d) => [
    d,
    entry(
      {
        1: "I realized I only drink water when someone reminds me.",
        8: "I started to walk to the park before breakfast since I had the time.",
        15: "I love that my daughter asks to taste it now.",
        19: "I plan to make the cherry one on Sundays.",
      }[d] ?? "Fine.",
    ),
  ]),
);

describe("private journal excerpts", () => {
  it("quotes only verbatim sentences, each attributed to the day it was written", () => {
    for (const j of [maya, rae]) {
      for (const e of candidateExcerpts(j)) {
        expect(journalTextForDay(j, e.day)).toContain(e.text);
        expect(e.week).toBe(e.day <= 7 ? 1 : e.day <= 14 ? 2 : 3);
      }
    }
  });

  it("never surfaces health, body or product-claim sentences, even the customer's own", () => {
    const texts = candidateExcerpts(maya)
      .map((e) => e.text)
      .join("\n");
    expect(texts).not.toMatch(/skin|clearer|doctor|stomach|hurt/i);
  });

  it("picks up to three, spread across the weeks, preferring described changes and reasons", () => {
    const xs = selectExcerpts(maya);
    expect(xs.length).toBeLessThanOrEqual(3);
    expect(xs.map((x) => x.week)).toEqual([1, 2, 3]);
    expect(xs.map((x) => x.day)).toEqual([2, 9, 17]);
    expect(xs[1].kind).toBe("change");
    expect(xs[2].kind).toBe("change");
  });

  it("labels a reason only when the customer wrote one", () => {
    const reasons = candidateExcerpts(maya).filter((e) => e.kind === "reason");
    expect(reasons.map((r) => r.day)).toEqual([11]);
    expect(reasons[0].text).toMatch(/because/);
  });

  it("is deterministic and different for different people", () => {
    expect(selectExcerpts(structuredClone(maya))).toEqual(selectExcerpts(structuredClone(maya)));
    const a = selectExcerpts(maya).map((e) => e.text);
    const b = selectExcerpts(rae).map((e) => e.text);
    expect(a.some((t) => b.includes(t))).toBe(false);
  });

  it("carries forward the latest intention, in the customer's words", () => {
    expect(latestIntention(maya)).toMatchObject({ day: 20, kind: "intention" });
    const r = buildGlowReflection({
      name: "Maya",
      completedDays: ALL,
      outcomesByDay: {},
      journalEntries: maya,
      dailyLogs: {},
    });
    expect(r.carryForward[0]).toEqual({
      id: "your-words",
      title: "In your words",
      body: "On Day 20 you wrote: “I want to keep a slow first ten minutes even after day 21.”",
    });
  });
});

describe("Glow Reflection with journal words", () => {
  const base = { name: "Maya", completedDays: ALL, outcomesByDay: {}, dailyLogs: {} };

  it("rich history: quotes, honest framing and an open question — never an explanation", () => {
    const r = buildGlowReflection({ ...base, journalEntries: maya });
    expect(r.words!.excerpts).toHaveLength(3);
    expect(r.words!.lines).toContain(
      "Where a sentence describes a change, that is how you described it yourself.",
    );
    expect(r.words!.question).toBe(
      "Reading your Week 1 words beside your Week 3 words, what do you notice?",
    );
    const voice = reflectionText(r) + "\n" + r.words!.lines.join("\n") + r.words!.question;
    expect(voice).not.toMatch(/\b(caused|because of the|thanks to|helped you|made you|proves?)\b/i);
    for (const re of [...PROHIBITED, ...TESTIMONIAL, ...DAY_RESULT]) expect(voice).not.toMatch(re);
  });

  it("sparse history: says honestly that nothing is quoted", () => {
    const r = buildGlowReflection({ ...base, journalEntries: { 4: entry("ok") } });
    expect(r.words!.excerpts).toEqual([]);
    expect(r.words!.lines[0]).toMatch(/none are quoted here/);
  });

  it("no writing: no words section at all", () => {
    expect(buildGlowReflection({ ...base, journalEntries: {} }).words).toBeNull();
  });

  it("the shareable card never carries any journal words or excerpts", () => {
    for (const j of [maya, rae]) {
      const r = buildGlowReflection({ ...base, journalEntries: j });
      const card = JSON.stringify(r.card);
      for (const e of candidateExcerpts(j)) expect(card).not.toContain(e.text.slice(0, 15));
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
    }
  });

  it("follows the current feelings after one is changed or deleted", () => {
    const one = buildGlowReflection({
      ...base,
      journalEntries: {},
      outcomesByDay: { 2: ["Rested"], 3: ["Rested"] },
    });
    const after = buildGlowReflection({
      ...base,
      journalEntries: {},
      outcomesByDay: { 2: ["Tired"], 3: [] },
    });
    expect(one.noticed.top.map((t) => t.label)).toEqual(["Rested"]);
    expect(after.noticed.top.map((t) => t.label)).toEqual(["Tired"]);
    expect(reflectionText(after)).not.toContain("Rested");
  });
});
