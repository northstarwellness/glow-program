import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Frame, TopBar, GoldDivider } from "@/components/Frame";
import { useApp } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { recipeLinkSearch } from "@/lib/recipe-entry";
import { ARTICLES, INGREDIENTS, POLYPHENOLS, RECIPES, REDS_URL } from "@/lib/content";
import { SoundLibrary } from "@/components/Sounds";
import {
  KnowledgeSwitcher,
  TopicSheet,
  knowledgeTiles,
  type KnowledgeSection,
} from "@/components/Knowledge";
import { GUIDE_TOPICS } from "@/lib/guide-topics";
import { recipeHeaderColors } from "@/lib/recipe-header";
import { recipesUsing } from "@/lib/ingredients";

const SECTIONS: KnowledgeSection[] = ["guide", "recipes", "poly", "ing", "sound"];

export const Route = createFileRoute("/bonuses")({
  validateSearch: (search: Record<string, unknown>): { section?: KnowledgeSection } =>
    SECTIONS.includes(search.section as KnowledgeSection)
      ? { section: search.section as KnowledgeSection }
      : {},
  component: Bonuses,
});

function Bonuses() {
  const hydrated = useHydrated();
  const s = useApp();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const tab: KnowledgeSection = search.section ?? "guide";
  const setTab = (t: KnowledgeSection) =>
    navigate({ search: { section: t }, replace: true, resetScroll: false });
  if (hydrated && !s.name) return <Navigate to="/" />;

  return (
    <Frame>
      <TopBar name={s.name} />
      <p className="label-caps text-[var(--ink-2)]">The Ritual Guide</p>
      <h1 className="font-serif text-[34px] leading-tight text-[var(--plum)]">
        Everything inside.
      </h1>

      <div className="mt-5">
        <KnowledgeSwitcher active={tab} onChange={setTab} />
      </div>

      <section aria-label={knowledgeTiles().find((t) => t.id === tab)?.title} className="mt-2">
        {tab === "recipes" && <BonusRecipes />}
        {tab === "poly" && <PolyTab />}
        {tab === "ing" && <IngTab />}
        {tab === "sound" && <SoundTab />}
        {tab === "guide" && <GuideTab />}
      </section>

      <GoldDivider />
      {/* Radiant Reds information: compact, optional and secondary (Option B). */}
      <div className="reds-info" data-testid="reds-info">
        <p className="label-caps font-semibold text-[var(--cranberry)]">Optional</p>
        <p className="mt-1.5 font-serif text-[21px] leading-tight text-[var(--charcoal)]">
          Radiant Reds
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-2)]">
          An optional addition to your glass. Every recipe is complete without it.
        </p>
        <a href={REDS_URL} target="_blank" rel="noreferrer" className="reds-info-link">
          About Radiant Reds <span aria-hidden="true">→</span>
        </a>
      </div>
    </Frame>
  );
}

