export const REDS_URL = "https://nourewellness.com/products/reds-superfood";
/** Radiant Reds Supplement Facts panel: 1 scoop (4 g), 30 servings per container (canonical label record, 2026-08-19; live listing: one scoop once daily). At one scoop a morning the 21 Reset days use 21 servings, leaving 9. */
export const REDS_SERVINGS_PER_BAG = 30;

export type Phase = { week: 1 | 2 | 3; label: string; range: [number, number] };
export const PHASES: Phase[] = [
  { week: 1, label: "Foundation", range: [1, 7] },
  { week: 2, label: "Build", range: [8, 14] },
  { week: 3, label: "Glow", range: [15, 21] },
];

export function phaseFor(day: number): Phase {
  return PHASES.find((p) => day >= p.range[0] && day <= p.range[1])!;
}

export type Day = { day: number; title: string; teaser: string; guide: string; recipeId: string };

export const DAYS: Day[] = [
  {
    day: 1,
    title: "The First Glass",
    recipeId: "pomegranate-elixir",
    teaser: "Today the ritual begins. One glass. One quiet morning.",
    guide:
      "Today is about beginning. Not perfectly — just beginning. Pour your warm water with lemon, then prepare your Radiant Reds. Drink slowly. Notice the color. That deep red comes from polyphenols like ellagic acid, anthocyanins and punicalagins, the pigments of pomegranate and red fruit. Let the first glass be enough. Today's only job: show up.",
  },
  {
    day: 2,
    title: "Stillness Before Speed",
    recipeId: "berry-bloom",
    teaser: "Five quiet minutes before the day asks anything of you.",
    guide:
      "Before you check your phone, sit for five minutes with your glass. This isn't meditation — it's permission. Let the morning start at your pace, not your inbox's. Notice the color, the cold of the glass, the quiet. Today, drink slow. Breathe slower.",
  },
  {
    day: 3,
    title: "The Polyphenol Window",
    recipeId: "cherry-cacao",
    teaser: "Why this ritual belongs to the morning.",
    guide:
      "Mornings are the easiest time to keep a ritual: before the day fills up, before anyone needs you. Today, layer in tart cherry, one of the most anthocyanin-rich fruits you can buy, deep red and sour-sweet.",
  },
  {
    day: 4,
    title: "Listening Inward",
    recipeId: "plum-rose",
    teaser: "Four mornings in. Today you check in.",
    guide:
      "Four mornings in, the ritual is starting to feel familiar. Notice what you enjoy about it: the flavor, the quiet, the small act of making something for yourself. Today's ritual: drink, then write one sentence about how your mornings feel.",
  },
  {
    day: 5,
    title: "The Skin-Gut Bridge",
    recipeId: "watermelon-reds",
    teaser: "Color in the glass, care in the morning.",
    guide:
      "Beauty from within starts with what goes into the glass: color, fiber, water and variety. This week you're building that habit one morning at a time. Today's recipe is hydration-forward: watermelon and hibiscus, bright, cold and ruby red.",
  },
  {
    day: 6,
    title: "The Quiet Build",
    recipeId: "fig-almond",
    teaser: "Day 6. Nothing dramatic. Everything compounding.",
    guide:
      "Six mornings of polyphenols, fiber, and stillness. Nothing dramatic, just a habit taking shape. Today, add fig: soft, jammy and naturally rich in fiber, a quiet addition to a glass you already know.",
  },
  {
    day: 7,
    title: "One Full Week",
    recipeId: "beet-glow",
    teaser: "One week. Foundation complete.",
    guide:
      "You've built the foundation. Seven mornings of ritual is no longer a beginning — it's a pattern. Today's recipe brings beet, an earthy root rich in natural nitrates and the betalain pigments behind its jewel color. Drink it slowly. Then notice how this first week has felt, without judgement. Week two starts tomorrow.",
  },
  {
    day: 8,
    title: "Build Begins",
    recipeId: "pomegranate-elixir",
    teaser: "Week 2. Now we deepen.",
    guide:
      "Foundation is built. Now we layer. This week the ritual starts to feel less like a task and more like a morning. Today, return to the pomegranate elixir — but this time, taste it differently. The same glass becomes the same ritual every morning, but you are not the same person who drank it on day one.",
  },
  {
    day: 9,
    title: "The Ferment Layer",
    recipeId: "berry-bloom",
    teaser: "Add a small fermented food today.",
    guide:
      "Today, alongside your reds, eat a small fermented food — yogurt, kefir, kimchi, sauerkraut. Fermented foods and colorful plants make a natural pairing, and a small spoonful is an easy way to bring more variety into your morning.",
  },
  {
    day: 10,
    title: "Day 10 — Ten Mornings",
    recipeId: "cherry-cacao",
    teaser: "Ten mornings in. The ritual is becoming yours.",
    guide:
      "Ten mornings is no longer 'trying it.' Ten mornings is a practice. Today, drink your reds, then notice: what feels different from day one? Not in the mirror — inside.",
  },
  {
    day: 11,
    title: "A Quiet Photo",
    recipeId: "plum-rose",
    teaser: "A quiet photo, just for you.",
    guide:
      "Eleven mornings. Today's ritual: drink, then take a quiet photo of yourself in natural light. Keep it just for you, a private marker of the mornings you've kept. There's nothing to judge.",
  },
  {
    day: 12,
    title: "Hydration Morning",
    recipeId: "watermelon-reds",
    teaser: "Today is about hydration.",
    guide:
      "Skin renews itself slowly, over weeks, so meet it with patience alongside the ritual. Today is about hydration: watermelon, hibiscus and lime, poured cold and sipped slowly.",
  },
  {
    day: 13,
    title: "Almost Halfway Through Build",
    recipeId: "fig-almond",
    teaser: "Tomorrow is the halfway mark.",
    guide:
      "Tomorrow is day 14 — the halfway point. Today, take inventory. What three things feel different? Write them in your journal. Then drink your reds slowly. The ritual rewards attention.",
  },
  {
    day: 14,
    title: "Halfway",
    recipeId: "beet-glow",
    teaser: "Halfway. The ritual is yours now.",
    guide:
      "Fourteen mornings. The ritual is no longer something you're doing. It's something you have. Week three is where it becomes second nature. Today, beet again, earthy and bright. Then sit with the feeling of having shown up fourteen times in a row.",
  },
  {
    day: 15,
    title: "Week 3 — Glow Begins",
    recipeId: "pomegranate-elixir",
    teaser: "Week three begins. The ritual feels like yours.",
    guide:
      "Week three. Fifteen mornings of color, fiber and a few quiet minutes that belong to you. Today, return to pomegranate. The first recipe. Notice how different it tastes when you've been drinking it for fifteen mornings.",
  },
  {
    day: 16,
    title: "Looking Back",
    recipeId: "berry-bloom",
    teaser: "Look back at the mornings you've kept.",
    guide:
      "If you took a photo on day 11, look back at it today. Don't go searching for anything. Just remember that morning, and count how many you've kept since. That consistency belongs to you.",
  },
  {
    day: 17,
    title: "Four Days Left",
    recipeId: "cherry-cacao",
    teaser: "Don't stop here.",
    guide:
      "Four mornings remain. This is the stretch where it's easiest to drift. Don't. Days 17–21 are where the ritual locks in for the long term. Today: tart cherry, full ritual, full attention.",
  },
  {
    day: 18,
    title: "Compounding",
    recipeId: "plum-rose",
    teaser: "Eighteen mornings, and counting.",
    guide:
      "One glass is a moment. Eighteen is a practice. This is why 21 days. This is why ritual. Today, plum and rose, and a slow morning.",
  },
  {
    day: 19,
    title: "Two Mornings After This",
    recipeId: "watermelon-reds",
    teaser: "Two more mornings after today.",
    guide:
      "Three mornings left including today. This week, start to think about what happens on day 22. The ritual that has worked for 21 days is the ritual that works for 121 days. Don't change it just because the count ends.",
  },
  {
    day: 20,
    title: "Day 20 — Almost",
    recipeId: "fig-almond",
    teaser: "Tomorrow is Day 21. You made it.",
    guide:
      "Tomorrow is the final morning. Today, drink your reds, eat your fig, and write a long journal entry. Tomorrow's entry will be a letter — today's is the setup.",
  },
  {
    day: 21,
    title: "Day 21 — The Ritual Holds",
    recipeId: "beet-glow",
    teaser: "This is Day 21. You showed up.",
    guide:
      "Twenty-one mornings. You showed up for a ritual most people won't. Drink the final glass slowly. Then open your celebration screen. The ritual doesn't end here — it just stops being a 21-day reset and starts being your morning.",
  },
];

export type Recipe = {
  id: string;
  name: string;
  gradient: string;
  prep: string;
  servings: string;
  benefit: string;
  benefitTag: string;
  ingredients: string[];
  method: string[];
  redsBoost: { why: string; proof: string[] };
  bonus?: boolean;
  /** Quick Glow Mornings — bonus five-minute smoothies outside the 21-day rotation */
  quick?: boolean;
  /** Optional override path for smoothie photo. Defaults to /images/smoothies/${id}.jpg */
  image?: string;
};

// Elegant, feminine, light gradients — NO red. Plum, gold, sand, sage, lavender, dusty rose, cream.
const G = {
  plumGold: "linear-gradient(135deg, #7B2D4E 0%, #C49A6C 100%)",
  goldSand: "linear-gradient(135deg, #C49A6C 0%, #F1EAE2 100%)",
  plumLavender: "linear-gradient(135deg, #7B2D4E 0%, #B8A9C9 100%)",
  sageIvory: "linear-gradient(135deg, #A8B5A0 0%, #FAF7F4 100%)",
  roseSand: "linear-gradient(135deg, #D9B8B0 0%, #F1EAE2 100%)",
  creamGold: "linear-gradient(135deg, #F4E9D8 0%, #C49A6C 100%)",
  plumSage: "linear-gradient(135deg, #7B2D4E 0%, #A8B5A0 100%)",
  goldRose: "linear-gradient(135deg, #C49A6C 0%, #D9B8B0 100%)",
  plumDeep: "linear-gradient(135deg, #5C2541 0%, #7B2D4E 100%)",
  lavenderIvory: "linear-gradient(135deg, #B8A9C9 0%, #FAF7F4 100%)",
  sandPlum: "linear-gradient(135deg, #F1EAE2 0%, #7B2D4E 100%)",
  goldLavender: "linear-gradient(135deg, #C49A6C 0%, #B8A9C9 100%)",
  sageGold: "linear-gradient(135deg, #A8B5A0 0%, #C49A6C 100%)",
  roseGold: "linear-gradient(135deg, #D9B8B0 0%, #C49A6C 100%)",
};

