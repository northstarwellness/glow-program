export type GlowTypeId = "luminous" | "settled" | "vital" | "full";

export const GLOW_TYPES: Record<GlowTypeId, {
  id: GlowTypeId;
  name: string;
  tagline: string;
  body: string;
  pillars: string[];
}> = {
  luminous: {
    id: "luminous",
    name: "The Luminous Reset",
    tagline: "Skin that catches the morning light.",
    body: "Your reset begins at the surface. Polyphenols, hydration, and quiet morning ritual to bring clarity back to your skin from the inside.",
    pillars: ["Polyphenols", "Hydration", "Skin clarity"],
  },
  settled: {
    id: "settled",
    name: "The Settled Glow",
    tagline: "A calmer middle, a brighter outside.",
    body: "Your glow lives in your gut. Twenty-one days of fiber, fermentation, and Radiant Reds to settle digestion and let your skin follow.",
    pillars: ["Fiber", "Reds & berries", "Soft mornings"],
  },
  vital: {
    id: "vital",
    name: "The Vital Glow",
    tagline: "Energy that holds, mornings that feel like yours.",
    body: "Your reset is about steadiness. Blood-sugar-friendly mornings, gentle movement, and a ritual you can keep when the day gets loud.",
    pillars: ["Steady energy", "Movement", "Morning ritual"],
  },
  full: {
    id: "full",
    name: "The Full Glow Reset",
    tagline: "All four pillars, gently in motion.",
    body: "Skin, gut, energy, mood — your reset moves through all of it. A complete 21 days of rituals, polyphenols, and quiet attention.",
    pillars: ["Skin", "Gut", "Energy", "Mood"],
  },
};

export const QUIZ: { id: number; q: string; options: { label: string; tag: GlowTypeId }[] }[] = [
  {
    id: 1,
    q: "Where does your glow feel dim right now?",
    options: [
      { label: "Skin",   tag: "luminous" },
      { label: "Gut",    tag: "settled" },
      { label: "Energy", tag: "vital" },
      { label: "All of it", tag: "full" },
    ],
  },
  {
    id: 2,
    q: "Your mornings usually feel…",
    options: [
      { label: "Rushed",  tag: "vital" },
      { label: "Foggy",   tag: "settled" },
      { label: "Steady",  tag: "luminous" },
      { label: "Sacred",  tag: "full" },
    ],
  },
  {
    id: 3,
    q: "Your skin tells the story of…",
    options: [
      { label: "Dullness",    tag: "luminous" },
      { label: "Breakouts",   tag: "settled" },
      { label: "Dryness",     tag: "luminous" },
      { label: "Sensitivity", tag: "settled" },
    ],
  },
  {
    id: 4,
    q: "By 3pm you usually feel…",
    options: [
      { label: "Crashed",  tag: "vital" },
      { label: "Bloated",  tag: "settled" },
      { label: "Wired",    tag: "vital" },
      { label: "Balanced", tag: "full" },
    ],
  },
  {
    id: 5,
    q: "What would feel like a win in 21 days?",
    options: [
      { label: "Visible glow",     tag: "luminous" },
      { label: "Calm digestion",   tag: "settled" },
      { label: "Real energy",      tag: "vital" },
      { label: "A morning I love", tag: "full" },
    ],
  },
];

export function scoreQuiz(answers: Record<number, GlowTypeId>): GlowTypeId {
  const tally: Record<GlowTypeId, number> = { luminous: 0, settled: 0, vital: 0, full: 0 };
  Object.values(answers).forEach((t) => { tally[t] += 1; });
  // If "full" picked twice or it's the top, return full
  const sorted = (Object.entries(tally) as [GlowTypeId, number][]).sort((a, b) => b[1] - a[1]);
  if (tally.full >= 2) return "full";
  return sorted[0][0];
}

export const RITUAL_STEPS = [
  { id: "lemon",    label: "Warm lemon water" },
  { id: "reds",     label: "Radiant Reds or red-fruit smoothie" },
  { id: "still",    label: "Five minutes of stillness" },
  { id: "intent",   label: "One glow intention" },
];

export const SMOOTHIES = [
  { name: "Pomegranate Sunrise",   note: "Pomegranate, raspberry, oat milk, a spoon of Radiant Reds." },
  { name: "Berry Bloom",           note: "Blueberry, strawberry, banana, almond milk, chia." },
  { name: "Cherry Cacao",          note: "Tart cherry, cacao, almond butter, oat milk." },
  { name: "Plum & Rose",           note: "Plum, rose water, coconut yogurt, a touch of honey." },
  { name: "Watermelon Reds",       note: "Watermelon, hibiscus tea, lime, Radiant Reds." },
  { name: "Fig & Almond",          note: "Black fig, almond, oat milk, cinnamon." },
  { name: "Beet Glow",             note: "Roasted beet, raspberry, ginger, orange." },
];

export const JOURNAL_PROMPTS: Record<number, string> = {
  1:  "What does glow mean to you this season?",
  2:  "Name one thing you'll let be slow today.",
  3:  "What did your morning ritual feel like?",
  4:  "Where in your body do you feel most awake?",
  5:  "What story is your skin telling this week?",
  6:  "What's one thing you're already doing right?",
  7:  "Where do you already feel a shift?",
  8:  "What does your body ask for at 3pm?",
  9:  "Name one ritual that's becoming yours.",
  10: "What did you eat that made you feel lit up?",
  11: "Where are you being too hard on yourself?",
  12: "What does softness look like today?",
  13: "Write one sentence to your skin.",
  14: "What ritual is starting to feel like yours?",
  15: "What have you stopped craving?",
  16: "Name a small moment of beauty from this week.",
  17: "What feels lighter than it did on day one?",
  18: "Where do you want to keep going past day 21?",
  19: "What would make tomorrow feel sacred?",
  20: "What are you carrying out of these 21 days?",
  21: "Write a letter to the woman who started 21 days ago.",
};

export function reflect(entry: string): string {
  const t = entry.trim().toLowerCase();
  if (t.length === 0) return "";
  if (t.length < 25) return "Even one sentence is a ritual. See you tomorrow.";
  if (/\b(tired|hard|slow|off|heavy|sad|stuck)\b/.test(t))
    return "Glow isn't linear. Your softness today is part of it.";
  if (/\b(better|lighter|clear|bright|calm|good|ease|steady)\b/.test(t))
    return "That shift you feel? It's compounding.";
  return "Noted. Your reset is taking shape.";
}

export const GROCERY = [
  { group: "Reds & Berries", items: ["Pomegranate", "Raspberries", "Strawberries", "Tart cherries", "Watermelon", "Plums", "Black figs", "Beets"] },
  { group: "Greens",         items: ["Lemons", "Mint", "Ginger", "Lime"] },
  { group: "Pantry",         items: ["Oat milk", "Almond milk", "Chia seeds", "Cacao", "Almond butter", "Hibiscus tea", "Honey", "Cinnamon"] },
  { group: "NOURÉ",          items: ["Radiant Reds Superfood"] },
];

export const REDS_URL = "https://nourewellness.com/products/reds-superfood";
