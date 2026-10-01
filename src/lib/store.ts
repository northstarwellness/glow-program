import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DailyLog = { reds?: boolean; ritual?: boolean; journal?: boolean };
export type JournalEntry = { prompt: string; entry: string; response: string; timestamp: string };

/** Approved outcome labels — no medical claims */
export const OUTCOMES = [
  "Lighter",
  "Less bloated",
  "Full but light",
  "Energized",
  "Calm digestion",
  "Satisfied",
  "Glowy",
  "Clearer mood",
  // Added 2026-09-29 (after the original eight, which never change): neutral and
  // lower-energy mornings can be recorded honestly, not only good ones.
  "Rested",
  "Focused",
  "Just okay",
  "Tired",
  // Added 2026-09-30, appended so every earlier value and record stays exactly as saved.
  "Calm",
  "Overwhelmed",
] as const;
export type Outcome = (typeof OUTCOMES)[number];

/**
 * The feelings offered on the Day page and in the Morning Journal (2026-09-29; Calm and
 * Overwhelmed added 2026-09-30): eight neutral, everyday words, including honest low ones. Every value above stays valid, so any day
 * that already holds another feeling keeps it, shows it, and can still untick it.
 */
export const VISIBLE_OUTCOMES = [
  "Rested",
  "Energized",
  "Calm",
  "Focused",
  "Satisfied",
  "Just okay",
  "Tired",
  "Overwhelmed",
] as const satisfies readonly Outcome[];

/** Display text only. Stored values in outcomesByDay never change, so saved history stays readable. */
const OUTCOME_DISPLAY: Record<string, string> = {
  "Less bloated": "Comfortable",
  "Calm digestion": "Settled",
};
export const outcomeLabel = (outcome: string): string => OUTCOME_DISPLAY[outcome] ?? outcome;

type State = {
  verifiedEmail: string | null;
  name: string | null;
  startDate: string | null;
  completedDays: number[];
  journalEntries: Record<number, JournalEntry>;
  dailyLogs: Record<number, DailyLog>;
  savedRecipes: string[];
  photos: Record<number, string>;
  notificationTime: string;
  badgesEarned: string[];
  seenWelcome: boolean;
  shownMilestones: string[];
  groceryChecked: Record<string, boolean>;
  /** Feeling chips selected per day */
  outcomesByDay: Record<number, string[]>;
  /** When she last opened Home (ISO). Added 2026-09-29; absent in older saved data. */
  lastVisitAt: string | null;

  setVerifiedEmail: (email: string) => void;
  setName: (n: string) => void;
  startReset: () => void;
  setSeenWelcome: () => void;
  toggleLog: (day: number, key: keyof DailyLog) => void;
  setLog: (day: number, key: keyof DailyLog, value: boolean) => void;
  saveJournal: (day: number, e: JournalEntry) => void;
  /** Removes a day's note only when she has cleared its text. */
  clearJournal: (day: number) => void;
  setLastVisit: (iso: string) => void;
  completeDay: (day: number) => void;
  toggleSavedRecipe: (id: string) => void;
  setRecipeSaved: (id: string, saved: boolean) => void;
  setNotificationTime: (t: string) => void;
  earnBadge: (id: string) => void;
  markMilestoneShown: (id: string) => void;
  setPhoto: (day: number, dataUrl: string) => void;
  toggleGrocery: (id: string) => void;
  clearGrocery: () => void;
  toggleOutcomeForDay: (day: number, outcome: string) => void;
  resetAll: () => void;
};

export const STORAGE_KEY = "noure_app_v1";
export const UNREADABLE_BACKUP_KEY = "noure_app_v1_unreadable_backup";

const isProgramDay = (d: unknown): d is number =>
  typeof d === "number" && Number.isInteger(d) && d >= 1 && d <= 21;

const RECORD_FIELDS = [
  "journalEntries",
  "dailyLogs",
  "photos",
  "groceryChecked",
  "outcomesByDay",
] as const;
const ARRAY_FIELDS = ["savedRecipes", "badgesEarned", "shownMilestones"] as const;
/** Unique, non-empty string ids in their original order. */
export function dedupeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const out: string[] = [];
  for (const id of ids) if (typeof id === "string" && id && !out.includes(id)) out.push(id);
  return out;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function mergePersisted<T extends object>(persisted: unknown, current: T): T {
  if (!isRecord(persisted)) return current;
  const merged = { ...current, ...persisted } as Record<string, unknown>;
  const base = current as Record<string, unknown>;
  for (const k of RECORD_FIELDS) if (k in merged && !isRecord(merged[k])) merged[k] = base[k];
  for (const k of ARRAY_FIELDS) if (k in merged && !Array.isArray(merged[k])) merged[k] = base[k];
  merged.completedDays = normalizeCompletedDays(merged.completedDays);
  merged.savedRecipes = dedupeIds(merged.savedRecipes);
  return merged as T;
}

