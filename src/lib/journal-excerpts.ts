/**
 * Picks a few of the customer's own journal sentences for the private Day 21 reflection.
 *
 * Rules:
 * - Only verbatim sentences are used, always with their day. Nothing is paraphrased,
 *   summarised or invented, and no reason or outcome is added to what was written.
 * - A sentence is labelled a "change" or a "reason" only when its own words say so
 *   ("easier than…", "because…"). Otherwise it is just something the customer wrote.
 * - Sentences touching health, bodies, loss or other sensitive subjects are skipped,
 *   as are sentences with product-claim words, so the reflection never echoes them.
 * - Runs on-device. The result is shown on the private reflection screen only; the
 *   shareable card never receives it.
 */
import { journalTextForDay, ALL_JOURNAL_NUDGES } from "./reflections";

export type ExcerptKind = "change" | "reason" | "intention" | "noticed";
export type JournalExcerpt = { day: number; week: 1 | 2 | 3; text: string; kind: ExcerptKind };

const DAYS = Array.from({ length: 21 }, (_, i) => i + 1);
const weekOf = (d: number) => (d <= 7 ? 1 : d <= 14 ? 2 : 3) as 1 | 2 | 3;

/** Topics never surfaced, even from the customer's own words. */
const SENSITIVE =
  /\b(pain|hurt|hurts|sick|ill|illness|doctor|hospital|medic\w*|diagnos\w*|symptom\w*|anxi\w*|depress\w*|panic|therap\w*|cancer|died|death|dying|grief|griev\w*|funeral|divorce|abuse\w*|suicid\w*|self-harm|pregnan\w*|miscarr\w*|weight|weigh|pounds|lbs|kg|calorie\w*|diet\w*|bloat\w*|digest\w*|gut|skin|acne|period|cramp\w*|hormone\w*|inflam\w*|detox\w*|cure\w*|heal\w*|treat\w*|disease|allerg\w*|medication|pill\w*|drunk|alcohol|money|debt|fired|lawyer)\b/i;
const FIRST_PERSON = /\b(i|i'm|i’m|i've|i’ve|i'd|i’d|my|me|myself)\b/i;
const KIND_RULES: [ExcerptKind, RegExp][] = [
  [
    "change",
    /\b(easier|harder|more than|less than|than (before|last week|yesterday|usual|the first)|for the first time|no longer|anymore|used to|started to|began to|now i\b|getting (easier|better))/i,
  ],
  ["reason", /\b(because|since i|so that)\b/i],
  [
    "intention",
    /\b(i want to|i'd like to|i’d like to|i hope to|i plan to|i'm going to|i’m going to|i will)\b/i,
  ],
  [
    "noticed",
    /\b(notic\w*|realiz\w*|learn\w*|enjoy\w*|love[ds]?|grateful|thankful|proud|felt|feel)\b/i,
  ],
];
const MIN = 24;
const MAX = 200;

function sentences(text: string): string[] {
  let t = text;
  for (const n of ALL_JOURNAL_NUDGES) t = t.split(n).join(" ");
  return t
    .split(/(?<=[.!?])\s+|\n+/)
    .map((x) => x.replace(/\s+/g, " ").trim())
    .filter((x) => x.length >= MIN && x.length <= MAX);
}

function classify(sentence: string): ExcerptKind | null {
  if (SENSITIVE.test(sentence) || !FIRST_PERSON.test(sentence)) return null;
  for (const [kind, re] of KIND_RULES) if (re.test(sentence)) return kind;
  return null;
}

/** Every usable sentence, in day order. */
export function candidateExcerpts(journalEntries: unknown): JournalExcerpt[] {
  const out: JournalExcerpt[] = [];
  for (const day of DAYS) {
    for (const text of sentences(journalTextForDay(journalEntries, day))) {
      const kind = classify(text);
      if (kind) out.push({ day, week: weekOf(day), text, kind });
    }
  }
  return out;
}

const PRIORITY: ExcerptKind[] = ["change", "reason", "noticed", "intention"];
const best = (xs: JournalExcerpt[]) =>
  [...xs].sort((a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind) || a.day - b.day)[0];

/**
 * Up to three sentences spread across the weeks (one each from Week 1, 2 and 3 when
 * available, preferring changes and reasons the customer described), in day order.
 * Deterministic: the same entries always give the same excerpts.
 */
export function selectExcerpts(journalEntries: unknown): JournalExcerpt[] {
  const all = candidateExcerpts(journalEntries).filter((e) => e.kind !== "intention");
  const picked: JournalExcerpt[] = [];
  for (const w of [1, 2, 3] as const) {
    const pick = best(all.filter((e) => e.week === w));
    if (pick) picked.push(pick);
  }
  // Fewer than three weeks written in: fill from the remaining sentences, one per day.
  for (const e of [...all].sort(
    (a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind) || a.day - b.day,
  )) {
    if (picked.length >= 3) break;
    if (!picked.some((p) => p.day === e.day)) picked.push(e);
  }
  return picked.sort((a, b) => a.day - b.day);
}

/** The most recent thing the customer wrote they want to carry on with, if any. */
export function latestIntention(journalEntries: unknown): JournalExcerpt | null {
  const xs = candidateExcerpts(journalEntries).filter((e) => e.kind === "intention");
  return xs.length ? xs[xs.length - 1] : null;
}
