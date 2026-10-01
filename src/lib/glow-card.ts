/**
 * Renders the Day 21 Ritual Card (the same fields shown on /celebrate) to a PNG
 * with the Canvas 2D API — no extra dependency, deterministic on iOS Safari.
 */

export type GlowCardData = {
  name: string;
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

  label("Your Ritual", 560);
  ctx.fillStyle = C.plum;
  ctx.font = `400 200px ${SERIF}`;
  ctx.fillText(String(d.daysDone), W / 2, 740);
  ctx.font = `italic 400 40px ${SERIF}`;
  ctx.globalAlpha = 0.7;
  ctx.fillText("mornings complete", W / 2, 800);
  ctx.globalAlpha = 1;

  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(W / 2 - 60, 840, 120, 2);
  ctx.globalAlpha = 1;

  const stats: [string, number][] = [
    ["Journal entries", d.entries],
    ["Reds Days", d.redsDays],
  ];
  stats.forEach(([k, v], i) => {
    const x = W / 2 + (i === 0 ? -170 : 170);
    ctx.fillStyle = C.plum;
    ctx.font = `400 64px ${SERIF}`;
    ctx.fillText(String(v), x, 930);
    ctx.font = `500 22px ${SANS}`;
    ctx.globalAlpha = 0.55;
    ctx.fillText(k.toUpperCase(), x, 970);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = C.blush;
  ctx.fillRect(140, 1040, W - 280, 170);
  label("Your 21 Mornings · Complete", 1100, C.gold, 22);
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

/**
 * The Day 21 Reflection card. Carries only counts and the fixed feeling labels
 * she chose — never journal text, journal topics, app URLs or account details.
 */
export async function renderReflectionCard(
  d: import("./glow-reflection").GlowReflectionCardData & { date: string },
): Promise<Blob> {
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
  ctx.fillStyle = C.blush;
  ctx.fillRect(48, 48, W - 96, 420);
  ctx.strokeStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  const label = (text: string, y: number, color = C.gold, size = 24) => {
    ctx.font = `500 ${size}px ${SANS}`;
    ctx.fillStyle = color;
    ctx.fillText(text.toUpperCase().split("").join(String.fromCharCode(8202)), W / 2, y);
  };

  label("My Reflection", 170);
  ctx.fillStyle = C.plum;
  ctx.font = `italic 400 84px ${SERIF}`;
  ctx.fillText(d.name || "21 days", W / 2, 290, W - 200);
  ctx.font = `400 40px ${SERIF}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(d.line, W / 2, 370, W - 200);
  ctx.globalAlpha = 1;

  const stats: [string, number][] = [
    ["Days", d.daysCompleted],
    ["Check-ins", d.checkInDays],
    ["Journal days", d.journalDays],
  ];
  stats.forEach(([k, v], i) => {
    const x = W / 2 + (i - 1) * 300;
    ctx.fillStyle = C.plum;
    ctx.font = `400 96px ${SERIF}`;
    ctx.fillText(String(v), x, 640);
    ctx.font = `500 22px ${SANS}`;
    ctx.globalAlpha = 0.55;
    ctx.fillText(k.toUpperCase(), x, 685);
    ctx.globalAlpha = 1;
  });

  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(W / 2 - 60, 760, 120, 2);
  ctx.globalAlpha = 1;

  if (d.topFeelings.length) {
    label(d.feelingsHeading, 850);
    // Pills, centred as one row.
    const padX = 32;
    const gap = 20;
    let size = 44;
    let widths: number[] = [];
    // Shrink the type until the row fits inside the frame.
    for (; size >= 28; size -= 2) {
      ctx.font = `400 ${size}px ${SERIF}`;
      widths = d.topFeelings.map((f) => ctx.measureText(f).width + padX * 2);
      if (widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1) <= W - 180) break;
    }
    let x = (W - (widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1))) / 2;
    d.topFeelings.forEach((f, i) => {
      const w = widths[i];
      ctx.fillStyle = C.blush;
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x, 890, w, 84, 42);
      else ctx.rect(x, 890, w, 84);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = C.plum;
      ctx.fillText(f, x + w / 2, 932 + size * 0.35);
      x += w + gap;
    });
  } else {
    ctx.fillStyle = C.plum;
    ctx.font = `italic 400 44px ${SERIF}`;
    ctx.fillText("One morning at a time.", W / 2, 930);
  }

  label("Your 21 Mornings", 1150, C.gold, 22);
  ctx.fillStyle = C.plum;
  ctx.font = `400 26px ${SANS}`;
  ctx.globalAlpha = 0.55;
  ctx.fillText(d.date, W / 2, 1200);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob-failed"))), "image/png"),
  );
}
