import { createFileRoute, Link, Navigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { INGREDIENTS, RECIPES, REDS_URL } from "@/lib/content";
import { BuildYourOwn } from "@/components/BuildYourOwn";

export const Route = createFileRoute("/recipes/$id")({ component: RecipeView });

function RecipeView() {
  const { id } = useParams({ from: "/recipes/$id" });
  const hydrated = useHydrated();
  const s = useApp();
  if (hydrated && !s.name) return <Navigate to="/" />;

  if (id === "build") return <BuildShell />;

  const r = RECIPES.find((x) => x.id === id);
  if (!r) return <Navigate to="/recipes" />;
  const saved = s.savedRecipes.includes(r.id);
  const [active, setActive] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  // Match ingredient by finding which INGREDIENTS entry name appears in the clicked string
  const ing = active
    ? INGREDIENTS
        .filter((i) => active.toLowerCase().includes(i.name.toLowerCase()))
        .sort((a, b) => b.name.length - a.name.length)[0] ?? null
    : null;

  const share = async () => {
    const url = window.location.href;
    const title = r.name;
    const text = `${r.benefitTag} — ${r.benefit.slice(0, 120)}`;

    // Web Share API — works natively on mobile and supported desktop browsers
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return; // native sheet handled it
      } catch (e) {
        if ((e as Error).name === "AbortError") return; // user dismissed — no message needed
        // Other error: fall through to clipboard
      }
    }

    // Clipboard fallback
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setShareMsg("Recipe link copied.");
        setTimeout(() => setShareMsg(null), 3000);
        return;
      } catch {
        // clipboard write denied
      }
    }

    // Last resort
    setShareMsg("Copy this page URL to share.");
    setTimeout(() => setShareMsg(null), 4000);
  };

  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--plum)]/55">← Recipes</Link>

      {r.image ? (
        /* Photo hero — image fills the card, text overlaid at bottom */
        <div className="mt-3 overflow-hidden rounded-3xl shadow-lg" style={{ background: r.gradient }}>
          <div className="relative aspect-[16/10]">
            <img src={r.image} alt={r.imageAlt ?? r.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 text-[var(--ivory)]">
              <p className="label-caps text-[var(--ivory)]/70">Recipe</p>
              <h1 className="mt-1 font-serif text-[28px] leading-tight drop-shadow-sm">{r.name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 px-5 py-3" style={{ background: r.gradient }}>
            <Pill>{r.prep}</Pill><Pill>Serves {r.servings}</Pill><Pill>{r.benefitTag}</Pill>
            {r.bonus && <Pill>Bonus recipe</Pill>}
          </div>
        </div>
      ) : (
        /* Gradient-only hero for recipes without a photo */
        <div className="mt-3 overflow-hidden rounded-3xl p-7 text-[var(--ivory)] shadow-lg" style={{ background: r.gradient }}>
          <p className="label-caps text-[var(--ivory)]/75">Recipe</p>
          <h1 className="mt-2 font-serif text-[30px] leading-tight">{r.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>{r.prep}</Pill><Pill>Serves {r.servings}</Pill><Pill>{r.benefitTag}</Pill>
            {r.bonus && <Pill>Bonus recipe</Pill>}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-[var(--sand)] mt-5 p-5">
        <p className="label-caps text-[var(--gold)]">Glow benefit</p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--plum)]/85">{r.benefit}</p>
      </div>

      {/* Ingredients */}
      <section className="mt-6">
        <h3 className="font-serif text-[22px] text-[var(--plum)]">Ingredients</h3>
        <p className="text-[12px] italic text-[var(--plum)]/50 mt-0.5">Tap any ingredient to learn what it does.</p>
        <div className="mt-3 space-y-2">
          {r.ingredients.map((name) => (
            <button key={name} onClick={() => setActive(name)}
              className="flex w-full items-center gap-3 rounded-xl border border-[var(--plum)]/10 bg-[var(--card)] px-4 py-2.5 text-left text-[13.5px] text-[var(--plum)] transition hover:border-[var(--gold)]/50 hover:bg-[var(--sand)] shadow-sm">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" />
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="mt-6">
        <h3 className="font-serif text-[22px] text-[var(--plum)]">Method</h3>
        <ol className="mt-3 space-y-2.5">
          {r.method.map((m, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-[var(--card)] border border-[var(--plum)]/8 p-3.5 shadow-sm">
              <span className="font-serif text-[20px] leading-none text-[var(--gold)] flex-shrink-0">{i + 1}</span>
              <span className="text-[14px] leading-relaxed text-[var(--plum)]/85">{m}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Perfect Texture section — only for recipes that have texture data */}
      {r.texture && (
        <section className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--plum)]/10 bg-[var(--card)] shadow-sm">
            <div className="px-5 pt-5 pb-2">
              <p className="label-caps text-[var(--gold)]">Perfect Texture</p>
              <p className="mt-0.5 font-serif italic text-[13px] text-[var(--plum)]/55">Tips for the best possible result.</p>
            </div>
            <div className="px-5 pb-5 space-y-3 mt-2">
              <TextureRow label="Frozen vs fresh" value={r.texture.frozen} />
              <TextureRow label="Liquid range" value={r.texture.liquid} />
              <TextureRow label="Make it thicker" value={r.texture.thicker} />
              <TextureRow label="Make it thinner" value={r.texture.thinner} />
              <TextureRow label="Blender tip" value={r.texture.blenderTip} />
              {r.texture.subs && <TextureRow label="Substitutions" value={r.texture.subs} />}
            </div>
          </div>
        </section>
      )}

      {/* Radiant Reds Boost */}
      <div className="relative mt-6 overflow-hidden rounded-3xl border border-[var(--gold)]/30 bg-[var(--card)] shadow-md">
        {/* Gold top accent line */}
        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)" }} />
        {/* Subtle berry radial glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(ellipse 80% 45% at 50% 0%, color-mix(in srgb, var(--color-berry) 9%, transparent), transparent 70%)" }} />

        <div className="relative px-5 pt-5">
          {/* Flanked label */}
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-[var(--gold)]/30" />
            <p className="label-caps text-[var(--gold)]">Radiant Reds</p>
            <span className="h-px flex-1 bg-[var(--gold)]/30" />
          </div>
          <h3 className="mt-3 font-serif text-[22px] leading-snug text-[var(--plum)]">
            Made to go deeper with Reds.
          </h3>
          <p className="mt-1.5 font-serif italic text-[13.5px] leading-relaxed text-[var(--plum)]/65">
            {r.redsBoost.why}
          </p>
        </div>

        <div className="relative mt-4 space-y-2 px-5 pb-5">
          {r.redsBoost.proof.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-[var(--plum)]/8 bg-[var(--ivory)] px-4 py-3 shadow-sm">
              <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" />
              <span className="text-[12.5px] leading-relaxed text-[var(--plum)]/80">{p}</span>
            </div>
          ))}
        </div>

        <a
          href={REDS_URL}
          target="_blank"
          rel="noreferrer"
          className="relative block px-5 py-4 text-center"
          style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-gold) 8%, var(--color-sand)), var(--color-sand))", borderTop: "1px solid color-mix(in srgb, var(--color-gold) 25%, transparent)" }}
        >
          <p className="font-serif text-[15px] tracking-[0.18em] uppercase text-[var(--gold)]">
            Add Radiant Reds →
          </p>
          <p className="mt-0.5 font-serif italic text-[11.5px] text-[var(--plum)]/50">
            the polyphenol blend behind every morning
          </p>
        </a>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => s.toggleSavedRecipe(r.id)}
          className={`flex-1 rounded-full border px-4 py-3 font-serif text-[15px] transition ${
            saved ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]" : "border-[var(--plum)]/15 text-[var(--plum)]"
          }`}>
          {saved ? "Saved" : "Save recipe"}
        </button>
        <button onClick={share} className="rounded-full border border-[var(--plum)]/15 px-4 py-3 font-serif text-[15px] text-[var(--plum)]">
          Share
        </button>
      </div>
      {shareMsg && (
        <p className="mt-2 text-center font-serif italic text-[12px] text-[var(--plum)]/55 fade-rise">{shareMsg}</p>
      )}

      <GoldDivider />

      {/* Ingredient drawer */}
      {ing && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/25 slide-up" onClick={() => setActive(null)}>
          <div className="mx-auto w-full max-w-[440px] rounded-t-3xl bg-[var(--ivory)] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[var(--plum)]/12" />
            <p className="label-caps text-[var(--gold)]">Ingredient</p>
            <h2 className="mt-1 font-serif text-[26px] text-[var(--plum)]">{ing.name}</h2>
            <p className="font-serif italic text-[14px] text-[var(--plum)]/55">{ing.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--plum)]/80">{ing.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[var(--sand)] p-3">
                <p className="label-caps text-[var(--gold)]">Gut</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/80">{ing.gut}</p>
              </div>
              <div className="rounded-2xl bg-[var(--sand)] p-3">
                <p className="label-caps text-[var(--gold)]">Skin</p>
                <p className="mt-1 text-[12.5px] text-[var(--plum)]/80">{ing.skin}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[var(--plum)]/50">Also in: {ing.alsoIn.join(", ")}</p>
            <button onClick={() => setActive(null)} className="gold-pill-btn mt-5 w-full">Back to recipe</button>
          </div>
        </div>
      )}
    </Frame>
  );
}

function TextureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10.5px] tracking-[0.14em] uppercase text-[var(--gold)]">{label}</p>
      <p className="text-[13.5px] leading-relaxed text-[var(--plum)]/80">{value}</p>
    </div>
  );
}

function BuildShell() {
  const s = useApp();
  return (
    <Frame>
      <TopBar name={s.name} />
      <Link to="/recipes" className="text-[12px] text-[var(--plum)]/55">← Recipes</Link>
      <p className="mt-3 label-caps text-[var(--gold)]">Build your own</p>
      <h1 className="mt-0.5 font-serif text-[30px] leading-tight text-[var(--plum)]">Compose your morning glass.</h1>
      <p className="mt-1 font-serif italic text-[14px] text-[var(--plum)]/55">
        Choose your layers — we'll write the benefits.
      </p>
      <BuildYourOwn />
    </Frame>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-[var(--ivory)]/22 px-3 py-1 text-[11px] tracking-wide">{children}</span>;
}
