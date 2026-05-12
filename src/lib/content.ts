export const REDS_URL = "https://nourewellness.com/products/reds-superfood";

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
  { day: 1, title: "The First Glass", recipeId: "pomegranate-elixir",
    teaser: "Today the ritual begins. One glass. One quiet morning.",
    guide: "Today is about beginning. Not perfectly — just beginning. Pour your warm water with lemon, then prepare your Radiant Reds. Drink slowly. Notice the color. The polyphenols you're taking in this morning — ellagic acid, anthocyanins, punicalagins — are already moving toward your gut lining, where the gut-skin axis begins. You won't see the result today. That's not the point. Today's only job: show up." },
  { day: 2, title: "Stillness Before Speed", recipeId: "berry-bloom",
    teaser: "Five quiet minutes before the day asks anything of you.",
    guide: "Before you check your phone, sit for five minutes with your glass. This isn't meditation — it's permission. Your nervous system sets the tone for digestion. A calm morning means a calm gut. A calm gut means clearer skin. Today, drink slow. Breathe slower." },
  { day: 3, title: "The Polyphenol Window", recipeId: "cherry-cacao",
    teaser: "Your morning is when polyphenols absorb best.",
    guide: "Polyphenols absorb best on a relatively empty stomach with hydration. That's why this ritual lives in the morning. Today, layer in tart cherry — one of the highest-anthocyanin foods studied for skin elasticity and recovery." },
  { day: 4, title: "Listening Inward", recipeId: "plum-rose",
    teaser: "Your body has been answering. Today you listen.",
    guide: "Four mornings in, your body has begun to respond. Bloating may have softened. Energy may feel a touch steadier. Skin won't show change yet — that's still days away. Today's ritual: drink, then write one sentence about what your body is saying." },
  { day: 5, title: "The Skin-Gut Bridge", recipeId: "watermelon-reds",
    teaser: "What you feed your gut, your skin wears.",
    guide: "The gut-skin axis isn't a metaphor. Inflammation in the gut lining shows up as dullness, breakouts, sensitivity. Polyphenols feed the bacteria that protect that lining. Today's recipe is hydration-forward — watermelon and hibiscus to flush and feed at once." },
  { day: 6, title: "The Quiet Build", recipeId: "fig-almond",
    teaser: "Day 6. Nothing dramatic. Everything compounding.",
    guide: "Six mornings of polyphenols, fiber, and stillness. Your microbiome has noticed. Your skin hasn't shown the world yet, but it's listening. Today, add fig — a quiet, fiber-rich addition that supports the gut bacteria you've been feeding all week." },
  { day: 7, title: "One Full Week", recipeId: "beet-glow",
    teaser: "One week. Foundation complete.",
    guide: "You've built the foundation. Seven mornings of ritual is no longer a beginning — it's a pattern. Today's recipe brings beet, one of the most studied roots for circulation and skin oxygenation. Drink it. Then look in the mirror. Notice without judgement. Week two starts tomorrow." },
  { day: 8, title: "Build Begins", recipeId: "pomegranate-elixir",
    teaser: "Week 2. Now we deepen.",
    guide: "Foundation is built. Now we layer. This week the ritual starts to feel less like a task and more like a morning. Today, return to the pomegranate elixir — but this time, taste it differently. The same glass becomes the same ritual every morning, but you are not the same person who drank it on day one." },
  { day: 9, title: "The Ferment Layer", recipeId: "berry-bloom",
    teaser: "Add a small fermented food today.",
    guide: "Today, alongside your reds, eat a small fermented food — yogurt, kefir, kimchi, sauerkraut. Polyphenols and probiotics work together: the polyphenols feed the bacteria, the bacteria metabolize the polyphenols into the compounds your skin actually uses." },
  { day: 10, title: "Ten Mornings", recipeId: "cherry-cacao",
    teaser: "Ten mornings in. The ritual is becoming yours.",
    guide: "Ten mornings is no longer 'trying it.' Ten mornings is a practice. Today, drink your reds, then notice: what feels different from day one? Not in the mirror — inside." },
  { day: 11, title: "Watching for the Shift", recipeId: "plum-rose",
    teaser: "Dullness lifts in week two. Watch for it.",
    guide: "Around day 11–14, many notice the first visible shift: a softening of dullness, a small lift in tone. It's subtle. It's compounding. Today's ritual: drink, then take a quiet photo of your skin in natural light. You'll want it later." },
  { day: 12, title: "The Skin Speaks", recipeId: "watermelon-reds",
    teaser: "Your skin has been working. Today it shows you.",
    guide: "Your skin renews on a roughly 27-day cycle, but the brightness of the surface — that comes faster. Twelve days of feeding your gut-skin axis means a freshly turned-over surface layer. Today, hydrate hard. Watermelon, hibiscus, lime." },
  { day: 13, title: "Almost Halfway", recipeId: "fig-almond",
    teaser: "Tomorrow is the halfway mark.",
    guide: "Tomorrow is day 14 — the halfway point. Today, take inventory. What three things feel different? Write them in your journal. Then drink your reds slowly. The ritual rewards attention." },
  { day: 14, title: "Halfway", recipeId: "beet-glow",
    teaser: "Halfway. The ritual is yours now.",
    guide: "Fourteen mornings. The ritual is no longer something you're doing — it's something you have. Week three is where the work becomes visible. Today, beet again, for circulation. Then sit with the feeling of having shown up fourteen times in a row." },
  { day: 15, title: "Glow Begins", recipeId: "pomegranate-elixir",
    teaser: "This is the week your skin shows the work.",
    guide: "Week three is where the inside surfaces. Your microbiome is noticeably more diverse. Your skin's surface layer is fresher. The polyphenols you've been drinking are now circulating in measurable amounts. Today, return to pomegranate. The first recipe. Notice how different it tastes when you've been drinking it for fifteen mornings." },
  { day: 16, title: "What the Mirror Shows", recipeId: "berry-bloom",
    teaser: "What your mirror shows now is what you built.",
    guide: "Today, look at the photo you took on day 11. Look at your skin now. Don't expect drama. Look for: clarity, tone, that small lift in the under-eye. It's the kind of glow that other people notice first." },
  { day: 17, title: "Four Days Left", recipeId: "cherry-cacao",
    teaser: "Don't stop here.",
    guide: "Four mornings remain. This is the stretch where many quit because they think they've gotten what they came for. Don't. Days 17–21 are where the ritual locks in for the long term. Today: tart cherry, full ritual, full attention." },
  { day: 18, title: "Compounding", recipeId: "plum-rose",
    teaser: "The glow you're seeing is compounding.",
    guide: "Each polyphenol you've taken in has built on the one before. The benefit isn't from one glass — it's from eighteen. This is why 21 days. This is why ritual. Today, plum and rose, and a slow morning." },
  { day: 19, title: "Two Mornings After This", recipeId: "watermelon-reds",
    teaser: "Two more mornings after today.",
    guide: "Three mornings left including today. This week, start to think about what happens on day 22. The ritual that has worked for 21 days is the ritual that works for 121 days. Don't change it just because the count ends." },
  { day: 20, title: "Almost", recipeId: "fig-almond",
    teaser: "Tomorrow is Day 21. You made it.",
    guide: "Tomorrow is the final morning. Today, drink your reds, eat your fig, and write a long journal entry. Tomorrow's entry will be a letter — today's is the setup." },
  { day: 21, title: "The Ritual Holds", recipeId: "beet-glow",
    teaser: "This is Day 21. You showed up.",
    guide: "Twenty-one mornings. You showed up for a ritual most people won't. Drink the final glass slowly. Then open your celebration screen. The ritual doesn't end here — it just stops being a 21-day reset and starts being your morning." },
];

// ─────────────────────────────────────────────
// Programs
// ─────────────────────────────────────────────

export type ProgramId = "skin-glow" | "feel-lighter" | "balanced-energy";

export type Program = {
  id: ProgramId;
  name: string;
  tagline: string;
  description: string;
  weekThemes: [string, string, string];
  checklistEmphasis: string;
};

export const PROGRAMS: Program[] = [
  {
    id: "skin-glow",
    name: "Skin Glow Program",
    tagline: "21 days of polyphenols, ritual, and glow.",
    description: "Built around the gut–skin axis. Each morning layers antioxidants that nourish your skin from the inside. Most people notice a quiet shift in clarity and tone by week two.",
    weekThemes: ["Foundation", "Build", "Glow"],
    checklistEmphasis: "skin photo, pillowcase freshness, hydration",
  },
  {
    id: "feel-lighter",
    name: "Feel Lighter Program",
    tagline: "21 days of gentle nourishment and digestive ease.",
    description: "A path focused on how you feel — lighter, more settled, more at ease in your body. Supports gentle digestion and gut comfort through plant fibers and polyphenols.",
    weekThemes: ["Reset", "Nourish", "Flow"],
    checklistEmphasis: "slow eating, fermented foods, noon check-in",
  },
  {
    id: "balanced-energy",
    name: "Balanced Energy Program",
    tagline: "21 days of steady, grounded vitality.",
    description: "Built for consistent energy throughout the day — not spikes and crashes, but a calm, sustained morning foundation that carries through your afternoon.",
    weekThemes: ["Ground", "Sustain", "Thrive"],
    checklistEmphasis: "Reds before coffee, no phone morning, midday movement",
  },
];

export function programFor(id: ProgramId): Program {
  return PROGRAMS.find((p) => p.id === id) ?? PROGRAMS[0];
}

// ─────────────────────────────────────────────
// Recipes
// ─────────────────────────────────────────────

export type TextureGuide = {
  frozen: string;
  liquid: string;
  thicker: string;
  thinner: string;
  blenderTip: string;
  subs?: string;
};

export type Recipe = {
  id: string; name: string; gradient: string; prep: string; servings: string;
  benefit: string; benefitTag: string; ingredients: string[]; method: string[];
  redsBoost: { why: string; proof: string[] };
  texture?: TextureGuide;
  image?: string;
  imageAlt?: string;
  bonus?: boolean;
};

const G = {
  plumGold:     "linear-gradient(135deg, #7B2D4E 0%, #C49A6C 100%)",
  goldSand:     "linear-gradient(135deg, #C49A6C 0%, #F1EAE2 100%)",
  plumLavender: "linear-gradient(135deg, #7B2D4E 0%, #B8A9C9 100%)",
  sageIvory:    "linear-gradient(135deg, #A8B5A0 0%, #FAF7F4 100%)",
  roseSand:     "linear-gradient(135deg, #D9B8B0 0%, #F1EAE2 100%)",
  creamGold:    "linear-gradient(135deg, #F4E9D8 0%, #C49A6C 100%)",
  plumSage:     "linear-gradient(135deg, #7B2D4E 0%, #A8B5A0 100%)",
  goldRose:     "linear-gradient(135deg, #C49A6C 0%, #D9B8B0 100%)",
  plumDeep:     "linear-gradient(135deg, #5C2541 0%, #7B2D4E 100%)",
  lavenderIvory:"linear-gradient(135deg, #B8A9C9 0%, #FAF7F4 100%)",
  sandPlum:     "linear-gradient(135deg, #F1EAE2 0%, #7B2D4E 100%)",
  goldLavender: "linear-gradient(135deg, #C49A6C 0%, #B8A9C9 100%)",
  sageGold:     "linear-gradient(135deg, #A8B5A0 0%, #C49A6C 100%)",
  roseGold:     "linear-gradient(135deg, #D9B8B0 0%, #C49A6C 100%)",
  mintIvory:    "linear-gradient(135deg, #8DB5A0 0%, #F4FAF7 100%)",
  citrusGold:   "linear-gradient(135deg, #D4A855 0%, #F4E9D8 100%)",
};

