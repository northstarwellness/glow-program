import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * A fine border for the recipe header that catches the light now and then, like the edge of good
 * stationery (owner refinement of preview cf0fc5e7, 2026-09-30). Nothing travels around the edge:
 * two tiny soft highlights (about 1.5px) sit at fixed points on the border and fade in and out on
 * staggered 9 s and 13 s cycles at low opacity, so at most two are ever visible and most of the time
 * none are. Only their opacity animates; the fill, text and controls never move.
 *
 * Motion runs only while the header is on screen and the page is visible; it is off when the
 * device asks for reduced motion, and the viewer can switch it on or off (remembered on this
 * device). With motion off only the still border shows.
 */

type Glint = {
  /** Where on the edge: "top" (x = share of width) or "left" (y = share of height). */
  side: "top" | "left";
  at: number;
  cycle: number; // seconds
  delay: number; // seconds
};
const GLINTS: Glint[] = [
  { side: "top", at: 0.68, cycle: 9, delay: -2 },
  { side: "left", at: 0.7, cycle: 13, delay: -9 },
];
const GLINT_PEAK = 0.22;
const EDGE = 3.5; // inset of the fine border line

function roundedRect(w: number, h: number, inset: number, r: number) {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = h - inset;
  const rr = Math.max(0, Math.min(r - inset, (x1 - x0) / 2, (y1 - y0) / 2));
  const d = [
    `M ${x0 + rr} ${y0}`,
    `H ${x1 - rr}`,
    `A ${rr} ${rr} 0 0 1 ${x1} ${y0 + rr}`,
    `V ${y1 - rr}`,
    `A ${rr} ${rr} 0 0 1 ${x1 - rr} ${y1}`,
    `H ${x0 + rr}`,
    `A ${rr} ${rr} 0 0 1 ${x0} ${y1 - rr}`,
    `V ${y0 + rr}`,
    `A ${rr} ${rr} 0 0 1 ${x0 + rr} ${y0}`,
    "Z",
  ].join(" ");
  const length = 2 * (x1 - x0 - 2 * rr) + 2 * (y1 - y0 - 2 * rr) + 2 * Math.PI * rr;
  return { d, length };
}

export function SparkleBorder({
  line,
  spark,
  glow,
  radius = 24,
  motion,
}: {
  line: [string, string, string];
  spark: string;
  glow: string;
  radius?: number;
  motion: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const gradId = useRef(`sb-${Math.random().toString(36).slice(2, 9)}`).current;

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    const vis = () => setPageVisible(document.visibilityState === "visible");
    vis();
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const running = motion && onScreen && pageVisible;
  const outer = size ? roundedRect(size.w, size.h, EDGE, radius) : null;
  const inner = size ? roundedRect(size.w, size.h, EDGE + 2, radius) : null;

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      className="sparkle-border"
      data-testid="sparkle-border"
      data-running={running ? "true" : "false"}
      width={size?.w ?? 0}
      height={size?.h ?? 0}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
    >
      {outer && inner && size && (
        <>
          <defs>
            <linearGradient
              id={gradId}
              x1="0"
              y1="0"
              x2={size.w}
              y2={size.h}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={line[0]} />
              <stop offset="50%" stopColor={line[1]} />
              <stop offset="100%" stopColor={line[2]} />
            </linearGradient>
          </defs>
          {/* Fine edge in the approved line colors, with a lighter inner line for depth. */}
          <path
            d={outer.d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="1.1"
            opacity="0.9"
          />
          <path d={inner.d} fill="none" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.28" />
          {GLINTS.map((g, i) => {
            const cx = g.side === "top" ? size.w * g.at : EDGE;
            const cy = g.side === "top" ? EDGE : size.h * g.at;
            const [rx, ry] = g.side === "top" ? [2, 0.75] : [0.75, 2];
            return (
              <g
                key={i}
                className="edge-glint"
                data-testid="edge-glint"
                style={
                  {
                    "--g-cycle": `${g.cycle}s`,
                    "--g-delay": `${g.delay}s`,
                    "--g-peak": GLINT_PEAK,
                    animationName: motion ? undefined : "none",
                    animationPlayState: running ? "running" : "paused",
                  } as React.CSSProperties
                }
              >
                {/* A soft halo along the edge and a tiny core: light catching the rim. */}
                <ellipse cx={cx} cy={cy} rx={rx * 2.4} ry={ry * 2.4} fill={glow} opacity="0.35" />
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={spark} />
              </g>
            );
          })}
        </>
      )}
    </svg>
  );
}

/** Small control in the header to switch the edge light on or off. */
export function SparkleMotionToggle({
  on,
  onChange,
  color,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  color: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Edge light motion"
      title={on ? "Pause edge light" : "Play edge light"}
      onClick={() => onChange(!on)}
      data-testid="sparkle-toggle"
      className="sparkle-toggle -mr-2 -mt-2 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
      style={{ color }}
    >
      {/* A plain pause / play mark: no star or sparkle shape. */}
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        {on ? (
          <path
            d="M8.5 6v12M15.5 6v12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M8.5 6.2v11.6L17.8 12z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
