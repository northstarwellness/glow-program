import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp, currentDay } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { JOURNAL_PROMPTS, phaseFor, reflectJournal } from "@/lib/content";

export const Route = createFileRoute("/journal/$n")({ component: JournalDay });

// Anthropic direct-browser access — requires VITE_ANTHROPIC_KEY to be set
const ANTHROPIC_KEY = typeof import.meta !== "undefined"
  ? (import.meta as { env?: Record<string, string> }).env?.VITE_ANTHROPIC_KEY ?? ""
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
        system: `You are the NOURÉ ritual companion — a warm, calm, deeply knowledgeable guide inside a 21-day polyphenol wellness ritual. The user is ${name}, on Day ${day} of their 21-day Inner Glow Reset. You know the gut-skin axis, you understand polyphenols, you speak with elegance and warmth. Never clinical. Never hype. 2-3 sentences maximum. Respond only to what they've written. End with one gentle question or observation that deepens their reflection. No emojis. No generic wellness phrases.`,
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

  // Compute everything needed for hooks before any conditional returns
  const day = Math.max(1, Math.min(21, parseInt(n, 10) || 1));
  const today = currentDay(s.startDate);
  const existing = s.journalEntries[day];
  const prompt = JOURNAL_PROMPTS[day]?.(s.name ?? "") ?? "";
  const phase = phaseFor(day);

  // All hooks before conditional returns
  const [text, setText] = useState(existing?.entry ?? "");
  const [aiResponse, setAiResponse] = useState<string | null>(existing?.response ?? null);
  const [aiLoading, setAiLoading] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggedOnce = useRef(!!existing);

  if (hydrated && !s.name) return <Navigate to="/" />;
  if (day > today) return <Navigate to="/journal" />;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    // Debounced autosave: 800ms after last keystroke
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (val.trim()) {
      saveTimer.current = setTimeout(() => {
        const r = existing?.response ?? aiResponse ?? "";
        s.saveJournal(day, { prompt, entry: val, response: r, timestamp: new Date().toISOString() });
        if (!loggedOnce.current) {
          s.toggleLog(day, "journal");
          if (Object.keys(s.journalEntries).length === 0) s.earnBadge("first-words");
          loggedOnce.current = true;
        }
      }, 800);
    }
  };

  const reflectWithCompanion = async () => {
    if (text.length < 20 || aiLoading) return;
    setAiLoading(true);
    // Instant local response first
    const localResponse = reflectJournal(text, s.name ?? "");
    setAiResponse(localResponse);
    // Save immediately
    s.saveJournal(day, { prompt, entry: text, response: localResponse, timestamp: new Date().toISOString() });
    if (!loggedOnce.current) {
      s.toggleLog(day, "journal");
      loggedOnce.current = true;
    }
    // Then try AI
    const aiResult = await fetchAIReflection(text, s.name ?? "", day);
    if (aiResult) {
      setAiResponse(aiResult);
      s.saveJournal(day, { prompt, entry: text, response: aiResult, timestamp: new Date().toISOString() });
    }
    setAiLoading(false);
  };

  const dateLabel = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <Frame>
      <TopBar name={s.name} day={today} />
      <Link to="/journal" className="text-[12px] text-[var(--charcoal)]/50">← Journal</Link>

      {/* Phase + day label */}
      <div className="mt-3 flex items-center gap-2">
        <span className="label-caps text-[var(--gold)]">Day {day}</span>
        <span className="text-[var(--taupe)]/60">·</span>
        <span className="label-caps text-[var(--gold)]/60">{phase.label}</span>
        <span className="text-[var(--taupe)]/60">·</span>
        <span className="label-caps text-[var(--charcoal)]/35">{dateLabel}</span>
      </div>

      {/* Journal prompt — large italic serif */}
      <GoldDivider />
      <p className="font-serif italic text-[26px] leading-relaxed text-[var(--charcoal)]">
        "{prompt}"
      </p>
      <GoldDivider />

      {/* Reflection nudges — tappable secondary prompts */}
      <ReflectionNudges onSelect={(hint) => setText((prev) => prev ? prev + " " + hint : hint)} />

      {/* Luxury textarea — no border, just text on ivory */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleChange}
          rows={10}
          autoFocus
          placeholder="Write what's true today…"
          className="w-full resize-none bg-transparent outline-none font-serif text-[18px] leading-relaxed text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/20 min-h-[200px]"
        />
        {/* Word count */}
        {wordCount > 0 && (
          <p className="absolute bottom-2 right-0 font-serif text-[11px] text-[var(--gold)]/60">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </p>
        )}
      </div>

      {/* Autosave indicator */}
      {text.trim() && !aiResponse && (
        <p className="mt-1 text-[11px] italic text-[var(--charcoal)]/25">Autosaving…</p>
      )}

      {/* AI Ritual Companion */}
      {text.length >= 20 && !aiResponse && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px flex-1 bg-[var(--gold)]/20" />
            <p className="label-caps text-[var(--gold)]">Ritual Companion</p>
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
            <span className="label-caps text-[var(--gold)]">RITUAL APP</span>
            <div className="gold-divider flex-1" />
          </div>
          <div className="rounded-2xl p-6" style={{ background: "var(--blush)", border: "1px solid oklch(0.82 0.06 10 / 0.18)" }}>
            <p className="font-serif italic text-[18px] leading-relaxed text-[var(--charcoal)]">
              "{aiResponse}"
            </p>
          </div>

          {/* View original entry */}
          {existing?.entry && existing.entry !== text && (
            <details className="mt-4 rounded-2xl bg-[var(--beige)] border border-[var(--taupe)]/15 p-4">
              <summary className="cursor-pointer font-serif text-[14px] italic text-[var(--charcoal)]/55">
                Read what you wrote
              </summary>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--charcoal)]/70">{text}</p>
            </details>
          )}

          <Link to="/journal" className="mt-4 block rounded-full border border-[var(--taupe)]/30 py-3 text-center font-serif text-[15px] text-[var(--charcoal)]">
            Return to journal
          </Link>
        </div>
      )}
    </Frame>
  );
}

const REFLECTION_HINTS = [
  "What changed in my body today.",
  "My digestion felt",
  "I felt lighter when",
  "My energy today was",
  "What helped me stay consistent:",
  "Did I feel fuller, lighter, or more energized:",
];

function ReflectionNudges({ onSelect }: { onSelect: (hint: string) => void }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[11px] tracking-[0.14em] uppercase text-[var(--charcoal)]/30">
        Start with a nudge
      </p>
      <div className="flex flex-wrap gap-2">
        {REFLECTION_HINTS.map((h) => (
          <button
            key={h}
            onClick={() => onSelect(h)}
            className="rounded-full border border-[var(--taupe)]/30 bg-[var(--beige)] px-3 py-1.5 font-serif text-[12px] italic text-[var(--charcoal)]/55 transition-all cursor-pointer hover:border-[var(--gold)]/40 hover:text-[var(--charcoal)]"
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  );
}
