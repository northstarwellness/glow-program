import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { DAYS, GROCERY_LIST, REDS_URL, RECIPES } from "@/lib/content";

export const Route = createFileRoute("/grocery")({ component: Grocery });

// Map recipe ingredient names → grocery item IDs for week generation
const ING_TO_GROCERY: Record<string, string> = {
  "Pomegranate": "pomegranate",
  "Raspberry": "raspberries",
  "Oat milk": "oat-milk",
  "Radiant Reds": "reds",
  "Lime": "lime",
  "Blueberry": "blueberries",
  "Strawberry": "strawberries",
  "Banana": "banana",
  "Almond milk": "almond-milk",
  "Chia": "chia",
  "Tart cherry": "tart-cherry",
  "Cacao": "cacao",
  "Almond butter": "almond-butter",
  "Cinnamon": "cinnamon",
  "Plum": "plum",
  "Rose water": "rose-water",
  "Coconut yogurt": "coconut-yogurt",
  "Honey": "honey",
  "Watermelon": "watermelon",
  "Hibiscus tea": "hibiscus-tea",
  "Black fig": "black-fig",
  "Almond": "almonds",
  "Beet": "beet",
  "Ginger": "ginger",
  "Orange": "orange",
  "Mint": "mint",
  "Lemon": "lemon",
  "Green tea": "green-tea",
};

function getWeekGroceryIds(week: 1 | 2 | 3): string[] {
  const phase = week === 1 ? [0, 7] : week === 2 ? [7, 14] : [14, 21];
  const daySlice = DAYS.slice(phase[0], phase[1]);
  const ids = new Set<string>(["reds"]); // always include Radiant Reds
  for (const d of daySlice) {
    const recipe = RECIPES.find((r) => r.id === d.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const groceryId = ING_TO_GROCERY[ing];
      if (groceryId) ids.add(groceryId);
    }
  }
  return Array.from(ids);
}

