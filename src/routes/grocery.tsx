import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GROCERY_ITEMS, GROCERY_CATEGORY_LABELS, programFor } from "@/lib/content";
import type { GroceryCategory } from "@/lib/content";

export const Route = createFileRoute("/grocery")({ component: GroceryPage });

const CATEGORY_ORDER: GroceryCategory[] = [
  "fruits",
  "greens",
  "liquids",
  "seeds-fats",
  "boosters",
  "pantry",
];

const CATEGORY_COLORS: Record<GroceryCategory, string> = {
  fruits:       "bg-[oklch(0.92_0.06_15)] text-[oklch(0.45_0.10_15)]",
  greens:       "bg-[oklch(0.90_0.06_145)] text-[oklch(0.38_0.10_145)]",
  liquids:      "bg-[oklch(0.90_0.04_220)] text-[oklch(0.40_0.07_220)]",
  "seeds-fats": "bg-[oklch(0.92_0.05_65)] text-[oklch(0.48_0.08_60)]",
  boosters:     "bg-[var(--gold)]/15 text-[var(--gold)]",
  pantry:       "bg-[var(--sand)] text-[var(--plum)]/65",
};

function GroceryPage() {
  const hydrated = useHydrated();
  const s = useApp();
  const [view, setView] = useState<"week" | "full">("week");
  const [collapsed, setCollapsed] = useState<Set<GroceryCategory>>(new Set());
  if (hydrated && !s.name) return <Navigate to="/" />;

  const program = programFor(s.activeProgram);
  const totalItems = GROCERY_ITEMS.length;
  const checkedCount = GROCERY_ITEMS.filter((i) => s.groceryChecked[i.id]).length;
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggleCategory = (cat: GroceryCategory) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <Frame>
      <TopBar name={s.name} />

      <div className="flex items-start justify-between">
        <div>
          <p className="label-caps text-[var(--plum)]/50">Smart Grocery List</p>
          <h1 className="mt-0.5 font-serif text-[28px] leading-tight text-[var(--plum)]">What to shop for.</h1>
        </div>
        <button
          onClick={s.clearGrocery}
          className="mt-1 rounded-full border border-[var(--plum)]/12 px-3 py-1.5 text-[11px] text-[var(--plum)]/50 tracking-wide"
        >
          Reset list
        </button>
      </div>

      {/* Program badge */}
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--sand)] px-3.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
        <span className="text-[11px] tracking-[0.12em] uppercase text-[var(--plum)]/65">{program.name}</span>
      </div>

      {/* Progress */}
      <div className="mt-4 rounded-2xl bg-[var(--card)] border border-[var(--plum)]/8 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-serif text-[17px] text-[var(--plum)]">
            {checkedCount === 0 ? "Nothing checked yet." : checkedCount === totalItems ? "All stocked up." : `${checkedCount} of ${totalItems} items checked.`}
          </p>
          <span className={`rounded-full px-2.5 py-1 text-[11px] tracking-wide ${
            pct === 100 ? "bg-[var(--gold)]/20 text-[var(--gold)]" : "bg-[var(--sand)] text-[var(--plum)]/55"
          }`}>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--plum)]/8">
          <div className="h-full rounded-full bg-[var(--gold)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Week / Full toggle */}
      <div className="mt-4 flex gap-2">
        <button onClick={() => setView("week")}
          className={`flex-1 rounded-full py-2 text-[12.5px] font-serif transition ${
            view === "week" ? "bg-[var(--plum)] text-[var(--ivory)]" : "bg-[var(--sand)] text-[var(--plum)]"
          }`}>
          This week
        </button>
        <button onClick={() => setView("full")}
          className={`flex-1 rounded-full py-2 text-[12.5px] font-serif transition ${
            view === "full" ? "bg-[var(--plum)] text-[var(--ivory)]" : "bg-[var(--sand)] text-[var(--plum)]"
          }`}>
          Full 21 days
        </button>
      </div>

      {view === "week" && (
        <p className="mt-2 text-[12px] italic text-[var(--plum)]/45">
          Quantities for one week (Days 1–7). The same 7 recipes repeat each week.
        </p>
      )}
      {view === "full" && (
        <p className="mt-2 text-[12px] italic text-[var(--plum)]/45">
          Quantities for the full 21-day program — all three weeks.
        </p>
      )}

      {/* Categories */}
      <div className="mt-5 space-y-3">
        {CATEGORY_ORDER.map((cat) => {
          const items = GROCERY_ITEMS.filter((i) => i.category === cat);
          const catChecked = items.filter((i) => s.groceryChecked[i.id]).length;
          const isCollapsed = collapsed.has(cat);

          return (
            <div key={cat} className="overflow-hidden rounded-2xl border border-[var(--plum)]/8 bg-[var(--card)] shadow-sm">
              <button
                onClick={() => toggleCategory(cat)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] tracking-wide ${CATEGORY_COLORS[cat]}`}>
                    {GROCERY_CATEGORY_LABELS[cat]}
                  </span>
                  {catChecked > 0 && (
                    <span className="text-[11px] text-[var(--plum)]/40">{catChecked}/{items.length}</span>
                  )}
                </div>
                <span className="text-[var(--plum)]/35 text-[13px]">{isCollapsed ? "+" : "–"}</span>
              </button>

              {!isCollapsed && (
                <div className="border-t border-[var(--plum)]/6 px-2 pb-2">
                  {items.map((item) => {
                    const checked = !!s.groceryChecked[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => s.toggleGroceryItem(item.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          checked ? "opacity-50" : "hover:bg-[var(--sand)]"
                        }`}
                      >
                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                          checked
                            ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ivory)]"
                            : "border-[var(--plum)]/20"
                        }`}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M4 13l4 4L20 6" />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13.5px] leading-tight ${checked ? "line-through text-[var(--plum)]/40" : "text-[var(--plum)]"}`}>
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[var(--plum)]/45 mt-0.5">
                            {view === "week" ? item.weeklyQty : item.fullQty}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <GoldDivider />
      <div className="flex items-center justify-between text-[12px] text-[var(--plum)]/45">
        <Link to="/home" className="font-serif italic">← Home</Link>
        <Link to="/recipes" className="font-serif italic">Browse recipes →</Link>
      </div>
    </Frame>
  );
}