const REDS_PROOF = {
  skin:     ["Pomegranate punicalagins support collagen", "Hibiscus anthocyanins support even tone", "Açaí flavonoids defend against oxidative stress", "Beet nitrates oxygenate the skin"],
  glow:     ["27 polyphenol sources in one scoop", "Feeds the gut bacteria your skin depends on", "Compounds with daily ritual use", "Visible lift around Day 14"],
  energy:   ["Beet nitrates increase cellular oxygen", "Polyphenols stabilize morning energy", "No caffeine spike, no crash", "Pairs with whole-food breakfast"],
  gut:      ["Polyphenols feed bifidobacteria diversity", "Soluble fibers support a calm gut lining", "Prebiotic action begins within 72 hours", "Supports the gut–skin axis directly"],
  hydration:["Mineral-rich hibiscus and beet", "Supports vascular hydration", "Pairs perfectly with morning water", "Replenishes after sleep"],
  recovery: ["Anti-inflammatory polyphenol matrix", "Tart cherry-style melatonin support", "Calms morning puffiness", "Restores after late nights"],
};

export const RECIPES: Recipe[] = [
  // ——— 21 CORE RECIPES ———
  {
    id: "pomegranate-elixir", name: "The Pomegranate Glow Elixir",
    gradient: G.plumGold, prep: "4 min", servings: "1",
    image: "/images/smoothies/pomegranate-radiance.png", imageAlt: "Rich pomegranate radiance elixir",
    benefitTag: "Skin clarity",
    benefit: "Supports the gut–skin axis with ellagic acid and punicalagins from pomegranate. Skin clarity benefit builds around Day 5.",
    ingredients: [
      "1 cup pomegranate seeds (or ½ cup 100% pomegranate juice)",
      "½ cup raspberries, fresh or frozen",
      "1 cup oat milk",
      "1 scoop Radiant Reds",
      "Juice of ½ lime",
    ],
    method: [
      "Add pomegranate seeds and raspberries to a high-speed blender.",
      "Pour in oat milk and add one scoop Radiant Reds.",
      "Squeeze in lime juice. Blend on high for 45–60 seconds until silky.",
      "Pour into a chilled glass. Drink slowly.",
    ],
    texture: {
      frozen: "Use fresh pomegranate seeds or freeze them overnight for an icy, thicker consistency. Frozen raspberries work best — they keep the blend thick and cold without diluting.",
      liquid: "¾–1¼ cups oat milk depending on desired thickness.",
      thicker: "Reduce oat milk to ¾ cup and add 2–3 ice cubes.",
      thinner: "Add up to ¼ cup extra oat milk or a splash of pomegranate juice.",
      blenderTip: "Blend for 45–60 seconds on high. Pomegranate seeds have tough membranes — extra blending time gives you a silk-smooth result.",
      subs: "Oat milk → any plant milk. Pomegranate seeds → ½ cup 100% pomegranate juice. Raspberries → strawberries.",
    },
    redsBoost: { why: "Radiant Reds layers a second wave of pomegranate and beet polyphenols on top of the fresh fruit — doubling the skin-clarity load in a single glass.", proof: REDS_PROOF.skin },
  },
  {
    id: "berry-bloom", name: "Berry Bloom",
    gradient: G.plumLavender, prep: "3 min", servings: "1",
    image: "/images/smoothies/berry-mint-refresh.png", imageAlt: "Fresh berry and mint antioxidant smoothie",
    benefitTag: "Antioxidant",
    benefit: "Anthocyanin-rich blueberries and strawberries to feed your microbiome and brighten dull mornings.",
    ingredients: [
      "¾ cup blueberries, fresh or frozen",
      "¾ cup strawberries, hulled, fresh or frozen",
      "½ ripe banana",
      "1 cup almond milk",
      "1 tbsp chia seeds",
    ],
    method: [
      "Add blueberries, strawberries, and banana to blender.",
      "Pour in almond milk and blend for 30–45 seconds.",
      "Stir in chia seeds and let sit 2 minutes so they begin to bloom.",
      "Stir once more and serve.",
    ],
    texture: {
      frozen: "Use frozen blueberries and strawberries. Frozen berries make this thick enough to sip slowly and keep it cold without ice.",
      liquid: "¾–1 cup almond milk.",
      thicker: "Use all frozen fruit and only ¾ cup milk. Let the chia sit for 3–4 minutes post-blend.",
      thinner: "Add up to ¼ cup extra almond milk or a splash of water.",
      blenderTip: "Blend 30–45 seconds. Stir in chia seeds after blending — they don't need to be blended and bloom better in the finished smoothie.",
      subs: "Almond milk → oat milk or coconut milk. Blueberry → blackberry. Banana → ¼ avocado for creaminess without sweetness.",
    },
    redsBoost: { why: "Add a scoop of Radiant Reds to fold in 27 additional polyphenol sources your berries can't reach alone.", proof: REDS_PROOF.glow },
  },
  {
    id: "cherry-cacao", name: "Cherry Cacao",
    gradient: G.plumDeep, prep: "4 min", servings: "1",
    image: "/images/smoothies/mocha-glow.png", imageAlt: "Rich mocha cacao and cherry glow smoothie",
    benefitTag: "Recovery",
    benefit: "Tart cherry brings melatonin and anthocyanins for skin recovery; cacao adds flavanols for circulation.",
    ingredients: [
      "1 cup tart cherries, pitted (fresh or frozen)",
      "1 tbsp raw cacao powder",
      "1 tbsp almond butter",
      "1 cup oat milk",
      "Pinch of ground cinnamon",
    ],
    method: [
      "Add tart cherries to the blender with oat milk and blend 20 seconds.",
      "Add cacao powder, almond butter, and cinnamon.",
      "Blend on high for 45 seconds until smooth and creamy.",
      "Taste and adjust cinnamon if desired.",
    ],
    texture: {
      frozen: "Use frozen tart cherries — they're the key to making this thick and fudgy. Fresh cherries make a thinner, lighter drink.",
      liquid: "¾–1 cup oat milk.",
      thicker: "Reduce to ¾ cup oat milk and add 3–4 ice cubes.",
      thinner: "Add up to ¼ cup extra oat milk or a splash of water.",
      blenderTip: "Blend cherries with milk first (20 seconds), then add cacao and almond butter. This prevents the cacao from clumping.",
      subs: "Tart cherry → dark sweet cherry (less anthocyanin, same texture). Almond butter → cashew butter or tahini. Oat milk → almond milk.",
    },
    redsBoost: { why: "Radiant Reds amplifies the recovery profile with hibiscus and açaí — calming inflammation while you sleep it off.", proof: REDS_PROOF.recovery },
  },
  {
    id: "plum-rose", name: "Plum & Rose",
    image: "/images/smoothies/strawberry-rose-glow.png", imageAlt: "Delicate strawberry rose glow smoothie",
    gradient: G.roseSand, prep: "5 min", servings: "1",
    benefitTag: "Soothing",
    benefit: "Plum polyphenols paired with rose water for a calming, soothing morning ritual.",
    ingredients: [
      "2 ripe plums, pitted and sliced",
      "½ cup coconut yogurt",
      "1 tsp rose water (culinary grade)",
      "1 tsp raw honey",
    ],
    method: [
      "Pit and slice both plums.",
      "Add plums and coconut yogurt to blender. Blend 30–45 seconds.",
      "Add rose water and honey. Pulse 2–3 times to combine.",
      "Pour into a bowl or glass. Best eaten with a spoon.",
    ],
    texture: {
      frozen: "Fresh plums work best for flavour. For a thicker bowl, freeze plum slices for 2+ hours before blending.",
      liquid: "½ cup coconut yogurt is the base — no additional liquid needed for a thick bowl. Add 2–3 tbsp almond milk to loosen if needed.",
      thicker: "Use frozen plum slices or add 1 tbsp chia seeds and let sit 3 minutes.",
      thinner: "Add 2–3 tbsp almond milk.",
      blenderTip: "Blend for 30–45 seconds. Don't over-blend the yogurt — you want it thick and creamy, not airy.",
      subs: "Plum → ripe nectarine or peach. Coconut yogurt → any thick dairy-free yogurt. Rose water → ½ tsp vanilla extract.",
    },
    redsBoost: { why: "A small scoop of Radiant Reds turns this gentle bowl into a full polyphenol ritual without changing its softness.", proof: REDS_PROOF.skin },
  },
  {
    id: "watermelon-reds", name: "Watermelon Hibiscus",
    gradient: G.goldRose, prep: "3 min", servings: "1",
    image: "/images/smoothies/citrus-skin-smoothie.png", imageAlt: "Bright watermelon hibiscus smoothie",
    benefitTag: "Hydration",
    benefit: "Hydration-forward with hibiscus for vascular support and a full polyphenol layer from Radiant Reds.",
    ingredients: [
      "2 cups watermelon, cubed (seeds removed)",
      "1 cup brewed hibiscus tea, cooled fully",
      "Juice of ½ lime",
      "1 scoop Radiant Reds",
    ],
    method: [
      "Brew hibiscus tea and cool completely (refrigerate 30 min or use ice).",
      "Add watermelon to blender and blend 20–30 seconds.",
      "Add hibiscus tea, lime juice, and Radiant Reds. Blend 15 seconds.",
      "Serve over ice.",
    ],
    texture: {
      frozen: "Freeze watermelon cubes for a frostier, thicker texture. Otherwise serve very cold over plenty of ice.",
      liquid: "1 cup hibiscus tea. Adjust to taste.",
      thicker: "Use frozen watermelon cubes. Reduce tea to ¾ cup.",
      thinner: "Add up to ½ cup extra hibiscus tea or water.",
      blenderTip: "Watermelon blends very fast — 20–30 seconds is enough. Don't over-blend or it becomes foamy.",
      subs: "Watermelon → frozen mango for a different colour and flavour. Hibiscus tea → chilled berry herbal tea.",
    },
    redsBoost: { why: "Radiant Reds is what makes this glass more than juice — adding the polyphenol density watermelon alone can't deliver.", proof: REDS_PROOF.hydration },
  },
  {
    id: "fig-almond", name: "Fig & Almond",
    gradient: G.creamGold, prep: "5 min", servings: "1",
    image: "/images/smoothies/almond-date-delight.png", imageAlt: "Creamy almond and fig date smoothie",
    benefitTag: "Gut nourishing",
    benefit: "Black fig for fiber and prebiotics, almond for healthy fats your skin barrier needs.",
    ingredients: [
      "3 ripe black figs, stems removed",
      "¼ cup raw almonds",
      "1 cup oat milk",
      "Pinch of ground cinnamon",
    ],
    method: [
      "Remove stems from figs. Add figs and almonds to blender.",
      "Pour in oat milk and add cinnamon.",
      "Blend on high for 60 seconds — figs need thorough blending.",
      "Taste. Add more cinnamon if desired. Serve immediately.",
    ],
    texture: {
      frozen: "Fresh figs work best for flavour. For a colder blend, refrigerate them for a few hours first.",
      liquid: "¾–1 cup oat milk.",
      thicker: "Add 1 extra fig and reduce oat milk to ¾ cup.",
      thinner: "Add up to ¼ cup extra oat milk.",
      blenderTip: "Blend for a full 60 seconds on high. Fig seeds can make this gritty — longer blending gives you a silk-smooth result.",
      subs: "Black figs → 2–3 Medjool dates (remove pits) for a similar sweetness. Almonds → cashews. Oat milk → almond milk.",
    },
    redsBoost: { why: "Radiant Reds layers prebiotic polyphenols on top of fig fiber — the duo your microbiome responds to fastest.", proof: REDS_PROOF.gut },
  },
  {
    id: "beet-glow", name: "Beet Glow",
    gradient: G.plumGold, prep: "6 min", servings: "1",
    image: "/images/smoothies/beetroot-glow.png", imageAlt: "Deep earthy beetroot glow smoothie",
    benefitTag: "Circulation",
    benefit: "Beet for nitric oxide and skin oxygenation, raspberry for ellagitannins, ginger for warmth.",
    ingredients: [
      "1 small beet (about 100g), roasted or steamed and cooled",
      "½ cup raspberries, fresh or frozen",
      "1-inch piece fresh ginger, peeled",
      "Juice of 1 orange (about ½ cup)",
    ],
    method: [
      "Roast or steam beet ahead of time. Cool completely before blending.",
      "Add beet, raspberries, and ginger to blender.",
      "Add fresh orange juice. Blend on high for 60 seconds.",
      "Strain through a fine mesh strainer if you want a silky, juice-like texture.",
    ],
    texture: {
      frozen: "Use cooled, cooked beet — not frozen. Add 3–4 ice cubes if you want the blend cold.",
      liquid: "Juice of 1 orange (about ½ cup). Add water for a thinner result.",
      thicker: "Add ½ frozen banana to the blend.",
      thinner: "Add up to ¼ cup water or extra orange juice.",
      blenderTip: "Blend for 60 seconds minimum — beet needs thorough blending. Strain through a fine mesh strainer if you want a silky texture.",
      subs: "Fresh beet → pre-cooked vacuum-packed beet. Raspberry → strawberry. Fresh ginger → ¼ tsp ground ginger.",
    },
    redsBoost: { why: "Radiant Reds doubles the beet nitrate load, deepening circulation and the lit-from-within glow this recipe is built for.", proof: REDS_PROOF.energy },
  },
  {
    id: "golden-turmeric", name: "Golden Turmeric Latte",
    gradient: G.creamGold, prep: "5 min", servings: "1",
    image: "/images/smoothies/golden-turmeric-glow.png", imageAlt: "Warm golden turmeric glow latte",
    benefitTag: "Calm & warm",
    benefit: "Curcumin with healthy fat and black pepper — a classic warming, soothing morning ritual.",
    ingredients: [
      "1 cup oat milk",
      "½ tsp ground turmeric",
      "Pinch of ground cinnamon",
      "Tiny pinch of black pepper (helps absorption)",
      "1 tsp raw honey",
      "2 tbsp crushed almonds (topping)",
    ],
    method: [
      "Warm oat milk in a small saucepan over low heat. Do not boil.",
      "Whisk in turmeric, cinnamon, and black pepper until smooth.",
      "Off heat, stir in honey.",
      "Pour into a mug and top with crushed almonds.",
    ],
    redsBoost: { why: "Once cooled to drinking temperature, stir in a scoop of Radiant Reds to add polyphenols turmeric can't deliver alone.", proof: REDS_PROOF.gut },
  },
  {
    id: "matcha-cloud", name: "Matcha Cloud",
    gradient: G.sageIvory, prep: "4 min", servings: "1",
    image: "/images/smoothies/matcha-green-energy.png", imageAlt: "Vibrant green matcha energy cloud",
    benefitTag: "EGCG",
    benefit: "Ceremonial matcha for EGCG — one of the most-studied polyphenols for skin protection.",
    ingredients: [
      "1 tsp ceremonial-grade matcha powder",
      "2 tbsp hot water (for whisking — not boiling)",
      "½ ripe banana, preferably frozen",
      "¾ cup almond milk",
      "1 tsp raw honey",
      "Ice to serve",
    ],
    method: [
      "Sift matcha into a small bowl. Whisk with 2 tbsp hot (not boiling) water until no lumps remain.",
      "Add whisked matcha, frozen banana, almond milk, and honey to blender.",
      "Blend on high for 45 seconds until creamy.",
      "Pour over ice and serve immediately.",
    ],
    texture: {
      frozen: "Use a frozen banana for a naturally thick, creamy texture without needing extra ice.",
      liquid: "¾ cup almond milk.",
      thicker: "Use a fully frozen banana and reduce almond milk to ½ cup.",
      thinner: "Add up to ¼ cup extra almond milk.",
      blenderTip: "Whisk matcha separately first to remove lumps, then add to blender. Pour over ice immediately — matcha oxidizes quickly.",
      subs: "Ceremonial matcha → culinary-grade matcha (less delicate). Almond milk → oat milk. Banana → ½ avocado for less sweetness.",
    },
    redsBoost: { why: "Radiant Reds pairs EGCG with anthocyanins — two polyphenol families your skin uses through different pathways.", proof: REDS_PROOF.skin },
  },
  {
    id: "lavender-honey", name: "Lavender Honey Tonic",
    gradient: G.lavenderIvory, prep: "3 min", servings: "1",
    image: "/images/smoothies/banana-vanilla-glow.png", imageAlt: "Creamy lavender honey tonic",
    benefitTag: "Calming",
    benefit: "Culinary lavender steeped with raw honey — soft on the nervous system, kind to digestion.",
    ingredients: [
      "1 tsp culinary dried lavender",
      "1 cup hot water",
      "1 tbsp raw honey",
      "Juice of ½ lemon",
      "Fresh mint leaves (garnish)",
    ],
    method: [
      "Steep culinary lavender in 1 cup just-boiled water for 4 minutes.",
      "Strain through a fine mesh strainer.",
      "Stir in honey and lemon juice.",
      "Garnish with fresh mint. Sip slowly while warm.",
    ],
    redsBoost: { why: "After it cools to drinking temperature, stir in a scoop of Radiant Reds — calm becomes a full polyphenol ritual.", proof: REDS_PROOF.recovery },
  },
  {
    id: "rose-cardamom", name: "Rose Cardamom Mylk",
    gradient: G.roseSand, prep: "5 min", servings: "1",
    image: "/images/smoothies/banana-vanilla-glow.png", imageAlt: "Creamy rose cardamom mylk",
    benefitTag: "Soothing",
    benefit: "Cardamom and rose with creamy oat milk — warming, comforting, gentle.",
    ingredients: [
      "1 cup oat milk",
      "¼ tsp ground cardamom",
      "Pinch of ground cinnamon",
      "1 tsp rose water (culinary grade)",
      "1 tsp raw honey",
    ],
    method: [
      "Warm oat milk in a small saucepan over low heat with cardamom and cinnamon. Do not boil.",
      "Remove from heat. Stir in rose water and honey.",
      "Pour into a warm mug. Sip slowly.",
    ],
    redsBoost: { why: "Radiant Reds folds in beautifully once the mylk cools to drinking temperature, adding the polyphenol layer.", proof: REDS_PROOF.skin },
  },
  {
    id: "blueberry-basil", name: "Blueberry Basil",
    gradient: G.plumLavender, prep: "4 min", servings: "1",
    image: "/images/smoothies/blueberry-antioxidant.png", imageAlt: "Deep blueberry antioxidant and basil smoothie",
    benefitTag: "Antioxidant",
    benefit: "Wild blueberries with fresh basil — anthocyanins meet aromatic polyphenols.",
    ingredients: [
      "1 cup wild blueberries, fresh or frozen",
      "½ ripe banana",
      "4 large fresh basil leaves",
      "1 cup almond milk",
      "Zest of ½ lemon",
    ],
    method: [
      "Add blueberries, banana, and almond milk to blender. Blend 30 seconds.",
      "Add basil leaves and lemon zest. Pulse 5–6 times — don't over-blend basil.",
      "Serve immediately (blueberry deepens in colour as it sits).",
    ],
    texture: {
      frozen: "Use frozen wild blueberries — they blend into a gorgeous deep purple and keep the smoothie thick and cold.",
      liquid: "¾–1 cup almond milk.",
      thicker: "Use all frozen blueberries and only ¾ cup milk.",
      thinner: "Add up to ¼ cup extra almond milk.",
      blenderTip: "Add basil leaves last and pulse briefly — over-blending basil can make it taste bitter.",
      subs: "Wild blueberries → regular blueberries. Basil → fresh mint. Banana → ¼ avocado.",
    },
    redsBoost: { why: "A scoop of Radiant Reds compounds the anthocyanin load — your microbiome converts both into the metabolites your skin uses.", proof: REDS_PROOF.glow },
  },
  {
    id: "papaya-lime", name: "Papaya Lime",
    gradient: G.goldRose, prep: "3 min", servings: "1",
    image: "/images/smoothies/tropical-radiance.png", imageAlt: "Bright tropical papaya lime radiance smoothie",
    benefitTag: "Digestive ease",
    benefit: "Papaya enzymes plus citrus and coconut yogurt for a glowing, gently supportive morning.",
    ingredients: [
      "1½ cups fresh papaya, cubed (seeds removed)",
      "Juice of 1 lime",
      "2 tbsp coconut yogurt",
      "Small handful fresh mint leaves",
    ],
    method: [
      "Cube papaya and add to blender with lime juice.",
      "Add coconut yogurt. Blend 20–30 seconds — papaya blends very fast.",
      "Tear in fresh mint and pulse once or twice.",
      "Serve cold, over ice if desired.",
    ],
    texture: {
      frozen: "Fresh papaya works best for flavour and enzymes. Chill well before blending, or freeze papaya chunks overnight.",
      liquid: "2 tbsp coconut yogurt is the creamy base — no additional liquid needed. Add 2–3 tbsp almond milk to loosen.",
      thicker: "Use frozen papaya chunks.",
      thinner: "Add 2–3 tbsp almond milk or a splash of coconut water.",
      blenderTip: "Blend for 20–30 seconds — papaya is naturally smooth and blends very fast. Don't over-blend.",
      subs: "Papaya → ripe mango. Coconut yogurt → any dairy-free yogurt. Lime → lemon.",
    },
    redsBoost: { why: "Radiant Reds adds the polyphenol density papaya is missing — turning a digestive glass into a full-spectrum ritual.", proof: REDS_PROOF.gut },
  },
  {
    id: "peach-saffron", name: "Peach & Saffron",
    gradient: G.creamGold, prep: "5 min", servings: "1",
    image: "/images/smoothies/peachy-radiance.png", imageAlt: "Golden peachy saffron radiance smoothie",
    benefitTag: "Mood",
    benefit: "A pinch of saffron with stone fruit — a traditionally used combination for steady mood and skin tone.",
    ingredients: [
      "Small pinch saffron threads (about 10–12 threads)",
      "2 tbsp warm almond milk (for steeping saffron)",
      "1 ripe peach, pitted and sliced",
      "½ cup almond milk",
      "1 tsp raw honey",
      "Pinch of ground cinnamon (topping)",
    ],
    method: [
      "Steep saffron threads in 2 tbsp warm almond milk for 3–5 minutes until golden.",
      "Add saffron milk, peach slices, and remaining almond milk to blender.",
      "Add honey. Blend on high for 45 seconds.",
      "Pour into a glass and top with a pinch of cinnamon.",
    ],
    texture: {
      frozen: "Use ripe fresh peach. For a colder texture, freeze peach slices overnight and omit ice.",
      liquid: "½ cup almond milk.",
      thicker: "Use frozen peach slices and reduce milk to ½ cup.",
      thinner: "Add up to ¼ cup extra almond milk.",
      blenderTip: "Steep saffron in warm almond milk for at least 3–5 minutes before blending — this releases flavour and the beautiful golden colour.",
      subs: "Peach → ripe nectarine or mango. Saffron → small pinch turmeric for colour (different flavour). Almond milk → oat milk.",
    },
    redsBoost: { why: "Radiant Reds layers anthocyanins and ellagitannins — supporting the steady tone saffron is known for.", proof: REDS_PROOF.skin },
  },
  {
    id: "fig-vanilla", name: "Fig & Vanilla Cream",
    gradient: G.creamGold, prep: "4 min", servings: "1",
    image: "/images/smoothies/oatmeal-cookie-smoothie.png", imageAlt: "Creamy oat and fig vanilla cookie smoothie",
    benefitTag: "Gut nourishing",
    benefit: "Black mission figs blended with vanilla and oat milk — silky, prebiotic, skin-kind.",
    ingredients: [
      "4 ripe black mission figs, stems removed",
      "1 cup oat milk",
      "¼ tsp pure vanilla extract",
      "1 tsp raw honey",
      "2 tbsp crushed raw almonds (topping)",
    ],
    method: [
      "Remove stems from figs. Add to blender with oat milk.",
      "Blend on high for 60 seconds until smooth.",
      "Add vanilla extract and honey. Blend 10 seconds more.",
      "Pour into a glass and top with crushed almonds.",
    ],
    texture: {
      frozen: "Fresh figs work best. Refrigerate them well before blending for a colder result.",
      liquid: "¾–1 cup oat milk.",
      thicker: "Add 1 extra fig and reduce oat milk to ¾ cup.",
      thinner: "Add up to ¼ cup extra oat milk.",
      blenderTip: "Blend for a full 60 seconds. Fig seeds need thorough blending. Strain if you prefer ultra-smooth.",
      subs: "Black figs → 3 Medjool dates (pits removed) plus ½ banana. Vanilla extract → pinch of cardamom.",
    },
    redsBoost: { why: "Radiant Reds amplifies the prebiotic effect of fig fiber — a 1+1=3 combination for the microbiome.", proof: REDS_PROOF.gut },
  },
  {
    id: "cucumber-mint", name: "Cucumber Mint Cooler",
    gradient: G.mintIvory, prep: "3 min", servings: "1",
    image: "/images/smoothies/cucumber-apple-refresh.png", imageAlt: "Cool cucumber and apple refresh smoothie",
    benefitTag: "Hydration",
    benefit: "Pure hydration with mineral-rich cucumber and cooling mint — the lightest morning glass.",
    ingredients: [
      "1 large cucumber (about 250g), roughly chopped",
      "Juice of ½ lime",
      "Small handful fresh mint leaves (about 10 leaves)",
      "Ice to serve",
      "Sparkling water to top",
    ],
    method: [
      "Add cucumber, lime juice, and mint to blender. Blend 20–30 seconds.",
      "Strain through a fine mesh strainer over a glass filled with ice.",
      "Top with sparkling water. Stir gently and serve.",
    ],
    texture: {
      frozen: "No frozen ingredients needed. Serve very cold over crushed ice for the best effect.",
      liquid: "Sparkling water to top — no set amount, add to your taste.",
      thicker: "Skip straining and add less sparkling water.",
      thinner: "Strain through a fine mesh strainer and top generously with sparkling water.",
      blenderTip: "Blend 20–30 seconds — cucumber liquifies quickly. Strain through a fine mesh for a cleaner, juice-like drink.",
      subs: "Cucumber → zucchini (milder flavour). Mint → fresh basil. Lime → lemon.",
    },
    redsBoost: { why: "Stir in a scoop of Radiant Reds — the only thing this glass is missing is polyphenols.", proof: REDS_PROOF.hydration },
  },
  {
    id: "apricot-almond", name: "Apricot Almond Glow",
    gradient: G.goldSand, prep: "4 min", servings: "1",
    image: "/images/smoothies/citrus-skin-smoothie.png", imageAlt: "Golden apricot and almond smoothie",
    benefitTag: "Skin tone",
    benefit: "Apricots are quietly carotenoid-rich — a soft, lit-from-within tone enhancer paired with vitamin E from almonds.",
    ingredients: [
      "3 ripe apricots, pitted and halved",
      "¼ cup raw almonds",
      "¾ cup oat milk",
      "1 tsp raw honey",
    ],
    method: [
      "Add apricots and almonds to blender.",
      "Pour in oat milk and add honey.",
      "Blend on high for 45 seconds until silky.",
      "Serve immediately, or refrigerate for up to 4 hours.",
    ],
    texture: {
      frozen: "Use ripe fresh apricots. For a thicker blend, freeze apricot halves for 2+ hours.",
      liquid: "¾ cup oat milk.",
      thicker: "Use frozen apricots and ½ cup milk.",
      thinner: "Add up to ¼ cup extra oat milk.",
      blenderTip: "Blend for 45 seconds. If using frozen apricots, run the blender for a full 60 seconds for smoothness.",
      subs: "Apricot → ripe peach or nectarine. Almonds → cashews or macadamia. Oat milk → almond milk.",
    },
    redsBoost: { why: "Radiant Reds pairs carotenoids with anthocyanins — the two pigment families your glow is built on.", proof: REDS_PROOF.skin },
  },
  {
    id: "kiwi-spinach", name: "Kiwi Spinach Light",
    gradient: G.sageGold, prep: "4 min", servings: "1",
    image: "/images/smoothies/kiwi-lime-glow.png", imageAlt: "Bright green kiwi and lime smoothie",
    benefitTag: "Vitamin C",
    benefit: "Kiwi for vitamin C, baby spinach for chlorophyll — a quietly powerful skin-tone glass.",
    ingredients: [
      "2 ripe kiwis, peeled and halved",
      "1 large handful baby spinach (about 1 cup packed)",
      "½ banana, frozen",
      "1 cup almond milk",
      "Juice of ½ lime",
    ],
    method: [
      "Add baby spinach and almond milk to blender. Blend 30 seconds until spinach is fully broken down.",
      "Add kiwi, frozen banana, and lime juice.",
      "Blend on high for 45 seconds until smooth and bright green.",
      "Serve immediately for the best colour.",
    ],
    texture: {
      frozen: "Freeze banana slices overnight — this is the key to a thick green smoothie without ice diluting the colour.",
      liquid: "¾–1 cup almond milk.",
      thicker: "Use a fully frozen banana and reduce milk to ¾ cup.",
      thinner: "Add up to ¼ cup extra almond milk.",
      blenderTip: "Blend spinach with liquid first (30 seconds), then add remaining ingredients. This prevents spinach chunks and gives the cleanest green colour.",
      subs: "Baby spinach → kale (stronger flavour) or romaine. Kiwi → pineapple. Banana → ½ avocado.",
    },
    redsBoost: { why: "Radiant Reds completes the picture — chlorophyll plus polyphenols cover the full plant-pigment spectrum.", proof: REDS_PROOF.glow },
  },
  {
    id: "vanilla-chia", name: "Vanilla Chia Pudding",
    image: "/images/smoothies/banana-vanilla-glow.png", imageAlt: "Creamy banana vanilla smoothie",
    gradient: G.creamGold, prep: "5 min + overnight", servings: "1",
    benefitTag: "Omega-3",
    benefit: "Plant omega-3, slow-release fiber, soft vanilla cream — the gentle skin-barrier breakfast.",
    ingredients: [
      "3 tbsp chia seeds",
      "1 cup oat milk",
      "¼ tsp pure vanilla extract",
      "1 tsp raw honey",
      "2 tbsp crushed raw almonds (topping)",
      "Pinch of ground cinnamon (topping)",
    ],
    method: [
      "Stir chia seeds into oat milk with vanilla extract and honey.",
      "Mix well — chia seeds clump if not stirred fully.",
      "Refrigerate overnight (or at least 4 hours) until thick and pudding-like.",
      "Stir once more before serving. Top with crushed almonds and cinnamon.",
    ],
    redsBoost: { why: "Sprinkle a scoop of Radiant Reds on top — omega-3 plus polyphenols is the barrier-and-glow combo your skin asks for.", proof: REDS_PROOF.skin },
  },
  {
    id: "ginger-pear", name: "Ginger Pear Warmth",
    gradient: G.goldSand, prep: "4 min", servings: "1",
    image: "/images/smoothies/ginger-lemon-reset.png", imageAlt: "Warming ginger lemon and pear reset smoothie",
    benefitTag: "Digestive ease",
    benefit: "Pear and warming ginger — gentle morning support with quiet polyphenol density.",
    ingredients: [
      "1 ripe pear, cored and roughly chopped",
      "1-inch piece fresh ginger, peeled",
      "Juice of ½ orange (about ¼ cup)",
      "1 tsp raw honey",
      "Pinch of ground cinnamon",
    ],
    method: [
      "Add pear and ginger to blender. Blend 20 seconds.",
      "Add orange juice, honey, and cinnamon.",
      "Blend on high for 30–45 seconds until smooth.",
      "Serve over ice or gently warmed.",
    ],
    texture: {
      frozen: "Fresh ripe pear works best. For a colder smoothie, freeze pear chunks overnight.",
      liquid: "Juice of ½ orange (about ¼ cup). Add water for a thinner result.",
      thicker: "Add a small frozen banana alongside the pear.",
      thinner: "Add up to ¼ cup extra water or apple juice.",
      blenderTip: "Blend for 30–45 seconds. Pear blends very smoothly — don't over-blend or it becomes airy.",
      subs: "Pear → ripe apple. Fresh ginger → ¼ tsp ground ginger. Orange juice → lemon juice + a little extra honey.",
    },
    redsBoost: { why: "Radiant Reds turns digestive comfort into a polyphenol ritual — the same glass, twice the work.", proof: REDS_PROOF.gut },
  },
  {
    id: "honey-almond", name: "Honey Almond Tonic",
    gradient: G.creamGold, prep: "3 min", servings: "1",
    image: "/images/smoothies/banana-vanilla-glow.png", imageAlt: "Creamy honey almond tonic",
    benefitTag: "Clean energy",
    benefit: "Raw honey, almond butter, oat milk — clean morning energy without caffeine.",
    ingredients: [
      "1 tbsp almond butter",
      "1 cup oat milk",
      "1 tsp raw honey",
      "Dash of ground cinnamon",
    ],
    method: [
      "Add almond butter and oat milk to blender.",
      "Add honey and cinnamon.",
      "Blend for 20–30 seconds until smooth and slightly frothy.",
      "Serve warm or cold depending on the season.",
    ],
    texture: {
      frozen: "Add 2–3 ice cubes for a cold version. Serve warm in winter by gently heating oat milk before blending.",
      liquid: "1 cup oat milk.",
      thicker: "Add a second tbsp of almond butter.",
      thinner: "Add up to ¼ cup extra oat milk.",
      blenderTip: "Blend 20–30 seconds. Almond butter emulsifies quickly — don't over-blend or it becomes too frothy.",
      subs: "Almond butter → cashew butter or tahini. Oat milk → almond milk or any plant milk.",
    },
    redsBoost: { why: "Stir in Radiant Reds for steady, polyphenol-backed energy that doesn't crash.", proof: REDS_PROOF.energy },
  },

  // ——— 5 BONUS RECIPES ———
  {
    id: "bonus-cacao-tonic", name: "Midnight Cacao Tonic",
    gradient: G.plumDeep, bonus: true,
    image: "/images/smoothies/cacao-cinnamon-balance.png", imageAlt: "Dark midnight cacao tonic",
    prep: "5 min", servings: "1", benefitTag: "Wind-down",
    benefit: "An evening polyphenol ritual — cacao flavanols and warm spice for skin recovery while you sleep.",
    ingredients: [
      "1 cup oat milk",
      "1 tbsp raw cacao powder",
      "Pinch of ground cinnamon",
      "1 tsp raw honey",
    ],
    method: [
      "Warm oat milk gently in a saucepan over low heat. Do not boil.",
      "Whisk in cacao and cinnamon until smooth.",
      "Off heat, stir in honey.",
      "Sip an hour before bed.",
    ],
    redsBoost: { why: "A small scoop of Radiant Reds in the evening adds the recovery polyphenols your skin uses overnight.", proof: REDS_PROOF.recovery },
  },
  {
    id: "bonus-rose-collagen", name: "Rose Collagen Float",
    gradient: G.roseSand, bonus: true,
    image: "/images/smoothies/avocado-dream.png", imageAlt: "Silky avocado rose collagen float",
    prep: "3 min", servings: "1", benefitTag: "Skin support",
    benefit: "A delicate collagen-supportive sip — vitamin C from strawberries, rose, and a sparkling finish.",
    ingredients: [
      "4 ripe strawberries, hulled",
      "Juice of ½ lime",
      "1 tsp rose water (culinary grade)",
      "1 tsp raw honey",
      "Sparkling water to top (about ½ cup)",
    ],
    method: [
      "Muddle or mash strawberries with lime juice in a glass.",
      "Stir in rose water and honey.",
      "Top with sparkling water. Stir gently.",
      "Serve over ice.",
    ],
    redsBoost: { why: "Radiant Reds completes the collagen support story — vitamin C plus polyphenols is the proven duo.", proof: REDS_PROOF.skin },
  },
  {
    id: "bonus-green-glow", name: "The Green Glow",
    gradient: G.sageGold, bonus: true,
    image: "/images/smoothies/green-goddess.png", imageAlt: "Vibrant green goddess glow smoothie",
    prep: "4 min", servings: "1", benefitTag: "Midday reset",
    benefit: "Cucumber, mint, kiwi, lime — a chlorophyll-forward midday reset that leaves you feeling clean.",
    ingredients: [
      "1 cucumber (about 250g), roughly chopped",
      "2 ripe kiwis, peeled",
      "Small handful fresh mint leaves",
      "½ banana, frozen",
      "½ cup almond milk",
      "Juice of ½ lime",
    ],
    method: [
      "Add cucumber and almond milk to blender. Blend 30 seconds.",
      "Add kiwi, frozen banana, mint, and lime juice.",
      "Blend on high for 45 seconds until fully smooth.",
      "Serve immediately for the brightest colour.",
    ],
    texture: {
      frozen: "Freeze banana slices for a thick green smoothie. Cucumber and kiwi work best fresh.",
      liquid: "½ cup almond milk.",
      thicker: "Use a frozen banana and reduce milk to ½ cup.",
      thinner: "Add up to ¼ cup extra almond milk.",
      blenderTip: "Blend cucumber and kiwi with liquid first, then add banana and mint for the cleanest green colour.",
      subs: "Kiwi → green apple. Mint → fresh basil or a handful of spinach. Banana → ½ avocado.",
    },
    redsBoost: { why: "Radiant Reds rounds out the green pigments with red-pigment polyphenols — the full plant-pigment spectrum.", proof: REDS_PROOF.glow },
  },
  {
    id: "bonus-warm-elixir", name: "Warm Berry Elixir",
    gradient: G.plumGold, bonus: true,
    image: "/images/smoothies/berry-glow-elixir.png", imageAlt: "Warm berry glow elixir",
    prep: "6 min", servings: "1", benefitTag: "Comfort",
    benefit: "A warm winter polyphenol cup for when cold smoothies feel too sharp.",
    ingredients: [
      "2 hibiscus tea bags (or 2 tsp loose hibiscus)",
      "1-inch piece fresh ginger",
      "2 cups hot water",
      "½ cup fresh blueberries",
      "1 tsp raw honey",
      "Pinch of ground cinnamon",
    ],
    method: [
      "Steep hibiscus tea bags with ginger in 2 cups just-boiled water for 6 minutes.",
      "Remove tea bags and ginger.",
      "Muddle blueberries in the bottom of a mug.",
      "Pour warm tea over blueberries. Stir in honey and cinnamon.",
    ],
    redsBoost: { why: "Once cooled to drinking temperature, stir in Radiant Reds — heat-sensitive polyphenols stay intact.", proof: REDS_PROOF.skin },
  },
  {
    id: "bonus-glow-sorbet", name: "Glow Sorbet Bowl",
    gradient: G.lavenderIvory, bonus: true,
    image: "/images/smoothies/banana-vanilla-glow.png", imageAlt: "Creamy banana berry sorbet bowl",
    prep: "5 min", servings: "1", benefitTag: "Treat",
    benefit: "A frozen ritual — banana, berry, almond cream — the dessert that nourishes your skin back.",
    ingredients: [
      "1 ripe banana, fully frozen (6+ hours)",
      "½ cup blueberries, fully frozen",
      "2 tbsp coconut yogurt",
      "1 tbsp almond butter",
      "1 tsp raw honey (topping)",
    ],
    method: [
      "Both banana and blueberries must be fully frozen. This is non-negotiable for sorbet texture.",
      "Add frozen banana and blueberries to a high-speed blender or food processor.",
      "Add coconut yogurt and almond butter. Blend in short pulses, scraping sides frequently.",
      "Scoop into a chilled bowl and drizzle with honey. Serve immediately.",
    ],
    texture: {
      frozen: "Both banana and blueberries must be fully frozen (at least 6 hours). This is what creates the sorbet-like texture.",
      liquid: "2 tbsp coconut yogurt only — no additional liquid. If needed, add 1 tbsp at a time.",
      thicker: "Use fully frozen fruit and blend in short pulses. Don't let it warm up.",
      thinner: "Add 1 tbsp coconut yogurt or almond milk at a time.",
      blenderTip: "Use a food processor or high-speed blender with a tamper. Stop and scrape sides frequently. Work quickly — sorbet melts fast.",
      subs: "Frozen banana → frozen mango. Blueberries → mixed frozen berries. Coconut yogurt → any thick dairy-free yogurt.",
    },
    redsBoost: { why: "Sprinkle Radiant Reds on top — sorbet becomes a polyphenol ritual without losing the indulgence.", proof: REDS_PROOF.glow },
  },
];

