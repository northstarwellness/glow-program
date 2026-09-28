/**
 * Read-only views over the feelings a customer picked in each day's
 * "How do you feel?" check-in (noure_app_v1 → state.outcomesByDay[day]).
 *
 * Day page, Journal and Progress all read through these helpers, so every screen
 * shows the same selections. Nothing here writes to storage: legacy or malformed
 * values are skipped on read, never deleted.
 */
import { OUTCOMES, STORAGE_KEY } from "./store";

const PROGRAM_DAYS = Array.from({ length: 21 }, (_, i) => i + 1);
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Known feelings chosen for `day`, once each, in the fixed chip order. */
export function feelingsForDay(outcomesByDay: unknown, day: number): string[] {
  if (!isRecord(outcomesByDay)) return [];
  const raw = outcomesByDay[String(day)];
  if (!Array.isArray(raw)) return [];
  return OUTCOMES.filter((o) => raw.includes(o));
}

/** Program days (1–21, ascending) with at least one feeling selected. */
export function daysWithFeelings(outcomesByDay: unknown, days: number[] = PROGRAM_DAYS): number[] {
  return days.filter((d) => feelingsForDay(outcomesByDay, d).length > 0);
}

/**
 * How many days each feeling was chosen on (a feeling counts once per day).
 * Sorted by count, ties in chip order, so the result is stable.
 */
export function feelingCounts(
  outcomesByDay: unknown,
  days: number[] = PROGRAM_DAYS,
): { outcome: string; days: number }[] {
  const counts = new Map<string, number>();
  for (const d of days)
    for (const o of feelingsForDay(outcomesByDay, d)) counts.set(o, (counts.get(o) ?? 0) + 1);
  return OUTCOMES.filter((o) => counts.has(o))
    .map((o) => ({ outcome: o as string, days: counts.get(o)! }))
    .sort((a, b) => b.days - a.days);
}

/** Journal text for `day`, or "" when nothing was written. */
export function journalTextForDay(journalEntries: unknown, day: number): string {
  if (!isRecord(journalEntries)) return "";
  const e = journalEntries[String(day)];
  return isRecord(e) && typeof e.entry === "string" ? e.entry.trim() : "";
}

/** The date an entry was written, only when the stored timestamp is a real date. */
export function journalDateForDay(journalEntries: unknown, day: number): Date | null {
  if (!isRecord(journalEntries)) return null;
  const e = journalEntries[String(day)];
  if (!isRecord(e) || typeof e.timestamp !== "string") return null;
  const t = Date.parse(e.timestamp);
  return Number.isFinite(t) ? new Date(t) : null;
}

/** Feelings for `day` as they are actually stored on this device (to confirm a save). */
export function persistedFeelingsForDay(
  day: number,
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
): string[] | null {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    return feelingsForDay(JSON.parse(raw)?.state?.outcomesByDay, day);
  } catch {
    return null;
  }
}

/** Tappable starters in the journal. Stripped before reading themes, so they never count as the customer's own words. */
export const JOURNAL_NUDGES = [
  "What I noticed today.",
  "My digestion felt",
  "I felt lighter when",
  "My energy today was",
  "What helped me stay consistent:",
  "Did I feel fuller, lighter, or more energized:",
];
