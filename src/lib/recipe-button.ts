/**
 * Button colors for an action that belongs to a day or a smoothie, derived from that
 * recipe's own gradient (the recipe's color blocks themselves are never changed):
 *
 * - wash: every stop of the recipe gradient blended toward the app's ivory (up to 80%), but
 *   never so far that it stops being a visible tint, so pale recipes keep their character;
 * - edge: the recipe's deepest stop, softened, as a fine matching border;
 * - ink: a deep tone of the same recipe for the label, darkened until it reads at 4.5:1
 *   or better across the whole wash (sampled end to end, not just at the stops).
 */
export const IVORY = "#FAF7F3";
export const CHARCOAL = "#2A2A2A";
const INK_TARGET = 6; // comfortably above WCAG AA 4.5:1
const WASH = 0.8; // most ivory a wash stop may take
const MIN_TINT = 1.18; // …but it must stay at least this distinct from ivory (contrast ratio)
const EDGE = 0.45; // share of ivory in the edge

type RGB = [number, number, number];
const hex = (h: string): RGB => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)) as RGB;
};
const toHex = (c: RGB) =>
  "#" +
  c
    .map((v) => Math.round(v).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
const lum = (c: RGB) => {
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
export const contrast = (a: string, b: string) => {
  const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
export const mix = (a: string, b: string, t: number) =>
  toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t) as RGB);

export const gradientStops = (gradient: string) =>
  [...gradient.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toUpperCase());

/** Points along the wash, end to end, for contrast checks. */
export const washSamples = (stops: string[], n = 10) =>
  stops.length < 2
    ? stops
    : Array.from({ length: n + 1 }, (_, i) => {
        const pos = (i / n) * (stops.length - 1);
        const k = Math.min(Math.floor(pos), stops.length - 2);
        return mix(stops[k], stops[k + 1], pos - k);
      });

export type DayButtonColors = {
  wash: string;
  washStops: string[];
  edge: string;
  ink: string;
  shadow: string;
};

export function dayButtonColors(gradient: string): DayButtonColors {
  const stops = gradientStops(gradient);
  const angle = gradient.match(/(\d+)deg/)?.[1] ?? "135";
  const source = stops.length ? stops : [CHARCOAL];
  const washStops = source.map((s) => {
    let t = WASH;
    while (t > 0 && contrast(mix(s, IVORY, t), IVORY) < MIN_TINT) t = Math.max(0, t - 0.02);
    return mix(s, IVORY, t);
  });
  const deep = [...source].sort((a, b) => lum(hex(a)) - lum(hex(b)))[0];
  const samples = washSamples(washStops);
  let ink = deep;
  for (let t = 0; t <= 1; t += 0.02) {
    ink = mix(deep, "#1A1718", t);
    if (Math.min(...samples.map((s) => contrast(ink, s))) >= INK_TARGET) break;
  }
  return {
    wash: `linear-gradient(${angle}deg, ${washStops.map((s, i) => `${s} ${Math.round((i / Math.max(1, washStops.length - 1)) * 100)}%`).join(", ")})`,
    washStops,
    edge: mix(deep, IVORY, EDGE),
    ink,
    shadow: deep,
  };
}

/** Inline CSS variables for `.btn-day` / `.btn-day-quiet`. */
export function dayButtonStyle(gradient: string): Record<string, string> {
  const c = dayButtonColors(gradient);
  return {
    "--btn-wash": c.wash,
    "--btn-edge": c.edge,
    "--btn-ink": c.ink,
    "--btn-shadow": c.shadow,
  };
}
