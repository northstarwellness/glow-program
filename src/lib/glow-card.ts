/**
 * Renders the Day 21 Glow Card (the same fields shown on /celebrate) to a PNG
 * with the Canvas 2D API — no extra dependency, deterministic on iOS Safari.
 */

export type GlowCardData = {
  name: string;
  score: number;
  daysDone: number;
  entries: number;
  redsDays: number;
  date: string;
};

// sRGB equivalents of the --ivory / --plum / --gold / --berry / --blush tokens.
const C = {
  ivory: "#FBF6EF",
  plum: "#6E2748",
  gold: "#C99A6D",
  berry: "#8E132B",
  blush: "#F9E9EA",
};
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", system-ui, sans-serif';

export async function renderGlowCard(d: GlowCardData): Promise<Blob> {
  if (typeof document === "undefined") throw new Error("no-document");
  try {
    await document.fonts?.ready;
  } catch {
    /* fall back to Georgia */
  }
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no-canvas");

  ctx.fillStyle = C.ivory;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const label = (text: string, y: number, color = C.gold, size = 26) => {
    ctx.font = `500 ${size}px ${SANS}`;
    ctx.fillStyle = color;
    const spaced = text.toUpperCase().split("").join(String.fromCharCode(8202));
    ctx.fillText(spaced, W / 2, y);
  };

  label("Day 21 · Complete", 190);
  ctx.fillStyle = C.plum;
  ctx.font = `400 88px ${SERIF}`;
  ctx.fillText("You did it,", W / 2, 320);
  ctx.fillStyle = C.berry;
  ctx.font = `italic 400 88px ${SERIF}`;
  ctx.fillText(`${d.name}.`, W / 2, 420, W - 200);

  label("Your Glow Score", 560);
  ctx.fillStyle = C.plum;
  ctx.font = `400 200px ${SERIF}`;
  ctx.fillText(String(d.score), W / 2, 760);

  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(W / 2 - 60, 810, 120, 2);
  ctx.globalAlpha = 1;

  const stats: [string, number][] = [
    ["Days Done", d.daysDone],
    ["Entries", d.entries],
    ["Reds Days", d.redsDays],
  ];
  stats.forEach(([k, v], i) => {
    const x = W / 2 + (i - 1) * 280;
    ctx.fillStyle = C.plum;
    ctx.font = `400 64px ${SERIF}`;
    ctx.fillText(String(v), x, 920);
    ctx.font = `500 22px ${SANS}`;
    ctx.globalAlpha = 0.55;
    ctx.fillText(k.toUpperCase(), x, 960);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = C.blush;
  ctx.fillRect(140, 1040, W - 280, 170);
  label("Inner Glow Reset — Complete", 1100, C.gold, 22);
  ctx.fillStyle = C.plum;
  ctx.font = `400 40px ${SERIF}`;
  ctx.fillText(d.name, W / 2, 1152, W - 320);
  ctx.font = `400 24px ${SANS}`;
  ctx.globalAlpha = 0.55;
  ctx.fillText(`Day 21 · ${d.date}`, W / 2, 1190);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob-failed"))), "image/png"),
  );
}
