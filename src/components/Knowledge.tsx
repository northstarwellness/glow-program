import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { RECIPES, POLYPHENOLS } from "@/lib/content";
import { SOUNDS } from "@/lib/sounds";
import type { GuideTopic } from "@/lib/guide-topics";

export type KnowledgeSection = "guide" | "recipes" | "poly" | "ing" | "sound";

type Tile = { id: KnowledgeSection; title: string; note: string; icon: IconName };

/** The five parts of the Ritual Guide, each with one line saying what opens. */
export function knowledgeTiles(): Tile[] {
  const bonus = RECIPES.filter((r) => r.bonus).length;
  return [
    {
      id: "guide",
      title: "Ritual Guide",
      note: "Short reads on polyphenols, mornings and keeping the ritual",
      icon: "book",
    },
    {
      id: "recipes",
      title: "Bonus recipes",
      note: `${bonus} extra drinks and treats`,
      icon: "glass",
    },
    {
      id: "poly",
      title: "Polyphenols",
      note: `${POLYPHENOLS.length} colorful foods and how to use them`,
      icon: "leaf",
    },
    { id: "ing", title: "Ingredients", note: "What each recipe ingredient brings", icon: "list" },
    {
      id: "sound",
      title: "Sounds",
      note: "Rain, birdsong, waves, piano and ambient",
      icon: "wave",
    },
  ];
}

type IconName = "book" | "glass" | "leaf" | "list" | "wave";
function Icon({ name, on = false }: { name: IconName; on?: boolean }) {
  const d: Record<IconName, string> = {
    book: "M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5v-12zM20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5v-12z",
    glass: "M6 4h12l-1.6 11.2A4 4 0 0112.4 19h-.8a4 4 0 01-4-3.8L6 4z",
    leaf: "M5 19c0-8 6-14 14-14-.5 8-6 14-14 14zM5 19l7-7",
    list: "M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01",
    wave: "M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2",
  };
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${on ? "border-[var(--cranberry)] text-[var(--cranberry)]" : "border-[var(--line)] text-[var(--ink-2)]"}`}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={d[name]} />
      </svg>
    </span>
  );
}

function Chevron({ on = false }: { on?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`flex-shrink-0 ${on ? "text-[var(--cranberry)]" : "text-[var(--ink-2)]"}`}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const tileClass =
  "knowledge-tile flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(41,40,45,0.04)]";

function TileBody({ t, on = false }: { t: Tile; on?: boolean }) {
  return (
    <>
      <Icon name={t.icon} on={on} />
      <span className="min-w-0 flex-1">
        <span
          className={`block font-serif text-[17px] leading-tight ${on ? "text-[var(--cranberry)]" : "text-[var(--charcoal)]"}`}
        >
          {t.title}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--ink-2)]">
          {t.note}
        </span>
      </span>
      <Chevron on={on} />
    </>
  );
}

/** On Home: each part of the Ritual Guide as its own tile, opening that section. */
export function KnowledgeLinks() {
  const tiles = knowledgeTiles();
  return (
    <ul className="grid gap-2.5" data-testid="knowledge-tiles">
      {tiles.map((t) => (
        <li key={t.id}>
          <Link to="/bonuses" search={{ section: t.id }} className={tileClass}>
            <TileBody t={t} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** On the Ritual Guide page: the same tiles, choosing the section shown below. */
export function KnowledgeSwitcher({
  active,
  onChange,
}: {
  active: KnowledgeSection;
  onChange: (s: KnowledgeSection) => void;
}) {
  return (
    <ul className="grid gap-2.5" data-testid="knowledge-tiles">
      {knowledgeTiles().map((t) => (
        <li key={t.id}>
          <button
            type="button"
            aria-pressed={active === t.id}
            onClick={() => onChange(t.id)}
            className={`${tileClass} ${active === t.id ? "knowledge-tile-on" : ""}`}
          >
            <TileBody t={t} on={active === t.id} />
          </button>
        </li>
      ))}
    </ul>
  );
}

/**
 * A Ritual Guide topic as a mobile sheet: heading, a short introduction, three takeaways, and
 * the full article with sources under "Read more". Uses the native modal dialog, so Escape
 * closes it, focus stays inside while open and returns to the tile that opened it.
 */
export function TopicSheet({
  topic,
  title,
  body,
  onClose,
}: {
  topic: GuideTopic;
  title: string;
  body: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    opener.current = document.activeElement;
    if (!d.open) d.showModal();
    const onClosed = () => closeRef.current();
    d.addEventListener("close", onClosed);
    return () => {
      d.removeEventListener("close", onClosed);
      if (d.open) d.close();
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, []);
  const headingId = "topic-sheet-title";
  return (
    <dialog
      ref={ref}
      aria-labelledby={headingId}
      className="topic-sheet"
      data-testid="topic-sheet"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="topic-sheet-inner">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="label-caps text-[var(--cranberry)]">Ritual Guide</p>
            <h2
              id={headingId}
              className="mt-1 font-serif text-[26px] leading-tight text-[var(--plum)] [text-wrap:balance]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="-mr-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[var(--plum)]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cranberry)]"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="mt-3 font-serif text-[17px] leading-relaxed text-[var(--plum)]/85">
          {topic.intro}
        </p>
        <ul className="mt-4 space-y-2.5">
          {topic.takeaways.map((k) => (
            <li key={k} className="flex gap-3 text-[14px] leading-relaxed text-[var(--plum)]/85">
              <span
                aria-hidden="true"
                className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--cranberry)]"
              />
              <span>{k}</span>
            </li>
          ))}
        </ul>
        <details className="topic-more mt-5 border-t border-[var(--line)] pt-3">
          <summary className="flex min-h-11 cursor-pointer items-center text-[13.5px] font-medium text-[var(--plum)]">
            Read more
          </summary>
          <div className="space-y-3 pb-1 font-serif text-[16px] leading-[1.65] text-[var(--plum)]/85">
            {body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {topic.sources.length > 0 && (
            <div className="mt-4">
              <p className="label-caps text-[var(--ink-2)]">Sources</p>
              <ul className="mt-2 space-y-1.5 text-[12.5px] leading-snug text-[var(--plum)]/70">
                {topic.sources.map((src) => (
                  <li key={src.label}>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-[var(--cranberry)]/50 underline-offset-2"
                      >
                        {src.label}
                      </a>
                    ) : (
                      src.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>
      </div>
    </dialog>
  );
}