// ─────────────────────────────────────────────
// Ingredients
// ─────────────────────────────────────────────

export type Ingredient = {
  name: string; tagline: string; description: string; gut: string; skin: string;
  alsoIn: string[];
};

export const INGREDIENTS: Ingredient[] = [
  { name: "Pomegranate", tagline: "Ellagic acid + punicalagins",
    description: "Two of the most studied polyphenols for skin health. Supports collagen protection and reduces UV-related skin damage.",
    gut: "Feeds beneficial bacteria; metabolized into urolithin A.", skin: "Clarity, elasticity, tone.",
    alsoIn: ["The Pomegranate Glow Elixir", "Radiant Reds blend"] },
  { name: "Raspberry", tagline: "Ellagitannins, vitamin C",
    description: "Tiny berries with one of the highest polyphenol densities by weight. Supports collagen production via vitamin C.",
    gut: "Soluble fiber feeds the microbiome.", skin: "Brightness, evenness.",
    alsoIn: ["Berry Bloom", "Beet Glow"] },
  { name: "Strawberry", tagline: "Vitamin C, ellagic acid",
    description: "More vitamin C than oranges by weight. Supports the collagen synthesis pathway your skin uses every day.",
    gut: "Polyphenols modulate inflammation in the gut lining.", skin: "Tone, firmness.",
    alsoIn: ["Berry Bloom"] },
  { name: "Tart cherry", tagline: "Anthocyanins, melatonin",
    description: "One of the highest-anthocyanin foods. Studied for skin elasticity, recovery, and sleep — all of which show in your face.",
    gut: "Anti-inflammatory effects in the gut lining.", skin: "Recovery, elasticity.",
    alsoIn: ["Cherry Cacao"] },
  { name: "Blueberry", tagline: "Anthocyanins, vitamin K",
    description: "Classic for a reason. The anthocyanins protect skin cells from oxidative damage every day.",
    gut: "Increases bifidobacteria diversity.", skin: "Protection, glow.",
    alsoIn: ["Berry Bloom"] },
  { name: "Plum", tagline: "Chlorogenic acid, fiber",
    description: "Underrated polyphenol source. The chlorogenic acid is the same beneficial compound found in green coffee.",
    gut: "Gentle motility support.", skin: "Tone evenness.",
    alsoIn: ["Plum & Rose"] },
  { name: "Watermelon", tagline: "Lycopene, citrulline",
    description: "Hydration plus lycopene — a carotenoid with skin-protective effects against UV stress.",
    gut: "Hydrates the gut lining.", skin: "UV defense, clarity.",
    alsoIn: ["Watermelon Hibiscus"] },
  { name: "Black fig", tagline: "Soluble fiber, polyphenols",
    description: "One of the best prebiotic fruits. The fiber feeds the bacteria you spent the morning building up.",
    gut: "Prebiotic — feeds gut bacteria directly.", skin: "Indirect: better gut means clearer skin.",
    alsoIn: ["Fig & Almond", "Fig & Vanilla Cream"] },
  { name: "Beet", tagline: "Nitrates, betalains",
    description: "Nitrates support nitric oxide production and skin oxygenation. Betalains are powerful antioxidants.",
    gut: "Supports liver detox pathways.", skin: "Oxygenation, glow.",
    alsoIn: ["Beet Glow"] },
  { name: "Hibiscus", tagline: "Anthocyanins, quercetin",
    description: "Vivid red tea high in vascular-supportive polyphenols. Long traditional use for circulation and skin tone.",
    gut: "Mild prebiotic.", skin: "Tone, blood-vessel support.",
    alsoIn: ["Watermelon Hibiscus"] },
  { name: "Cacao", tagline: "Flavanols, magnesium",
    description: "Cacao flavanols are some of the most-studied for skin hydration and circulation.",
    gut: "Modulates microbiome composition.", skin: "Hydration, density.",
    alsoIn: ["Cherry Cacao", "Midnight Cacao Tonic"] },
  { name: "Almond", tagline: "Vitamin E, healthy fats",
    description: "Vitamin E is a primary lipid-soluble antioxidant your skin barrier needs.",
    gut: "Fiber feeds beneficial bacteria.", skin: "Barrier strength.",
    alsoIn: ["Cherry Cacao", "Fig & Almond"] },
  { name: "Oat milk", tagline: "Beta-glucans",
    description: "Beta-glucans support gut lining and skin barrier. Gentle base for morning rituals.",
    gut: "Soothing soluble fiber.", skin: "Barrier support.",
    alsoIn: ["The Pomegranate Glow Elixir", "Cherry Cacao", "Fig & Almond"] },
  { name: "Almond milk", tagline: "Light base",
    description: "Low-sugar, gentle base. Pairs well with high-polyphenol fruits without competing.",
    gut: "Easy on digestion.", skin: "Neutral.",
    alsoIn: ["Berry Bloom", "Matcha Cloud"] },
  { name: "Chia seeds", tagline: "Omega-3, fiber",
    description: "Plant omega-3 ALA and soluble fiber. Both support skin barrier and gut motility.",
    gut: "Forms a soothing gel.", skin: "Barrier, hydration.",
    alsoIn: ["Berry Bloom", "Vanilla Chia Pudding"] },
  { name: "Cinnamon", tagline: "Polyphenols, blood-sugar support",
    description: "A small pinch helps blunt morning blood sugar — relevant for skin clarity.",
    gut: "Mild antimicrobial.", skin: "Reduces glycation stress.",
    alsoIn: ["Cherry Cacao", "Fig & Almond"] },
  { name: "Honey", tagline: "Trace polyphenols",
    description: "A small amount of raw honey adds gentle sweetness and trace antioxidants.",
    gut: "Some prebiotic effect.", skin: "Indirect.",
    alsoIn: ["Plum & Rose"] },
  { name: "Rose water", tagline: "Calming aromatic",
    description: "Mildly anti-inflammatory and aromatic. A traditional addition to feminine wellness rituals.",
    gut: "Calming.", skin: "Soothing, calming.",
    alsoIn: ["Plum & Rose", "Rose Cardamom Mylk"] },
  { name: "Coconut yogurt", tagline: "Probiotics, fats",
    description: "Probiotic base with healthy medium-chain fats. Pairs beautifully with stone fruits.",
    gut: "Live cultures.", skin: "Indirect via gut.",
    alsoIn: ["Plum & Rose"] },
  { name: "Lime", tagline: "Vitamin C, brightness",
    description: "Brightens flavor and adds vitamin C without the bulk of orange juice.",
    gut: "Mild digestive support.", skin: "Vitamin C cofactor.",
    alsoIn: ["The Pomegranate Glow Elixir", "Watermelon Hibiscus"] },
  { name: "Orange", tagline: "Vitamin C, hesperidin",
    description: "Hesperidin is a citrus flavonoid with vascular and skin-tone benefits.",
    gut: "Soluble fiber.", skin: "Tone, micro-circulation.",
    alsoIn: ["Beet Glow"] },
  { name: "Banana", tagline: "Potassium, prebiotics",
    description: "Resistant starch in slightly green bananas feeds gut bacteria.",
    gut: "Prebiotic.", skin: "Indirect.",
    alsoIn: ["Berry Bloom", "Matcha Cloud"] },
  { name: "Ginger", tagline: "Gingerols",
    description: "Warming, anti-inflammatory, and motility-supportive. Long traditional use in morning rituals.",
    gut: "Motility, anti-nausea.", skin: "Anti-inflammatory.",
    alsoIn: ["Beet Glow", "Ginger Pear Warmth"] },
  { name: "Lemon", tagline: "Vitamin C, citric acid",
    description: "Warm lemon water is the gentlest way to begin the morning ritual.",
    gut: "Mild digestive support.", skin: "Vitamin C cofactor.",
    alsoIn: ["Warm lemon water (Day 1)"] },
  { name: "Radiant Reds", tagline: "NOURÉ blend",
    description: "The polyphenol-dense base of every morning. Pomegranate, beet, hibiscus, açaí, and more in one scoop.",
    gut: "Multi-source polyphenol load.", skin: "Glow, clarity, tone.",
    alsoIn: ["The Pomegranate Glow Elixir", "Watermelon Hibiscus"] },
  { name: "Açaí", tagline: "Anthocyanins, healthy fats",
    description: "Amazonian berry with one of the highest antioxidant scores measured.",
    gut: "Polyphenol fermentation.", skin: "Protection, glow.",
    alsoIn: ["Radiant Reds"] },
  { name: "Green tea", tagline: "EGCG",
    description: "EGCG is one of the most studied skin-protective polyphenols.",
    gut: "Microbiome diversity.", skin: "UV defense, clarity.",
    alsoIn: ["Matcha Cloud"] },
  { name: "Turmeric", tagline: "Curcumin",
    description: "Curcumin is a strong anti-inflammatory; pair with black pepper for absorption.",
    gut: "Anti-inflammatory.", skin: "Tone, calmness.",
    alsoIn: ["Golden Turmeric Latte"] },
  { name: "Mint", tagline: "Aromatic herb",
    description: "Cooling, digestion-supportive herb. A small handful elevates any morning blend.",
    gut: "Soothing.", skin: "Indirect.",
    alsoIn: ["Cucumber Mint Cooler", "The Green Glow"] },
  { name: "Papaya", tagline: "Papain enzymes, vitamin C",
    description: "Papain enzymes support gentle digestion. Vitamin C cofactor for collagen synthesis.",
    gut: "Digestive enzyme support.", skin: "Brightness, tone.",
    alsoIn: ["Papaya Lime"] },
  { name: "Kiwi", tagline: "Vitamin C, actinidin",
    description: "More vitamin C than oranges. Actinidin supports protein digestion.",
    gut: "Digestive enzyme support.", skin: "Tone, brightness.",
    alsoIn: ["Kiwi Spinach Light", "The Green Glow"] },
  { name: "Saffron", tagline: "Crocin, safranal",
    description: "A pinch of saffron steeps into warm milk for flavour and a traditional mood-supportive effect.",
    gut: "Mild calming effect.", skin: "Steady tone.",
    alsoIn: ["Peach & Saffron"] },
  { name: "Pear", tagline: "Quercetin, fiber",
    description: "Gentle, fiber-rich fruit. Quercetin is a flavonoid with anti-inflammatory properties.",
    gut: "Soluble fiber, gentle motility.", skin: "Anti-inflammatory.",
    alsoIn: ["Ginger Pear Warmth"] },
  { name: "Almond butter", tagline: "Vitamin E, protein",
    description: "Adds creaminess and healthy fats. Vitamin E supports the skin barrier.",
    gut: "Satiating, easy on digestion.", skin: "Barrier strength.",
    alsoIn: ["Cherry Cacao"] },
  { name: "Spinach", tagline: "Chlorophyll, folate",
    description: "A handful of baby spinach adds chlorophyll without changing the flavour significantly.",
    gut: "Magnesium, gentle alkalizing.", skin: "Indirect via nutrients.",
    alsoIn: ["Kiwi Spinach Light"] },
];

