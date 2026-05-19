import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DailyLog = { reds?: boolean; ritual?: boolean; journal?: boolean };
export type JournalEntry = { prompt: string; entry: string; response: string; timestamp: string };

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

  setVerifiedEmail: (email: string) => void;
  setName: (n: string) => void;
  startReset: () => void;
  setSeenWelcome: () => void;
  toggleLog: (day: number, key: keyof DailyLog) => void;
  saveJournal: (day: number, e: JournalEntry) => void;
  completeDay: (day: number) => void;
  toggleSavedRecipe: (id: string) => void;
  setNotificationTime: (t: string) => void;
  earnBadge: (id: string) => void;
  markMilestoneShown: (id: string) => void;
  setPhoto: (day: number, dataUrl: string) => void;
  toggleGrocery: (id: string) => void;
  clearGrocery: () => void;
  resetAll: () => void;
};

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

      setVerifiedEmail: (email) => set({ verifiedEmail: email }),
      setName: (n) => set({ name: n.trim() }),
      startReset: () => set((s) => ({ startDate: s.startDate ?? new Date().toISOString() })),
      setSeenWelcome: () => set({ seenWelcome: true }),
      toggleLog: (day, key) =>
        set((s) => ({
          dailyLogs: { ...s.dailyLogs, [day]: { ...s.dailyLogs[day], [key]: !s.dailyLogs[day]?.[key] } },
        })),
      saveJournal: (day, e) =>
        set((s) => ({ journalEntries: { ...s.journalEntries, [day]: e } })),
      completeDay: (day) =>
        set((s) =>
          s.completedDays.includes(day) ? s : { completedDays: [...s.completedDays, day].sort((a, b) => a - b) }
        ),
      toggleSavedRecipe: (id) =>
        set((s) => ({
          savedRecipes: s.savedRecipes.includes(id)
            ? s.savedRecipes.filter((x) => x !== id)
            : [...s.savedRecipes, id],
        })),
      setNotificationTime: (t) => set({ notificationTime: t }),
      earnBadge: (id) =>
        set((s) => (s.badgesEarned.includes(id) ? s : { badgesEarned: [...s.badgesEarned, id] })),
      markMilestoneShown: (id) =>
        set((s) => (s.shownMilestones.includes(id) ? s : { shownMilestones: [...s.shownMilestones, id] })),
      setPhoto: (day, dataUrl) => set((s) => ({ photos: { ...s.photos, [day]: dataUrl } })),
      toggleGrocery: (id) =>
        set((s) => ({
          groceryChecked: { ...s.groceryChecked, [id]: !s.groceryChecked[id] },
        })),
      clearGrocery: () => set({ groceryChecked: {} }),
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
        }),
    }),
    { name: "noure_app_v1" }
  )
);

export function currentDay(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return Math.max(1, Math.min(21, Math.floor(ms / 86400000) + 1));
}

export function glowScore(s: {
  completedDays: number[];
  journalEntries: Record<number, unknown>;
  dailyLogs: Record<number, DailyLog>;
}): number {
  const ritualPts = (s.completedDays.length / 21) * 50;
  const journalPts = (Object.keys(s.journalEntries).length / 21) * 30;
  const logPts =
    (Object.values(s.dailyLogs).filter((l) => l.reds || l.ritual || l.journal).length / 21) * 20;
  return Math.round(ritualPts + journalPts + logPts);
}
