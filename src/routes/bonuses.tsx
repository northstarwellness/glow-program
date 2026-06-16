import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { ARTICLES, INGREDIENTS, POLYPHENOLS, RECIPES, SOUNDS, REDS_URL } from "@/lib/content";

export const Route = createFileRoute("/bonuses")({ component: Bonuses });

function Bonuses() {
  const hydrated = useHydrated();
  const s = useApp();
  if (!hydrated) return <div className="ivory-frame min-h-screen" />;
  if (!s.unlocked) return <Navigate to="/" />;
  const [tab, setTab] = useState<"recipes" | "poly" | "ing" | "sound" | "guide">("recipes");

  return (
    <Frame>
      <TopBar name={s.name} />
      <p className="label-caps text-[var(--gold)]">✦ Your bonuses</p>
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">Everything you also got.</h1>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {(["recipes", "poly", "ing", "sound", "guide"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-[12px] tracking-wide transition ${
              tab === t ? "bg-[var(--plum)] text-[var(--ivory)]" : "bg-[var(--sand)] text-[var(--plum)]"
            }`}>
            {t === "recipes" ? "Bonus Recipes" : t === "poly" ? "Polyphenols" : t === "ing" ? "Ingredients" : t === "sound" ? "Sounds" : "Glow Guide"}
          </button>
        ))}
      </div>

      {tab === "recipes" && <BonusRecipes />}
      {tab === "poly" && <PolyTab />}
      {tab === "ing" && <IngTab />}
      {tab === "sound" && <SoundTab />}
      {tab === "guide" && <GuideTab />}

      <GoldDivider />
      <a href={REDS_URL} target="_blank" rel="noreferrer" className="block sand-card p-5 text-center">
        <p className="font-serif italic text-[14px] text-[var(--plum)]/70">The blend behind every morning</p>
        <p className="mt-1 font-serif text-[22px] text-[var(--plum)]">✦ Radiant Reds Superfood →</p>
      </a>
    </Frame>
  );
}

function RecipeGrid({ list }: { list: typeof RECIPES }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {list.map((r) => (
        <Link key={r.id} to="/recipes/$id" params={{ id: r.id }} className="block">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-sm" style={{ background: r.gradient }}>
            <div className="flex h-full flex-col justify-end p-3 text-[var(--ivory)]">
              <span className="self-start rounded-full bg-[var(--ivory)]/25 px-2 py-0.5 text-[9px] tracking-wider uppercase">{r.benefitTag}</span>
              <h3 className="mt-2 font-serif text-[16px] leading-tight">{r.name}</h3>
              <p className="mt-1 text-[10px] tracking-wide opacity-80">{r.prep}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function BonusRecipes() {
  const all = RECIPES.filter((r) => r.bonus);
  const quick = all.filter((r) => r.benefitTag.startsWith("Quick"));
  const rituals = all.filter((r) => !r.benefitTag.startsWith("Quick"));
  return (
    <div className="mt-5">
      {quick.length > 0 && (
        <div>
          <p className="label-caps text-[var(--gold)]">Quick mornings</p>
          <p className="font-serif italic text-[13px] text-[var(--plum)]/60">Three minutes or under.</p>
          <RecipeGrid list={quick} />
        </div>
      )}
      {rituals.length > 0 && (
        <div className={quick.length > 0 ? "mt-7" : ""}>
          <p className="label-caps text-[var(--gold)]">Bonus rituals</p>
          <p className="font-serif italic text-[13px] text-[var(--plum)]/60">A little something extra.</p>
          <RecipeGrid list={rituals} />
        </div>
      )}
    </div>
  );
}

function PolyTab() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {POLYPHENOLS.map((p) => {
        const expanded = open === p.id;
        return (
          <div key={p.id} className={`sand-card overflow-hidden ${expanded ? "col-span-2" : ""}`}>
            <button onClick={() => setOpen(expanded ? null : p.id)} className="block w-full text-left">
              <div className="h-20" style={{ background: `linear-gradient(135deg, ${p.color}, oklch(0.42 0.10 354))` }} />
              <div className="p-3">
                <h4 className="font-serif text-[18px] text-[var(--plum)]">{p.name}</h4>
                <p className="text-[11px] text-[var(--plum)]/65">{p.topBenefit}</p>
                <p className="mt-1 text-[10px] text-[var(--gold)]">{expanded ? "Close ↑" : "Learn more ↓"}</p>
              </div>
            </button>
            {expanded && (
              <div className="border-t border-[var(--plum)]/10 p-4">
                <ul className="space-y-1.5 text-[13px] text-[var(--plum)]/85">
                  {p.points.map((pt, i) => <li key={i}>· {pt}</li>)}
                </ul>
                <p className="mt-3 text-[12px] italic text-[var(--plum)]/60">How to use: {p.howTo}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function IngTab() {
  const [q, setQ] = useState("");
  const list = INGREDIENTS.filter((i) => i.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mt-5">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search any ingredient…"
        className="w-full rounded-full border border-[var(--plum)]/15 bg-[var(--card)] px-5 py-3 text-[14px] focus:border-[var(--gold)] focus:outline-none" />
      <div className="mt-4 space-y-2">
        {list.map((i) => (
          <details key={i.name} className="rounded-2xl bg-[var(--card)] p-4 shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-serif text-[17px] text-[var(--plum)]">{i.name}</p>
                <p className="text-[11px] text-[var(--gold)]">{i.tagline}</p>
              </div>
              <span className="text-[var(--plum)]/40">+</span>
            </summary>
            <p className="mt-3 text-[13px] text-[var(--plum)]/85">{i.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <p><span className="text-[var(--gold)]">Gut:</span> <span className="text-[var(--plum)]/75">{i.gut}</span></p>
              <p><span className="text-[var(--gold)]">Skin:</span> <span className="text-[var(--plum)]/75">{i.skin}</span></p>
            </div>
            <p className="mt-2 text-[11px] text-[var(--plum)]/55">Also in: {i.alsoIn.join(", ")}</p>
          </details>
        ))}
        {list.length === 0 && <p className="text-center text-[13px] text-[var(--plum)]/50">No matches.</p>}
      </div>
    </div>
  );
}

function SoundTab() {
  return (
    <div id="sounds" className="mt-5 space-y-3">
      {SOUNDS.map((s) => <SoundPlayer key={s.id} {...s} />)}
      <p className="mt-3 text-center text-[11px] italic text-[var(--plum)]/45">Audio streams from Pixabay (royalty-free).</p>
    </div>
  );
}

function SoundPlayer({ name, duration, url }: { name: string; duration: string; url: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const a = ref.current; if (!a) return;
    const onTime = () => setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("ended", onEnd); };
  }, []);
  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
  };
  return (
    <div className="sand-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif text-[18px] text-[var(--plum)]">{name}</p>
          <p className="text-[11px] tracking-wide uppercase text-[var(--plum)]/55">{duration}</p>
        </div>
        <button onClick={toggle} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--plum)] text-[var(--ivory)]">
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--plum)]/10">
        <div className="h-full bg-[var(--gold)]" style={{ width: `${progress}%` }} />
      </div>
      <audio ref={ref} src={url} preload="none" />
    </div>
  );
}

function GuideTab() {
  const [active, setActive] = useState<string | null>(null);
  const a = active ? ARTICLES.find((x) => x.id === active) : null;
  if (a) {
    return (
      <div className="mt-5 fade-rise">
        <button onClick={() => setActive(null)} className="text-[12px] text-[var(--plum)]/60">← All articles</button>
        <p className="mt-3 label-caps text-[var(--gold)]">The Glow Guide</p>
        <h2 className="mt-1 font-serif text-[28px] leading-tight text-[var(--plum)]">{a.title}</h2>
        <GoldDivider />
        <article className="space-y-4 font-serif text-[16.5px] leading-[1.65] text-[var(--plum)]/85">
          {a.body.split("\n\n").map((p, i) => (
            <p key={i} className={i === 0 ? "drop-cap" : ""}>{p}</p>
          ))}
        </article>
      </div>
    );
  }
  return (
    <div className="mt-5 space-y-3">
      {ARTICLES.map((art) => (
        <button key={art.id} onClick={() => setActive(art.id)}
          className="block w-full rounded-2xl bg-[var(--card)] p-5 text-left shadow-sm transition hover:bg-[var(--sand)]">
          <p className="label-caps text-[var(--gold)]">Article</p>
          <h3 className="mt-1 font-serif text-[20px] leading-tight text-[var(--plum)]">{art.title}</h3>
          <p className="mt-2 text-[13px] text-[var(--plum)]/65">{art.body.slice(0, 100)}…</p>
        </button>
      ))}
    </div>
  );
}