// ─────────────────────────────────────────────
// Grocery List
// ─────────────────────────────────────────────

export type GroceryCategory = "fruits" | "greens" | "liquids" | "seeds-fats" | "boosters" | "pantry";

export const GROCERY_CATEGORY_LABELS: Record<GroceryCategory, string> = {
  fruits:      "Fruits & Berries",
  greens:      "Greens & Herbs",
  liquids:     "Liquids & Yogurt",
  "seeds-fats":"Seeds & Fats",
  boosters:    "Boosters & Powders",
  pantry:      "Pantry Staples",
};

export type GroceryItem = {
  id: string;
  name: string;
  weeklyQty: string;
  fullQty: string;
  category: GroceryCategory;
};

export const GROCERY_ITEMS: GroceryItem[] = [
  // Fruits
  { id: "pomegranate-seeds", name: "Pomegranate seeds (or 100% juice)", weeklyQty: "2 cups", fullQty: "6 cups", category: "fruits" },
  { id: "raspberries", name: "Raspberries, fresh or frozen", weeklyQty: "1½ cups", fullQty: "4½ cups", category: "fruits" },
  { id: "blueberries", name: "Blueberries, fresh or frozen", weeklyQty: "1¾ cups", fullQty: "5 cups", category: "fruits" },
  { id: "strawberries", name: "Strawberries, fresh or frozen", weeklyQty: "¾ cup", fullQty: "2¼ cups", category: "fruits" },
  { id: "tart-cherries", name: "Tart cherries, pitted (fresh or frozen)", weeklyQty: "1 cup", fullQty: "3 cups", category: "fruits" },
  { id: "plums", name: "Ripe plums", weeklyQty: "2–3 plums", fullQty: "6–9 plums", category: "fruits" },
  { id: "watermelon", name: "Watermelon", weeklyQty: "2 cups cubed", fullQty: "6 cups cubed", category: "fruits" },
  { id: "figs", name: "Black figs, ripe", weeklyQty: "3–4 figs", fullQty: "9–12 figs", category: "fruits" },
  { id: "beet", name: "Small beets", weeklyQty: "1 small beet", fullQty: "3 small beets", category: "fruits" },
  { id: "banana", name: "Bananas", weeklyQty: "1–2", fullQty: "3–6", category: "fruits" },
  // Greens
  { id: "baby-spinach", name: "Baby spinach", weeklyQty: "1 small bag (80g)", fullQty: "3 bags", category: "greens" },
  { id: "mint-fresh", name: "Fresh mint", weeklyQty: "1 small bunch", fullQty: "2–3 bunches", category: "greens" },
  { id: "ginger-fresh", name: "Fresh ginger root", weeklyQty: "1 small knob", fullQty: "1 large knob", category: "greens" },
  // Liquids
  { id: "oat-milk", name: "Oat milk, unsweetened", weeklyQty: "2–3 cartons (1L)", fullQty: "6–9 cartons", category: "liquids" },
  { id: "almond-milk", name: "Almond milk, unsweetened", weeklyQty: "1 carton (1L)", fullQty: "3 cartons", category: "liquids" },
  { id: "hibiscus-tea", name: "Hibiscus tea bags (or loose)", weeklyQty: "2–3 bags", fullQty: "1 pack", category: "liquids" },
  { id: "coconut-yogurt", name: "Coconut yogurt", weeklyQty: "½ cup", fullQty: "1–2 tubs", category: "liquids" },
  // Seeds & Fats
  { id: "chia-seeds", name: "Chia seeds", weeklyQty: "3 tbsp", fullQty: "½ cup", category: "seeds-fats" },
  { id: "almond-butter", name: "Almond butter", weeklyQty: "1 tbsp", fullQty: "¼ cup", category: "seeds-fats" },
  { id: "raw-almonds", name: "Raw almonds", weeklyQty: "¼ cup", fullQty: "¾ cup", category: "seeds-fats" },
  // Boosters
  { id: "radiant-reds", name: "Radiant Reds superfood (NOURÉ)", weeklyQty: "7 scoops (1/day)", fullQty: "21 scoops", category: "boosters" },
  { id: "raw-cacao", name: "Raw cacao powder", weeklyQty: "1 tbsp", fullQty: "3 tbsp", category: "boosters" },
  { id: "turmeric-powder", name: "Ground turmeric", weeklyQty: "as needed", fullQty: "1 small jar", category: "boosters" },
  { id: "rose-water", name: "Rose water, culinary grade", weeklyQty: "as needed", fullQty: "1 small bottle", category: "boosters" },
  // Pantry
  { id: "raw-honey", name: "Raw honey", weeklyQty: "2–3 tsp", fullQty: "1 small jar", category: "pantry" },
  { id: "cinnamon", name: "Ground cinnamon", weeklyQty: "as needed", fullQty: "1 small jar", category: "pantry" },
  { id: "black-pepper", name: "Black pepper", weeklyQty: "as needed", fullQty: "1 small jar", category: "pantry" },
  { id: "vanilla-extract", name: "Pure vanilla extract", weeklyQty: "as needed", fullQty: "1 small bottle", category: "pantry" },
  { id: "lime", name: "Limes", weeklyQty: "3–4", fullQty: "9–12", category: "pantry" },
  { id: "orange", name: "Oranges", weeklyQty: "1–2", fullQty: "3–6", category: "pantry" },
  { id: "lemon", name: "Lemons", weeklyQty: "2–3", fullQty: "6–9", category: "pantry" },
  { id: "sparkling-water", name: "Sparkling water", weeklyQty: "1 bottle", fullQty: "2–3 bottles", category: "pantry" },
];