/**
 * If noure_app_v1 can't be parsed, keep an untouched copy before the app writes
 * fresh state, so a customer's original data is never silently lost.
 */
function preserveUnreadableStorage() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw && !globalThis.localStorage.getItem(UNREADABLE_BACKUP_KEY)) {
      globalThis.localStorage.setItem(UNREADABLE_BACKUP_KEY, raw);
    }
  } catch {
    /* storage unavailable — nothing more we can do */
  }
}

export const useApp = create<State>()(
  persist(
    (set) => ({
      verifiedEmail: null,
      name: null,
      startDate: null,
      completedDays: [],
      journalEntries: {},
      dailyLogs: {},
      savedRecipes: [],
      photos: {},
      notificationTime: "07:00",
      badgesEarned: [],
      seenWelcome: false,
      shownMilestones: [],
      groceryChecked: {},
      outcomesByDay: {},
      lastVisitAt: null,

      setVerifiedEmail: (email) => set({ verifiedEmail: email }),
      setName: (n) => set({ name: n.trim() }),
      startReset: () => set((s) => ({ startDate: s.startDate ?? new Date().toISOString() })),
      setSeenWelcome: () => set({ seenWelcome: true }),
      toggleLog: (day, key) =>
        set((s) => ({
          dailyLogs: {
            ...s.dailyLogs,
            [day]: { ...s.dailyLogs[day], [key]: !s.dailyLogs[day]?.[key] },
          },
        })),
      setLog: (day, key, value) =>
        set((s) =>
          s.dailyLogs[day]?.[key] === value
            ? s
            : { dailyLogs: { ...s.dailyLogs, [day]: { ...s.dailyLogs[day], [key]: value } } },
        ),
      saveJournal: (day, e) => set((s) => ({ journalEntries: { ...s.journalEntries, [day]: e } })),
      clearJournal: (day) =>
        set((s) => {
          if (!(day in s.journalEntries)) return s;
          const rest = { ...s.journalEntries };
          delete rest[day];
          return { journalEntries: rest };
        }),
      setLastVisit: (iso) => set({ lastVisitAt: iso }),
      completeDay: (day) =>
        set((s) => {
          const current = normalizeCompletedDays(s.completedDays);
          if (!isProgramDay(day) || current.includes(day)) {
            return current.length === s.completedDays.length ? s : { completedDays: current };
          }
          return { completedDays: [...current, day].sort((a, b) => a - b) };
        }),
      toggleSavedRecipe: (id) =>
        set((s) => ({
          savedRecipes: s.savedRecipes.includes(id)
            ? s.savedRecipes.filter((x) => x !== id)
            : dedupeIds([...s.savedRecipes, id]),
        })),
      /** Explicit set — repeated taps can never create duplicates or flip past the intent. */
      setRecipeSaved: (id, saved) =>
        set((s) => {
          const current = dedupeIds(s.savedRecipes);
          const has = current.includes(id);
          if (saved === has)
            return current.length === s.savedRecipes.length ? s : { savedRecipes: current };
          return { savedRecipes: saved ? [...current, id] : current.filter((x) => x !== id) };
        }),
      setNotificationTime: (t) => set({ notificationTime: t }),
      earnBadge: (id) =>
        set((s) => (s.badgesEarned.includes(id) ? s : { badgesEarned: [...s.badgesEarned, id] })),
      markMilestoneShown: (id) =>
        set((s) =>
          s.shownMilestones.includes(id) ? s : { shownMilestones: [...s.shownMilestones, id] },
        ),
      setPhoto: (day, dataUrl) => set((s) => ({ photos: { ...s.photos, [day]: dataUrl } })),
      toggleGrocery: (id) =>
        set((s) => ({
          groceryChecked: { ...s.groceryChecked, [id]: !s.groceryChecked[id] },
        })),
      clearGrocery: () => set({ groceryChecked: {} }),
      // Only this day's list changes. It holds each feeling at most once, however it is tapped,
      // and any legacy values already stored for the day are kept as they are.
      toggleOutcomeForDay: (day, outcome) =>
        set((s) => {
          if (!isProgramDay(day) || !(OUTCOMES as readonly string[]).includes(outcome)) return s;
          const stored = s.outcomesByDay[day];
          const current = dedupeIds(Array.isArray(stored) ? stored : []);
          const next = current.includes(outcome)
            ? current.filter((o) => o !== outcome)
            : [...current, outcome];
          return { outcomesByDay: { ...s.outcomesByDay, [day]: next } };
        }),
      resetAll: () =>
        set({
          verifiedEmail: null,
          name: null,
          startDate: null,
          completedDays: [],
          journalEntries: {},
          dailyLogs: {},
          savedRecipes: [],
          photos: {},
          badgesEarned: [],
          seenWelcome: false,
          shownMilestones: [],
          groceryChecked: {},
          outcomesByDay: {},
          lastVisitAt: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      // Stored progress is merged over defaults; fields with an unusable type fall back to
      // defaults in memory, and completedDays is normalized (duplicates, strings, order).
      merge: (persisted, current) => mergePersisted(persisted, current),
      onRehydrateStorage: () => (_state, error) => {
        if (error) preserveUnreadableStorage();
      },
    },
  ),
);

export function currentDay(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return Math.max(1, Math.min(21, Math.floor(ms / 86400000) + 1));
}

/** Valid, unique, ascending days 1–21. Numeric strings are accepted; anything else is ignored, never deleted from storage. */
export function normalizeCompletedDays(days: unknown): number[] {
  if (!Array.isArray(days)) return [];
  const out = new Set<number>();
  for (const d of days) {
    const n = typeof d === "string" && d.trim() !== "" ? Number(d) : d;
    if (isProgramDay(n)) out.add(n);
  }
  return [...out].sort((a, b) => a - b);
}

/** True once all 21 days are recorded. */
export function isProgramComplete(completedDays: unknown): boolean {
  return normalizeCompletedDays(completedDays).length === 21;
}

/**
 * The day the customer should be on: the earliest day not yet completed.
 * Once all 21 are complete it stays on 21 (the program is finished).
 */
export function activeDay(completedDays: unknown): number {
  const done = new Set(normalizeCompletedDays(completedDays));
  for (let d = 1; d <= 21; d++) if (!done.has(d)) return d;
  return 21;
}

/** A day may be opened when it is already completed or it is the active day. */
export function isDayUnlocked(day: number, completedDays: unknown): boolean {
  return normalizeCompletedDays(completedDays).includes(day) || day === activeDay(completedDays);
}

export const MILESTONE_DAYS = [1, 7, 14];

/**
 * Where to send the customer right after completing `day`, given the completed
 * days after that write. In a sequential journey this is Day N+1; if the next
 * day was already done (legacy gap), it is the new earliest incomplete day.
 */
export function routeAfterComplete(
  day: number,
  completedAfter: unknown,
):
  | { to: "/celebrate" }
  | { to: "/milestone/$id"; params: { id: string } }
  | { to: "/day/$n"; params: { n: string } } {
  if (day >= 21 || isProgramComplete(completedAfter)) return { to: "/celebrate" };
  if (MILESTONE_DAYS.includes(day)) return { to: "/milestone/$id", params: { id: `day-${day}` } };
  return { to: "/day/$n", params: { n: String(activeDay(completedAfter)) } };
}

/** Reads noure_app_v1 back to confirm a saved-recipe change actually persisted. */
export function isRecipeSavedPersisted(
  id: string,
  saved: boolean,
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
): boolean {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return false;
    return dedupeIds(JSON.parse(raw)?.state?.savedRecipes).includes(id) === saved;
  } catch {
    return false;
  }
}

/** Reads noure_app_v1 back from storage to confirm a completion actually persisted. */
export function isDayPersisted(
  day: number,
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
): boolean {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return false;
    return normalizeCompletedDays(JSON.parse(raw)?.state?.completedDays).includes(day);
  } catch {
    return false;
  }
}

/**
 * Factual 21-day progress. Every number is a count of completed mornings, never a score:
 * `completed` is how many of Days 1–21 are marked complete, `next` is the morning she is
 * on (the earliest one not yet complete), or null once all 21 are done.
 */
export function ritualProgress(completedDays: unknown): {
  completed: number;
  remaining: number;
  next: number | null;
} {
  const completed = normalizeCompletedDays(completedDays).length;
  return {
    completed,
    remaining: 21 - completed,
    next: completed === 21 ? null : activeDay(completedDays),
  };
}

/** Whole calendar days between two ISO times, by local date. Invalid input → 0. */
export function daysBetween(fromIso: string | null, to: Date = new Date()): number {
  if (!fromIso) return 0;
  const from = new Date(fromIso);
  if (Number.isNaN(from.getTime())) return 0;
  const a = new Date(from).setHours(0, 0, 0, 0);
  const b = new Date(to).setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b - a) / 86400000));
}
