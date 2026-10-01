import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, isDayUnlocked, activeDay, STORAGE_KEY } from "@/lib/store";
import { ProgressSkeleton } from "@/components/ProgressSkeleton";
import { useHydrated } from "@/lib/use-hydrated";
import { JOURNAL_PROMPTS, phaseFor, reflectJournal } from "@/lib/content";
import { FeelingChips } from "@/components/FeelingChips";

export const Route = createFileRoute("/journal/$n")({ component: JournalDay });

// Anthropic direct-browser access — requires VITE_ANTHROPIC_KEY to be set
const ANTHROPIC_KEY =
  typeof import.meta !== "undefined"
    ? ((import.meta as { env?: Record<string, string> }).env?.VITE_ANTHROPIC_KEY ?? "")
    : "";

async function fetchAIReflection(text: string, name: string, day: number): Promise<string | null> {
  if (!ANTHROPIC_KEY) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `You are the NOURÉ ritual companion — a warm, calm, deeply knowledgeable guide inside a 21-day polyphenol wellness ritual. The user is ${name}, on Day ${day} of their 21-day Inner Glow Reset. You know the gut-skin axis, you understand polyphenols, you speak with elegance and warmth. Never clinical. Never hype. 2-3 sentences maximum. Respond only to what they've written. End with one gentle question or observation that deepens their reflection. No emojis. No generic wellness phrases. Never make health, disease, inflammation, skin-result, detox, blood-sugar or hormone claims, and never attribute a change the user describes to the ritual or to Radiant Reds. If the user describes pain or a persistent symptom, gently suggest they talk to a doctor.`,
        messages: [{ role: "user", content: `Day ${day} journal entry: "${text}"` }],
      }),
    });
    const data = await res.json();
    return data?.content?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

function JournalDay() {
  const { n } = useParams({ from: "/journal/$n" });
  const hydrated = useHydrated();
  const s = useApp();

  const validParam = /^\d+$/.test(n) && +n >= 1 && +n <= 21;
  const day = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  if (!hydrated) return <ProgressSkeleton />;
  if (!s.name) return <Navigate to="/" />;
  if (!validParam || !isDayUnlocked(day, s.completedDays)) return <Navigate to="/journal" />;
  // Mounted only after saved data loads, so an existing entry is never shown as empty.
  return <JournalEditor key={day} day={day} />;
}