// ─────────────────────────────────────────────
// Polyphenols
// ─────────────────────────────────────────────

export type Polyphenol = {
  id: string; name: string; color: string; topBenefit: string; points: string[]; howTo: string;
};

export const POLYPHENOLS: Polyphenol[] = [
  { id: "pomegranate", name: "Pomegranate", color: "#9B1B3A", topBenefit: "Skin clarity & elasticity",
    points: ["Highest in punicalagins of any common fruit.", "Metabolized to urolithin A by gut bacteria.", "Supports collagen protection.", "Studied for UV-related skin protection.", "Best drunk in the morning."],
    howTo: "One serving daily — fresh seeds, juice, or a scoop of Radiant Reds." },
  { id: "acai", name: "Açaí", color: "#3E1A47", topBenefit: "Antioxidant density",
    points: ["One of the highest ORAC scores of any fruit.", "Rich in anthocyanins.", "Healthy fats support absorption of fat-soluble nutrients.", "Pairs well with banana and almond milk.", "Found in Radiant Reds."],
    howTo: "Frozen pulp blended into a smoothie, or via Radiant Reds." },
  { id: "blueberry", name: "Blueberry", color: "#3F4A8C", topBenefit: "Daily skin protection",
    points: ["Anthocyanin-rich.", "Studied for cognitive and skin benefits.", "Feeds bifidobacteria diversity.", "Easy daily addition.", "Wild varieties are denser."],
    howTo: "½ cup fresh or frozen, daily." },
  { id: "hibiscus", name: "Hibiscus", color: "#A02447", topBenefit: "Vascular & tone",
    points: ["Vivid red tea, anthocyanin-rich.", "Traditional use for circulation.", "Mild blood-pressure support.", "Cooling iced or warming hot.", "Pairs with lime and watermelon."],
    howTo: "1–2 cups daily, hot or cold." },
  { id: "beet", name: "Beet", color: "#6B1730", topBenefit: "Circulation & oxygenation",
    points: ["Nitrate-rich, supports nitric oxide.", "Betalains are unique antioxidants.", "Skin oxygenation benefit.", "Roast or steam to soften flavor.", "Pairs with raspberry and orange."],
    howTo: "1 small beet daily during the reset." },
  { id: "green-tea", name: "Green tea", color: "#3E5C3A", topBenefit: "EGCG defense",
    points: ["EGCG is one of the most studied polyphenols.", "Skin-protective in human studies.", "Supports microbiome diversity.", "Best brewed at lower temps to preserve EGCG.", "Skip late afternoon for sleep."],
    howTo: "1–2 cups in the morning or early afternoon." },
  { id: "turmeric", name: "Turmeric", color: "#C8893A", topBenefit: "Inflammation calm",
    points: ["Curcumin is anti-inflammatory.", "Pair with black pepper for absorption.", "Best with a fat source.", "Traditional women's wellness use.", "Adds warmth to morning blends."],
    howTo: "½ tsp daily with food and pepper." },
  { id: "cacao", name: "Cacao", color: "#4A2716", topBenefit: "Hydration & density",
    points: ["Cacao flavanols studied for skin hydration.", "Supports density of skin over time.", "Magnesium-rich.", "Use raw or minimally processed.", "Pairs with cherry and almond."],
    howTo: "1–2 tbsp raw cacao, several times a week." },
];

