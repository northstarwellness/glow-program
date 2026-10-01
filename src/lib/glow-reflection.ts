/**
 * "Your Reflection" — the Day 21 summary, built on-device from the customer's own
 * saved activity. Deterministic rules only: no AI service, no randomness, no network.
 *
 * Rules the copy follows:
 * - Everything reported is something the customer recorded (a completed day, a chosen feeling,
 *   a written entry, a logged check-in). Nothing is inferred about her health.
 * - Feelings are reported as the customer's own choices ("You chose …"), never as results the
 *   ritual or any product caused, and never compared with other people.
 * - Sparse participation is described neutrally, never as falling short.
 * - Journal text is read on-device only. A few sentences may be quoted verbatim, with
 *   their day, on the private reflection screen (see journal-excerpts.ts); the shareable
 *   card carries counts and feeling labels only.
 */
import { normalizeCompletedDays, outcomeLabel } from "./store";
import {
  daysWithFeelings,
  feelingCounts,
  feelingsForDay,
  journalTextForDay,
  ALL_JOURNAL_NUDGES,
} from "./reflections";
import { latestIntention, selectExcerpts, type JournalExcerpt } from "./journal-excerpts";

export type ReflectionInput = {
  name: string | null;
  completedDays: unknown;
  outcomesByDay: unknown;
  journalEntries: unknown;
  dailyLogs: unknown;
  savedRecipes?: unknown;
};

export type ReflectionProfile = "rich" | "feelings" | "writing" | "steady" | "quiet";

export type WeekSummary = { week: 1 | 2 | 3; checkInDays: number; top: string[] };

export type GlowReflectionCardData = {
  name: string;
  line: string;
  daysCompleted: number;
  checkInDays: number;
  journalDays: number;
  topFeelings: string[];
  feelingsHeading: string;
};

export type GlowReflection = {
  profile: ReflectionProfile;
  opening: { title: string; body: string };
  rhythm: {
    daysCompleted: number;
    checkInDays: number;
    journalDays: number;
    redsDays: number;
    weekCheckIns: [number, number, number];
    lines: string[];
  };
  noticed: {
    top: { outcome: string; label: string; days: number }[];
    weeks: WeekSummary[];
    lines: string[];
  };
  reflection: string[];
  carryForward: { id: string; title: string; body: string }[];
  closing: string;
  /** Private, in-app only. Never put on the card. */
  themes: string[];
  /** Private, in-app only: verbatim sentences from the customer's entries. Never on the card. */
  words: {
    excerpts: JournalExcerpt[];
    lines: string[];
    question: string;
  } | null;
  card: GlowReflectionCardData;
};

const WEEKS: { week: 1 | 2 | 3; days: number[] }[] = [
  { week: 1, days: [1, 2, 3, 4, 5, 6, 7] },
  { week: 2, days: [8, 9, 10, 11, 12, 13, 14] },
  { week: 3, days: [15, 16, 17, 18, 19, 20, 21] },
];
const ALL_DAYS = WEEKS.flatMap((w) => w.days);

/**
 * Everyday topics that can be spotted safely by keyword. Nothing health-related,
 * nothing about other people. A topic only counts once it shows up on 3+ separate days.
 */
const THEMES: { id: string; label: string; pattern: RegExp }[] = [
  {
    id: "mornings",
    label: "your mornings",
    pattern: /\b(morning|mornings|sunrise|wake|woke|waking|coffee|breakfast)\b/,
  },
  {
    id: "stillness",
    label: "quiet, slower moments",
    pattern: /\b(quiet|slow|slower|slowed|peace|peaceful|breathe|breathing|stillness)\b/,
  },
  {
    id: "movement",
    label: "moving your body",
    pattern:
      /\b(walk|walks|walked|walking|yoga|stretch|stretched|stretching|pilates|workout|gym)\b/,
  },
  {
    id: "kitchen",
    label: "your time in the kitchen",
    pattern: /\b(blend|blended|blender|blending|kitchen|recipe|recipes|berries|chopping)\b/,
  },
  {
    id: "gratitude",
    label: "gratitude",
    pattern: /\b(grateful|gratitude|thankful|appreciate|appreciated)\b/,
  },
  {
    id: "routine",
    label: "building a routine",
    pattern: /\b(routine|habit|habits|consistent|consistency|committed|commitment)\b/,
  },
];
export const THEME_MIN_DAYS = 3;

const q = (label: string) => `“${label}”`;
const joinWords = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function stripNudges(text: string): string {
  let t = text;
  for (const n of ALL_JOURNAL_NUDGES) t = t.split(n).join(" ");
  return t.toLowerCase();
}

