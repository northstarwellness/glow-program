/**
 * Colors for the full recipe header (2026-09-30, owner brief): the recipe's ORIGINAL gradient
 * fills the whole header, through the title and the actions. The gradient itself is never
 * changed. Text sits on it in one of two ways:
 *
 * - "ink": on light gradients, a deep tone of the recipe's own deepest stop, darkened until it
 *   reads at INK_TARGET or better on every point of the gradient. Nothing is layered on top.
 * - "ivory": on dark or mixed gradients, ivory text. Where a stretch of the gradient is too
 *   light for ivory, a veil in the recipe's own deep tone (never gray or black) is layered over
 *   just that stretch, only as strong as needed, so the rest of the gradient shows untouched.
 *
 * `samples` are the composited colors the text can sit on (gradient plus veil), end to end,
 * so tests can prove the contrast. The sparkle border colors come from the same stops.
 */
import { contrast, gradientStops, IVORY, mix, washSamples } from "@/lib/recipe-button";

export const INK_TARGET = 4.6; // above WCAG AA 4.5:1 for the 11px details line
const NIGHT = "#1A1718";

type RGB = [number, number, number];
const rgb = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const lum = (h: string) => {
  const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = rgb(h);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

export type RecipeHeaderColors = {
  mode: "ink" | "ivory";
  /** The recipe's original gradient, unchanged. */
  gradient: string;
  stops: string[];
  /** Veil layered over the gradient (ivory mode only), or null. */
  veil: string | null;
  /** Full CSS background: veil (if any) over the original gradient. */
  background: string;
  text: string;
  /** Label color for the pearl action pills (on white). */
  pillInk: string;
  /** Composited colors behind the text, end to end. */
  samples: string[];
  /** Sparkle border: fine line stops, light core and glow. */
  line: [string, string, string];
  spark: string;
  glow: string;
};

const cache = new Map<string, RecipeHeaderColors>();

export function recipeHeaderColors(gradient: string): RecipeHeaderColors {
  const hit = cache.get(gradient);
  if (hit) return hit;
  const stops = gradientStops(gradient);
  const angle = gradient.match(/(\d+)deg/)?.[1] ?? "135";
  const byLum = [...stops].sort((a, b) => lum(a) - lum(b));
  const deep = byLum[0];
  const light = byLum[byLum.length - 1];
  const plain = washSamples(stops, 24);

  // Ink: the recipe's deepest stop, darkened just enough for every point of the gradient.
  let ink = deep;
  for (let t = 0; t <= 1.0001; t += 0.02) {
    ink = mix(deep, NIGHT, Math.min(1, t));
    if (Math.min(...plain.map((s) => contrast(ink, s))) >= INK_TARGET) break;
  }
  const inkWorks = Math.min(...plain.map((s) => contrast(ink, s))) >= INK_TARGET;

  // Pill label on white: the same deep tone, at least INK_TARGET on white.
  let pillInk = deep;
  for (let t = 0; t <= 1.0001 && contrast(pillInk, "#FFFFFF") < 6; t += 0.02)
    pillInk = mix(deep, NIGHT, Math.min(1, t));

  let result: RecipeHeaderColors;
  if (inkWorks) {
    result = {
      mode: "ink",
      gradient,
      stops,
      veil: null,
      background: gradient,
      text: ink,
      pillInk,
      samples: plain,
      line: [mix(light, "#FFFFFF", 0.55), mix("#C49A6C", deep, 0.25), mix(deep, IVORY, 0.25)],
      spark: "#B8864F",
      glow: "#E2B978",
    };
  } else {
    // Ivory text. Per-stop veil strength in the recipe's own deep tone, then raised evenly
    // until every point in between also clears the target.
    const veilColor = contrast(IVORY, deep) >= INK_TARGET + 1 ? deep : mix(deep, NIGHT, 0.35);
    const need = (s: string) => {
      let a = 0;
      while (a < 1 && contrast(IVORY, mix(s, veilColor, a)) < INK_TARGET) a += 0.01;
      return Math.min(1, a);
    };
    let alphas = stops.map(need);
    const composite = (as: number[]) =>
      Array.from({ length: 25 }, (_, i) => {
        const pos = (i / 24) * (stops.length - 1);
        const k = Math.min(Math.floor(pos), stops.length - 2);
        const f = pos - k;
        const base = mix(stops[k], stops[k + 1], f);
        const a = as[k] + (as[k + 1] - as[k]) * f;
        return mix(base, veilColor, a);
      });
    let samples = composite(alphas);
    while (Math.min(...samples.map((s) => contrast(IVORY, s))) < INK_TARGET) {
      alphas = alphas.map((a) => Math.min(1, a + 0.01));
      samples = composite(alphas);
    }
    const [vr, vg, vb] = rgb(veilColor);
    const veil = alphas.every((a) => a === 0)
      ? null
      : `linear-gradient(${angle}deg, ${alphas
          .map(
            (a, i) =>
              `rgba(${vr}, ${vg}, ${vb}, ${a.toFixed(2)}) ${Math.round((i / Math.max(1, alphas.length - 1)) * 100)}%`,
          )
          .join(", ")})`;
    result = {
      mode: "ivory",
      gradient,
      stops,
      veil,
      background: veil ? `${veil}, ${gradient}` : gradient,
      text: IVORY,
      pillInk,
      samples,
      line: [mix(light, "#FFFFFF", 0.35), "#E7C992", mix(light, "#FFFFFF", 0.6)],
      spark: "#FFF6E4",
      glow: mix("#E7C992", light, 0.35),
    };
  }
  cache.set(gradient, result);
  return result;
}