// ─────────────────────────────────────────────
// Articles
// ─────────────────────────────────────────────

export const ARTICLES = [
  { id: "polyphenols", title: "What Polyphenols Actually Do for Your Skin",
    body: `Polyphenols are plant compounds — thousands of them — that act as the plant's defense against stress. When you eat them, they become part of your defense too.\n\nThe ones that matter most for skin are anthocyanins (the deep reds and purples), ellagitannins (pomegranate, raspberry), flavanols (cacao, green tea), and carotenoids (orange and red plants).\n\nThey work in two ways. First, directly: many polyphenols are absorbed and circulate in your skin, where they protect against oxidative stress every minute of the day. Second, indirectly: polyphenols feed the bacteria in your gut. Those bacteria metabolize the polyphenols into smaller, more powerful compounds — like urolithin A — that the body actually uses.\n\nThis is why one polyphenol-rich morning isn't enough. The compounds work in compounding fashion, building both their own circulating concentration and the gut bacteria that produce their active forms. Twenty-one days is the window where both layers reach a noticeable threshold.` },
  { id: "gut-skin", title: "The Gut-Skin Axis Explained Simply",
    body: `The gut-skin axis is the two-way communication line between your digestive system and your skin. It's not a metaphor. It's a measurable, studied relationship.\n\nHere is the simple version: your gut lining is one cell thick. When that lining is inflamed, immune signals leak into circulation. Those signals travel — and skin is one of their loudest expressions. Dullness, breakouts, sensitivity, redness: many of these begin in the gut.\n\nThe inverse is also true. When the gut lining is healthy and the microbiome is diverse, your skin gets a steady supply of anti-inflammatory signals and the metabolites of the polyphenols you eat. That's the glow.\n\nThe Inner Glow Reset is built around this axis. Every morning ritual feeds it. Every recipe is designed for it. The work happens inside, and the result happens at the surface.` },
  { id: "morning-timing", title: "Why Your Morning Timing Matters",
    body: `Polyphenols absorb best on a relatively empty stomach with hydration. That's why this ritual lives in the morning, not in the afternoon.\n\nYour body has just finished its longest fast of the day. Your gut lining is calm, your absorption is high, and your circadian rhythm is most receptive to the compounds you take in.\n\nA polyphenol-dense morning sets the tone for the rest of your day's inflammation profile. It's a small lever with a big effect.` },
  { id: "reading-skin", title: "How to Read Your Skin's Changes During a Reset",
    body: `Your skin renews on roughly a 27-day cycle, but the brightness of the surface changes faster. Here's what to watch for, and when:\n\nDays 1–7: Mostly internal. Energy may shift. Gut may settle. Skin won't show you yet.\n\nDays 8–14: First visible signs. Often a softening of dullness. Sometimes an initial breakout as the gut shifts — this is normal and clears.\n\nDays 15–21: Visible glow. Tone evens. Under-eye lifts. Other people notice before you do.\n\nDay 22 onward: This is when 21 days of work becomes the new baseline. The ritual is now your morning, not your reset.` },
  { id: "reds-ingredients", title: "The Radiant Reds Ingredients — And What Each One Does",
    body: `Radiant Reds is built around one principle: polyphenol density. Each ingredient was chosen for what it contributes to the gut-skin axis.\n\nPomegranate brings ellagic acid and punicalagins — two of the most studied compounds for collagen protection.\n\nBeet brings nitrates and betalains — for circulation, oxygenation, and a unique class of antioxidants.\n\nHibiscus brings anthocyanins and vascular support — for tone and small-vessel health.\n\nAçaí brings one of the highest antioxidant scores measured in any fruit.\n\nRaspberry and strawberry bring ellagitannins and vitamin C — for the collagen synthesis pathway.\n\nThe scoop is what 21 days of feeding your gut-skin axis looks like — concentrated, every morning.` },
  { id: "after-21", title: "After 21 Days: How to Keep the Ritual",
    body: `Twenty-one days is enough to build a habit. It's not enough to finish a transformation.\n\nThe most common mistake is to treat day 22 as the end. Don't. The ritual that worked for 21 days is the ritual that works for 121.\n\nKeep the morning glass. Keep the slow start. Rotate the recipes. Add a second polyphenol moment in the afternoon if you want to deepen.\n\nThe Inner Glow Reset isn't a 21-day product. It's the entry point to a morning you keep.` },
];