function Grocery() {
  const hydrated = useHydrated();
  const s = useApp();
  const [customInput, setCustomInput] = useState("");
  const [customItems, setCustomItems] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("noure_grocery_custom") ?? "[]"); }
    catch { return []; }
  });
  const [copyLabel, setCopyLabel] = useState("Copy list");

  if (hydrated && !s.name) return <Navigate to="/" />;

  const checked = s.groceryChecked;
  const totalItems = GROCERY_LIST.reduce((sum, cat) => sum + cat.items.length, 0) + customItems.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const generateWeek = (week: 1 | 2 | 3) => {
    const ids = getWeekGroceryIds(week);
    for (const id of ids) {
      if (!checked[id]) s.toggleGrocery(id);
    }
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val || customItems.includes(val)) return;
    const next = [...customItems, val];
    setCustomItems(next);
    localStorage.setItem("noure_grocery_custom", JSON.stringify(next));
    setCustomInput("");
  };

  const removeCustom = (item: string) => {
    const next = customItems.filter((i) => i !== item);
    setCustomItems(next);
    localStorage.setItem("noure_grocery_custom", JSON.stringify(next));
  };

  const copyList = () => {
    const lines: string[] = [];
    for (const cat of GROCERY_LIST) {
      const catItems = cat.items.filter((i) => !checked[i.id]);
      if (catItems.length === 0) continue;
      lines.push(`\n${cat.name.toUpperCase()}`);
      for (const item of catItems) lines.push(`☐ ${item.name}`);
    }
    if (customItems.length > 0) {
      lines.push("\nCUSTOM");
      for (const item of customItems) lines.push(`☐ ${item}`);
    }
    navigator.clipboard?.writeText(lines.join("\n").trim());
    setCopyLabel("Copied!");
    setTimeout(() => setCopyLabel("Copy list"), 2000);
  };

  return (
    <Frame>
      <TopBar name={s.name} />

      {/* Radiant Reds reminder — top */}
      <a href={REDS_URL} target="_top"
         className="block rounded-2xl px-5 py-4 mb-5"
         style={{ background: "linear-gradient(135deg, oklch(0.968 0.028 68) 0%, oklch(0.985 0.016 65) 100%)", border: "1px solid oklch(0.720 0.082 65 / 0.22)" }}>
        <p className="label-caps text-[var(--gold)]">Don't forget</p>
        <p className="mt-1 font-serif text-[15px] text-[var(--charcoal)]">
          Radiant Reds — the base of every ritual.
        </p>
        <p className="mt-0.5 font-serif italic text-[12px] text-[var(--charcoal)]/50">
          One bag covers the full 21 days. Shop now →
        </p>
      </a>

      <div className="flex items-end justify-between">
        <div>
          <p className="label-caps text-[var(--charcoal)]/40">Shopping list</p>
          <h1 className="mt-1 font-serif text-[34px] leading-tight text-[var(--charcoal)]">
            Your groceries.
          </h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-[26px] text-[var(--gold)]">{checkedCount}</p>
          <p className="text-[11px] tracking-[0.16em] uppercase text-[var(--charcoal)]/45">of {totalItems}</p>
        </div>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--taupe)]/25">
        <div
          className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
          style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
        />
      </div>

      {/* Week generation buttons */}
      <div className="mt-5">
        <p className="label-caps text-[var(--charcoal)]/40 mb-3">Generate by week</p>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map((week) => {
            const labels = ["Foundation", "Build", "Glow"];
            return (
              <button
                key={week}
                onClick={() => generateWeek(week)}
                className="rounded-xl border border-[var(--taupe)]/25 bg-white p-3 text-center transition-all cursor-pointer hover:border-[var(--gold)]/40 hover:bg-[var(--gold)]/5"
              >
                <p className="label-caps text-[var(--gold)]">Week {week}</p>
                <p className="font-serif text-[13px] text-[var(--charcoal)] mt-0.5">{labels[week - 1]}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions row */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={copyList}
          className="flex-1 rounded-full border border-[var(--taupe)]/30 py-2.5 font-serif text-[13px] text-[var(--charcoal)] transition-all cursor-pointer hover:border-[var(--gold)]/40"
        >
          {copyLabel}
        </button>
        {checkedCount > 0 && (
          <button
            onClick={s.clearGrocery}
            className="flex-1 rounded-full border border-[var(--taupe)]/20 py-2.5 font-serif text-[13px] text-[var(--charcoal)]/45 cursor-pointer"
          >
            Clear checks
          </button>
        )}
      </div>

      {/* Custom item input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Add a custom item…"
            className="flex-1 rounded-full border border-[var(--taupe)]/30 bg-white px-4 py-2.5 font-serif text-[14px] text-[var(--charcoal)] placeholder:text-[var(--charcoal)]/30 focus:border-[var(--gold)] focus:outline-none"
          />
          <button
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="rounded-full bg-[var(--charcoal)] px-5 py-2.5 font-serif text-[13px] text-[var(--ivory)] disabled:opacity-30 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Custom items */}
      {customItems.length > 0 && (
        <div className="mt-4">
          <p className="label-caps text-[var(--charcoal)]/40 mb-2">Custom items</p>
          <div className="space-y-1.5">
            {customItems.map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-white border border-[var(--taupe)]/20 px-4 py-3">
                <span className="font-serif text-[15px] text-[var(--charcoal)]">{item}</span>
                <button onClick={() => removeCustom(item)} className="text-[var(--taupe)] hover:text-[var(--berry)] cursor-pointer text-[12px]">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grocery categories */}
      <div className="mt-6 space-y-6">
        {GROCERY_LIST.map((cat) => {
          const unchecked = cat.items.filter((i) => !checked[i.id]);
          const catChecked = cat.items.length - unchecked.length;
          return (
            <section key={cat.name}>
              <div className="mb-3 flex items-center justify-between">
                <p className="label-caps text-[var(--charcoal)]/50">{cat.name}</p>
                {catChecked > 0 && (
                  <span className="text-[11px] text-[var(--gold)]">
                    {catChecked}/{cat.items.length}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {/* Unchecked items first */}
                {unchecked.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => s.toggleGrocery(item.id)}
                    className="flex w-full items-start gap-4 rounded-2xl bg-white border border-[var(--taupe)]/15 shadow-sm p-4 text-left transition-all cursor-pointer hover:shadow"
                  >
                    <span className="mt-[2px] flex-shrink-0"><EmptyCircle /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[17px] leading-snug text-[var(--charcoal)]">{item.name}</p>
                      {item.note && (
                        <p className="mt-0.5 text-[12px] italic text-[var(--charcoal)]/45">{item.note}</p>
                      )}
                    </div>
                  </button>
                ))}
                {/* Checked items */}
                {cat.items.filter((i) => !!checked[i.id]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => s.toggleGrocery(item.id)}
                    className="flex w-full items-start gap-4 rounded-2xl bg-[var(--gold)]/6 opacity-50 p-4 text-left transition-all cursor-pointer"
                  >
                    <span className="mt-[2px] flex-shrink-0"><CheckCircle /></span>
                    <p className="font-serif text-[17px] leading-snug text-[var(--charcoal)] line-through">
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <GoldDivider />
    </Frame>
  );
}

function CheckCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--gold)]">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 12l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyCircle() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--taupe)]/50">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
