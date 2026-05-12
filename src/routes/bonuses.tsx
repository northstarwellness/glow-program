import { createFileRoute, Link, Navigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { ARTICLES, INGREDIENTS, POLYPHENOLS, RECIPES, SOUNDS, REDS_URL } from "@/lib/content";

export const Route = createFileRoute("/bonuses")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) ?? "",
  }),
  component: Bonuses,
});

function Bonuses() {
  const hydrated = useHydrated();
  const s = useApp();
  const search = useSearch({ from: "/bonuses" });
  if (hydrated && !s.name) return <Navigate to="/" />;
  const [tab, setTab] = useState<"recipes" | "poly" | "ing" | "sound" | "guide">(
    search.tab === "sound" ? "sound" : "recipes"
  );

  return (
    <Frame>
      <TopBar name={s.name} />
      <p className="label-caps text-[var(--gold)]">Bonuses & sounds</p>
      <h1 className="font-serif text-[32px] leading-tight text-[var(--plum)]">Everything you also got.</h1>

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

function BonusRecipes() {
  const bonus = RECIPES.filter((r) => r.bonus);
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {bonus.map((r) => (
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

// Module-level ref so stopping one sound stops all
let _activeCtx: AudioContext | null = null;

function buildAmbient(ctx: AudioContext, id: string) {
  const master = ctx.createGain();
  master.connect(ctx.destination);

  if (id === "bowl") {
    master.gain.value = 0.32;
    ([[432, 0.4], [648, 0.14], [864, 0.07], [1296, 0.03]] as [number, number][]).forEach(([freq, vol]) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.25;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 1.5;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start();
      const g = ctx.createGain();
      g.gain.value = vol;
      osc.connect(g);
      g.connect(master);
      osc.start();
    });
  } else {
    // Pink noise for all other sounds
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(2, sr * 4, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < sr * 4; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    if (id === "rain") {
      f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.4;
      master.gain.value = 0.38;
    } else if (id === "birds") {
      f.type = "highpass"; f.frequency.value = 500;
      master.gain.value = 0.28;
    } else if (id === "silence") {
      f.type = "lowpass"; f.frequency.value = 160;
      master.gain.value = 0.07;
    } else {
      f.type = "lowpass"; f.frequency.value = 480;
      master.gain.value = 0.32;
    }
    src.connect(f);
    f.connect(master);
    src.start();
  }
}

function SoundTab() {
  return (
    <div id="sounds" className="mt-5 space-y-3">
      {SOUNDS.map((s) => <SoundPlayer key={s.id} id={s.id} name={s.name} duration={s.duration} />)}
      <p className="mt-3 text-center text-[11px] italic text-[var(--plum)]/45">
        Ambient audio generated in-browser. No external files needed.
      </p>
    </div>
  );
}

function SoundPlayer({ id, name, duration }: { id: string; name: string; duration: string }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null; _activeCtx = null; }
    if (timerRef.current !== null) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
  };

  useEffect(() => () => { stop(); }, []);

  const toggle = () => {
    if (playing) { stop(); return; }
    if (_activeCtx) { _activeCtx.close().catch(() => {}); _activeCtx = null; }
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      ctxRef.current = ctx;
      _activeCtx = ctx;
      buildAmbient(ctx, id);
      const startedAt = Date.now() - elapsed * 1000;
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="sand-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-serif text-[18px] text-[var(--plum)]">{name}</p>
          <p className="text-[11px] tracking-wide uppercase text-[var(--plum)]/55">
            {playing ? `${fmt(elapsed)} · playing` : duration}
          </p>
        </div>
        <button
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--plum)] text-[var(--ivory)] transition-opacity active:opacity-70"
        >
          {playing
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          }
        </button>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--plum)]/10">
        <div className="h-full rounded-full bg-[var(--gold)] transition-all" style={{ width: playing ? `${Math.min((elapsed / 480) * 100, 100)}%` : "0%" }} />
      </div>
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
