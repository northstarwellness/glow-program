import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/grocery")({ component: Grocery });

type GroceryItem = { id: string; name: string; note?: string };
type GrocerySection = { label: string; items: GroceryItem[] };

const SECTIONS: GrocerySection[] = [
  {
    label: "Fresh Produce",
    items: [
      { id: "pomegranate", name: "Pomegranate seeds (or 1 whole pomegranate)", note: "Days 1, 8, 15" },
      { id: "berries", name: "Mixed berries — blueberry, strawberry, raspberry", note: "Days 2, 9, 16" },
      { id: "tart-cherry", name: "Tart cherries — fresh or frozen", note: "Days 3, 10, 17" },
      { id: "plums", name: "Ripe plums (2–3)", note: "Days 4, 11, 18" },
      { id: "watermelon", name: "Watermelon (small)", note: "Days 5, 12, 19" },
      { id: "figs", name: "Black figs (4–5)", note: "Days 6, 13, 20" },
      { id: "beet", name: "Beet (1 small, roastable)", note: "Days 7, 14, 21" },
      { id: "ginger", name: "Ginger root (thumb-sized)", note: "Beet Glow" },
      { id: "limes", name: "Limes (4–6)", note: "Several recipes" },
      { id: "lemon", name: "Lemon (1–2)", note: "Day 1 warm water" },
      { id: "banana", name: "Banana (ripe)", note: "Berry Bloom, optional" },
      { id: "mint", name: "Fresh mint", note: "Garnish" },
    ],
  },
  {
    label: "Pantry",
    items: [
      { id: "oat-milk", name: "Oat milk (carton)", note: "Most recipes" },
      { id: "almond-milk", name: "Almond milk (carton)", note: "Cherry Cacao, Berry Bloom" },
      { id: "chia", name: "Chia seeds", note: "Berry Bloom" },
      { id: "almond-butter", name: "Almond butter", note: "Cherry Cacao, Fig & Almond" },
      { id: "raw-almonds", name: "Raw almonds", note: "Fig & Almond" },
      { id: "cacao", name: "Raw cacao powder", note: "Cherry Cacao" },
      { id: "cinnamon", name: "Cinnamon", note: "Several recipes" },
      { id: "honey", name: "Raw honey", note: "Several recipes" },
      { id: "hibiscus", name: "Hibiscus tea bags", note: "Watermelon Reds" },
      { id: "rose-water", name: "Rose water", note: "Plum & Rose" },
    ],
  },
  {
    label: "Refrigerator",
    items: [
      { id: "coconut-yogurt", name: "Coconut yogurt", note: "Plum & Rose; probiotic pair" },
      { id: "frozen-berries", name: "Frozen berries (backup)", note: "Any week" },
    ],
  },
  {
    label: "Morning Ritual",
    items: [
      { id: "reds", name: "Radiant Reds — NOURE superfood blend", note: "Every morning" },
    ],
  },
];

function Grocery() {
  const hydrated = useHydrated();
  const s = useApp();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [week, setWeek] = useState<1 | 2 | 3>(1);

  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  const done = checked.size;

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/home" className="text-[12px] text-[var(--plum)]/60">← Home</Link>

      <h1 className="mt-3 font-serif text-[32px] leading-tight text-[var(--plum)]">Grocery list.</h1>
      <p className="mt-1 font-serif italic text-[14px] text-[var(--plum)]/60">
        Everything you need for one week of the reset.
      </p>

      <div className="mt-4 flex gap-2">
        {([1, 2, 3] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWeek(w)}
            className={`flex-1 rounded-full py-2 text-[12px] tracking-wide transition ${
              week === w
                ? "bg-[var(--plum)] text-[var(--ivory)]"
                : "bg-[var(--sand)] text-[var(--plum)]"
            }`}
          >
            Week {w}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-2xl bg-[var(--sand)] px-4 py-3">
        <p className="text-[12px] text-[var(--plum)]/65">
          The same 7 recipes cycle each week — your shopping list is identical for all three weeks.
        </p>
      </div>

      {done > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--gold)]/12 px-4 py-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--gold)]/25">
            <div
              className="h-full rounded-full bg-[var(--gold)] transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <p className="flex-shrink-0 text-[12px] font-serif text-[var(--gold)]">
            {done}/{total} checked
          </p>
        </div>
      )}

      {SECTIONS.map((section) => (
        <section key={section.label} className="mt-6">
          <p className="label-caps text-[var(--plum)]/55">{section.label}</p>
          <div className="mt-2 space-y-2">
            {section.items.map((item) => {
              const done = checked.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition ${
                    done ? "bg-[var(--gold)]/12" : "bg-[var(--card)]"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                      done
                        ? "border-[var(--gold)] bg-[var(--gold)]"
                        : "border-[var(--plum)]/25"
                    }`}
                  >
                    {done && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[15px] font-serif leading-snug ${done ? "text-[var(--plum)]/40 line-through" : "text-[var(--plum)]"}`}>
                      {item.name}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 text-[11px] text-[var(--plum)]/45">{item.note}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <GoldDivider />

      {done > 0 && (
        <button
          onClick={() => setChecked(new Set())}
          className="w-full rounded-full border border-[var(--plum)]/15 py-3 text-center font-serif text-[13px] text-[var(--plum)]/55"
        >
          Clear all checks
        </button>
      )}

      <div className="mt-4 rounded-2xl bg-[var(--sand)] p-4 text-center">
        <p className="font-serif text-[14px] text-[var(--plum)]/70">
          Don't forget: <span className="text-[var(--gold)]">Radiant Reds</span> is the centerpiece of every morning.
        </p>
        <a
          href="https://nourewellness.com/products/reds-superfood"
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-[12px] tracking-[0.18em] uppercase text-[var(--gold)]"
        >
          Shop Radiant Reds →
        </a>
      </div>
    </Frame>
  );
}