function JournalEditor({ day }: { day: number }) {
  const s = useApp();
  const existing = s.journalEntries[day];
  // A saved note keeps the prompt it was written to, so older notes read as they were written.
  const prompt = existing?.prompt?.trim() || (JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "");
  const phase = phaseFor(day);

  // All hooks before conditional returns
  const [text, setText] = useState(existing?.entry ?? "");
  const [aiResponse, setAiResponse] = useState<string | null>(existing?.response ?? null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<(() => void) | null>(null);
  const loggedOnce = useRef(!!existing);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  /** Saves the entry (or removes it when she has cleared the text), then confirms against storage. */
  const commit = (val: string) => {
    if (!val.trim()) {
      // She cleared the entry: remove it rather than silently keeping the old text.
      s.clearJournal(day);
      if (loggedOnce.current) s.setLog(day, "journal", false);
      loggedOnce.current = false;
      setSaveState(isNotePersisted(day, null) ? "idle" : "failed");
      return;
    }
    const r = existing?.response ?? aiResponse ?? "";
    s.saveJournal(day, {
      prompt,
      entry: val,
      response: r,
      timestamp: new Date().toISOString(),
    });
    if (!loggedOnce.current) {
      s.setLog(day, "journal", true);
      if (Object.keys(s.journalEntries).length === 0) s.earnBadge("first-words");
      loggedOnce.current = true;
    }
    setSaveState(isNotePersisted(day, val) ? "saved" : "failed");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setSaveState("saving");
    // Debounced autosave: 800ms after last keystroke
    if (saveTimer.current) clearTimeout(saveTimer.current);
    pendingSave.current = () => {
      pendingSave.current = null;
      commit(val);
    };
    saveTimer.current = setTimeout(() => pendingSave.current?.(), 800);
  };

  // "Save entry": saves now, without waiting for the autosave.
  const saveEntry = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    pendingSave.current = null;
    commit(text);
  };
  const savedText = s.journalEntries[day]?.entry ?? "";
  const canSave = text !== savedText && !(text.trim() === "" && savedText === "");

  /** Saves any pending keystrokes right now. Safe to call repeatedly. */
  const flushPending = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = null;
    pendingSave.current?.();
  };
  const flushRef = useRef(flushPending);
  flushRef.current = flushPending;

  // Leaving within the autosave delay still saves the last keystroke: on unmount (tab bar,
  // back), and when the page is hidden (iPhone app switcher, lock screen, closing the tab).
  useEffect(() => {
    const onHide = () => flushRef.current();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
      flushRef.current();
    };
  }, []);

  const reflectWithCompanion = async () => {
    if (text.length < 20 || aiLoading) return;
    setAiLoading(true);
    // Instant local response first
    const localResponse = reflectJournal(text, s.name ?? "");
    setAiResponse(localResponse);
    // Save immediately
    s.saveJournal(day, {
      prompt,
      entry: text,
      response: localResponse,
      timestamp: new Date().toISOString(),
    });
    if (!loggedOnce.current) {
      s.setLog(day, "journal", true);
      loggedOnce.current = true;
    }
    // Then try AI
    const aiResult = await fetchAIReflection(text, s.name ?? "", day);
    if (aiResult) {
      setAiResponse(aiResult);
      s.saveJournal(day, {
        prompt,
        entry: text,
        response: aiResult,
        timestamp: new Date().toISOString(),
      });
    }
    setAiLoading(false);
  };

  // Client-only (mounted after hydration), so the phone's local date is used — no server/UTC mismatch.
  const dateLabel = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <Frame>
      <TopBar name={s.name} day={activeDay(s.completedDays)} />
      <Link to="/journal" className="text-[12px] text-[var(--ink-2)]">
        ← Morning Journal
      </Link>

      {/* Phase + day label */}
      <div className="mt-3 flex items-center gap-2">
        <span className="label-caps text-[var(--cranberry)]">Day {day}</span>
        <span className="text-[var(--ink-2)]">·</span>
        <span className="label-caps text-[var(--cranberry)]">{phase.label}</span>
        <span className="text-[var(--ink-2)]">·</span>
        <span className="label-caps text-[var(--ink-2)]">{dateLabel}</span>
      </div>

      <p className="mt-3 font-serif italic text-[15px] text-[var(--charcoal)]/65">
        A little space for what's on your mind.
      </p>

      {/* One short prompt. Writing about anything else is just as welcome. */}
      <GoldDivider />
      <p className="font-serif italic text-[26px] leading-relaxed text-[var(--charcoal)]">
        "{prompt}"
      </p>
      <GoldDivider />

      {/* Luxury textarea — no border, just text on ivory */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          rows={5}
          autoFocus
          placeholder="A thought, a feeling, an idea. Start anywhere."
          className="w-full resize-none bg-transparent outline-none font-serif text-[18px] leading-relaxed text-[var(--charcoal)] placeholder:text-[var(--ink-2)] min-h-[150px]"
        />
        {/* Word count */}
        {wordCount > 0 && (
          <p className="absolute bottom-2 right-0 font-serif text-[11px] text-[var(--cranberry)]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={saveEntry}
        disabled={!canSave}
        className="gold-pill-btn mt-3 w-full disabled:opacity-40"
        data-testid="save-entry"
      >
        Save entry
      </button>

      {/* Save status, confirmed against storage */}
      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-[16px] text-center text-[11.5px] italic"
      >
        {saveState === "saving" && <span className="text-[var(--ink-2)]">Saving…</span>}
        {saveState === "saved" && (
          <span className="text-[var(--ink-2)]">Saved on this device.</span>
        )}
        {saveState === "failed" && (
          <span className="text-[var(--berry)]">
            We couldn't save this entry on your device. Please try again.
          </span>
        )}
      </p>

      {/* Skipping is always a normal choice */}
      <Link
        to="/day/$n"
        params={{ n: String(day) }}
        className="mt-3 inline-flex min-h-[44px] items-center text-[13px] text-[var(--charcoal)]/70 underline decoration-[var(--taupe)]/50 underline-offset-4"
        data-testid="skip-note"
        // Save before navigating, not after the next screen has already rendered.
        onClick={flushPending}
      >
        {text.trim() ? `Done, back to Day ${day}` : `Skip today's entry, back to Day ${day}`}
      </Link>

      {/* The same optional feelings as the Day page's check-in, editable here */}
      <section
        aria-labelledby="daily-reflection-heading"
        className="mt-6 rounded-2xl border border-[var(--taupe)]/20 bg-white p-5 shadow-sm"
      >
        <p id="daily-reflection-heading" className="label-caps text-[var(--ink-2)]">
          Optional · How this morning felt · Day {day}
        </p>
        <p className="mt-1 mb-4 font-serif italic text-[13px] text-[var(--ink-2)]">
          Tap any that fit, or skip.
        </p>
        <FeelingChips day={day} savedNote={`Saved to Day ${day} and your Progress.`} />
      </section>

      {/* AI Ritual Companion */}
      {text.length >= 20 && !aiResponse && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px flex-1 bg-[var(--gold)]/20" />
            <p className="label-caps text-[var(--cranberry)]">Ritual Companion</p>
            <span className="h-px flex-1 bg-[var(--gold)]/20" />
          </div>
          <button
            onClick={reflectWithCompanion}
            disabled={aiLoading}
            className="gold-pill-btn w-full disabled:opacity-50"
          >
            {aiLoading ? "Reflecting…" : "Reflect with me →"}
          </button>
        </div>
      )}

      {/* AI response — blush card */}
      {aiResponse && (
        <div className="mt-6 fade-rise">
          <div className="mb-4 flex items-center gap-3">
            <div className="gold-divider flex-1" />
            <span className="label-caps text-[var(--cranberry)]">RITUAL APP</span>
            <div className="gold-divider flex-1" />
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}
          >
            <p className="font-serif italic text-[18px] leading-relaxed text-[var(--charcoal)]">
              "{aiResponse}"
            </p>
          </div>

          {/* View original entry */}
          {existing?.entry && existing.entry !== text && (
            <details className="mt-4 rounded-2xl bg-[var(--beige)] border border-[var(--taupe)]/15 p-4">
              <summary className="cursor-pointer font-serif text-[14px] italic text-[var(--ink-2)]">
                Read what you wrote
              </summary>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--charcoal)]/70">
                {text}
              </p>
            </details>
          )}

          <Link
            to="/journal"
            className="mt-4 block rounded-full border border-[var(--taupe)]/30 py-3 text-center font-serif text-[15px] text-[var(--charcoal)]"
          >
            Return to journal
          </Link>
        </div>
      )}
    </Frame>
  );
}

/** Reads noure_app_v1 back to confirm a note was saved (text) or removed (null). */
function isNotePersisted(day: number, text: string | null): boolean {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    const entry = raw ? JSON.parse(raw)?.state?.journalEntries?.[day] : undefined;
    return text === null ? entry === undefined : entry?.entry === text;
  } catch {
    return false;
  }
}
