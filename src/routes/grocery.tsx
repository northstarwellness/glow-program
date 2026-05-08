import { createFileRoute } from "@tanstack/react-router";
import { Shell, GoldDivider } from "@/components/Shell";
import { CTALink } from "@/components/CTA";
import { useGlow } from "@/lib/glow-store";
import { GROCERY, REDS_URL } from "@/lib/glow-data";

export const Route = createFileRoute("/grocery")({
  head: () => ({ meta: [{ title: "Grocery — NOURÉ Inner Glow" }] }),
  component: Grocery,
});

function Grocery() {
  const grocery = useGlow((s) => s.grocery);
  const toggle = useGlow((s) => s.toggleGrocery);

  return (
    <Shell>
      <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Your week</p>
      <h1 className="mt-2 font-serif text-4xl text-primary">Grocery & ritual list.</h1>
      <p className="mt-3 font-serif italic text-muted-foreground">
        Everything you'll want on hand for your smoothies and morning ritual.
      </p>

      <GoldDivider />

      <div className="space-y-6">
        {GROCERY.map((g) => (
          <div key={g.group}>
            <p className="text-[11px] uppercase tracking-[0.28em] text-accent">{g.group}</p>
            <ul className="mt-2 divide-y divide-border rounded-2xl border border-border bg-card">
              {g.items.map((item) => {
                const checked = grocery[item];
                return (
                  <li key={item}>
                    <button
                      onClick={() => toggle(item)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          checked ? "border-accent bg-accent text-gold-foreground" : "border-border"
                        }`}
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <span className={`font-serif text-base ${checked ? "text-muted-foreground line-through" : ""}`}>
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <CTALink href={REDS_URL} variant="gold">Get Radiant Reds</CTALink>
      </div>
    </Shell>
  );
}
