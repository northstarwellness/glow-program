import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GlowTypeId } from "./glow-data";

export type DayProgress = {
  completedSteps: string[];
  journal?: string;
  completedAt?: string;
};

type GlowState = {
  startedAt: string | null;
  glowType: GlowTypeId | null;
  quizAnswers: Record<number, GlowTypeId>;
  email?: string;
  reminderTime?: string;
  days: Record<number, DayProgress>;
  grocery: Record<string, boolean>;

  setQuizAnswer: (qid: number, tag: GlowTypeId) => void;
  setGlowType: (t: GlowTypeId) => void;
  setEmail: (e: string) => void;
  setReminderTime: (t: string) => void;
  startReset: () => void;
  toggleStep: (day: number, stepId: string) => void;
  setJournal: (day: number, text: string) => void;
  toggleGrocery: (item: string) => void;
  reset: () => void;
};

export const useGlow = create<GlowState>()(
  persist(
    (set) => ({
      startedAt: null,
      glowType: null,
      quizAnswers: {},
      days: {},
      grocery: {},

      setQuizAnswer: (qid, tag) =>
        set((s) => ({ quizAnswers: { ...s.quizAnswers, [qid]: tag } })),
      setGlowType: (t) => set({ glowType: t }),
      setEmail: (e) => set({ email: e }),
      setReminderTime: (t) => set({ reminderTime: t }),
      startReset: () =>
        set((s) => ({ startedAt: s.startedAt ?? new Date().toISOString() })),
      toggleStep: (day, stepId) =>
        set((s) => {
          const d = s.days[day] ?? { completedSteps: [] };
          const has = d.completedSteps.includes(stepId);
          const completedSteps = has
            ? d.completedSteps.filter((x) => x !== stepId)
            : [...d.completedSteps, stepId];
          return {
            days: {
              ...s.days,
              [day]: {
                ...d,
                completedSteps,
                completedAt: completedSteps.length >= 3 ? new Date().toISOString() : d.completedAt,
              },
            },
          };
        }),
      setJournal: (day, text) =>
        set((s) => ({
          days: { ...s.days, [day]: { ...(s.days[day] ?? { completedSteps: [] }), journal: text } },
        })),
      toggleGrocery: (item) =>
        set((s) => ({ grocery: { ...s.grocery, [item]: !s.grocery[item] } })),
      reset: () =>
        set({ startedAt: null, glowType: null, quizAnswers: {}, days: {}, grocery: {}, email: undefined }),
    }),
    { name: "noure-glow-v1" }
  )
);

export function currentDay(startedAt: string | null): number {
  if (!startedAt) return 1;
  const start = new Date(startedAt);
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0);
  const day = Math.floor(ms / 86400000) + 1;
  return Math.max(1, Math.min(21, day));
}
