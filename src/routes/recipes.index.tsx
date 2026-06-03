import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";

export const Route = createFileRoute("/recipes/")({ component: Recipes });

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;
  const core = RECIPES.filter((r) => !r.bonus);

  return (
    <Frame>
      <TopBar name={s.name} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">The recipe library.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/60">
        ✦ {core.length} recipes · 5 bonus in the Bonuses tab
      </p>

      <Link to="/recipes/$id" params={{ id: "build" }} className="mt-5 block">
        <div className="overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-[var(--card)] p-5 shadow-sm">
          <p className="label-caps text-[var(--gold)]">✦ New ritual</p>
          <h3 className="mt-1 font-serif text-[22px] leading-tight text-[var(--plum)]">Build your own smoothie</h3>
          <p className="mt-1 text-[12.5px] italic text-[var(--plum)]/65">
            Choose a base, a fruit, a fat, a polyphenol — we'll write your benefits.
          </p>
          <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-[var(--gold)]">Begin →</p>
        </div>
      </Link>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {core.map((r) => {
          const saved = s.savedRecipes.includes(r.id);
          return (
            <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-sm" style={{ background: r.gradient }}>
                <div className="flex h-full flex-col justify-end p-3 text-[var(--ivory)]">
                  <span className="self-start rounded-full bg-[var(--ivory)]/25 px-2 py-0.5 text-[9px] tracking-wider uppercase">{r.benefitTag}</span>
                  <h3 className="mt-2 font-serif text-[16px] leading-tight">{r.name}</h3>
                  <p className="mt-1 text-[10px] tracking-wide opacity-80">{r.prep}</p>
                </div>
              </div>
              {saved && <p className="mt-1 text-[10px] text-[var(--gold)]">✦ saved</p>}
            </Link>
          );
        })}
      </div>
    </Frame>
  );
}
