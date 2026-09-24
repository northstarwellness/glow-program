import { useMemo, useState } from "react";
import { REDS_URL } from "@/lib/content";

type Opt = { id: string; label: string; benefit: string };

const BASES: Opt[] = [
  { id: "oat", label: "Oat milk", benefit: "Beta-glucans for a calm gut and steady morning energy." },
  { id: "almond", label: "Almond milk", benefit: "Light, low-sugar base that lets polyphenols shine." },
  { id: "coconut", label: "Coconut yogurt", benefit: "Probiotics + healthy fats for the gut–skin axis." },
  { id: "hibiscus", label: "Hibiscus tea", benefit: "Vascular-supportive anthocyanins and a feminine ruby tone." },
];
const FRUITS: Opt[] = [
  { id: "berry", label: "Mixed berries", benefit: "Anthocyanins for daily skin protection and brightness." },
  { id: "pom", label: "Pomegranate", benefit: "Punicalagins and ellagic acid for collagen protection." },
  { id: "peach", label: "Peach or plum", benefit: "Stone-fruit polyphenols for soft, even tone." },
  { id: "watermelon", label: "Watermelon", benefit: "Lycopene and hydration for clarity and UV defense." },
  { id: "fig", label: "Fig", benefit: "Prebiotic fiber for the bacteria your skin depends on." },
];
const FATS: Opt[] = [
  { id: "almondbutter", label: "Almond butter", benefit: "Vitamin E for skin barrier strength." },
  { id: "chia", label: "Chia seeds", benefit: "Plant omega-3 and soluble fiber for hydration and motility." },
  { id: "cacaonibs", label: "Cacao nibs", benefit: "Flavanols for circulation and skin density." },
  { id: "none", label: "Skip the fat", benefit: "Lighter glass — lets the polyphenols absorb fast." },
];
const POLYS: Opt[] = [
  { id: "reds", label: "Radiant Reds", benefit: "27 polyphenol sources in one scoop — the centerpiece of your glow." },
  { id: "matcha", label: "Matcha", benefit: "EGCG, one of the most-studied skin-protective polyphenols." },
  { id: "turmeric", label: "Turmeric + pepper", benefit: "Curcumin for calm, steady inflammation balance." },
  { id: "cacaopowder", label: "Raw cacao", benefit: "Flavanols for hydration and density." },
];
const TOUCHES: Opt[] = [
  { id: "lime", label: "Lime", benefit: "Vitamin C cofactor for collagen synthesis." },
  { id: "rose", label: "Rose water", benefit: "Calming aromatic — softens the nervous system." },
  { id: "cinnamon", label: "Cinnamon", benefit: "Blunts morning blood sugar; protects against glycation." },
  { id: "honey", label: "Raw honey", benefit: "Trace antioxidants and gentle sweetness." },
  { id: "mint", label: "Fresh mint", benefit: "Cooling and digestion-supportive." },
];

const STEPS: { key: "base" | "fruit" | "fat" | "poly" | "touch"; title: string; sub: string; opts: Opt[] }[] = [
  { key: "base", title: "Choose a base", sub: "The body of your glass.", opts: BASES },
  { key: "fruit", title: "Choose a fruit", sub: "Color and natural polyphenols.", opts: FRUITS },
  { key: "fat", title: "Choose a healthy fat", sub: "What carries the nutrients in.", opts: FATS },
  { key: "poly", title: "Choose your polyphenol", sub: "The glow layer.", opts: POLYS },
  { key: "touch", title: "Add a finishing touch", sub: "The note that makes it yours.", opts: TOUCHES },
];

type Picks = Partial<Record<"base" | "fruit" | "fat" | "poly" | "touch", Opt>>;

export function BuildYourOwn() {
  const [picks, setPicks] = useState<Picks>({});
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  const benefits = useMemo(
    () => Object.values(picks).filter(Boolean).map((p) => p!.benefit),
    [picks]
  );

  if (done) {
    const includesReds = picks.poly?.id === "reds";
    return (
      <div className="mt-6 fade-rise">
        <div className="overflow-hidden rounded-3xl p-6 text-[var(--ivory)] shadow-lg" style={{ background: "linear-gradient(135deg, #7B2D4E 0%, #C49A6C 100%)" }}>
          <p className="label-caps text-[var(--ivory)]/80">Your glass</p>
          <h2 className="mt-1 font-serif text-[28px] leading-tight">
            {picks.fruit?.label} {picks.poly?.label} ritual
          </h2>
          <ul className="mt-4 space-y-1 text-[13.5px] font-serif italic opacity-90">
            <li>· {picks.base?.label}</li>
            <li>· {picks.fruit?.label}</li>
            {picks.fat && picks.fat.id !== "none" && <li>· {picks.fat.label}</li>}
            <li>· {picks.poly?.label}</li>
            <li>· {picks.touch?.label}</li>
          </ul>
        </div>

        <div className="sand-card mt-5 p-5">
          <p className="label-caps text-[var(--gold)]">Your benefits</p>
          <ul className="mt-3 space-y-2.5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--plum)]/85">
                <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gold)]" /> <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {!includesReds && (
          <a href={REDS_URL} target="_blank" rel="noreferrer"
             className="mt-5 block overflow-hidden rounded-3xl border border-[var(--gold)]/40 bg-[var(--card)] p-5 text-center shadow-sm">
            <p className="label-caps text-[var(--gold)]">Make it a glow ritual</p>
            <p className="mt-2 font-serif text-[20px] text-[var(--plum)]">Add Radiant Reds</p>
            <p className="mt-1 font-serif italic text-[13px] text-[var(--plum)]/65">
              The polyphenol blend that makes any glass a Reset glass.
            </p>
            <p className="mt-3 font-serif text-[13px] tracking-[0.18em] uppercase text-[var(--gold)]">Shop the blend</p>
          </a>
        )}

        <button onClick={() => { setPicks({}); setStep(0); }}
          className="mt-5 w-full rounded-full border border-[var(--plum)]/20 px-4 py-3 font-serif text-[15px] text-[var(--plum)]">
          Build another
        </button>
      </div>
    );
  }

  const cur = STEPS[step];
  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <span key={i} className={`h-[2px] flex-1 rounded-full ${i <= step ? "bg-[var(--gold)]" : "bg-[var(--plum)]/15"}`} />
        ))}
      </div>
      <p className="mt-4 label-caps text-[var(--gold)]">Step {step + 1} of {STEPS.length}</p>
      <h2 className="mt-1 font-serif text-[26px] leading-tight text-[var(--plum)]">{cur.title}</h2>
      <p className="mt-1 font-serif italic text-[14px] text-[var(--plum)]/60">{cur.sub}</p>

      <div className="mt-5 space-y-2.5">
        {cur.opts.map((o) => {
          const selected = picks[cur.key]?.id === o.id;
          return (
            <button key={o.id}
              onClick={() => { setPicks({ ...picks, [cur.key]: o }); setTimeout(() => setStep(step + 1), 220); }}
              className={`block w-full rounded-2xl border p-4 text-left transition ${
                selected ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-[var(--plum)]/15 bg-[var(--card)]"
              }`}>
              <p className="font-serif text-[18px] text-[var(--plum)]">{o.label}</p>
              <p className="mt-1 text-[12.5px] italic text-[var(--plum)]/65">{o.benefit}</p>
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-5 text-[12px] text-[var(--plum)]/55">← Back</button>
      )}
    </div>
  );
}
