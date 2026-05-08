import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Frame, TopBar } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { RECIPES } from "@/lib/content";

export const Route = createFileRoute("/recipes/")({ component: Recipes });

function Recipes() {
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  return (
    <Frame>
      <TopBar name={s.name} />
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">The recipe library.</h1>
      <p className="mt-1 font-serif italic text-[15px] text-[var(--plum)]/60">Polyphenol-rich. Morning-built. Yours.</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {RECIPES.map((r) => {
          const saved = s.savedRecipes.includes(r.id);
          return (
            <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-sm" style={{ background: r.gradient }}>
                <div className="flex h-full flex-col justify-end p-3 text-[var(--ivory)]">
                  <span className="self-start rounded-full bg-[var(--ivory)]/20 px-2 py-0.5 text-[9px] tracking-wider uppercase">{r.benefitTag}</span>
                  <h3 className="mt-2 font-serif text-[17px] leading-tight">{r.name}</h3>
                  <p className="mt-1 text-[10px] tracking-wide opacity-80">{r.prep}</p>
                </div>
              </div>
              {saved && <p className="mt-1 text-[10px] text-[var(--gold)]">♥ saved</p>}
            </Link>
          );
        })}
      </div>
    </Frame>
  );
}
