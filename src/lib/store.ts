import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DailyLog = { reds?: boolean; ritual?: boolean; journal?: boolean };
export type JournalEntry = { prompt: string; entry: string; response: string; timestamp: string };

export type OnboardingAnswers = {
  skinGoal: "glow" | "texture" | "calm" | null;
  gutGoal: "bloating" | "energy" | "unsettled" | "good" | null;
  morningPace: "quick" | "slow" | null;
};

export type ReflectionEntry = {
  skin: number;
  gut: number;
  energy: number;
  mood: number;
  timestamp: string;
};

export type ProgramId = "skin-glow" | "feel-lighter" | "balanced-energy";

const BLANK_ONBOARDING: OnboardingAnswers = { skinGoal: null, gutGoal: null, morningPace: null };

type State = {
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
  onboarding: OnboardingAnswers;
  onboardingDone: boolean;
  checklistLogs: Record<number, Record<string, boolean>>;
  reflectionLogs: Record<number, ReflectionEntry>;
  activeProgram: ProgramId;
  groceryChecked: Record<string, boolean>;

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
  setOnboarding: (answers: OnboardingAnswers) => void;
  toggleChecklist: (day: number, taskId: string) => void;
  saveReflection: (day: number, entry: ReflectionEntry) => void;
  setProgram: (p: ProgramId) => void;
  toggleGroceryItem: (id: string) => void;
  clearGrocery: () => void;
  resetAll: () => void;
};

export const useApp = create<State>()(
  persist(
    (set) => ({
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
      onboarding: BLANK_ONBOARDING,
      onboardingDone: false,
      checklistLogs: {},
      reflectionLogs: {},
      activeProgram: "skin-glow",
      groceryChecked: {},

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
      setOnboarding: (answers) => set({ onboarding: answers, onboardingDone: true }),
      toggleChecklist: (day, taskId) =>
        set((s) => {
          const dayLog = s.checklistLogs[day] ?? {};
          return { checklistLogs: { ...s.checklistLogs, [day]: { ...dayLog, [taskId]: !dayLog[taskId] } } };
        }),
      saveReflection: (day, entry) =>
        set((s) => ({ reflectionLogs: { ...s.reflectionLogs, [day]: entry } })),
      setProgram: (p) => set({ activeProgram: p }),
      toggleGroceryItem: (id) =>
        set((s) => ({
          groceryChecked: { ...s.groceryChecked, [id]: !s.groceryChecked[id] },
        })),
      clearGrocery: () => set({ groceryChecked: {} }),
      resetAll: () =>
        set({
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
          onboarding: BLANK_ONBOARDING,
          onboardingDone: false,
          checklistLogs: {},
          reflectionLogs: {},
          activeProgram: "skin-glow",
          groceryChecked: {},
        }),
    }),
    { name: "noure_app_v2" }
  )
);

// Returns the lowest day the user has not yet completed (1–21).
// This is the single source of truth for "what day should I work on next?"
export function activeDay(completedDays: number[]): number {
  for (let d = 1; d <= 21; d++) {
    if (!completedDays.includes(d)) return d;
  }
  return 21; // all 21 complete — stay on 21
}

export function currentDay(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  return Math.max(1, Math.min(21, Math.floor(ms / 86400000) + 1));
}

export function isDayUnlocked(
  dayNum: number,
  startDate: string | null,
  completedDays: number[]
): boolean {
  const calendarDay = currentDay(startDate);
  if (dayNum <= calendarDay) return true;
  if (dayNum > 1 && completedDays.includes(dayNum - 1)) return true;
  return false;
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