const REDS_PROOF = {
  skin: [
    "Pomegranate brings punicalagins",
    "Hibiscus brings deep-red anthocyanins",
    "Açaí adds dark-berry flavonoids",
    "Beetroot adds its jewel-toned betalains",
  ],
  glow: [
    "Red fruits, roots and botanicals",
    "With inulin and oat fiber",
    "Made for a daily morning ritual",
    "One scoop, stirred in seconds",
  ],
  energy: [
    "Beetroot, naturally rich in nitrates",
    "A bright, colorful start",
    "Pairs with whole-food breakfast",
    "An easy anchor for your morning",
  ],
  gut: [
    "With inulin, a prebiotic fiber",
    "Plus nine probiotic cultures",
    "Polyphenol-rich red fruits and roots",
    "Made for fiber-rich recipes",
  ],
  hydration: [
    "Hibiscus and beetroot, red by nature",
    "Mixes into cold water in seconds",
    "Pairs perfectly with morning water",
    "A bright glass to start the day",
  ],
  recovery: [
    "A deep-red polyphenol blend",
    "Pairs with tart cherry and cacao",
    "Gentle enough for slow evenings",
    "Made for a ritual you keep",
  ],
};

export const RECIPES: Recipe[] = [
  // ——— 21 CORE RECIPES ———
  {
    id: "pomegranate-elixir",
    name: "The Pomegranate Glow Elixir",
    gradient: G.plumGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Deep red",
    benefit:
      "Pomegranate and raspberry bring ellagic acid and punicalagins, the polyphenols behind their deep ruby color. Bright, tart and silky.",
    ingredients: ["Pomegranate", "Raspberry", "Oat milk", "Radiant Reds", "Lime"],
    method: [
      "Add 1 cup pomegranate seeds and ½ cup raspberries to a blender.",
      "Pour in 1 cup oat milk and one scoop Radiant Reds.",
      "Squeeze in half a lime. Blend until silky.",
      "Pour into a chilled glass. Drink slowly.",
    ],
    redsBoost: {
      why: "Radiant Reds layers a second wave of pomegranate and beet polyphenols on top of the fresh fruit, deepening the color of every sip.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "berry-bloom",
    name: "Berry Bloom",
    gradient: G.plumLavender,
    prep: "3 min",
    servings: "1",
    benefitTag: "Antioxidant",
    benefit:
      "Anthocyanin-rich blueberries and strawberries, softened with chia, for a bright start to grey mornings.",
    ingredients: ["Blueberry", "Strawberry", "Banana", "Almond milk", "Chia"],
    method: [
      "Combine 1 cup mixed berries with half a banana.",
      "Add 1 cup almond milk and 1 tbsp chia.",
      "Blend 30 seconds. Let sit 2 minutes for chia to bloom.",
      "Stir and serve.",
    ],
    redsBoost: {
      why: "Add a scoop of Radiant Reds to fold in red fruits, roots and botanicals your berries can't bring alone.",
      proof: REDS_PROOF.glow,
    },
  },
  {
    id: "cherry-cacao",
    name: "Cherry Cacao",
    gradient: G.plumDeep,
    prep: "4 min",
    servings: "1",
    benefitTag: "Rich & dark",
    benefit:
      "Tart cherry brings deep anthocyanin color; cacao adds rich, dark flavanols and a velvety finish.",
    ingredients: ["Tart cherry", "Cacao", "Almond butter", "Oat milk", "Cinnamon"],
    method: [
      "Blend 1 cup tart cherries with 1 tbsp cacao.",
      "Add 1 tbsp almond butter and 1 cup oat milk.",
      "Pinch of cinnamon. Blend until smooth.",
    ],
    redsBoost: {
      why: "Radiant Reds adds hibiscus and açaí to the cherry and cacao, for a darker, richer glass.",
      proof: REDS_PROOF.recovery,
    },
  },
  {
    id: "plum-rose",
    name: "Plum & Rose",
    gradient: G.roseSand,
    prep: "5 min",
    servings: "1",
    benefitTag: "Soothing",
    benefit: "Plum polyphenols paired with rose water for a soft, fragrant ritual.",
    ingredients: ["Plum", "Rose water", "Coconut yogurt", "Honey"],
    method: [
      "Pit and slice 2 ripe plums.",
      "Blend with ½ cup coconut yogurt and 1 tsp rose water.",
      "Sweeten with a touch of honey.",
    ],
    redsBoost: {
      why: "A small scoop of Radiant Reds turns this gentle bowl into a full polyphenol ritual without changing its softness.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "watermelon-reds",
    name: "Watermelon Hibiscus",
    gradient: G.goldRose,
    prep: "3 min",
    servings: "1",
    benefitTag: "Hydration",
    benefit: "Hydration-forward with tart hibiscus, and Radiant Reds for the polyphenol layer.",
    ingredients: ["Watermelon", "Hibiscus tea", "Lime", "Radiant Reds"],
    method: [
      "Brew 1 cup hibiscus tea, cool fully.",
      "Blend with 2 cups watermelon, lime juice.",
      "Stir in one scoop Radiant Reds.",
    ],
    redsBoost: {
      why: "Radiant Reds is what makes this glass more than juice — adding the polyphenol density watermelon alone can't deliver.",
      proof: REDS_PROOF.hydration,
    },
  },
  {
    id: "fig-almond",
    name: "Fig & Almond",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Gut",
    benefit:
      "Black fig for fiber and jammy sweetness, almond for healthy fats and a creamy finish.",
    ingredients: ["Black fig", "Almond", "Oat milk", "Cinnamon"],
    method: [
      "Blend 3 black figs with a small handful of almonds.",
      "Add 1 cup oat milk and a pinch of cinnamon.",
      "Blend until creamy.",
    ],
    redsBoost: {
      why: "Radiant Reds layers polyphenols and inulin on top of fig fiber, a pairing made for fiber-rich mornings.",
      proof: REDS_PROOF.gut,
    },
  },
  {
    id: "beet-glow",
    name: "Beet Glow",
    gradient: G.plumGold,
    prep: "6 min",
    servings: "1",
    benefitTag: "Earthy",
    benefit:
      "Beet for earthy sweetness and natural nitrates, raspberry for ellagitannins, ginger for warmth.",
    ingredients: ["Beet", "Raspberry", "Ginger", "Orange"],
    method: [
      "Roast or steam 1 small beet ahead of time.",
      "Blend with ½ cup raspberries, a thumb of ginger, and the juice of 1 orange.",
      "Strain if you want it silky.",
    ],
    redsBoost: {
      why: "Radiant Reds adds more beetroot and hibiscus, turning the glass a deeper jewel red.",
      proof: REDS_PROOF.energy,
    },
  },
  {
    id: "golden-turmeric",
    name: "Golden Turmeric Latte",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Calm",
    benefit:
      "Curcumin with healthy fat and black pepper, the classic golden cup for a slow morning.",
    ingredients: ["Turmeric", "Oat milk", "Cinnamon", "Honey", "Almond"],
    method: [
      "Warm 1 cup oat milk gently.",
      "Whisk in ½ tsp turmeric, pinch of cinnamon, pinch of black pepper.",
      "Sweeten with honey. Top with crushed almond.",
    ],
    redsBoost: {
      why: "A scoop of Radiant Reds stirred into the cooled latte adds polyphenols turmeric can't deliver alone.",
      proof: REDS_PROOF.gut,
    },
  },
  {
    id: "matcha-cloud",
    name: "Matcha Cloud",
    gradient: G.sageIvory,
    prep: "4 min",
    servings: "1",
    benefitTag: "EGCG",
    benefit:
      "Ceremonial matcha for EGCG, the signature polyphenol of green tea, whisked soft and pale.",
    ingredients: ["Green tea", "Almond milk", "Honey", "Banana"],
    method: [
      "Whisk 1 tsp matcha with 2 tbsp warm water until smooth.",
      "Blend with ½ banana, ¾ cup almond milk, drizzle of honey.",
      "Pour over ice.",
    ],
    redsBoost: {
      why: "Radiant Reds pairs EGCG with anthocyanins, two polyphenol families from very different plants.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "lavender-honey",
    name: "Lavender Honey Tonic",
    gradient: G.lavenderIvory,
    prep: "3 min",
    servings: "1",
    benefitTag: "Calm",
    benefit: "Culinary lavender steeped with raw honey. Floral, gentle and made for a quiet start.",
    ingredients: ["Rose water", "Honey", "Lemon", "Mint"],
    method: [
      "Steep 1 tsp culinary lavender in 1 cup hot water for 4 minutes.",
      "Strain. Stir in honey and a squeeze of lemon.",
      "Garnish with mint.",
    ],
    redsBoost: {
      why: "After it cools, stir in a scoop of Radiant Reds — calm becomes a full polyphenol ritual.",
      proof: REDS_PROOF.recovery,
    },
  },
  {
    id: "rose-cardamom",
    name: "Rose Cardamom Mylk",
    gradient: G.roseSand,
    prep: "5 min",
    servings: "1",
    benefitTag: "Soothing",
    benefit: "Cardamom and rose with creamy oat milk. Feminine, warming, fragrant.",
    ingredients: ["Oat milk", "Rose water", "Cinnamon", "Honey"],
    method: [
      "Warm 1 cup oat milk with a pinch of crushed cardamom and cinnamon.",
      "Off heat, stir in 1 tsp rose water and honey.",
      "Sip slowly.",
    ],
    redsBoost: {
      why: "Radiant Reds folds in beautifully once the mylk cools to drinking temperature, adding the polyphenol layer.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "blueberry-basil",
    name: "Blueberry Basil",
    gradient: G.plumLavender,
    prep: "4 min",
    servings: "1",
    benefitTag: "Antioxidant",
    benefit: "Wild blueberries with fresh basil — anthocyanins meet aromatic polyphenols.",
    ingredients: ["Blueberry", "Banana", "Almond milk", "Mint", "Lemon"],
    method: [
      "Blend 1 cup wild blueberries, ½ banana, 4 basil leaves.",
      "Add 1 cup almond milk and lemon zest.",
      "Blend until smooth.",
    ],
    redsBoost: {
      why: "A scoop of Radiant Reds deepens the anthocyanins with more dark berries and hibiscus.",
      proof: REDS_PROOF.glow,
    },
  },
  {
    id: "papaya-lime",
    name: "Papaya Lime",
    gradient: G.goldRose,
    prep: "3 min",
    servings: "1",
    benefitTag: "Digestive",
    benefit: "Ripe papaya and bright citrus for a light, tropical morning.",
    ingredients: ["Watermelon", "Lime", "Mint", "Coconut yogurt"],
    method: [
      "Blend 1½ cups papaya with the juice of 1 lime.",
      "Stir in 2 tbsp coconut yogurt and torn mint.",
      "Serve cold.",
    ],
    redsBoost: {
      why: "Radiant Reds adds the polyphenol density papaya is missing — turning a digestive glass into a full-spectrum ritual.",
      proof: REDS_PROOF.gut,
    },
  },
  {
    id: "peach-saffron",
    name: "Peach & Saffron",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Mood",
    benefit: "A pinch of saffron with ripe stone fruit. Golden, floral and quietly luxurious.",
    ingredients: ["Plum", "Honey", "Almond milk", "Cinnamon"],
    method: [
      "Steep a small pinch of saffron in 2 tbsp warm almond milk.",
      "Blend with 1 ripe peach, ½ cup almond milk, honey.",
      "Top with cinnamon.",
    ],
    redsBoost: {
      why: "Radiant Reds layers anthocyanins and ellagitannins — supporting the steady tone saffron is famous for.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "fig-vanilla",
    name: "Fig & Vanilla Cream",
    gradient: G.creamGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Gut",
    benefit: "Black mission figs blended with vanilla and oat milk — silky, prebiotic, skin-kind.",
    ingredients: ["Black fig", "Oat milk", "Honey", "Cinnamon", "Almond"],
    method: [
      "Blend 4 figs with 1 cup oat milk.",
      "Add ¼ tsp vanilla and a drizzle of honey.",
      "Top with crushed almond.",
    ],
    redsBoost: {
      why: "Radiant Reds adds polyphenols and inulin to the fig's own fiber, for a silkier, deeper glass.",
      proof: REDS_PROOF.gut,
    },
  },
  {
    id: "cucumber-mint",
    name: "Cucumber Mint Cooler",
    gradient: G.sageIvory,
    prep: "3 min",
    servings: "1",
    benefitTag: "Hydration",
    benefit: "Pure hydration with mineral-rich cucumber and cooling mint.",
    ingredients: ["Watermelon", "Lime", "Mint", "Hibiscus tea"],
    method: [
      "Blend 1 cucumber with the juice of ½ lime and a small handful of mint.",
      "Strain over ice.",
      "Top with sparkling water.",
    ],
    redsBoost: {
      why: "Stir in a scoop of Radiant Reds — the only thing this glass is missing is polyphenols.",
      proof: REDS_PROOF.hydration,
    },
  },
  {
    id: "apricot-almond",
    name: "Apricot Almond Glow",
    gradient: G.goldSand,
    prep: "4 min",
    servings: "1",
    benefitTag: "Skin",
    benefit: "Apricots are quietly carotenoid-rich, blended soft and golden with almond.",
    ingredients: ["Plum", "Almond", "Oat milk", "Honey"],
    method: [
      "Blend 3 ripe apricots with a small handful of almonds.",
      "Add ¾ cup oat milk and honey.",
      "Blend until silky.",
    ],
    redsBoost: {
      why: "Radiant Reds pairs carotenoids with anthocyanins — the two pigment families your glow is built on.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "kiwi-spinach",
    name: "Kiwi Spinach Light",
    gradient: G.sageGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Vitamin C",
    benefit: "Kiwi for vitamin C, baby spinach for chlorophyll. Fresh, tart and bright green.",
    ingredients: ["Lime", "Banana", "Almond milk", "Mint"],
    method: [
      "Blend 2 kiwis with a handful of baby spinach.",
      "Add ½ banana, 1 cup almond milk.",
      "Squeeze in lime.",
    ],
    redsBoost: {
      why: "Radiant Reds completes the picture — chlorophyll plus polyphenols cover the full plant-pigment spectrum.",
      proof: REDS_PROOF.glow,
    },
  },
  {
    id: "vanilla-chia",
    name: "Vanilla Chia Pudding",
    gradient: G.creamGold,
    prep: "5 min + chill",
    servings: "1",
    benefitTag: "Omega-3",
    benefit:
      "Plant omega-3, slow-release fiber, soft vanilla cream. A gentle breakfast you make the night before.",
    ingredients: ["Chia", "Oat milk", "Honey", "Cinnamon", "Almond"],
    method: [
      "Stir 3 tbsp chia into 1 cup oat milk with vanilla and honey.",
      "Refrigerate overnight.",
      "Top with crushed almond and cinnamon.",
    ],
    redsBoost: {
      why: "Sprinkle a scoop of Radiant Reds on top: omega-3 and polyphenols in one crimson-dusted bowl.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "ginger-pear",
    name: "Ginger Pear Warmth",
    gradient: G.goldSand,
    prep: "4 min",
    servings: "1",
    benefitTag: "Digestive",
    benefit: "Pear and warming ginger, gently spiced, with quiet polyphenol depth.",
    ingredients: ["Ginger", "Orange", "Honey", "Cinnamon"],
    method: [
      "Blend 1 ripe pear with a thumb of ginger and the juice of ½ orange.",
      "Sweeten with honey, dust with cinnamon.",
      "Serve over ice or warm.",
    ],
    redsBoost: {
      why: "Radiant Reds turns digestive comfort into a polyphenol ritual — the same glass, twice the work.",
      proof: REDS_PROOF.gut,
    },
  },
  {
    id: "honey-almond",
    name: "Honey Almond Tonic",
    gradient: G.creamGold,
    prep: "3 min",
    servings: "1",
    benefitTag: "Energy",
    benefit: "Raw honey, almond and oat milk. A warm, nutty, grounding cup.",
    ingredients: ["Almond", "Oat milk", "Honey", "Cinnamon"],
    method: [
      "Blend 1 tbsp almond butter with 1 cup oat milk.",
      "Add 1 tsp raw honey and a dash of cinnamon.",
      "Serve warm or cold.",
    ],
    redsBoost: {
      why: "Stir in Radiant Reds for a deep-red polyphenol layer in a warm, nutty cup.",
      proof: REDS_PROOF.energy,
    },
  },

  // ——— 5 BONUS RECIPES (live in Bonuses tab) ———
  {
    id: "bonus-cacao-tonic",
    name: "Midnight Cacao Tonic",
    gradient: G.plumDeep,
    bonus: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Bonus · Wind-down",
    benefit:
      "An evening polyphenol ritual: cacao flavanols and warm spice for a slow, cozy wind-down.",
    ingredients: ["Cacao", "Oat milk", "Cinnamon", "Honey"],
    method: [
      "Warm 1 cup oat milk gently.",
      "Whisk in 1 tbsp cacao, pinch of cinnamon, drizzle of honey.",
      "Sip an hour before bed.",
    ],
    redsBoost: {
      why: "A small scoop of Radiant Reds in the evening adds a deep-red polyphenol layer to your wind-down.",
      proof: REDS_PROOF.recovery,
    },
  },
  {
    id: "bonus-rose-collagen",
    name: "Rose Strawberry Float",
    gradient: G.roseSand,
    bonus: true,
    prep: "3 min",
    servings: "1",
    benefitTag: "Bonus · Sparkling",
    benefit: "A delicate sparkling sip: strawberry, lime, rose and gold-flecked elegance.",
    ingredients: ["Rose water", "Lime", "Honey", "Strawberry"],
    method: [
      "Muddle 4 strawberries with lime juice.",
      "Top with sparkling water and 1 tsp rose water.",
      "Drizzle honey, stir gently.",
    ],
    redsBoost: {
      why: "Radiant Reds pairs its polyphenols with the vitamin C in strawberry and lime.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "bonus-green-glow",
    name: "The Green Glow",
    gradient: G.sageGold,
    bonus: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Bonus · Refresh",
    benefit: "Cucumber, mint, kiwi, lime — a chlorophyll-forward midday reset.",
    ingredients: ["Lime", "Mint", "Banana", "Almond milk"],
    method: [
      "Blend 1 cucumber, 2 kiwis, handful of mint.",
      "Add ½ banana and ½ cup almond milk.",
      "Squeeze in lime.",
    ],
    redsBoost: {
      why: "Radiant Reds rounds out the green pigments with red-pigment polyphenols.",
      proof: REDS_PROOF.glow,
    },
  },
  {
    id: "bonus-warm-elixir",
    name: "Warm Berry Elixir",
    gradient: G.plumGold,
    bonus: true,
    prep: "6 min",
    servings: "1",
    benefitTag: "Bonus · Comfort",
    benefit: "A warm winter-morning polyphenol cup for when cold smoothies feel too sharp.",
    ingredients: ["Blueberry", "Hibiscus tea", "Honey", "Cinnamon", "Ginger"],
    method: [
      "Steep hibiscus tea with a thumb of ginger for 6 minutes.",
      "Stir in muddled blueberries, honey, cinnamon.",
      "Strain and sip.",
    ],
    redsBoost: {
      why: "Once it cools to drinking temperature, stir in Radiant Reds — heat-sensitive polyphenols stay intact.",
      proof: REDS_PROOF.skin,
    },
  },
  {
    id: "bonus-glow-sorbet",
    name: "Glow Sorbet Bowl",
    gradient: G.lavenderIvory,
    bonus: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Bonus · Treat",
    benefit:
      "A frozen ritual — banana, berry, almond cream — the dessert that loves your skin back.",
    ingredients: ["Blueberry", "Banana", "Almond", "Coconut yogurt", "Honey"],
    method: [
      "Blend 1 frozen banana with ½ cup frozen blueberries.",
      "Add 2 tbsp coconut yogurt and 1 tbsp almond butter.",
      "Scoop into a chilled bowl, drizzle honey.",
    ],
    redsBoost: {
      why: "Sprinkle Radiant Reds on top — sorbet becomes a polyphenol ritual without losing the indulgence.",
      proof: REDS_PROOF.glow,
    },
  },

  // ——— QUICK GLOW MORNINGS — 7 bonus five-minute smoothies (outside the 21-day rotation) ———
  {
    id: "berry-reds-yogurt-shake",
    name: "Berry Reds Yogurt Shake",
    gradient: G.plumGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Steady",
    benefit: "Creamy, antioxidant-rich, and quietly filling.",
    ingredients: [
      "1 cup frozen mixed berries",
      "1/2 cup Greek yogurt or kefir",
      "3/4 cup almond milk",
      "1 tsp chia seeds",
      "1/2 banana (optional)",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add almond milk, yogurt, berries, chia, and banana to the blender.",
      "Blend until smooth, about 30 seconds.",
      "Add your Glow Boost and pulse twice to keep the color bright.",
      "Pour and sip slowly.",
      "Texture — thick and spoonable; add a splash more almond milk to drink it.",
      "Swap — no kefir? Plain Greek yogurt works. Dairy-free: coconut yogurt + oat milk.",
    ],
    redsBoost: {
      why: "Folded into a berry-and-yogurt base, a scoop of Radiant Reds layers in concentrated polyphenols from red superfruits.",
      proof: [
        "Polyphenol-rich pomegranate, açaí, and beetroot",
        "A deep-red finish for a creamy glass",
      ],
    },
  },
  {
    id: "pomegranate-vanilla-glow",
    name: "Pomegranate Vanilla Glow",
    gradient: G.creamGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Radiant",
    benefit: "Bright, polyphenol-rich, and a little luxurious.",
    ingredients: [
      "1/2 cup pomegranate juice",
      "1 cup frozen strawberries",
      "1/2 cup Greek yogurt",
      "1/4 tsp vanilla extract",
      "1/2 cup ice",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Pour pomegranate juice into the blender first.",
      "Add strawberries, yogurt, vanilla, and ice.",
      "Blend until silky.",
      "Stir in your Glow Boost at the end.",
      "Texture — light and pourable, almost like a drinkable sorbet.",
      "Swap — use frozen cherries for a deeper, less sweet flavor.",
    ],
    redsBoost: {
      why: "Pomegranate is already one of the most polyphenol-rich fruits — the Glow Boost concentrates that even further.",
      proof: ["Concentrated red-fruit polyphenols", "A brighter, deeper pink in the glass"],
    },
  },
  {
    id: "cucumber-mint-lightness",
    name: "Cucumber Mint Lightness Smoothie",
    gradient: G.sageIvory,
    quick: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Refreshed",
    benefit: "Crisp, cooling, and feather-light.",
    ingredients: [
      "1/2 cucumber, roughly chopped",
      "1 cup frozen pineapple",
      "Juice of 1/2 lime",
      "4–5 fresh mint leaves",
      "3/4 cup coconut water",
      "1 tsp chia seeds",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add coconut water, cucumber, and pineapple to the blender.",
      "Add lime, mint, and chia.",
      "Blend until smooth and pale green.",
      "Finish with your Glow Boost and a quick pulse.",
      "Texture — thin and refreshing; best served over ice.",
      "Swap — no fresh mint? A drop of mint extract works. Honeydew can stand in for cucumber.",
    ],
    redsBoost: {
      why: "A scoop of Radiant Reds adds antioxidant depth to an otherwise light, hydrating blend.",
      proof: ["Polyphenols from red superfruits", "Color and depth without heaviness"],
    },
  },
  {
    id: "cherry-cacao-calm-glow",
    name: "Cherry Cacao Calm Glow",
    gradient: G.plumDeep,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Calm",
    benefit: "Rich, chocolatey, and grounding.",
    ingredients: [
      "1 cup frozen cherries",
      "1 tbsp cacao powder",
      "1/2 banana",
      "1/2 cup Greek yogurt",
      "3/4 cup almond milk",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add almond milk, cherries, banana, and yogurt to the blender.",
      "Add cacao and blend until smooth.",
      "Stir in your Glow Boost at the end.",
      "Texture — velvety and dessert-like; add ice for a thicker, colder finish.",
      "Swap — frozen blueberries can replace cherries. Oat milk for a creamier dairy-free version.",
    ],
    redsBoost: {
      why: "Cherries and cacao bring their own polyphenols; the Glow Boost rounds out the antioxidant profile.",
      proof: ["Polyphenol-rich red superfruits", "Rounds out the cherry and cacao"],
    },
  },
  {
    id: "peach-ginger-gut-glow",
    name: "Peach Ginger Gut-Glow",
    gradient: G.goldSand,
    quick: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Balanced",
    benefit: "Warm-spiced, golden, and gentle.",
    ingredients: [
      "1 cup frozen peaches",
      "1/2 inch fresh ginger (or 1/4 tsp ground)",
      "1 tbsp ground flax or chia seeds",
      "1/2 cup Greek yogurt or kefir",
      "3/4 cup coconut water",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add coconut water, peaches, and ginger to the blender.",
      "Add flax or chia and yogurt.",
      "Blend until smooth and golden.",
      "Finish with your Glow Boost.",
      "Texture — smooth with a little body from the flax; thin with extra coconut water if needed.",
      "Swap — frozen mango works in place of peaches. Skip the ginger if you prefer it mellow.",
    ],
    redsBoost: {
      why: "A scoop of Radiant Reds adds concentrated red-fruit polyphenols to this gentle, golden blend.",
      proof: ["Polyphenols from pomegranate and beetroot", "A crimson layer in a golden glass"],
    },
  },
  {
    id: "mocha-reds-morning",
    name: "Mocha Reds Morning Smoothie",
    gradient: G.sandPlum,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Energized",
    benefit: "Coffee and breakfast in one glass.",
    ingredients: [
      "1/2 cup cold brew or chilled coffee",
      "1 tbsp cacao powder",
      "1 scoop vanilla protein or 1/2 cup Greek yogurt",
      "1 frozen banana",
      "1/2 cup almond milk",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add coffee, almond milk, banana, and protein or yogurt to the blender.",
      "Add cacao and blend until smooth.",
      "Stir in your Glow Boost at the end.",
      "Texture — creamy and frothy; add a few ice cubes if you like it colder.",
      "Swap — decaf or half-caf works just as well. Oat milk for extra creaminess.",
    ],
    redsBoost: {
      why: "Folded into coffee and cacao, the Glow Boost adds polyphenols alongside your morning caffeine.",
      proof: ["Concentrated red-superfruit polyphenols", "A red-fruit layer beside your coffee"],
    },
  },
  {
    id: "tropical-reds-quickie",
    name: "Tropical Reds Quickie",
    gradient: G.sageGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Light",
    benefit: "Bright, sunny, and effortless.",
    ingredients: [
      "1 cup frozen mango",
      "1/2 cup frozen papaya (or extra mango)",
      "Juice of 1/2 lime",
      "3/4 cup coconut water",
      "1 tsp chia seeds",
      "1 scoop Radiant Reds (Glow Boost)",
    ],
    method: [
      "Add coconut water, mango, and papaya to the blender.",
      "Add lime and chia.",
      "Blend until smooth and golden-orange.",
      "Finish with your Glow Boost and a quick pulse.",
      "Texture — smooth and tropical; naturally sweet, no added sugar needed.",
      "Swap — pineapple can replace papaya. Add a handful of spinach for greens; the color stays bright.",
    ],
    redsBoost: {
      why: "A scoop of Radiant Reds brings red-fruit polyphenols to a bright tropical base.",
      proof: ["Polyphenol-rich red fruits and roots", "A ruby swirl through the mango"],
    },
  },
];

export type Ingredient = {
  name: string;
  tagline: string;
  description: string;
  gut: string;
  skin: string;
  alsoIn: string[];
};

export const INGREDIENTS: Ingredient[] = [
  {
    name: "Pomegranate",
    tagline: "Ellagic acid + punicalagins",
    description:
      "Deep-red arils rich in punicalagins and ellagic acid, two of the most researched fruit polyphenols.",
    gut: "Ellagitannins, vitamin C and fiber.",
    skin: "Tart, bright and jewel-red.",
    alsoIn: ["The Pomegranate Glow Elixir", "Radiant Reds blend"],
  },
  {
    name: "Raspberry",
    tagline: "Ellagitannins, vitamin C",
    description: "Tiny berries rich in ellagitannins, vitamin C and fiber.",
    gut: "Fiber and vitamin C.",
    skin: "Bright, tart and fragrant.",
    alsoIn: ["Berry Bloom", "Beet Glow"],
  },
  {
    name: "Strawberry",
    tagline: "Vitamin C, ellagic acid",
    description: "Gram for gram, about as much vitamin C as an orange, plus ellagic acid.",
    gut: "Vitamin C and ellagic acid.",
    skin: "Sweet, soft and pink.",
    alsoIn: ["Berry Bloom"],
  },
  {
    name: "Tart cherry",
    tagline: "Anthocyanins, deep color",
    description:
      "One of the most anthocyanin-rich fruits you can buy, with a deep, sour-sweet flavor.",
    gut: "Anthocyanins.",
    skin: "Dark, rich and sour-sweet.",
    alsoIn: ["Cherry Cacao"],
  },
  {
    name: "Blueberry",
    tagline: "Anthocyanins, vitamin K",
    description: "Classic for a reason. Blueberries owe their deep color to anthocyanins.",
    gut: "Anthocyanins, fiber and vitamin K.",
    skin: "Sweet and deep blue-purple.",
    alsoIn: ["Berry Bloom"],
  },
  {
    name: "Plum",
    tagline: "Chlorogenic acid, fiber",
    description:
      "Underrated polyphenol source. The chlorogenic acid is the same beneficial compound found in green coffee.",
    gut: "Chlorogenic acid and fiber.",
    skin: "Soft, juicy and gently tart.",
    alsoIn: ["Plum & Rose"],
  },
  {
    name: "Watermelon",
    tagline: "Lycopene, citrulline",
    description: "Mostly water, with lycopene, the carotenoid behind its rosy color.",
    gut: "Lycopene and citrulline.",
    skin: "Light, cold and refreshing.",
    alsoIn: ["Watermelon Reds"],
  },
  {
    name: "Black fig",
    tagline: "Soluble fiber, polyphenols",
    description: "A naturally fiber-rich fruit with soft, jammy sweetness.",
    gut: "Soluble fiber and polyphenols.",
    skin: "Caramel-sweet and creamy.",
    alsoIn: ["Fig & Almond"],
  },
  {
    name: "Beet",
    tagline: "Nitrates, betalains",
    description: "Naturally rich in nitrates and betalains, the pigments behind its deep color.",
    gut: "Supports a calm, well-fed gut environment.",
    skin: "Earthy, sweet and jewel-red.",
    alsoIn: ["Beet Glow"],
  },
  {
    name: "Hibiscus",
    tagline: "Anthocyanins, quercetin",
    description: "A vivid red tea rich in anthocyanins, with a long history of traditional use.",
    gut: "Anthocyanins and quercetin.",
    skin: "Tart, cranberry-like and ruby red.",
    alsoIn: ["Watermelon Reds"],
  },
  {
    name: "Cacao",
    tagline: "Flavanols, magnesium",
    description: "Rich in flavanols and magnesium, with a deep, dark flavor.",
    gut: "Flavanols, magnesium and fiber.",
    skin: "Dark, bittersweet and chocolatey.",
    alsoIn: ["Cherry Cacao"],
  },
  {
    name: "Almond",
    tagline: "Vitamin E, healthy fats",
    description: "A source of vitamin E and healthy fats, and the easiest way to add richness.",
    gut: "Vitamin E, healthy fats and fiber.",
    skin: "Nutty, creamy and filling.",
    alsoIn: ["Cherry Cacao", "Fig & Almond"],
  },
  {
    name: "Oat milk",
    tagline: "Beta-glucans",
    description: "A creamy, gentle base. Oats contain beta-glucans, a type of soluble fiber.",
    gut: "Soluble fiber.",
    skin: "Creamy and mild.",
    alsoIn: ["The Pomegranate Glow Elixir", "Cherry Cacao", "Fig & Almond"],
  },
  {
    name: "Almond milk",
    tagline: "Light base",
    description:
      "Low-sugar, gentle base. Pairs well with high-polyphenol fruits without competing.",
    gut: "Light and low in sugar.",
    skin: "Neutral and light.",
    alsoIn: ["Berry Bloom"],
  },
  {
    name: "Chia",
    tagline: "Omega-3, fiber",
    description: "Plant omega-3 (ALA) and soluble fiber that thickens as it sits.",
    gut: "ALA omega-3 and fiber.",
    skin: "Sets into a soft gel and adds body.",
    alsoIn: ["Berry Bloom"],
  },
  {
    name: "Cinnamon",
    tagline: "Polyphenols, warming spice",
    description: "A small pinch adds warmth and natural sweetness to the glass.",
    gut: "A warming spice.",
    skin: "Sweet-spicy and cozy.",
    alsoIn: ["Cherry Cacao", "Fig & Almond"],
  },
  {
    name: "Honey",
    tagline: "Trace polyphenols",
    description: "A small amount of raw honey adds gentle sweetness and trace antioxidants.",
    gut: "Gentle sweetness.",
    skin: "Floral and golden.",
    alsoIn: ["Plum & Rose"],
  },
  {
    name: "Rose water",
    tagline: "Calming aromatic",
    description: "Floral and aromatic. A traditional addition to feminine wellness rituals.",
    gut: "Aromatic rather than nutritional.",
    skin: "Floral and delicate.",
    alsoIn: ["Plum & Rose"],
  },
  {
    name: "Coconut yogurt",
    tagline: "Probiotics, fats",
    description:
      "Probiotic base with healthy medium-chain fats. Pairs beautifully with stone fruits.",
    gut: "Live cultures and healthy fats.",
    skin: "Tangy and creamy.",
    alsoIn: ["Plum & Rose"],
  },
  {
    name: "Lime",
    tagline: "Vitamin C, brightness",
    description: "Brightens flavor and adds vitamin C without the bulk of orange juice.",
    gut: "Vitamin C.",
    skin: "Bright and sharp.",
    alsoIn: ["The Pomegranate Glow Elixir", "Watermelon Reds"],
  },
  {
    name: "Orange",
    tagline: "Vitamin C, hesperidin",
    description: "Rich in vitamin C and hesperidin, a citrus flavonoid.",
    gut: "Vitamin C and hesperidin.",
    skin: "Sweet, sunny and juicy.",
    alsoIn: ["Beet Glow"],
  },
  {
    name: "Banana",
    tagline: "Potassium, prebiotics",
    description: "Slightly green bananas contain resistant starch, a type of fiber.",
    gut: "Potassium and fiber.",
    skin: "Sweet, creamy and thickening.",
    alsoIn: ["Berry Bloom"],
  },
  {
    name: "Ginger",
    tagline: "Gingerols",
    description: "Warming and aromatic, with long traditional use in morning rituals.",
    gut: "Gingerols.",
    skin: "Spicy, warming heat.",
    alsoIn: ["Beet Glow"],
  },
  {
    name: "Lemon",
    tagline: "Vitamin C, citric acid",
    description: "Warm lemon water is the gentlest way to begin the morning ritual.",
    gut: "Vitamin C.",
    skin: "Bright and clean.",
    alsoIn: ["Warm lemon water (Day 1)"],
  },
  {
    name: "Radiant Reds",
    tagline: "NOURÉ blend",
    description:
      "The polyphenol-dense base of every morning. Pomegranate, beet, hibiscus, açaí, and more in one scoop.",
    gut: "Red-plant polyphenols, fiber and probiotic cultures.",
    skin: "Deep red and tart-sweet.",
    alsoIn: ["The Pomegranate Glow Elixir", "Watermelon Reds"],
  },
  {
    name: "Açaí",
    tagline: "Anthocyanins, healthy fats",
    description: "An Amazonian berry rich in anthocyanins, with a little natural fat.",
    gut: "Anthocyanins and healthy fats.",
    skin: "Dark and earthy-berry.",
    alsoIn: ["Radiant Reds"],
  },
  {
    name: "Green tea",
    tagline: "EGCG",
    description: "EGCG is the signature polyphenol of green tea.",
    gut: "EGCG. Contains caffeine.",
    skin: "Grassy, fresh and gently bitter.",
    alsoIn: ["Optional afternoon ritual"],
  },
  {
    name: "Turmeric",
    tagline: "Curcumin",
    description:
      "Curcumin gives turmeric its golden color. Pair it with black pepper and a little fat.",
    gut: "Curcumin.",
    skin: "Earthy, warm and golden.",
    alsoIn: ["Optional add-in"],
  },
  {
    name: "Mint",
    tagline: "Aromatic herb",
    description: "Cooling and aromatic. A small handful elevates any morning blend.",
    gut: "Aromatic and fresh.",
    skin: "Cool and bright.",
    alsoIn: ["Optional garnish"],
  },
  {
    name: "Strawberry leaf tea",
    tagline: "Quiet ritual",
    description: "A traditional women's wellness brew, quietly polyphenol-rich.",
    gut: "Mild and astringent.",
    skin: "Light and grassy.",
    alsoIn: ["Optional afternoon ritual"],
  },
];

export type Polyphenol = {
  id: string;
  name: string;
  color: string;
  topBenefit: string;
  points: string[];
  howTo: string;
};

export const POLYPHENOLS: Polyphenol[] = [
  {
    id: "pomegranate",
    name: "Pomegranate",
    color: "#9B1B3A",
    topBenefit: "Punicalagins & ellagic acid",
    points: [
      "Highest in punicalagins of any common fruit.",
      "Metabolized to urolithin A by gut bacteria.",
      "Also brings vitamin C and fiber.",
      "Jewel-red and tart.",
      "Best drunk in the morning.",
    ],
    howTo: "One serving daily — fresh seeds, juice, or a scoop of Radiant Reds.",
  },
  {
    id: "acai",
    name: "Açaí",
    color: "#3E1A47",
    topBenefit: "Deep anthocyanins",
    points: [
      "Deep purple from anthocyanins.",
      "Rich in anthocyanins.",
      "Healthy fats support absorption of fat-soluble nutrients.",
      "Pairs well with banana and almond milk.",
      "Found in Radiant Reds.",
    ],
    howTo: "Frozen pulp blended into a smoothie, or via Radiant Reds.",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    color: "#3F4A8C",
    topBenefit: "Everyday anthocyanins",
    points: [
      "Anthocyanin-rich.",
      "One of the most researched berries.",
      "A good source of fiber.",
      "Easy daily addition.",
      "Wild varieties are denser.",
    ],
    howTo: "½ cup fresh or frozen, daily.",
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    color: "#A02447",
    topBenefit: "Ruby anthocyanins",
    points: [
      "Vivid red tea, anthocyanin-rich.",
      "Traditional use for circulation.",
      "Tart, cranberry-like flavor.",
      "Cooling iced or warming hot.",
      "Pairs with lime and watermelon.",
    ],
    howTo: "1–2 cups daily, hot or cold.",
  },
  {
    id: "beet",
    name: "Beet",
    color: "#6B1730",
    topBenefit: "Nitrates & betalains",
    points: [
      "Nitrate-rich, supports nitric oxide.",
      "Betalains are unique antioxidants.",
      "Jewel-red natural pigment.",
      "Roast or steam to soften flavor.",
      "Pairs with raspberry and orange.",
    ],
    howTo: "1 small beet daily during the reset.",
  },
  {
    id: "green-tea",
    name: "Green tea",
    color: "#3E5C3A",
    topBenefit: "Signature EGCG",
    points: [
      "EGCG is one of the most studied polyphenols.",
      "Also found in Radiant Reds.",
      "Grassy, fresh and gently bitter.",
      "Best brewed at lower temps to preserve EGCG.",
      "Skip late afternoon for sleep.",
    ],
    howTo: "1–2 cups in the morning or early afternoon.",
  },
  {
    id: "turmeric",
    name: "Turmeric",
    color: "#C8893A",
    topBenefit: "Golden curcumin",
    points: [
      "Curcumin gives turmeric its gold.",
      "Pair with black pepper for absorption.",
      "Best with a fat source.",
      "Traditional women's wellness use.",
      "Adds warmth to morning blends.",
    ],
    howTo: "½ tsp daily with food and pepper.",
  },
  {
    id: "cacao",
    name: "Cacao",
    color: "#4A2716",
    topBenefit: "Rich flavanols",
    points: [
      "Rich in flavanols.",
      "Dark, bittersweet depth.",
      "Magnesium-rich.",
      "Use raw or minimally processed.",
      "Pairs with cherry and almond.",
    ],
    howTo: "1–2 tbsp raw cacao, several times a week.",
  },
];

export const ARTICLES = [
  {
    id: "polyphenols",
    title: "What Polyphenols Are, and Where to Find Them",
    body: `Polyphenols are plant compounds, thousands of them, that help plants cope with sun, heat and pests. They also give many fruits, flowers and roots their color.\n\nThe families you'll meet in this reset are anthocyanins (the deep reds and purples), ellagitannins (pomegranate, raspberry) and flavanols (cacao, green tea). Carotenoids, the orange and red pigments in apricot and watermelon, are a related group.\n\nWhen you eat polyphenols, some are absorbed directly and many travel on to your gut, where your gut bacteria break them down into smaller compounds. Researchers are still learning what those compounds do.\n\nThat's why this ritual favors variety and consistency over any single superfood: a different colorful glass each morning, kept for 21 days.`,
  },
  {
    id: "gut-skin",
    title: "The Gut-Skin Axis Explained Simply",
    body: `The gut-skin axis is the phrase researchers use for the ways your digestive system and your skin appear to be connected. It's a fascinating, active area of study, and much of it is still being worked out.\n\nWhat's well established is simpler: a varied diet with plenty of fiber, water and colorful plants is part of taking good care of yourself.\n\nThe Inner Glow Reset is built on that everyday idea. Every morning gives you one colorful, fiber-rich glass and a few quiet minutes. The ritual is the part you control, and it's a beautiful part to keep.`,
  },
  {
    id: "morning-timing",
    title: "Why This Ritual Lives in the Morning",
    body: `Habits stick best when they're tied to a moment you already have. For most of us, that's the first quiet minutes of the morning.\n\nAnchoring the glass to the same time every day means you never have to decide. The ritual is simply what happens after you wake up: blend, pour, sip.\n\nA calm, colorful start sets a steady tone for the rest of your day. It's a small lever you can pull every morning.`,
  },
  {
    id: "reading-skin",
    title: "Noticing Your Mornings During the Reset",
    body: `Your skin renews itself slowly, over weeks, and everyone's skin is different. So this reset asks you to notice rather than expect.\n\nDays 1–7: Focus on the routine. Notice how your mornings feel.\n\nDays 8–14: Take a quiet photo in natural light if you'd like a private record. There's nothing to judge.\n\nDays 15–21: Look back through your journal. Notice what has become easier, and what you've come to love.\n\nDay 22 onward: The ritual is now your morning, not your reset. Keep what works for you.`,
  },
  {
    id: "reds-ingredients",
    title: "What's in Radiant Reds",
    body: `Radiant Reds is built around polyphenol-rich red plants. Here are some of the ingredients in every scoop.\n\nPomegranate brings ellagic acid and punicalagins.\n\nBeetroot brings nitrates and betalains, the pigments behind its deep red.\n\nHibiscus brings anthocyanins and a tart, ruby flavor.\n\nAçaí brings dark-berry anthocyanins.\n\nRaspberry and strawberry bring ellagitannins and vitamin C.\n\nThe blend also includes inulin, oat fiber and nine probiotic cultures. The full ingredient list is on the label.`,
  },
  {
    id: "after-21",
    title: "After 21 Days: How to Keep the Ritual",
    body: `Twenty-one days is enough to build a habit, and a habit is worth keeping.\n\nThe most common mistake is to treat day 22 as the end. Don't. The ritual you kept for 21 days can carry you to day 121.\n\nKeep the morning glass. Keep the slow start. Rotate the recipes. Add a second polyphenol moment in the afternoon if you want to deepen.\n\nThe Inner Glow Reset isn't a 21-day product. It's the entry point to a morning you keep.`,
  },
];

export type BlendTip = { thick: string; thin: string; pro: string };

export const BLEND_TIPS: Record<string, BlendTip> = {
  "pomegranate-elixir": {
    thick:
      "Add ½ frozen banana or 2 tbsp coconut yogurt. The fat deepens the texture and makes it feel more like a meal.",
    thin: "Use ¾ cup oat milk instead of ½, or add a splash of cold hibiscus tea. Strain through a fine mesh for extra silk.",
    pro: "Chill the glass first. Pour slowly. The color is the ritual — let it land.",
  },
  "berry-bloom": {
    thick:
      "Add 1 tbsp almond butter or use half a frozen banana. Let it sit 5 minutes after blending — the chia blooms and thickens naturally.",
    thin: "Use 1¼ cups almond milk and skip the chia. Strain over ice for a bright, clean pour.",
    pro: "Freeze the berries the night before. Cold blending keeps the anthocyanins from degrading in heat.",
  },
  "cherry-cacao": {
    thick:
      "Double the almond butter to 2 tbsp and use ¾ cup oat milk. This becomes a proper morning meal.",
    thin: "Add an extra ¼ cup oat milk and skip the almond butter. Run the blender an extra 30 seconds for a silky finish.",
    pro: "Use frozen tart cherries straight from the bag — no need to thaw. The cold intensifies the dark flavor.",
  },
  "plum-rose": {
    thick:
      "Add 3 tbsp coconut yogurt and reduce rose water to ½ tsp. The yogurt rounds the tartness and gives it body.",
    thin: "Add 2 tbsp cold water and blend until completely smooth. This one is better thinner — let the rose water breathe.",
    pro: "Use very ripe plums — the skin is where most of the polyphenols live. Don't peel them.",
  },
  "watermelon-reds": {
    thick:
      "Freeze the watermelon cubes overnight. Blend frozen — it becomes a sorbet-style slush with no extra ingredients.",
    thin: "Double the hibiscus tea and serve over crushed ice. The palest, most refreshing version.",
    pro: "Brew the hibiscus tea strong, then chill overnight. Add Radiant Reds after blending, not before — heat degrades some polyphenols.",
  },
  "fig-almond": {
    thick:
      "Add 1 tbsp almond butter and use ¾ cup oat milk. The fig and almond together become almost caramel-like.",
    thin: "Use 1¼ cups oat milk and blend longer. Strain if the fig seeds bother you.",
    pro: "Soak dried figs in warm water for 15 minutes before blending — they open up completely and the texture becomes silky.",
  },
  "beet-glow": {
    thick:
      "Add 1 small frozen banana to balance the earthiness. The natural starch makes it thick and almost dessert-like.",
    thin: "Extra orange juice and no banana. Strain through a fine mesh — the result is a clear, jewel-red glass.",
    pro: "Roast the beet ahead of time and freeze in cubes. Game-changer for texture and sweetness.",
  },
  "golden-turmeric": {
    thick:
      "Use oat milk and whisk in ½ tsp coconut oil. The fat emulsifies everything and adds body.",
    thin: "Use almond milk and let it stay warm. Don't blend — just whisk gently.",
    pro: "Add a crack of black pepper, turmeric's classic partner. A pinch is enough.",
  },
  "matcha-cloud": {
    thick:
      "Add ½ frozen banana and use ¾ cup almond milk. Blend until completely smooth — it becomes thick and pale green.",
    thin: "Whisk the matcha separately, then pour over ice and top with almond milk. No blending needed.",
    pro: "Sift the matcha before whisking. Clumps are the enemy. A bamboo whisk in a zig-zag motion, not circular.",
  },
  "lavender-honey": {
    thick:
      "Stir in 1 tbsp raw honey and 2 tbsp coconut yogurt after steeping. Serve at room temperature.",
    thin: "Double the water, steep 3 minutes, strain well, serve over ice. The lightest, most delicate version.",
    pro: "Don't over-steep culinary lavender — 4 minutes maximum or it turns soapy.",
  },
  "rose-cardamom": {
    thick:
      "Add ¼ tsp coconut cream to the oat milk before warming. The result is luscious and almost dessert-like.",
    thin: "Reduce to ¾ cup oat milk and add ¼ cup water. Keep it warm, not hot.",
    pro: "Crush cardamom pods fresh if you have them — the fragrance is completely different from ground.",
  },
  "blueberry-basil": {
    thick:
      "Use frozen wild blueberries and add ½ banana. The frozen fruit makes it naturally thick without yogurt.",
    thin: "Add ¼ cup cold water and strain through a fine mesh. Serve very cold.",
    pro: "Add the basil last — just a few seconds in the blender. Over-blending turns it slightly bitter.",
  },
  "papaya-lime": {
    thick: "Add 2 tbsp coconut yogurt. The enzyme and fat combination is incredibly smooth.",
    thin: "Blend with ¼ cup cold water and strain. Papaya thins beautifully — it's almost juice-like.",
    pro: "Let papaya ripen until it's fully yielding. The riper it is, the sweeter and silkier the glass.",
  },
  "peach-saffron": {
    thick: "Use ½ cup almond milk and add 1 tbsp almond butter. Luxurious texture.",
    thin: "Add ¼ cup extra almond milk. Serve over a single large ice cube.",
    pro: "Steep the saffron in warm milk — not hot water — for 10 minutes before blending. The milk extraction is richer.",
  },
  "fig-vanilla": {
    thick: "Use ¾ cup oat milk and blend in 2 tbsp almond butter. This is a full meal.",
    thin: "1¼ cups oat milk and strain. The natural sweetness of fig makes it work as a light drink.",
    pro: "Use a vanilla bean scraped directly if you can — the flavor depth is worth it.",
  },
  "cucumber-mint": {
    thick: "Don't — this one lives in thin territory. Freeze it in popsicle molds instead.",
    thin: "Add ¼ cup sparkling water at the end, don't blend the bubbles. Serve immediately.",
    pro: "Don't peel the cucumber — the skin has more silica and polyphenols than the flesh.",
  },
  "apricot-almond": {
    thick:
      "Add 1 tbsp almond butter and use ¾ cup oat milk. Let it rest 2 minutes — it thickens as it sits.",
    thin: "Use 1 cup oat milk and add a splash of cold water. Strain for a delicate, pale gold pour.",
    pro: "Use ripe apricots that yield to gentle pressure. They're sweetest and most fragrant at peak ripeness.",
  },
  "kiwi-spinach": {
    thick: "Add ½ frozen banana. The banana smooths the sharpness of kiwi and adds body.",
    thin: "Skip the banana, add ¼ cup more almond milk. Strain for a completely clear, jewel-green glass.",
    pro: "Kiwi skin is edible and adds extra fiber. Try blending whole if your blender is powerful.",
  },
  "vanilla-chia": {
    thick: "Add an extra tablespoon of chia and let it sit overnight rather than a few hours.",
    thin: "Use 1¼ cups oat milk in the mix. The ratio is everything with chia.",
    pro: "Stir twice during the first 10 minutes of refrigerating — this prevents clumping and gives the smoothest texture.",
  },
  "ginger-pear": {
    thick: "Add ½ banana and blend the ginger fully. Warming and filling.",
    thin: "Juice instead of blend — press pear and ginger through a juicer for a completely clear, spicy morning shot.",
    pro: "Freeze the pear first if you want it cold and thick. Fresh pear makes it thinner and more delicate.",
  },
  "honey-almond": {
    thick: "Use 2 tbsp almond butter instead of 1 and reduce oat milk to ¾ cup.",
    thin: "1¼ cups oat milk and just ½ tbsp almond butter. Warm and silky.",
    pro: "Warm gently — don't boil. Raw honey loses its enzymes above 40°C.",
  },
  "bonus-cacao-tonic": {
    thick: "Add 1 tbsp almond butter and reduce to ¾ cup oat milk. This becomes a true nightcap.",
    thin: "Use 1¼ cups oat milk and just whisk — no need to blend.",
    pro: "Drink this 90 minutes before bed, as part of a slow evening.",
  },
  "bonus-rose-collagen": {
    thick: "Add 2 tbsp coconut yogurt and stir gently — don't over-mix.",
    thin: "More sparkling water, less sparkling. The lighter it is, the more elegant.",
    pro: "Add the sparkling water last, after everything else is mixed.",
  },
  "bonus-green-glow": {
    thick: "Add ½ frozen banana. It turns completely smooth and green.",
    thin: "Skip the banana, strain, serve very cold.",
    pro: "Blend the mint for just 3 seconds — any longer and it can turn bitter.",
  },
  "bonus-warm-elixir": {
    thick:
      "Muddle the berries hard before adding the tea. Let it steep together for 2 extra minutes.",
    thin: "Strain and serve hot without muddling — a clean, garnet-colored cup.",
    pro: "Add Radiant Reds only after the tea cools below 40°C — heat degrades heat-sensitive polyphenols.",
  },
  "bonus-glow-sorbet": {
    thick: "Use less coconut yogurt and blend from frozen — it comes out like ice cream.",
    thin: "Add 2 tbsp oat milk and blend until completely smooth.",
    pro: "Pre-freeze your bowl. Cold bowl, cold sorbet, right consistency.",
  },
};

export type GlowBoostStory = { headline: string; skinStory: string; moment: string };

export const GLOW_BOOST_STORIES: Record<string, GlowBoostStory> = {
  "pomegranate-elixir": {
    headline: "Two sources of pomegranate in one glass.",
    skinStory:
      "Fresh pomegranate brings punicalagins and ellagic acid, the polyphenols behind its deep ruby color. Radiant Reds adds more pomegranate, along with beetroot and hibiscus, so a single glass draws on a wider circle of red plants. Tart, bright and beautifully saturated.",
    moment:
      "Add one scoop to the blender before blending. The color deepens. The flavor stays bright.",
  },
  "berry-bloom": {
    headline: "Berries, then more berries.",
    skinStory:
      "Blueberries and strawberries bring anthocyanins and vitamin C. Radiant Reds adds raspberry, black currant, cranberry and açaí from the blend, so the glass grows deeper in color and broader in the plants it draws from. Variety is the quiet luxury of this ritual.",
    moment:
      "Stir in after blending, not before. The blueberry and Reds stay visually separate — swirl once before drinking.",
  },
  "cherry-cacao": {
    headline: "Deep red meets dark cacao.",
    skinStory:
      "Tart cherry is one of the most anthocyanin-rich fruits you can buy, and cacao brings flavanols and magnesium. Radiant Reds adds hibiscus, açaí and beetroot. Together they make a dark, velvety glass that feels like an indulgence and still belongs in your morning.",
    moment: "Blend Radiant Reds in with everything. The cherry-cacao flavor carries it completely.",
  },
  "plum-rose": {
    headline: "A soft glass with a deeper layer.",
    skinStory:
      "Plum skin carries chlorogenic acid, the same polyphenol found in green coffee beans. Rose water adds fragrance and turns the bowl into a small moment of calm. Radiant Reds folds in without disturbing any of that softness, adding color and a layer of red-plant polyphenols.",
    moment: "Stir Radiant Reds into the finished bowl — it folds into the plum color beautifully.",
  },
  "watermelon-reds": {
    headline: "Hydration meets polyphenol density.",
    skinStory:
      "Watermelon is mostly water and naturally rich in lycopene, the carotenoid behind its rosy color. Hibiscus adds tart anthocyanins, and Radiant Reds layers in beetroot and red fruits. It's the easiest glass in the reset to sip slowly on a warm morning.",
    moment:
      "Stir Radiant Reds in after blending — don't blend it. The watermelon flavor stays pure and the Reds blends smoothly.",
  },
  "fig-almond": {
    headline: "Fiber and polyphenols, side by side.",
    skinStory:
      "Figs bring soluble fiber and caramel sweetness, and almonds bring vitamin E and richness. Radiant Reds adds polyphenols from red fruits and roots, plus inulin and oat fiber from the blend. Expect a creamy, caramel-toned glass with real body.",
    moment:
      "Add Radiant Reds to the blender with everything. The creamGold color takes on a richer, warmer tone.",
  },
  "beet-glow": {
    headline: "The jewel-red glass.",
    skinStory:
      "Beets are naturally rich in nitrates and in betalains, the pigments behind their deep color. Radiant Reds adds more beetroot along with hibiscus, and the glass turns a darker, more saturated red. Earthy, sweet and bright with orange, it's the most striking glass of the week.",
    moment:
      "Add Radiant Reds in the blender — it deepens the jewel color and amplifies the earthy-sweet flavor.",
  },
  "golden-turmeric": {
    headline: "Golden warmth, with a red layer.",
    skinStory:
      "Turmeric brings curcumin, the pigment behind its golden color, and a pinch of black pepper is its classic partner. Oat milk makes it creamy. Once the latte cools to drinking temperature, Radiant Reds adds a layer of red-plant polyphenols to the gold. Warm, spiced and deeply comforting.",
    moment:
      "Wait until the latte cools to drinking temperature. Stir in Radiant Reds then — heat kills some polyphenols.",
  },
  "matcha-cloud": {
    headline: "EGCG and anthocyanins, two polyphenol families.",
    skinStory:
      "Matcha is green tea leaf ground whole, and its signature polyphenol is EGCG. Radiant Reds brings anthocyanins from red fruits and hibiscus. The two come from very different plants, so one glass draws on both: grassy and bright, then deep and berry-red.",
    moment:
      "Stir Radiant Reds into the finished glass over ice. The matcha green and Reds garnet swirl — drink before it fully blends for the full effect.",
  },
  "lavender-honey": {
    headline: "A floral pause with a polyphenol layer.",
    skinStory:
      "Culinary lavender and raw honey make a gentle, fragrant tonic, and the four minutes it takes to steep are part of the ritual. Use them to breathe. Once it cools, Radiant Reds adds deep-red polyphenols without changing its delicate character.",
    moment:
      "Add Radiant Reds after the tea cools completely. Stir gently — this should stay delicate.",
  },
  "rose-cardamom": {
    headline: "Feminine, warming, and deeper in color.",
    skinStory:
      "Cardamom and rose bring warmth and fragrance to creamy oat milk. This glass already feels like care. Stir in Radiant Reds once it cools to drinking temperature and the mylk blushes a soft rose, with a layer of red-plant polyphenols folded in.",
    moment: "Wait until it reaches drinking temperature. Stir in Radiant Reds last. Sip slowly.",
  },
  "blueberry-basil": {
    headline: "Two sources of anthocyanins in one glass.",
    skinStory:
      "Blueberries get their deep blue-purple color from anthocyanins. Radiant Reds adds more anthocyanin-rich plants, including blueberry, black currant and açaí, each with a slightly different profile. Fresh basil lifts it all with something green and aromatic.",
    moment:
      "Blend Radiant Reds in with the fruit. The deep blue-purple color intensifies — striking and saturated.",
  },
  "papaya-lime": {
    headline: "Tropical, bright and layered.",
    skinStory:
      "Ripe papaya contains papain, a natural fruit enzyme, and lime brings vitamin C and a sharp, clean brightness. Radiant Reds adds the red-plant polyphenols a tropical glass rarely includes, and turns it a warm coral.",
    moment:
      "Stir Radiant Reds into the finished glass instead of blending it in, for a marbled coral swirl.",
  },
  "peach-saffron": {
    headline: "Golden stone fruit, a crimson layer.",
    skinStory:
      "Saffron is one of the world's most treasured spices, prized for its color, aroma and centuries of traditional use. Ripe peach makes the glass soft and sweet. Radiant Reds adds anthocyanins and ellagitannins beneath the saffron gold. A glass that feels like an occasion.",
    moment: "Add Radiant Reds after blending, before topping with cinnamon. Stir once.",
  },
  "fig-vanilla": {
    headline: "Fiber and polyphenols, silky and sweet.",
    skinStory:
      "Figs bring soluble fiber and a natural caramel sweetness, and vanilla rounds everything out. Radiant Reds adds polyphenols from red fruits and roots, plus inulin and oat fiber from the blend. Think of it as dessert that belongs at breakfast.",
    moment:
      "Add Radiant Reds to the blender. The vanilla and Reds create a complex, warm aroma that makes the morning feel like something.",
  },
  "cucumber-mint": {
    headline: "The lightest glass in the reset.",
    skinStory:
      "Cucumber is more than 95% water, and mint makes it cooling. Radiant Reds turns the pale green base a deep garnet and adds the polyphenols a cucumber glass doesn't have on its own. Crisp, clean and made for warm mornings.",
    moment:
      "Stir Radiant Reds into the finished cooler after straining. The clear cucumber base takes on a deep garnet color — serve immediately.",
  },
  "apricot-almond": {
    headline: "Two pigment families in one glass.",
    skinStory:
      "Apricots get their golden color from beta-carotene, a carotenoid your body can use to make vitamin A. Radiant Reds adds anthocyanins, the red and purple pigments of berries and hibiscus. Gold and crimson together make one of the prettiest glasses in the library.",
    moment:
      "Add Radiant Reds before blending. The apricot gold and Reds deepen into a stunning warm tone.",
  },
  "kiwi-spinach": {
    headline: "Vitamin C, meet the red layer.",
    skinStory:
      "Kiwi is one of the richest fruit sources of vitamin C, and baby spinach adds chlorophyll and a fresh green note. Radiant Reds brings red-plant polyphenols and turns the glass an unexpected deep teal. Tart, fresh and quietly striking.",
    moment:
      "Add Radiant Reds before blending. The green and garnet make a deep teal blend — unexpected, beautiful.",
  },
  "vanilla-chia": {
    headline: "Omega-3 and polyphenols, made ahead.",
    skinStory:
      "Chia seeds bring ALA, a plant omega-3, and soluble fiber that sets into a soft pudding overnight. Vanilla makes it feel like a treat. A dusting of Radiant Reds adds red-plant polyphenols and a crimson finish on the cream.",
    moment:
      "Sprinkle Radiant Reds on top like a dusting. The crimson on cream is one of the most beautiful presentations in the reset.",
  },
  "ginger-pear": {
    headline: "Warm spice, soft fruit, deep red.",
    skinStory:
      "Pear brings soluble fiber and gentle sweetness, and fresh ginger brings its gingerols and warming heat. Radiant Reds adds polyphenols from red fruits and roots. Serve it cold on bright mornings or warm when the weather turns.",
    moment:
      "Add Radiant Reds before blending. The ginger warmth and Reds complement each other completely.",
  },
  "honey-almond": {
    headline: "A grounding, nutty cup.",
    skinStory:
      "Almond butter brings vitamin E, healthy fats and fiber, and raw honey adds gentle sweetness. Oat milk makes it creamy. Radiant Reds adds a deep-red polyphenol layer to a cup that feels like a slow, unhurried start.",
    moment:
      "Stir Radiant Reds in after blending. Add a cinnamon dusting last — this is one of the most grounding morning cups in the reset.",
  },
  "bonus-cacao-tonic": {
    headline: "An evening cup for winding down.",
    skinStory:
      "Cacao brings flavanols and magnesium, and warm spice makes it one of the coziest rituals in the library. Once it cools, a small scoop of Radiant Reds adds red-plant polyphenols. Sip it slowly and let the day end gently.",
    moment: "Wait until fully cooled. Stir in Radiant Reds. Sip slowly one hour before bed.",
  },
  "bonus-rose-collagen": {
    headline: "Vitamin C and a crimson layer.",
    skinStory:
      "Strawberries and lime bring vitamin C and a bright, fresh flavor. Rose water adds fragrance. Radiant Reds brings red-plant polyphenols and turns the sparkling glass a deep garnet, with the bubbles catching the color as they rise.",
    moment:
      "Stir Radiant Reds into the finished glass before topping with sparkling water. The garnet color through the bubbles is striking.",
  },
  "bonus-green-glow": {
    headline: "Green pigments and red pigments, the full spectrum.",
    skinStory:
      "Cucumber, kiwi and mint bring green color and freshness. Radiant Reds adds anthocyanins, the red and purple pigments of berries and hibiscus. One glass draws on both ends of the plant-color spectrum, and it looks beautiful doing it.",
    moment:
      "Stir Radiant Reds into the strained glass, not the blender. The crimson drops through the green — beautiful.",
  },
  "bonus-warm-elixir": {
    headline: "Heat-sensitive ritual, carefully built.",
    skinStory:
      "Some polyphenols in Radiant Reds are heat-sensitive — they degrade above 40°C. This warm glass needs to cool before Radiant Reds goes in. Once it does, the hibiscus anthocyanins in the tea and the pomegranate, beet, and açaí in Radiant Reds create one of the deepest polyphenol concentrations in the entire recipe library. A warming cup that delivers a cold-process polyphenol punch.",
    moment:
      "Cool to drinking temperature — test with your wrist. Then stir in Radiant Reds and drink immediately.",
  },
  "bonus-glow-sorbet": {
    headline: "Dessert that works like a ritual.",
    skinStory:
      "Frozen berries keep their color bright when you blend them cold. Coconut yogurt adds live cultures and a creamy tang. Radiant Reds on top adds red-plant polyphenols and a crimson dusting. This is the most indulgent way to keep the ritual.",
    moment:
      "Dust Radiant Reds on top like finishing powder. The crimson on ivory sorbet is the most beautiful thing you'll make in 21 days.",
  },
};

export const SOUNDS = [
  {
    id: "rain",
    name: "Morning Rain",
    duration: "8 min",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_a8e603753c.mp3",
  },
  {
    id: "bowl",
    name: "Tibetan Bowl",
    duration: "5 min",
    url: "https://cdn.pixabay.com/audio/2022/10/18/audio_3433d6cea0.mp3",
  },
  {
    id: "forest",
    name: "Forest Light",
    duration: "10 min",
    url: "https://cdn.pixabay.com/audio/2022/03/09/audio_c8c8a73467.mp3",
  },
  {
    id: "birds",
    name: "Birdsong",
    duration: "7 min",
    url: "https://cdn.pixabay.com/audio/2021/10/07/audio_3f15f7e3a4.mp3",
  },
  {
    id: "silence",
    name: "Soft Silence",
    duration: "12 min",
    url: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bdd.mp3",
  },
];

export const JOURNAL_PROMPTS: Record<number, (name: string) => string> = {
  1: (n) => `What made you start this reset today, ${n}?`,
  2: (n) => `What does your morning look like when it goes well, ${n}?`,
  3: () => `What did you notice in your body this morning?`,
  4: () => `Where in your body do you feel most alive right now?`,
  5: () => `What's one thing you're already doing right?`,
  6: () => `What does your skin feel like when you wake up?`,
  7: (n) => `One full week, ${n}. What's already shifting?`,
  8: () => `What does softness look like for you today?`,
  9: () => `Name a small ritual that's becoming yours.`,
  10: () => `What did you eat this week that made you feel lit up?`,
  11: () => `Look at your skin in natural light. What do you notice?`,
  12: () => `Where are you being too hard on yourself?`,
  13: () => `Write one sentence to your skin.`,
  14: (n) => `You're halfway, ${n}. What's shifted?`,
  15: () => `What have you stopped craving?`,
  16: () => `Name a moment of beauty from this week.`,
  17: () => `What feels lighter than it did on day one?`,
  18: () => `Where do you want to keep going past day 21?`,
  19: () => `What would make tomorrow feel sacred?`,
  20: () => `What are you carrying out of these 21 days?`,
  21: (n) => `This is the last entry, ${n}. What do you want to remember?`,
};

const SETS = {
  A: [
    "Tired is information, not failure. Your body is asking you to slow the morning, not push it.",
    "Rest is part of the ritual. Tomorrow's glass will be waiting.",
    "Today, do less. The ritual is the glass — everything else can wait.",
    "Exhaustion isn't a setback. Be gentle with yourself today.",
  ],
  B: [
    "Keep showing up. The mornings add up.",
    "Thank you for noticing. Write it down so you can look back on it.",
    "Keep noticing. Stay in it.",
    "Whatever you're noticing, you've shown up for it every morning.",
    "Your journal is a record of these mornings. Keep writing it.",
  ],
  C: [
    "One missed day doesn't break a 21-day ritual. It just means today matters more. You're still in it.",
    "Hard is not the same as wrong. You came back. That's the ritual.",
    "Forgetting isn't failure. The ritual is what you return to, not what you never miss.",
    "Compassion first. Then the glass.",
  ],
  D: [
    "Hold onto this feeling. Write down the date. You'll want to remember this morning.",
    "This is what compounding looks like. You earned it.",
    "Days like this are why we built this ritual. Keep going.",
    "What you're feeling is what we hoped you'd feel. The work is paying interest now.",
  ],
  E: [
    "Thank you for tuning in to your body. Notice it without judging it.",
    "If something doesn't feel right, listen to that, and talk to your doctor if it continues.",
    "Noticing how you feel is part of the ritual. Keep writing it down.",
    "A few quiet minutes with your glass is a lovely way to start the day.",
  ],
  F: [
    "Noted. Your reset is taking shape.",
    "Even one sentence is a ritual. See you tomorrow.",
    "The ritual is the showing up. You did that today.",
    "Glow isn't linear. Your morning today is part of the line.",
    "Twenty-one days is built one journal entry at a time.",
  ],
};

export function reflectJournal(text: string, name: string): string {
  const t = text.toLowerCase();
  let pool = SETS.F;
  if (/\b(tired|exhausted|drained|wiped)\b/.test(t)) pool = SETS.A;
  else if (/\b(skin|clear|glow|bright|radiant)\b/.test(t)) pool = SETS.B;
  else if (/\b(hard|forgot|missed|skip|fail)\b/.test(t)) pool = SETS.C;
  else if (/\b(amazing|love|feel good|incredible|wonderful)\b/.test(t)) pool = SETS.D;
  else if (/\b(bloated|gut|digestion|stomach|belly)\b/.test(t)) pool = SETS.E;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick.replace(/\{name\}/g, name);
}

export type GroceryItem = { id: string; name: string; note?: string };
export type GroceryCategory = { name: string; items: GroceryItem[] };

export const GROCERY_LIST: GroceryCategory[] = [
  {
    name: "Fresh Produce",
    items: [
      {
        id: "pomegranate",
        name: "Pomegranate seeds or juice",
        note: "1 cup per use — frozen works",
      },
      { id: "raspberries", name: "Raspberries", note: "Fresh or frozen" },
      { id: "blueberries", name: "Blueberries", note: "Wild if available" },
      { id: "strawberries", name: "Strawberries" },
      { id: "banana", name: "Banana", note: "Slightly green = more prebiotic fiber" },
      { id: "plum", name: "Plum (2–3)", note: "Ripe, any variety" },
      { id: "watermelon", name: "Watermelon" },
      { id: "black-fig", name: "Black figs (4–6)", note: "Fresh or dried" },
      { id: "beet", name: "Beet (2 small)", note: "Pre-roast for the week" },
      { id: "tart-cherry", name: "Tart cherries", note: "Frozen or jarred unsweetened" },
      { id: "peach", name: "Peach or nectarine" },
      { id: "kiwi", name: "Kiwi (2)" },
      { id: "orange", name: "Orange" },
      { id: "lime", name: "Lime (4–5)" },
      { id: "lemon", name: "Lemon (2)" },
      { id: "cucumber", name: "Cucumber" },
      { id: "ginger", name: "Fresh ginger root" },
      { id: "mint", name: "Fresh mint" },
    ],
  },
  {
    name: "Bases",
    items: [
      { id: "oat-milk", name: "Oat milk (2 cartons)", note: "Unsweetened, barista or plain" },
      { id: "almond-milk", name: "Almond milk", note: "Unsweetened" },
      { id: "coconut-yogurt", name: "Coconut yogurt", note: "Plain, live cultures" },
      { id: "hibiscus-tea", name: "Hibiscus tea (dried or bags)" },
      { id: "green-tea", name: "Green tea (ceremonial-grade matcha or loose leaf)" },
    ],
  },
  {
    name: "Pantry",
    items: [
      {
        id: "reds",
        name: "Radiant Reds",
        note: "30 servings. One scoop a morning covers all 21 Reset days, with 9 left over",
      },
      { id: "cacao", name: "Raw cacao powder" },
      { id: "almond-butter", name: "Almond butter", note: "No added sugar" },
      { id: "chia", name: "Chia seeds" },
      { id: "cinnamon", name: "Cinnamon (ground)" },
      { id: "honey", name: "Raw honey" },
      { id: "rose-water", name: "Rose water", note: "Culinary grade, small bottle" },
      { id: "vanilla", name: "Vanilla extract" },
      { id: "almonds", name: "Raw almonds (small bag)" },
      { id: "turmeric", name: "Turmeric (ground)" },
      { id: "black-pepper", name: "Black pepper", note: "Pairs with turmeric for absorption" },
    ],
  },
  {
    name: "Optional Upgrades",
    items: [
      { id: "collagen", name: "Collagen peptides (unflavored)", note: "Pairs with any recipe" },
      { id: "acai-packets", name: "Frozen açaí packets" },
      { id: "saffron", name: "Saffron (pinch jar)", note: "For the Peach & Saffron ritual" },
      { id: "cardamom", name: "Cardamom (ground)" },
    ],
  },
  {
    name: "Quick Glow Mornings",
    items: [
      { id: "qg-frozen-berries", name: "Frozen mixed berries", note: "Berry Reds Yogurt Shake" },
      { id: "qg-frozen-cherries", name: "Frozen cherries", note: "Cherry Cacao Calm Glow" },
      { id: "qg-frozen-mango", name: "Frozen mango", note: "Tropical Reds Quickie" },
      { id: "qg-frozen-papaya", name: "Frozen papaya", note: "Or extra mango" },
      { id: "qg-frozen-pineapple", name: "Frozen pineapple", note: "Cucumber Mint Lightness" },
      { id: "qg-cucumber", name: "Cucumber", note: "Cucumber Mint Lightness" },
      { id: "qg-greek-yogurt", name: "Greek yogurt or kefir", note: "Most quick recipes" },
      { id: "qg-coconut-water", name: "Coconut water", note: "Three quick recipes" },
      { id: "qg-cold-brew", name: "Cold brew or chilled coffee", note: "Mocha Reds Morning" },
      { id: "qg-flax", name: "Ground flax", note: "Or use chia seeds" },
      { id: "qg-vanilla", name: "Vanilla extract", note: "Pomegranate Vanilla Glow" },
      { id: "qg-protein", name: "Vanilla protein (optional)", note: "Mocha Reds Morning" },
    ],
  },
];

export const NOTIFICATIONS: Record<number, string> = {
  1: "Your reset begins this morning, {name}.",
  2: "Day 2. The ritual is still new. Show up anyway.",
  3: "Three mornings, {name}. The ritual is taking shape.",
  4: "The first week is about showing up. You're doing it.",
  5: "Halfway through week one. Consistency is the active ingredient.",
  6: "Day 6. Keep it simple. Your glass is ready when you are.",
  7: "One full week, {name}. The foundation is yours.",
  8: "Week two. This is where it deepens.",
  9: "Day 9. Your morning glass is waiting.",
  10: "Ten days in. The ritual is starting to feel like yours.",
  11: "Day 11. A quiet photo, just for you.",
  12: "Day 12. Today is about hydration.",
  13: "Tomorrow is the halfway point. You're almost there.",
  14: "Halfway, {name}. The ritual is becoming habit.",
  15: "Week three begins. The ritual feels like yours.",
  16: "Day 16. Look back at the mornings you've kept.",
  17: "Four days left. Don't stop here.",
  18: "Eighteen mornings, and counting, {name}.",
  19: "Two more mornings after this one.",
  20: "Day 20. Tomorrow is Day 21. You made it, {name}.",
  21: "This is Day 21. You showed up. Open the app.",
};

export const MILESTONES: Record<string, { title: string; sub: string; badge: string }> = {
  "day-1": {
    title: "Day 1 is done, {name}.",
    sub: "The ritual has started.",
    badge: "The Beginning",
  },
  "day-7": {
    title: "One week.",
    sub: "Seven mornings. The foundation is yours.",
    badge: "Foundation Built",
  },
  "day-14": { title: "Halfway, {name}.", sub: "The ritual is yours now.", badge: "Deep Glow" },
  "first-journal": {
    title: "You showed up for yourself today.",
    sub: "The first entry is the hardest.",
    badge: "First Words",
  },
  "streak-3": {
    title: "Three days in a row.",
    sub: "This is how rituals form.",
    badge: "Three Mornings",
  },
};
