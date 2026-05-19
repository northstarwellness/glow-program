import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { GROCERY_LIST } from "@/lib/content";

export const Route = createFileRoute("/grocery")({ component: Grocery });

function Grocery() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  const checked = s.groceryChecked;
  const totalItems = GROCERY_LIST.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allDone = checkedCount >= totalItems;

  return (
    <Frame>
      <TopBar name={s.name} />

      <div className="flex items-end justify-between">
        <div>
          <p className="label-caps text-[var(--plum)]/55">Shopping list</p>
          <h1 className="mt-1 font-serif text-[34px] leading-tight text-[var(--plum)]">
            {allDone ? "You're ready." : "Your groceries."}
          </h1>
        </div>
        <div className="text-right">
          <p className="font-serif text-[26px] text-[var(--gold)]">{checkedCount}</p>
          <p className="text-[11px] tracking-[0.16em] uppercase text-[var(--plum)]/50">of {totalItems}</p>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--plum)]/8">
        <div
          className="h-full rounded-full bg-[var(--gold)] transition-all duration-500"
          style={{ width: `${(checkedCount / totalItems) * 100}%` }}
        />
      </div>

      {allDone && (
        <div className="mt-4 fade-rise rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/8 px-5 py-4">
          <p className="font-serif italic text-[16px] text-[var(--plum)]">
            Pantry ready. Your 21-day ritual can begin any morning.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {GROCERY_LIST.map((cat) => {
          const catChecked = cat.items.filter((i) => checked[i.id]).length;
          return (
            <section key={cat.name}>
              <div className="mb-3 flex items-center justify-between">
                <p className="label-caps text-[var(--plum)]/60">{cat.name}</p>
                {catChecked > 0 && (
                  <span className="text-[11px] text-[var(--gold)]">
                    {catChecked}/{cat.items.length}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {cat.items.map((item) => {
                  const done = !!checked[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => s.toggleGrocery(item.id)}
                      className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all ${
                        done
                          ? "bg-[var(--gold)]/10 opacity-60"
                          : "bg-[var(--card)] shadow-sm"
                      }`}
                    >
                      <span className="mt-[2px] flex-shrink-0">
                        {done ? <CheckCircle /> : <EmptyCircle />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-serif text-[17px] leading-snug ${
                            done
                              ? "line-through text-[var(--plum)]/40"
                              : "text-[var(--plum)]"
                          }`}
                        >
                          {item.name}
                        </p>
                        {item.note && !done && (
                          <p className="mt-0.5 text-[12px] italic text-[var(--plum)]/50">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <GoldDivider />

      <div className="space-y-3 pb-4">
        <div className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-5">
          <p className="label-caps text-[var(--gold)]">The only non-negotiable</p>
          <p className="mt-2 font-serif text-[17px] leading-snug text-[var(--plum)]">
            Radiant Reds
          </p>
          <p className="mt-1 font-serif italic text-[13px] text-[var(--plum)]/60">
            One bag for the full 21 days. Everything else on this list rotates.
          </p>
          <a
            href="https://nourewellness.com/products/reds-superfood"
            target="_blank"
            rel="noreferrer"
            className="gold-pill-btn mt-4 block text-center text-[14px]"
          >
            Shop Radiant Reds
          </a>
        </div>

        {checkedCount > 0 && (
          <button
            onClick={s.clearGrocery}
            className="w-full rounded-full border border-[var(--plum)]/15 py-3 font-serif text-[14px] text-[var(--plum)]/50"
          >
            Clear all checks
          </button>
        )}
      </div>
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[var(--plum)]/25">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