function BonusRecipes() {
  const bonus = RECIPES.filter((r) => r.bonus);
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      {bonus.map((r) => (
        <Link
          key={r.id}
          to="/recipes/$id"
          params={{ id: r.id }}
          search={recipeLinkSearch({ kind: "library", filter: "bonus" })}
          className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--charcoal)] focus-visible:ring-offset-2"
          data-testid="bonus-card"
        >
          {/* Compact card: the recipe's own approved colors, unchanged; only the size is smaller. */}
          <div
            className="min-h-[124px] overflow-hidden rounded-2xl shadow-sm"
            style={{ background: recipeHeaderColors(r.gradient).background }}
          >
            <div
              className="flex h-full min-h-[124px] flex-col justify-between p-3.5"
              style={{ color: recipeHeaderColors(r.gradient).text }}
            >
              <span className="self-start rounded-full bg-white/25 px-2 py-0.5 text-[10px] tracking-wider uppercase">
                {r.benefitTag}
              </span>
              <span>
                <h3 className="font-serif text-[17px] leading-tight">{r.name}</h3>
                <p className="mt-0.5 flex items-center justify-between text-[11px] tracking-wide">
                  {r.prep}
                  <span aria-hidden="true">→</span>
                </p>
              </span>
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
            <button
              onClick={() => setOpen(expanded ? null : p.id)}
              className="block w-full text-left"
            >
              <div
                className="h-20"
                style={{ background: `linear-gradient(135deg, ${p.color}, oklch(0.42 0.10 354))` }}
              />
              <div className="p-3">
                <h4 className="font-serif text-[18px] text-[var(--plum)]">{p.name}</h4>
                <p className="text-[11px] text-[var(--plum)]/65">{p.topBenefit}</p>
                <p className="mt-1 text-[10px] text-[var(--cranberry)]">
                  {expanded ? "Close ↑" : "Learn more ↓"}
                </p>
              </div>
            </button>
            {expanded && (
              <div className="border-t border-[var(--plum)]/10 p-4">
                <ul className="space-y-1.5 text-[13px] text-[var(--plum)]/85">
                  {p.points.map((pt, i) => (
                    <li key={i}>· {pt}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] italic text-[var(--ink-2)]">How to use: {p.howTo}</p>
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
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search any ingredient…"
        className="w-full rounded-full border border-[var(--plum)]/15 bg-[var(--card)] px-5 py-3 text-[14px] focus:border-[var(--gold)] focus:outline-none"
      />
      <div className="mt-4 space-y-2">
        {list.map((i) => (
          <details key={i.name} className="rounded-2xl bg-[var(--card)] p-4 shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-serif text-[17px] text-[var(--plum)]">{i.name}</p>
                <p className="text-[11px] text-[var(--cranberry)]">{i.tagline}</p>
              </div>
              <span className="text-[var(--ink-2)]">+</span>
            </summary>
            <p className="mt-3 text-[13px] text-[var(--plum)]/85">{i.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <p>
                <span className="text-[var(--cranberry)]">Nutrition note:</span>{" "}
                <span className="text-[var(--plum)]/75">{i.gut}</span>
              </p>
              <p>
                <span className="text-[var(--cranberry)]">In the glass:</span>{" "}
                <span className="text-[var(--plum)]/75">{i.skin}</span>
              </p>
            </div>
            {recipesUsing(i.name).length > 0 && (
              <p className="mt-2 text-[11px] text-[var(--ink-2)]">
                Also in: {recipesUsing(i.name).join(", ")}
              </p>
            )}
          </details>
        ))}
        {list.length === 0 && (
          <p className="text-center text-[13px] text-[var(--ink-2)]">No matches.</p>
        )}
      </div>
    </div>
  );
}

function SoundTab() {
  return (
    <div id="sounds" className="mt-5">
      <SoundLibrary />
    </div>
  );
}

function GuideTab() {
  const [active, setActive] = useState<string | null>(null);
  const a = active ? ARTICLES.find((x) => x.id === active) : null;
  const topic = a ? GUIDE_TOPICS[a.id] : null;
  return (
    <div className="mt-5">
      <ul className="grid grid-cols-2 gap-2.5" data-testid="guide-topics">
        {ARTICLES.map((art) => {
          const t = GUIDE_TOPICS[art.id];
          return (
            <li key={art.id} className="min-w-0">
              <button
                type="button"
                onClick={() => setActive(art.id)}
                className="knowledge-tile flex h-full min-h-[96px] w-full flex-col justify-between rounded-2xl border border-[var(--taupe)]/25 bg-white p-4 text-left shadow-[0_1px_2px_rgba(42,30,34,0.04)]"
              >
                <span className="block font-serif text-[17px] leading-tight text-[var(--plum)]">
                  {t?.short ?? art.title}
                </span>
                <span className="mt-1.5 block text-[12px] leading-snug text-[var(--plum)]/70">
                  {t?.teaser}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {a && topic && (
        <TopicSheet topic={topic} title={a.title} body={a.body} onClose={() => setActive(null)} />
      )}
    </div>
  );
}