/** Topics that recur in her own writing (3+ days), most frequent first. On-device only. */
export function journalThemes(journalEntries: unknown): string[] {
  const texts = ALL_DAYS.map((d) => stripNudges(journalTextForDay(journalEntries, d))).filter(
    (t) => t.trim().length > 0,
  );
  return THEMES.map((th) => ({ th, days: texts.filter((t) => th.pattern.test(t)).length }))
    .filter((x) => x.days >= THEME_MIN_DAYS)
    .sort((a, b) => b.days - a.days)
    .slice(0, 2)
    .map((x) => x.th.label);
}

function loggedDays(dailyLogs: unknown, key: "reds" | "ritual" | "journal"): number {
  if (!isRecord(dailyLogs)) return 0;
  return ALL_DAYS.filter((d) => {
    const l = dailyLogs[String(d)];
    return isRecord(l) && l[key] === true;
  }).length;
}

function topOf(counts: { outcome: string; days: number }[]): string[] {
  if (!counts.length) return [];
  const max = counts[0].days;
  return counts
    .filter((c) => c.days === max)
    .slice(0, 2)
    .map((c) => c.outcome);
}

export function profileFor(checkInDays: number, journalDays: number): ReflectionProfile {
  const c = checkInDays;
  const j = journalDays;
  if (c >= 10 && j >= 7) return "rich";
  if (c >= 7 && c >= j) return "feelings";
  if (j >= 7) return "writing";
  if (c >= 7) return "feelings";
  if (c + j >= 3) return "steady";
  return "quiet";
}