// ─────────────────────────────────────────────
// Sounds
// ─────────────────────────────────────────────

export const SOUNDS = [
  { id: "rain", name: "Morning Rain", duration: "8 min", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_a8e603753c.mp3" },
  { id: "bowl", name: "Tibetan Bowl", duration: "5 min", url: "https://cdn.pixabay.com/audio/2022/10/18/audio_3433d6cea0.mp3" },
  { id: "forest", name: "Forest Light", duration: "10 min", url: "https://cdn.pixabay.com/audio/2022/03/09/audio_c8c8a73467.mp3" },
  { id: "birds", name: "Birdsong", duration: "7 min", url: "https://cdn.pixabay.com/audio/2021/10/07/audio_3f15f7e3a4.mp3" },
  { id: "silence", name: "Soft Silence", duration: "12 min", url: "https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bdd.mp3" },
];

// ─────────────────────────────────────────────
// Journal
// ─────────────────────────────────────────────

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
    "Rest is part of the ritual. The polyphenols still work while you sleep.",
    "Today, do less. The ritual is the glass — everything else can wait.",
    "Exhaustion isn't a setback. It's a signal that this work is reaching the parts that matter.",
  ],
  B: [
    "Your skin notices before your mirror does. Keep showing up.",
    "What you're describing is the gut-skin axis doing its job. The clarity you're feeling is the system working.",
    "This is the week it becomes visible. Stay in it.",
    "That glow you're seeing isn't from one morning. It's from all of them.",
    "Your skin is a record of the last twenty-one mornings. Keep writing it.",
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
    "The fiber and polyphenols are doing slow, real work. Your gut is responding.",
    "The gut-skin axis you're feeling is the most important system in this reset. Trust the discomfort — it's reorganizing.",
    "Digestion changes are the first sign the ritual is reaching the right place.",
    "Your gut is the first organ to notice. Your skin is the second.",
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

// ─────────────────────────────────────────────
// Notifications & Milestones
// ─────────────────────────────────────────────

export const NOTIFICATIONS: Record<number, string> = {
  1: "Your reset begins this morning, {name}.",
  2: "Day 2. The ritual is still new. Show up anyway.",
  3: "Three mornings. Your gut is already paying attention.",
  4: "The first week is about showing up. You're doing it.",
  5: "Halfway through week one. Consistency is the active ingredient.",
  6: "Day 6. Your skin hasn't shown you everything yet. Stay in.",
  7: "One full week, {name}. Your body has been listening.",
  8: "Week two. This is where it deepens.",
  9: "Your polyphenol window is open. Use it this morning.",
  10: "Ten days in. The ritual is starting to feel like yours.",
  11: "Day 11. Dullness lifts in the second week. Watch for it.",
  12: "Your gut-skin axis is working. Keep feeding it.",
  13: "Tomorrow is the halfway point. You're almost there.",
  14: "Halfway, {name}. The ritual is becoming habit.",
  15: "Week three. This is where your skin shows the work.",
  16: "Day 16. What your mirror shows now is what you built.",
  17: "Four days left. Don't stop here.",
  18: "Day 18. The glow you're seeing is compounding.",
  19: "Two more mornings after this one.",
  20: "Day 20. Tomorrow is Day 21. You made it, {name}.",
  21: "This is Day 21. You showed up. Open the app.",
};

export const MILESTONES: Record<string, { title: string; sub: string; badge: string }> = {
  "day-1":  { title: "Day 1 is done, {name}.", sub: "The ritual has started.", badge: "The Beginning" },
  "day-7":  { title: "One week.",              sub: "Your gut has shifted. Your skin is listening.", badge: "Foundation Built" },
  "day-14": { title: "Halfway, {name}.",       sub: "The ritual is yours now.", badge: "Deep Glow" },
  "first-journal": { title: "You showed up for yourself today.", sub: "The first entry is the hardest.", badge: "First Words" },
  "streak-3": { title: "Three days in a row.", sub: "This is how rituals form.", badge: "Three Mornings" },
};

// ─────────────────────────────────────────────
// Smart Daily Glow Checklist
// ─────────────────────────────────────────────

export type GoalTag =
  | "glow" | "texture" | "calm"
  | "bloating" | "energy" | "unsettled" | "good"
  | "slow";

export type ChecklistTask = {
  id: string;
  label: string;
  detail: string;
  category: "ritual" | "nourish" | "hydrate" | "reflect" | "rest";
  goals?: GoalTag[];
};

const UNIVERSAL: ChecklistTask[] = [
  {
    id: "pour-reds",
    label: "Drink your Radiant Reds",
    detail: "Pour slowly. Sit with the glass. This is the polyphenol moment your morning is built around.",
    category: "ritual",
  },
  {
    id: "first-water",
    label: "First glass of water",
    detail: "Before coffee, before your phone — one full glass of water. Your body has been resting for hours.",
    category: "hydrate",
  },
  {
    id: "slow-moment",
    label: "Five quiet minutes",
    detail: "No phone. No planning. Five minutes where the day hasn't asked anything of you yet.",
    category: "reflect",
  },
];

const PHASE_TASK: Record<1 | 2 | 3, ChecklistTask> = {
  1: {
    id: "day-ritual",
    label: "Open today's ritual guide",
    detail: "Read it slowly. The guide is short. Let it land before the day begins.",
    category: "ritual",
  },
  2: {
    id: "fermented-food",
    label: "Add a fermented food today",
    detail: "A small serving of yogurt, kefir, kimchi, or sauerkraut. Polyphenols and probiotics work together.",
    category: "nourish",
  },
  3: {
    id: "compare-feeling",
    label: "Compare today to Day 1",
    detail: "Notice — not in the mirror necessarily, but inside. Energy, skin, gut. What's different?",
    category: "reflect",
  },
};

const SKIN_GOAL_TASKS: ChecklistTask[] = [
  {
    id: "skin-photo",
    label: "Take a quiet skin photo",
    detail: "Natural light, no filter. You'll want this later. This week is when the shift becomes visible.",
    category: "reflect",
    goals: ["glow"],
  },
  {
    id: "clean-pillowcase",
    label: "Fresh pillowcase tonight",
    detail: "Your skin rests on it for seven hours. A small change that compounds over weeks.",
    category: "rest",
    goals: ["texture"],
  },
  {
    id: "skin-observation",
    label: "One quiet observation about your skin",
    detail: "Not a judgement — an observation. Is it more settled today than last week? Notice gently.",
    category: "reflect",
    goals: ["calm"],
  },
];

const GUT_GOAL_TASKS: ChecklistTask[] = [
  {
    id: "eat-slow",
    label: "Eat breakfast slowly today",
    detail: "More chews than feels necessary. Digestion begins in the mouth. Your gut responds to how you eat.",
    category: "nourish",
    goals: ["bloating"],
  },
  {
    id: "reds-before-coffee",
    label: "Reds before coffee this morning",
    detail: "Let polyphenols lead. Your gut absorbs them best before caffeine shifts the environment.",
    category: "ritual",
    goals: ["energy"],
  },
  {
    id: "gut-noon-check",
    label: "Check in with your gut at noon",
    detail: "One word — how does it feel? Settled, heavy, calm, tight? Just notice. No fixing required.",
    category: "reflect",
    goals: ["unsettled"],
  },
  {
    id: "gut-gratitude",
    label: "Notice what felt nourishing today",
    detail: "Something you ate, drank, or did that supported your gut. Name it. Awareness deepens the benefit.",
    category: "reflect",
    goals: ["good"],
  },
];

const PACE_TASK: ChecklistTask = {
  id: "phone-free-reds",
  label: "Reds with no phone — ten minutes",
  detail: "Set it face-down. Drink slowly. The nervous system sets the tone for digestion. A calm morning is a better morning.",
  category: "ritual",
  goals: ["slow"],
};

function weekTasks(week: 1 | 2 | 3): ChecklistTask[] {
  return [...UNIVERSAL, PHASE_TASK[week], ...SKIN_GOAL_TASKS, ...GUT_GOAL_TASKS, PACE_TASK];
}

export const CHECKLIST_TASKS: Record<number, ChecklistTask[]> = Object.fromEntries(
  Array.from({ length: 21 }, (_, i) => {
    const day = i + 1;
    const week = (day <= 7 ? 1 : day <= 14 ? 2 : 3) as 1 | 2 | 3;
    return [day, weekTasks(week)];
  })
);

export function getPersonalizedTasks(
  day: number,
  skinGoal: string | null,
  gutGoal: string | null,
  morningPace: string | null
): ChecklistTask[] {
  const all = CHECKLIST_TASKS[day] ?? CHECKLIST_TASKS[1];
  return all.filter((task) => {
    if (!task.goals || task.goals.length === 0) return true;
    return task.goals.some(
      (g) => g === skinGoal || g === gutGoal || g === morningPace
    );
  });
}

export const GLOW_FOCUS: Record<number, { focus: string; sub: string }> = {
  1:  { focus: "The ritual begins with one glass.",
        sub: "What you pour this morning is the start of something slow and beautiful." },
  2:  { focus: "Stillness before speed.",
        sub: "Five quiet minutes is not wasted time. It's the whole point." },
  3:  { focus: "Your morning is your polyphenol window.",
        sub: "Your gut absorbs best now. This is when the ritual works." },
  4:  { focus: "Listen to what your body is saying.",
        sub: "You don't have to feel different yet. You just have to notice." },
  5:  { focus: "What you nourish inside begins to show.",
        sub: "The gut–skin connection is real. It's building every morning." },
  6:  { focus: "The quiet build.",
        sub: "Nothing dramatic. Everything compounding." },
  7:  { focus: "One full week.",
        sub: "Seven mornings is a foundation. Your body has been paying attention." },
  8:  { focus: "Week two begins here.",
        sub: "Foundation is built. Now we deepen the practice." },
  9:  { focus: "Feed the ferment.",
        sub: "Polyphenols and probiotics work in tandem. Add something fermented today." },
  10: { focus: "Ten mornings in.",
        sub: "Ten mornings is no longer trying it. It's a practice that's becoming yours." },
  11: { focus: "Watch for the shift.",
        sub: "Dullness may begin to lift this week. Look for it in natural light." },
  12: { focus: "Your skin is working.",
        sub: "Twelve days of nourishing your gut means a freshly renewed surface layer." },
  13: { focus: "Almost halfway.",
        sub: "Tomorrow is the midpoint. Today, take inventory of what's already shifted." },
  14: { focus: "Halfway.",
        sub: "The ritual is no longer something you're doing — it's something you have." },
  15: { focus: "Week three. The inside surfaces.",
        sub: "This is the week the work becomes visible. Keep showing up." },
  16: { focus: "What the mirror shows now is what you built.",
        sub: "Look at where you started. Notice what's quietly changed." },
  17: { focus: "Four mornings remain. Don't stop here.",
        sub: "Days 17–21 are where the ritual locks in for the long term." },
  18: { focus: "The glow is compounding.",
        sub: "Each morning builds on the one before. You're at the peak of the build." },
  19: { focus: "Two mornings after this one.",
        sub: "Start thinking about what Day 22 looks like. The ritual doesn't end." },
  20: { focus: "Almost.",
        sub: "Tomorrow is Day 21. Today, write the long journal entry." },
  21: { focus: "Day 21. You showed up.",
        sub: "Twenty-one mornings. The ritual doesn't end here — it becomes yours." },
};

export function currentStreak(
  startDate: string | null,
  completedDays: number[],
  checklistLogs: Record<number, Record<string, boolean>>
): number {
  if (!startDate) return 0;
  const ms = new Date().setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0);
  const today = Math.max(1, Math.min(21, Math.floor(ms / 86400000) + 1));
  let streak = 0;
  for (let d = today; d >= 1; d--) {
    const hasChecklist = Object.values(checklistLogs[d] ?? {}).some(Boolean);
    if (hasChecklist || completedDays.includes(d)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