export function buildGlowReflection(input: ReflectionInput): GlowReflection {
  const name = (input.name ?? "").trim();
  const daysCompleted = normalizeCompletedDays(input.completedDays).length;
  const checkIn = daysWithFeelings(input.outcomesByDay);
  const C = checkIn.length;
  const J = ALL_DAYS.filter((d) => journalTextForDay(input.journalEntries, d).length > 0).length;
  const R = loggedDays(input.dailyLogs, "reds");
  const saved = Array.isArray(input.savedRecipes)
    ? new Set(input.savedRecipes.filter((x) => typeof x === "string" && x)).size
    : 0;
  const themes = journalThemes(input.journalEntries);
  const profile = profileFor(C, J);

  const counts = feelingCounts(input.outcomesByDay);
  const top = counts.slice(0, 3).map((c) => ({ ...c, label: outcomeLabel(c.outcome) }));
  const leaders = topOf(counts).map(outcomeLabel);
  const weeks: WeekSummary[] = WEEKS.map((w) => ({
    week: w.week,
    checkInDays: daysWithFeelings(input.outcomesByDay, w.days).length,
    top: topOf(feelingCounts(input.outcomesByDay, w.days)).map(outcomeLabel),
  }));
  const weekCheckIns = weeks.map((w) => w.checkInDays) as [number, number, number];

  // 1. Opening
  const who = name ? `${name}, ` : "";
  const opening = {
    title: `${who}this is your 21-day reflection.`.replace(/^t/, "T"),
    body: {
      rich: "You finished all 21 days and recorded how they felt, in chosen words and in writing. Everything here comes from what you recorded.",
      feelings:
        "You finished all 21 days and kept choosing words for how you felt. Those choices are the heart of this reflection.",
      writing:
        "You finished all 21 days and kept returning to your journal. Your writing is the thread through this reflection.",
      // Names only what was recorded: check-ins, journal notes, or both.
      steady: `You finished all 21 days and ${J === 0 ? "checked in a few times" : C === 0 ? "left a few notes" : "left a few check-ins and notes"} along the way. This reflection starts with the rhythm you built.`,
      quiet: `You finished all 21 days, quietly, one morning at a time. This reflection starts with the rhythm you built.`,
    }[profile],
  };

  // 2. Your 21-Day Rhythm
  const rhythmLines = [`You marked ${daysCompleted} of 21 days complete.`];
  if (C > 0 && J > 0)
    rhythmLines.push(
      `You checked in with how you felt on ${plural(C, "day")} and wrote in your journal on ${plural(J, "day")}.`,
    );
  else if (C > 0) rhythmLines.push(`You checked in with how you felt on ${plural(C, "day")}.`);
  else if (J > 0) rhythmLines.push(`You wrote in your journal on ${plural(J, "day")}.`);
  else
    rhythmLines.push(
      "The feeling check-ins and journal were optional, and you kept the focus on the ritual itself.",
    );
  if (C >= 3) {
    const most = Math.max(...weekCheckIns);
    const which = weeks.filter((w) => w.checkInDays === most).map((w) => `Week ${w.week}`);
    rhythmLines.push(
      which.length === 3
        ? `Your check-ins were spread evenly, ${most} of 7 days in each week.`
        : `You checked in most often in ${joinWords(which)} (${most} of 7 days).`,
    );
  }
  if (R > 0) rhythmLines.push(`You logged your Radiant Reds glass on ${plural(R, "day")}.`);

  // 3. What You Noticed
  // A "most often" or week-to-week comparison needs repeats to mean anything:
  // a feeling chosen once is reported as a single choice, and weeks are only
  // compared when each has at least 2 check-in days.
  const repeated = (counts[0]?.days ?? 0) >= 2;
  const noticedLines: string[] = [];
  const withData = weeks.filter((w) => w.top.length > 0);
  if (C === 0) {
    noticedLines.push(
      "You didn't choose any feelings this time, so there's nothing to compare here. The check-in is always there if you'd like it next time.",
    );
  } else if (!repeated) {
    const chosen = counts.map((c) => q(outcomeLabel(c.outcome)));
    noticedLines.push(
      C === 1
        ? `On Day ${checkIn[0]} you chose ${joinWords(chosen)}.`
        : `Across your ${C} check-in days you chose ${joinWords(chosen)}, each once.`,
    );
  } else {
    noticedLines.push(
      leaders.length > 1
        ? `You chose ${joinWords(leaders.map(q))} most often, each on ${plural(counts[0].days, "day")}.`
        : `You chose ${q(leaders[0])} most often, on ${plural(counts[0].days, "day")}.`,
    );
    const firstDay = checkIn.find((d) =>
      feelingsForDay(input.outcomesByDay, d).includes(counts[0].outcome),
    );
    if (firstDay && leaders.length === 1)
      noticedLines.push(`You first chose it on Day ${firstDay}.`);
    if (withData.length === 1) {
      noticedLines.push(`All of your check-ins were in Week ${withData[0].week}.`);
    } else {
      for (const w of weeks) {
        if (!w.top.length) continue;
        noticedLines.push(
          `Week ${w.week}: ${joinWords(w.top.map(q))} (${plural(w.checkInDays, "check-in day")}).`,
        );
      }
      const [w1, , w3] = weeks;
      if (w1.checkInDays >= 2 && w3.checkInDays >= 2) {
        const shared = w1.top.filter((x) => w3.top.includes(x));
        noticedLines.push(
          shared.length
            ? `${joinWords(shared.map(q))} ${shared.length > 1 ? "were" : "was"} among your most-chosen feelings in both Week 1 and Week 3.`
            : `Your most-chosen words changed between Week 1 (${joinWords(w1.top.map(q))}) and Week 3 (${joinWords(w3.top.map(q))}).`,
        );
      }
    }
  }

  // 4. Your Reflection
  const reflection: string[] = [];
  const words = leaders.length > 1 ? "are the words" : "is the word";
  if (repeated && themes.length)
    reflection.push(
      `${joinWords(leaders.map(q))} ${words} you reached for most, and in your journal you kept coming back to ${joinWords(themes)}.`,
    );
  else if (repeated)
    reflection.push(
      `${joinWords(leaders.map(q))} ${words} you reached for most across your check-ins.`,
    );
  else if (themes.length)
    reflection.push(`In your journal you kept coming back to ${joinWords(themes)}.`);
  if (J > 0 && !themes.length)
    reflection.push(
      `You wrote on ${plural(J, "day")}. Those entries stay private, on this device.`,
    );
  if (C === 0 && J === 0)
    reflection.push(
      "You came back to the ritual, morning after morning, until all 21 days were done.",
    );
  reflection.push(
    {
      rich: "You didn't just follow the ritual. You paid attention to it, and that attention is what this reflection is made of.",
      feelings:
        "Naming how you feel, one morning at a time, is a practice of its own. You practiced it.",
      writing:
        "Putting a morning into words is a way of noticing it. You did that again and again.",
      steady: `${J === 0 ? "A few check-ins" : C === 0 ? "A few notes" : "A few check-ins and notes"} and a full 21 days. The rhythm is the part you built.`,
      quiet: "You kept the ritual without needing to explain it. The 21 days are yours.",
    }[profile],
  );

  // 5. Carry It Forward — only from things she actually did, then gentle fallbacks.
  const ideas: { id: string; when: boolean; title: string; body: string }[] = [
    {
      id: "check-in",
      when: C >= 7,
      title: "Keep the one-word check-in",
      body: `After your morning glass, choose one word for how you feel. You did it on ${plural(C, "day")}, and it takes seconds.`,
    },
    {
      id: "journal",
      when: J >= 5,
      title: "Keep a two-line journal",
      body: "One thing you noticed, one thing you want for tomorrow. Short entries still count.",
    },
    {
      id: "mornings",
      when: themes.includes("your mornings"),
      title: "Protect your first ten minutes",
      body: "Your mornings came up often in your writing. Keep ten unhurried minutes for your ritual before the day starts.",
    },
    {
      id: "movement",
      when: themes.includes("moving your body"),
      title: "Pair your glass with a short walk",
      body: "Moving your body came up often in your writing. A short walk after your glass is an easy pairing.",
    },
    {
      id: "reds",
      when: R >= 7,
      title: "Keep Radiant Reds within reach",
      body: `You logged it on ${plural(R, "day")}. Keeping the bag beside your blender makes the morning glass easy to repeat.`,
    },
    {
      id: "saved",
      when: saved > 0,
      title: "Return to your Saved Recipes",
      body: `You saved ${plural(saved, "recipe")}. Choose one to blend each week.`,
    },
    {
      id: "weekly",
      when: true,
      title: "Repeat one recipe each week",
      body: "Choose any smoothie from the 21 and make it once a week. The Grocery list is ready when you are.",
    },
    {
      id: "start-small",
      when: C < 7,
      title: "Start with one tap",
      body: "Next time you blend, choose one word for how the morning felt. A few taps build a record of your own.",
    },
  ];
  const intention = latestIntention(input.journalEntries);
  const carryForward = [
    ...(intention
      ? [
          {
            id: "your-words",
            title: "In your words",
            body: `On Day ${intention.day} you wrote: “${intention.text}”`,
          },
        ]
      : []),
    ...ideas.filter((i) => i.when).map(({ id, title, body }) => ({ id, title, body })),
  ].slice(0, 3);

  // In your own words — verbatim, dated, private. Never paraphrased or explained.
  const excerpts = selectExcerpts(input.journalEntries);
  let ownWords: GlowReflection["words"] = null;
  if (J > 0) {
    const weeksQuoted = new Set(excerpts.map((e) => e.week));
    const lines: string[] = [];
    if (excerpts.length === 0) {
      lines.push(
        "Your entries stay in your Journal exactly as you wrote them. This page quotes a sentence only when it clearly describes something you noticed, so none are quoted here.",
      );
    } else {
      lines.push("A few sentences from your own entries, exactly as you wrote them.");
      if (excerpts.some((e) => e.kind === "change"))
        lines.push("Where a sentence describes a change, that is how you described it yourself.");
      if (excerpts.some((e) => e.kind === "reason"))
        lines.push("Where a sentence gives a reason, the reason is yours.");
    }
    ownWords = {
      excerpts,
      lines,
      question:
        weeksQuoted.has(1) && weeksQuoted.has(3)
          ? "Reading your Week 1 words beside your Week 3 words, what do you notice?"
          : excerpts.length
            ? "Reading these now, what would you add?"
            : "If you look back through your Journal, what stands out to you?",
    };
  }

  // 6. Closing
  const closing = {
    rich: "Carry the noticing forward. The ritual gave it a shape; the attention was yours.",
    feelings: "Keep choosing your word each morning. It's a small way of listening to yourself.",
    writing: "Keep a page open for yourself. Your mornings are worth writing down.",
    steady: "Keep what felt easy, and let the rest stay optional.",
    quiet: "Twenty-one mornings, kept. Begin again whenever you like.",
  }[profile];

  // 7. Shareable card — counts and fixed feeling labels only, never journal text or themes.
  const card: GlowReflectionCardData = {
    name,
    line: {
      rich: "21 days of ritual and reflection",
      feelings: "21 days of checking in with myself",
      writing: "21 days, in my own words",
      steady: "21 mornings, kept",
      quiet: "21 mornings, kept",
    }[profile],
    daysCompleted,
    checkInDays: C,
    journalDays: J,
    topFeelings: top.map((t) => t.label),
    feelingsHeading: repeated ? "The words I chose most" : "The words I chose",
  };

  return {
    profile,
    opening,
    rhythm: {
      daysCompleted,
      checkInDays: C,
      journalDays: J,
      redsDays: R,
      weekCheckIns,
      lines: rhythmLines,
    },
    noticed: { top, weeks, lines: noticedLines },
    reflection,
    carryForward,
    closing,
    themes,
    words: ownWords,
    card,
  };
}

/** Every customer-facing sentence, for claim and privacy scans. */
export function reflectionText(r: GlowReflection): string {
  return [
    r.opening.title,
    r.opening.body,
    ...r.rhythm.lines,
    ...r.noticed.lines,
    ...r.reflection,
    ...r.carryForward.flatMap((c) => [c.title, c.body]),
    r.closing,
  ].join("\n");
}
