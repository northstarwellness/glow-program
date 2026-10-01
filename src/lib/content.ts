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
      "Today is about beginning. Not perfectly, just beginning. Pour your warm water with lemon, then make today's glass. Drink slowly. Notice the color. That deep red comes from anthocyanins, the pigments of pomegranate and red fruit. Let the first glass be enough. Today's only job: show up.",
  },
  {
    day: 2,
    title: "Stillness Before Speed",
    recipeId: "berry-bloom",
    teaser: "Five quiet minutes before the day asks anything of you.",
    guide:
      "Before you check your phone, sit for five minutes with your glass. Call it permission rather than meditation. Let the morning start at your pace, not your inbox's. Notice the color, the cold of the glass, the quiet. Today, drink slow. Breathe slower.",
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
      "You've built the foundation. Seven mornings of ritual make a pattern. Today's recipe brings beet, an earthy root rich in natural nitrates and the betalain pigments behind its jewel color. Drink it slowly. Then notice how this first week has felt, without judgment. Week two starts tomorrow.",
  },
  {
    day: 8,
    title: "Build Begins",
    recipeId: "pomegranate-elixir",
    teaser: "Week 2. Now we deepen.",
    guide:
      "Foundation is built. Now we layer. This week the ritual starts to feel less like a task and more like a morning. Today, return to the Pomegranate & Raspberry Elixir, and this time, taste it differently. The same glass becomes the same ritual every morning, but you are not the same person who drank it on day one.",
  },
  {
    day: 9,
    title: "The Ferment Layer",
    recipeId: "berry-bloom",
    teaser: "Add a small fermented food today.",
    guide:
      "Today, alongside your glass, eat a small fermented food: yogurt, kefir, kimchi or sauerkraut. Fermented foods and colorful plants make a natural pairing, and a small spoonful is an easy way to bring more variety into your morning.",
  },
  {
    day: 10,
    title: "Day 10: Ten Mornings",
    recipeId: "cherry-cacao",
    teaser: "Ten mornings in. The ritual is becoming yours.",
    guide:
      "Ten mornings is no longer 'trying it.' Ten mornings is a practice. Today, drink your glass, then notice: what feels different from day one? Not in the mirror, but inside.",
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
      "Tomorrow is day 14, the halfway point. Today, take inventory. What three things feel different? Write them in your journal. Then drink your glass slowly. The ritual rewards attention.",
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
    title: "Week 3: Glow Begins",
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
      "Four mornings remain. This is the stretch where it's easiest to drift. Don't. Days 17 to 21 are where the ritual locks in for the long term. Today: tart cherry, full ritual, full attention.",
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
    title: "Day 20: Almost",
    recipeId: "fig-almond",
    teaser: "Tomorrow is Day 21. You made it.",
    guide:
      "Tomorrow is the final morning. Today, drink your glass and write a long journal entry. Tomorrow's entry will be a letter, and today's is the setup.",
  },
  {
    day: 21,
    title: "Day 21: The Ritual Holds",
    recipeId: "beet-glow",
    teaser: "This is Day 21. You showed up.",
    guide:
      "Twenty-one mornings. You showed up for a ritual most people won't. Drink the final glass slowly. Then open your celebration screen. The ritual doesn't end here. It just stops being a 21-day reset and starts being your morning.",
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
  bonus?: boolean;
  /** Quick Mornings (formerly Quick Glow Mornings) — bonus five-minute smoothies outside the 21-day rotation */
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

export const RECIPES: Recipe[] = [
  // ——— 21 CORE RECIPES ———
  {
    id: "pomegranate-elixir",
    name: "Pomegranate & Raspberry Elixir",
    gradient: G.plumGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Bright & tart",
    benefit:
      "Pomegranate and raspberry blended with oat milk and a squeeze of lime. Tart, bright and silky, with a deep ruby color.",
    ingredients: ["Pomegranate", "Raspberry", "Oat milk", "Lime"],
    method: [
      "Add 1 cup pomegranate seeds and ½ cup raspberries to a blender.",
      "Pour in 1 cup oat milk.",
      "Squeeze in half a lime. Blend until silky.",
      "Pour into a chilled glass. Drink slowly.",
    ],
  },
  {
    id: "berry-bloom",
    name: "Berry & Chia",
    gradient: G.plumLavender,
    prep: "3 min",
    servings: "1",
    benefitTag: "Fruity",
    benefit:
      "Mixed berries, half a banana and almond milk, thickened with a spoonful of chia. Fruity, soft and easy.",
    ingredients: ["Blueberry", "Strawberry", "Banana", "Almond milk", "Chia"],
    method: [
      "Combine 1 cup mixed berries with half a banana.",
      "Add 1 cup almond milk and 1 tbsp chia.",
      "Blend 30 seconds. Let sit 2 minutes for chia to bloom.",
      "Stir and serve.",
    ],
  },
  {
    id: "cherry-cacao",
    name: "Cherry Cacao",
    gradient: G.plumDeep,
    prep: "4 min",
    servings: "1",
    benefitTag: "Chocolatey",
    benefit:
      "Tart cherries and cacao with almond butter and oat milk. Dark, chocolatey and smooth, with a hint of cinnamon.",
    ingredients: ["Tart cherry", "Cacao", "Almond butter", "Oat milk", "Cinnamon"],
    method: [
      "Blend 1 cup tart cherries with 1 tbsp cacao.",
      "Add 1 tbsp almond butter and 1 cup oat milk.",
      "Pinch of cinnamon. Blend until smooth.",
    ],
  },
  {
    id: "plum-rose",
    name: "Plum & Rose",
    gradient: G.roseSand,
    prep: "5 min",
    servings: "1",
    benefitTag: "Floral",
    benefit:
      "Ripe plums blended with coconut yogurt and a little rose water. Soft, fragrant and gently sweet.",
    ingredients: ["Plum", "Rose water", "Coconut yogurt", "Honey"],
    method: [
      "Pit and slice 2 ripe plums.",
      "Blend with ½ cup coconut yogurt and 1 tsp rose water.",
      "Sweeten with a touch of honey.",
    ],
  },
  {
    id: "watermelon-reds",
    name: "Watermelon Hibiscus",
    gradient: G.goldRose,
    prep: "3 min",
    servings: "1",
    benefitTag: "Bright & tart",
    benefit: "Cool hibiscus tea blended with watermelon and lime. Light, tart and very refreshing.",
    ingredients: ["Watermelon", "Hibiscus tea", "Lime"],
    method: ["Brew 1 cup hibiscus tea, cool fully.", "Blend with 2 cups watermelon, lime juice."],
  },
  {
    id: "fig-almond",
    name: "Fig & Almond",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Creamy",
    benefit:
      "Black figs and almonds blended with oat milk and a pinch of cinnamon. Jammy, nutty and creamy.",
    ingredients: ["Black fig", "Almond", "Oat milk", "Cinnamon"],
    method: [
      "Blend 3 black figs with a small handful of almonds.",
      "Add 1 cup oat milk and a pinch of cinnamon.",
      "Blend until creamy.",
    ],
  },
  {
    id: "beet-glow",
    name: "Beet & Orange",
    gradient: G.plumGold,
    prep: "6 min",
    servings: "1",
    benefitTag: "Earthy",
    benefit:
      "Beet, raspberries, fresh ginger and orange juice. Earthy-sweet, bright and a little warming.",
    ingredients: ["Beet", "Raspberry", "Ginger", "Orange"],
    method: [
      "Roast or steam 1 small beet ahead of time.",
      "Blend with ½ cup raspberries, a thumb of ginger, and the juice of 1 orange.",
      "Strain if you want it silky.",
    ],
  },
  {
    id: "golden-turmeric",
    name: "Golden Turmeric Latte",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Warm & spiced",
    benefit:
      "Warm oat milk whisked with turmeric, cinnamon and black pepper, sweetened with honey. A cozy golden cup for a slow morning.",
    ingredients: ["Oat milk", "Turmeric", "Cinnamon", "Black pepper", "Honey", "Almond"],
    method: [
      "Warm 1 cup oat milk gently.",
      "Whisk in ½ tsp turmeric, pinch of cinnamon, pinch of black pepper.",
      "Sweeten with honey. Top with crushed almond.",
    ],
  },
  {
    id: "matcha-cloud",
    name: "Iced Matcha & Banana",
    gradient: G.sageIvory,
    prep: "4 min",
    servings: "1",
    benefitTag: "Green tea",
    benefit:
      "Whisked matcha blended with banana and almond milk, poured over ice. Soft, pale green and gently grassy.",
    ingredients: ["Matcha (green tea)", "Banana", "Almond milk", "Honey"],
    method: [
      "Whisk 1 tsp matcha with 2 tbsp warm water until smooth.",
      "Blend with ½ banana, ¾ cup almond milk, drizzle of honey.",
      "Pour over ice.",
    ],
  },
  {
    id: "lavender-honey",
    name: "Lavender Honey Tea",
    gradient: G.lavenderIvory,
    prep: "3 min",
    servings: "1",
    benefitTag: "Floral",
    benefit:
      "Culinary lavender steeped in hot water, finished with honey and lemon. Floral, light and calm.",
    ingredients: ["Culinary lavender", "Honey", "Lemon", "Mint"],
    method: [
      "Steep 1 tsp culinary lavender in 1 cup hot water for 4 minutes.",
      "Strain. Stir in honey and a squeeze of lemon.",
      "Garnish with mint.",
    ],
  },
  {
    id: "rose-cardamom",
    name: "Rose Cardamom Oat Milk",
    gradient: G.roseSand,
    prep: "5 min",
    servings: "1",
    benefitTag: "Warm & spiced",
    benefit:
      "Warm oat milk with cardamom, cinnamon, rose water and honey. Fragrant, creamy and gently spiced.",
    ingredients: ["Oat milk", "Cardamom", "Cinnamon", "Rose water", "Honey"],
    method: [
      "Warm 1 cup oat milk with a pinch of crushed cardamom and cinnamon.",
      "Off heat, stir in 1 tsp rose water and honey.",
      "Sip slowly.",
    ],
  },
  {
    id: "blueberry-basil",
    name: "Blueberry Basil",
    gradient: G.plumLavender,
    prep: "4 min",
    servings: "1",
    benefitTag: "Fruity",
    benefit:
      "Wild blueberries, banana and fresh basil with almond milk and lemon zest. Fruity, with a fresh herbal lift.",
    ingredients: ["Blueberry", "Banana", "Basil", "Almond milk", "Lemon"],
    method: [
      "Blend 1 cup wild blueberries, ½ banana, 4 basil leaves.",
      "Add 1 cup almond milk and lemon zest.",
      "Blend until smooth.",
    ],
  },
  {
    id: "papaya-lime",
    name: "Papaya & Lime",
    gradient: G.goldRose,
    prep: "3 min",
    servings: "1",
    benefitTag: "Tropical",
    benefit:
      "Ripe papaya and lime juice with coconut yogurt and torn mint. Light, tropical and bright.",
    ingredients: ["Papaya", "Lime", "Coconut yogurt", "Mint"],
    method: [
      "Blend 1½ cups papaya with the juice of 1 lime.",
      "Stir in 2 tbsp coconut yogurt and torn mint.",
      "Serve cold.",
    ],
  },
  {
    id: "peach-saffron",
    name: "Peach & Saffron",
    gradient: G.creamGold,
    prep: "5 min",
    servings: "1",
    benefitTag: "Floral",
    benefit:
      "A ripe peach blended with saffron-steeped almond milk and honey. Golden, floral and quietly luxurious.",
    ingredients: ["Saffron", "Almond milk", "Peach", "Honey", "Cinnamon"],
    method: [
      "Steep a small pinch of saffron in 2 tbsp warm almond milk.",
      "Blend with 1 ripe peach, ½ cup almond milk, honey.",
      "Top with cinnamon.",
    ],
  },
  {
    id: "fig-vanilla",
    name: "Fig & Vanilla Cream",
    gradient: G.creamGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Creamy",
    benefit:
      "Figs blended with oat milk, vanilla and honey, topped with crushed almond. Silky, sweet and comforting.",
    ingredients: ["Black fig", "Oat milk", "Vanilla", "Honey", "Almond"],
    method: [
      "Blend 4 figs with 1 cup oat milk.",
      "Add ¼ tsp vanilla and a drizzle of honey.",
      "Top with crushed almond.",
    ],
  },
  {
    id: "cucumber-mint",
    name: "Cucumber Mint Cooler",
    gradient: G.sageIvory,
    prep: "3 min",
    servings: "1",
    benefitTag: "Sparkling",
    benefit:
      "Cucumber, lime and mint, strained over ice and topped with sparkling water. Crisp and cooling.",
    ingredients: ["Cucumber", "Lime", "Mint", "Sparkling water"],
    method: [
      "Blend 1 cucumber with the juice of ½ lime and a small handful of mint.",
      "Strain over ice.",
      "Top with sparkling water.",
    ],
  },
  {
    id: "apricot-almond",
    name: "Apricot & Almond",
    gradient: G.goldSand,
    prep: "4 min",
    servings: "1",
    benefitTag: "Creamy",
    benefit: "Ripe apricots and almonds blended with oat milk and honey. Soft, golden and silky.",
    ingredients: ["Apricot", "Almond", "Oat milk", "Honey"],
    method: [
      "Blend 3 ripe apricots with a small handful of almonds.",
      "Add ¾ cup oat milk and honey.",
      "Blend until silky.",
    ],
  },
  {
    id: "kiwi-spinach",
    name: "Kiwi & Spinach",
    gradient: G.sageGold,
    prep: "4 min",
    servings: "1",
    benefitTag: "Fresh & green",
    benefit:
      "Kiwi, baby spinach, banana and almond milk with a squeeze of lime. Fresh, tart and bright green.",
    ingredients: ["Kiwi", "Baby spinach", "Banana", "Almond milk", "Lime"],
    method: [
      "Blend 2 kiwis with a handful of baby spinach.",
      "Add ½ banana, 1 cup almond milk.",
      "Squeeze in lime.",
    ],
  },
  {
    id: "vanilla-chia",
    name: "Vanilla Chia Pudding",
    gradient: G.creamGold,
    prep: "5 min + chill",
    servings: "1",
    benefitTag: "Make-ahead",
    benefit:
      "Chia soaked overnight in vanilla oat milk with honey. A spoonable breakfast you make the night before.",
    ingredients: ["Chia", "Oat milk", "Vanilla", "Honey", "Almond", "Cinnamon"],
    method: [
      "Stir 3 tbsp chia into 1 cup oat milk with vanilla and honey.",
      "Refrigerate overnight.",
      "Top with crushed almond and cinnamon.",
    ],
  },
  {
    id: "ginger-pear",
    name: "Pear & Ginger",
    gradient: G.goldSand,
    prep: "4 min",
    servings: "1",
    benefitTag: "Gently spiced",
    benefit:
      "Ripe pear, fresh ginger and orange juice with honey and cinnamon. Gently spiced, over ice or warm.",
    ingredients: ["Pear", "Ginger", "Orange", "Honey", "Cinnamon"],
    method: [
      "Blend 1 ripe pear with a thumb of ginger and the juice of ½ orange.",
      "Sweeten with honey, dust with cinnamon.",
      "Serve over ice or warm.",
    ],
  },
  {
    id: "honey-almond",
    name: "Honey Almond Milk",
    gradient: G.creamGold,
    prep: "3 min",
    servings: "1",
    benefitTag: "Creamy",
    benefit:
      "Almond butter blended with oat milk, raw honey and cinnamon. Nutty and grounding, warm or cold.",
    ingredients: ["Almond butter", "Oat milk", "Honey", "Cinnamon"],
    method: [
      "Blend 1 tbsp almond butter with 1 cup oat milk.",
      "Add 1 tsp raw honey and a dash of cinnamon.",
      "Serve warm or cold.",
    ],
  },

  // ——— 5 BONUS RECIPES (live in Bonuses tab) ———
  {
    id: "bonus-cacao-tonic",
    name: "Spiced Hot Cacao",
    gradient: G.plumDeep,
    bonus: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Chocolatey",
    benefit:
      "Warm oat milk whisked with cacao, cinnamon and honey. Rich, cozy and chocolatey; cacao naturally contains a little caffeine.",
    ingredients: ["Cacao", "Oat milk", "Cinnamon", "Honey"],
    method: [
      "Warm 1 cup oat milk gently.",
      "Whisk in 1 tbsp cacao, pinch of cinnamon, drizzle of honey.",
      "Sip slowly while it is warm.",
    ],
  },
  {
    id: "bonus-rose-collagen",
    name: "Strawberry Rose Spritz",
    gradient: G.roseSand,
    bonus: true,
    prep: "3 min",
    servings: "1",
    benefitTag: "Sparkling",
    benefit:
      "Muddled strawberries and lime, topped with sparkling water, rose water and honey. Delicate, fizzy and fragrant.",
    ingredients: ["Strawberry", "Lime", "Sparkling water", "Rose water", "Honey"],
    method: [
      "Muddle 4 strawberries with lime juice.",
      "Top with sparkling water and 1 tsp rose water.",
      "Drizzle honey, stir gently.",
    ],
  },
  {
    id: "bonus-green-glow",
    name: "Kiwi, Cucumber & Mint",
    gradient: G.sageGold,
    bonus: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Fresh & green",
    benefit: "Cucumber, kiwi, mint and banana with almond milk and lime. Fresh, green and bright.",
    ingredients: ["Cucumber", "Kiwi", "Mint", "Banana", "Almond milk", "Lime"],
    method: [
      "Blend 1 cucumber, 2 kiwis, handful of mint.",
      "Add ½ banana and ½ cup almond milk.",
      "Squeeze in lime.",
    ],
  },
  {
    id: "bonus-warm-elixir",
    name: "Warm Hibiscus Berry Tea",
    gradient: G.plumGold,
    bonus: true,
    prep: "6 min",
    servings: "1",
    benefitTag: "Warm & spiced",
    benefit:
      "Hibiscus tea steeped with ginger, then stirred with muddled blueberries, honey and cinnamon. A warm cup for mornings when a cold smoothie feels too sharp.",
    ingredients: ["Blueberry", "Hibiscus tea", "Honey", "Cinnamon", "Ginger"],
    method: [
      "Steep hibiscus tea with a thumb of ginger for 6 minutes.",
      "Stir in muddled blueberries, honey, cinnamon.",
      "Strain and sip.",
    ],
  },
  {
    id: "bonus-glow-sorbet",
    name: "Blueberry Banana Bowl",
    gradient: G.lavenderIvory,
    bonus: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Frozen treat",
    benefit:
      "Frozen banana and blueberries blended with coconut yogurt and almond butter. A spoonable, dessert-like bowl.",
    ingredients: ["Banana", "Blueberry", "Coconut yogurt", "Almond butter", "Honey"],
    method: [
      "Blend 1 frozen banana with ½ cup frozen blueberries.",
      "Add 2 tbsp coconut yogurt and 1 tbsp almond butter.",
      "Scoop into a chilled bowl, drizzle honey.",
    ],
  },

  // ——— QUICK GLOW MORNINGS — 7 bonus five-minute smoothies (outside the 21-day rotation) ———
  {
    id: "berry-reds-yogurt-shake",
    name: "Berry Yogurt Shake",
    gradient: G.plumGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Creamy",
    benefit: "Frozen berries, yogurt or kefir, almond milk and chia. Thick, creamy and filling.",
    ingredients: [
      "1 cup frozen mixed berries",
      "1/2 cup Greek yogurt or kefir",
      "3/4 cup almond milk",
      "1 tsp chia seeds",
      "1/2 banana (optional)",
    ],
    method: [
      "Add almond milk, yogurt, berries, chia, and banana to the blender.",
      "Blend until smooth, about 30 seconds.",

      "Pour and sip slowly.",
      "Texture: thick and spoonable; add a splash more almond milk to drink it.",
      "Swap: no kefir? Plain Greek yogurt works. Dairy-free: coconut yogurt + oat milk.",
    ],
  },
  {
    id: "pomegranate-vanilla-glow",
    name: "Pomegranate & Vanilla",
    gradient: G.creamGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Fruity",
    benefit:
      "Pomegranate juice, strawberries, yogurt and vanilla, blended with ice. Bright, light and a little luxurious.",
    ingredients: [
      "1/2 cup pomegranate juice",
      "1 cup frozen strawberries",
      "1/2 cup Greek yogurt",
      "1/4 tsp vanilla extract",
      "1/2 cup ice",
    ],
    method: [
      "Pour pomegranate juice into the blender first.",
      "Add strawberries, yogurt, vanilla, and ice.",
      "Blend until silky.",

      "Texture: light and pourable, almost like a drinkable sorbet.",
      "Swap: use frozen cherries for a deeper, less sweet flavor.",
    ],
  },
  {
    id: "cucumber-mint-lightness",
    name: "Cucumber Pineapple Cooler",
    gradient: G.sageIvory,
    quick: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Tropical",
    benefit: "Cucumber, pineapple, lime and mint with coconut water. Crisp, cooling and light.",
    ingredients: [
      "1/2 cucumber, roughly chopped",
      "1 cup frozen pineapple",
      "Juice of 1/2 lime",
      "4 or 5 fresh mint leaves",
      "3/4 cup coconut water",
      "1 tsp chia seeds",
    ],
    method: [
      "Add coconut water, cucumber, and pineapple to the blender.",
      "Add lime, mint, and chia.",
      "Blend until smooth and pale green.",

      "Texture: thin and refreshing; best served over ice.",
      "Swap: no fresh mint? A drop of mint extract works. Honeydew can stand in for cucumber.",
    ],
  },
  {
    id: "cherry-cacao-calm-glow",
    name: "Chocolate Cherry Smoothie",
    gradient: G.plumDeep,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Chocolatey",
    benefit: "Cherries, cacao, banana and yogurt with almond milk. Rich, chocolatey and velvety.",
    ingredients: [
      "1 cup frozen cherries",
      "1 tbsp cacao powder",
      "1/2 banana",
      "1/2 cup Greek yogurt",
      "3/4 cup almond milk",
    ],
    method: [
      "Add almond milk, cherries, banana, and yogurt to the blender.",
      "Add cacao and blend until smooth.",

      "Texture: velvety and dessert-like; add ice for a thicker, colder finish.",
      "Swap: frozen blueberries can replace cherries. Oat milk for a creamier dairy-free version.",
    ],
  },
  {
    id: "peach-ginger-gut-glow",
    name: "Peach Ginger Smoothie",
    gradient: G.goldSand,
    quick: true,
    prep: "5 min",
    servings: "1",
    benefitTag: "Gently spiced",
    benefit:
      "Peaches, fresh ginger, flax or chia and yogurt with coconut water. Warm-spiced, golden and gentle.",
    ingredients: [
      "1 cup frozen peaches",
      "1/2 inch fresh ginger (or 1/4 tsp ground)",
      "1 tbsp ground flax or chia seeds",
      "1/2 cup Greek yogurt or kefir",
      "3/4 cup coconut water",
    ],
    method: [
      "Add coconut water, peaches, and ginger to the blender.",
      "Add flax or chia and yogurt.",
      "Blend until smooth and golden.",

      "Texture: smooth with a little body from the flax; thin with extra coconut water if needed.",
      "Swap: frozen mango works in place of peaches. Skip the ginger if you prefer it mellow.",
    ],
  },
  {
    id: "mocha-reds-morning",
    name: "Mocha Banana Smoothie",
    gradient: G.sandPlum,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Coffee",
    benefit:
      "Chilled coffee, cacao, banana and almond milk with protein or yogurt. Coffee and breakfast in one glass.",
    ingredients: [
      "1/2 cup cold brew or chilled coffee",
      "1 tbsp cacao powder",
      "1 scoop vanilla protein or 1/2 cup Greek yogurt",
      "1 frozen banana",
      "1/2 cup almond milk",
    ],
    method: [
      "Add coffee, almond milk, banana, and protein or yogurt to the blender.",
      "Add cacao and blend until smooth.",

      "Texture: creamy and frothy; add a few ice cubes if you like it colder.",
      "Swap: decaf or half-caf works just as well. Oat milk for extra creaminess.",
    ],
  },
  {
    id: "tropical-reds-quickie",
    name: "Mango Papaya Smoothie",
    gradient: G.sageGold,
    quick: true,
    prep: "4 min",
    servings: "1",
    benefitTag: "Tropical",
    benefit: "Mango, papaya, lime and chia with coconut water. Bright, sunny and naturally sweet.",
    ingredients: [
      "1 cup frozen mango",
      "1/2 cup frozen papaya (or extra mango)",
      "Juice of 1/2 lime",
      "3/4 cup coconut water",
      "1 tsp chia seeds",
    ],
    method: [
      "Add coconut water, mango, and papaya to the blender.",
      "Add lime and chia.",
      "Blend until smooth and golden-orange.",

      "Texture: smooth and tropical; naturally sweet on its own.",
      "Swap: pineapple can replace papaya. Add a handful of spinach for greens; the color stays bright.",
    ],
  },
];

export type Ingredient = {
  name: string;
  tagline: string;
  description: string;
  gut: string;
  skin: string;
};

export const INGREDIENTS: Ingredient[] = [
  {
    name: "Pomegranate",
    tagline: "Ellagic acid + punicalagins",
    description:
      "Deep-red arils rich in punicalagins and ellagic acid, two of the most researched fruit polyphenols.",
    gut: "Ellagitannins, vitamin C and fiber.",
    skin: "Tart, bright and jewel-red.",
  },
  {
    name: "Raspberry",
    tagline: "Ellagitannins, vitamin C",
    description: "Tiny berries rich in ellagitannins, vitamin C and fiber.",
    gut: "Fiber and vitamin C.",
    skin: "Bright, tart and fragrant.",
  },
  {
    name: "Strawberry",
    tagline: "Vitamin C, ellagic acid",
    description: "Gram for gram, about as much vitamin C as an orange, plus ellagic acid.",
    gut: "Vitamin C and ellagic acid.",
    skin: "Sweet, soft and pink.",
  },
  {
    name: "Tart cherry",
    tagline: "Anthocyanins, deep color",
    description:
      "One of the most anthocyanin-rich fruits you can buy, with a deep, sour-sweet flavor.",
    gut: "Anthocyanins.",
    skin: "Dark, rich and sour-sweet.",
  },
  {
    name: "Blueberry",
    tagline: "Anthocyanins, vitamin K",
    description: "Classic for a reason. Blueberries owe their deep color to anthocyanins.",
    gut: "Anthocyanins, fiber and vitamin K.",
    skin: "Sweet and deep blue-purple.",
  },
  {
    name: "Plum",
    tagline: "Chlorogenic acid, fiber",
    description:
      "Underrated polyphenol source. The chlorogenic acid is the same beneficial compound found in green coffee.",
    gut: "Chlorogenic acid and fiber.",
    skin: "Soft, juicy and gently tart.",
  },
  {
    name: "Watermelon",
    tagline: "Lycopene, citrulline",
    description: "Mostly water, with lycopene, the carotenoid behind its rosy color.",
    gut: "Lycopene and citrulline.",
    skin: "Light, cold and refreshing.",
  },
  {
    name: "Black fig",
    tagline: "Soluble fiber, polyphenols",
    description: "A naturally fiber-rich fruit with soft, jammy sweetness.",
    gut: "Soluble fiber and polyphenols.",
    skin: "Caramel-sweet and creamy.",
  },
  {
    name: "Beet",
    tagline: "Nitrates, betalains",
    description: "Naturally rich in nitrates and betalains, the pigments behind its deep color.",
    gut: "Supports a calm, well-fed gut environment.",
    skin: "Earthy, sweet and jewel-red.",
  },
  {
    name: "Hibiscus",
    tagline: "Anthocyanins, quercetin",
    description: "A vivid red tea rich in anthocyanins, with a long history of traditional use.",
    gut: "Anthocyanins and quercetin.",
    skin: "Tart, cranberry-like and ruby red.",
  },
  {
    name: "Cacao",
    tagline: "Flavanols, magnesium",
    description: "Rich in flavanols and magnesium, with a deep, dark flavor.",
    gut: "Flavanols, magnesium and fiber.",
    skin: "Dark, bittersweet and chocolatey.",
  },
  {
    name: "Almond",
    tagline: "Vitamin E, healthy fats",
    description: "A source of vitamin E and healthy fats, and the easiest way to add richness.",
    gut: "Vitamin E, healthy fats and fiber.",
    skin: "Nutty, creamy and filling.",
  },
  {
    name: "Oat milk",
    tagline: "Beta-glucans",
    description: "A creamy, gentle base. Oats contain beta-glucans, a type of soluble fiber.",
    gut: "Soluble fiber.",
    skin: "Creamy and mild.",
  },
  {
    name: "Almond milk",
    tagline: "Light base",
    description:
      "Low-sugar, gentle base. Pairs well with high-polyphenol fruits without competing.",
    gut: "Light and low in sugar.",
    skin: "Neutral and light.",
  },
  {
    name: "Chia",
    tagline: "Omega-3, fiber",
    description: "Plant omega-3 (ALA) and soluble fiber that thickens as it sits.",
    gut: "ALA omega-3 and fiber.",
    skin: "Sets into a soft gel and adds body.",
  },
  {
    name: "Cinnamon",
    tagline: "Polyphenols, warming spice",
    description: "A small pinch adds warmth and natural sweetness to the glass.",
    gut: "A warming spice.",
    skin: "Sweet-spicy and cozy.",
  },
  {
    name: "Honey",
    tagline: "Trace polyphenols",
    description: "A small amount of raw honey adds gentle sweetness and trace antioxidants.",
    gut: "Gentle sweetness.",
    skin: "Floral and golden.",
  },
  {
    name: "Rose water",
    tagline: "Calming aromatic",
    description: "Floral and aromatic. A traditional addition to feminine wellness rituals.",
    gut: "Aromatic rather than nutritional.",
    skin: "Floral and delicate.",
  },
  {
    name: "Coconut yogurt",
    tagline: "Probiotics, fats",
    description:
      "Probiotic base with healthy medium-chain fats. Pairs beautifully with stone fruits.",
    gut: "Live cultures and healthy fats.",
    skin: "Tangy and creamy.",
  },
  {
    name: "Lime",
    tagline: "Vitamin C, brightness",
    description: "Brightens flavor and adds vitamin C without the bulk of orange juice.",
    gut: "Vitamin C.",
    skin: "Bright and sharp.",
  },
  {
    name: "Orange",
    tagline: "Vitamin C, hesperidin",
    description: "Rich in vitamin C and hesperidin, a citrus flavonoid.",
    gut: "Vitamin C and hesperidin.",
    skin: "Sweet, sunny and juicy.",
  },
  {
    name: "Banana",
    tagline: "Potassium, prebiotics",
    description: "Slightly green bananas contain resistant starch, a type of fiber.",
    gut: "Potassium and fiber.",
    skin: "Sweet, creamy and thickening.",
  },
  {
    name: "Ginger",
    tagline: "Gingerols",
    description: "Warming and aromatic, with long traditional use in morning rituals.",
    gut: "Gingerols.",
    skin: "Spicy, warming heat.",
  },
  {
    name: "Lemon",
    tagline: "Vitamin C, citric acid",
    description: "Warm lemon water is the gentlest way to begin the morning ritual.",
    gut: "Vitamin C.",
    skin: "Bright and clean.",
  },
  {
    name: "Radiant Reds",
    tagline: "NOURÉ blend",
    description:
      "The polyphenol-dense base of every morning. Pomegranate, beet, hibiscus, açaí, and more in one scoop.",
    gut: "Red-plant polyphenols, fiber and probiotic cultures.",
    skin: "Deep red and tart-sweet.",
  },
  {
    name: "Açaí",
    tagline: "Anthocyanins, healthy fats",
    description: "An Amazonian berry rich in anthocyanins, with a little natural fat.",
    gut: "Anthocyanins and healthy fats.",
    skin: "Dark and earthy-berry.",
  },
  {
    name: "Green tea",
    tagline: "EGCG",
    description: "EGCG is the signature polyphenol of green tea.",
    gut: "EGCG. Contains caffeine.",
    skin: "Grassy, fresh and gently bitter.",
  },
  {
    name: "Turmeric",
    tagline: "Curcumin",
    description:
      "Curcumin gives turmeric its golden color. Pair it with black pepper and a little fat.",
    gut: "Curcumin.",
    skin: "Earthy, warm and golden.",
  },
  {
    name: "Mint",
    tagline: "Aromatic herb",
    description: "Cooling and aromatic. A small handful elevates any morning blend.",
    gut: "Aromatic and fresh.",
    skin: "Cool and bright.",
  },
  {
    name: "Strawberry leaf tea",
    tagline: "Quiet ritual",
    description: "A traditional women's wellness brew, quietly polyphenol-rich.",
    gut: "Mild and astringent.",
    skin: "Light and grassy.",
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
      "The best-known food source of punicalagins.",
      "Gut bacteria can turn its ellagitannins into urolithins; how much varies from person to person.",
      "Also brings vitamin C and fiber.",
      "Jewel-red and tart.",
      "Seeds, juice or blended arils all work.",
    ],
    howTo: "Fresh seeds or juice, blended into a smoothie.",
  },
  {
    id: "acai",
    name: "Açaí",
    color: "#3E1A47",
    topBenefit: "Deep anthocyanins",
    points: [
      "Deep purple from anthocyanins.",
      "Rich in anthocyanins.",
      "Contains natural fat, unusual for a berry.",
      "Pairs well with banana and almond milk.",
      "Acai is also on the Radiant Reds label.",
    ],
    howTo: "Frozen pulp blended into a smoothie.",
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
      "Wild blueberries are smaller and deeply colored.",
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
      "Made from the dried calyces of the hibiscus flower.",
      "Tart, cranberry-like flavor.",
      "Cooling iced or warming hot.",
      "Pairs with lime and watermelon.",
    ],
    howTo: "Brewed as tea, hot or iced; cool it fully before blending.",
  },
  {
    id: "beet",
    name: "Beet",
    color: "#6B1730",
    topBenefit: "Nitrates & betalains",
    points: [
      "Naturally rich in dietary nitrate.",
      "Betalains are the pigments behind its color.",
      "Jewel-red natural pigment.",
      "Roast or steam to soften flavor.",
      "Pairs with raspberry and orange.",
    ],
    howTo: "Roasted or steamed, then cooled for blending.",
  },
  {
    id: "green-tea",
    name: "Green tea",
    color: "#3E5C3A",
    topBenefit: "Signature EGCG",
    points: [
      "EGCG is one of the most studied polyphenols.",
      "Green tea is also on the Radiant Reds label.",
      "Grassy, fresh and gently bitter.",
      "Many prefer it brewed below boiling for a softer taste.",
      "Contains caffeine, so you may prefer it earlier in the day.",
    ],
    howTo: "1 to 2 cups in the morning or early afternoon.",
  },
  {
    id: "turmeric",
    name: "Turmeric",
    color: "#C8893A",
    topBenefit: "Golden curcumin",
    points: [
      "Curcumin gives turmeric its gold.",
      "Often paired with black pepper.",
      "Often used with a little fat, such as milk.",
      "Earthy and warm; a little goes a long way.",
      "Adds warmth to morning blends.",
    ],
    howTo: "A pinch to ½ tsp in a warm drink or smoothie.",
  },
  {
    id: "cacao",
    name: "Cacao",
    color: "#4A2716",
    topBenefit: "Rich flavanols",
    points: [
      "Rich in flavanols.",
      "Dark, bittersweet depth.",
      "A source of magnesium.",
      "Natural (non-alkalized) cocoa keeps more flavanols than Dutch-processed.",
      "Pairs with cherry and almond.",
    ],
    howTo: "1 to 2 tbsp cocoa or cacao powder in a smoothie or warm drink.",
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
    body: `The gut-skin axis is the phrase researchers use for the ways your digestive system and your skin appear to be connected. It's a fascinating, active area of study, and much of it is still being worked out.\n\nWhat's well established is simpler: a varied diet with plenty of fiber, water and colorful plants is part of taking good care of yourself.\n\nYour 21 Mornings are built on that everyday idea. Every morning gives you one colorful, fiber-rich glass and a few quiet minutes. The ritual is the part you control, and it's a beautiful part to keep.`,
  },
  {
    id: "morning-timing",
    title: "Why This Ritual Lives in the Morning",
    body: `Habits stick best when they're tied to a moment you already have. For most of us, that's the first quiet minutes of the morning.\n\nAnchoring the glass to the same time every day means you never have to decide. The ritual is simply what happens after you wake up: blend, pour, sip.\n\nA calm, colorful start sets a steady tone for the rest of your day. It's a small lever you can pull every morning.`,
  },
  {
    id: "reading-skin",
    title: "Noticing Your Mornings During the Reset",
    body: `Your skin renews itself slowly, over weeks, and everyone's skin is different. So this reset asks you to notice rather than expect.\n\nDays 1 to 7: Focus on the routine. Notice how your mornings feel.\n\nDays 8 to 14: Take a quiet photo in natural light if you'd like a private record. There's nothing to judge.\n\nDays 15 to 21: Look back through your journal. Notice what has become easier, and what you've come to love.\n\nDay 22 onward: The ritual is now your morning, not your reset. Keep what works for you.`,
  },
  {
    id: "reds-ingredients",
    title: "What's in Radiant Reds",
    body: `Radiant Reds is built around red fruit and plant powders. Its 2,000 mg Polyphenol Blend lists beet root first, then strawberry, hibiscus, raspberry, black currant, acai, blueberry, cranberry, grape seed, African mango and pomegranate. Within a blend, ingredients are listed from most to least by weight.\n\nAs whole foods, these plants are known for different compounds: pomegranate for ellagitannins such as punicalagins, beetroot for nitrates and the betalain pigments behind its deep red, hibiscus, acai and berries for anthocyanins, and raspberry and strawberry for ellagitannins.\n\nThe label does not state how much of any single ingredient, or of any of these compounds, one scoop contains.\n\nThe label also lists a 700 mg blend of oat fiber and inulin, a 9-strain probiotic, and a 400 mg blend that includes cinnamon, green tea, ginger and turmeric. The full ingredient list is on the jar.`,
  },
  {
    id: "after-21",
    title: "After 21 Days: How to Keep the Ritual",
    body: `Twenty-one mornings are a real start, and research suggests habits often take longer than that to feel automatic, so the morning glass is worth keeping.\n\nThe most common mistake is to treat day 22 as the end. Don't. The ritual you kept for 21 days can carry you to day 121.\n\nKeep the morning glass. Keep the slow start. Rotate the recipes. Add a second polyphenol moment in the afternoon if you want to deepen.\n\nYour 21 Mornings are the start of a morning you keep.`,
  },
];

export type BlendTip = { thick: string; thin: string; pro: string };

export const BLEND_TIPS: Record<string, BlendTip> = {
  "pomegranate-elixir": {
    thick:
      "Add ½ frozen banana or 2 tbsp coconut yogurt. The fat deepens the texture and makes it feel more like a meal.",
    thin: "Add ¼ cup more oat milk, or a splash of cold hibiscus tea. Strain through a fine mesh for extra silk.",
    pro: "Chill the glass first and pour slowly, so you can enjoy the color.",
  },
  "berry-bloom": {
    thick:
      "Add 1 tbsp almond butter or use a frozen banana half. Let it sit 5 minutes after blending; the chia swells and thickens it naturally.",
    thin: "Use 1¼ cups almond milk and skip the chia. Strain over ice for a bright, clean pour.",
    pro: "Freeze the berries the night before for a colder, thicker glass without adding ice.",
  },
  "cherry-cacao": {
    thick:
      "Double the almond butter to 2 tbsp and use ¾ cup oat milk. This becomes a proper morning meal.",
    thin: "Add an extra ¼ cup oat milk and skip the almond butter. Run the blender an extra 30 seconds for a silky finish.",
    pro: "Use frozen tart cherries straight from the bag, no need to thaw. The cold keeps the flavor deep and dark.",
  },
  "plum-rose": {
    thick:
      "Add 3 tbsp more coconut yogurt and reduce the rose water to ½ tsp. The yogurt rounds the tartness and gives it body.",
    thin: "Add 2 tbsp cold water and blend until completely smooth. This one is lovely thinner, where the rose water can come through.",
    pro: "Use very ripe plums and leave the skins on. They carry much of the color.",
  },
  "watermelon-reds": {
    thick:
      "Freeze the watermelon cubes overnight. Blended frozen, it becomes a sorbet-style slush with no extra ingredients.",
    thin: "Double the hibiscus tea and serve over crushed ice. The palest, most refreshing version.",
    pro: "Brew the hibiscus tea strong, then chill it overnight for the deepest color.",
  },
  "fig-almond": {
    thick:
      "Add 1 tbsp almond butter and use ¾ cup oat milk. The fig and almond together become almost caramel-like.",
    thin: "Use 1¼ cups oat milk and blend longer. Strain if the fig seeds bother you.",
    pro: "Using dried figs? Soak them in warm water for 15 minutes before blending so they soften and blend silky.",
  },
  "beet-glow": {
    thick:
      "Add 1 small frozen banana to balance the earthiness. The natural starch makes it thick and almost dessert-like.",
    thin: "Add extra orange juice, then strain through a fine mesh for a clear, jewel-red glass.",
    pro: "Roast the beet ahead of time and freeze in cubes. Game-changer for texture and sweetness.",
  },
  "golden-turmeric": {
    thick:
      "Use oat milk and whisk in ½ tsp coconut oil. The fat emulsifies everything and adds body.",
    thin: "Use almond milk and keep it warm. No need to blend; just whisk gently.",
    pro: "Add a crack of black pepper, turmeric's classic partner. A pinch is enough.",
  },
  "matcha-cloud": {
    thick:
      "Use a frozen banana half and only ½ cup almond milk. Blend until completely smooth; it turns thick and pale green.",
    thin: "Whisk the matcha separately, then pour over ice and top with almond milk. No blending needed.",
    pro: "Sift the matcha before whisking. Clumps are the enemy. A bamboo whisk in a zig-zag motion, not circular.",
  },
  "lavender-honey": {
    thick:
      "Stir in 1 tbsp raw honey and 2 tbsp coconut yogurt after steeping. Serve at room temperature.",
    thin: "Double the water, steep 3 minutes, strain well, serve over ice. The lightest, most delicate version.",
    pro: "Steep culinary lavender for 4 minutes at most, or it can taste soapy.",
  },
  "rose-cardamom": {
    thick:
      "Add ¼ tsp coconut cream to the oat milk before warming. The result is luscious and almost dessert-like.",
    thin: "Reduce to ¾ cup oat milk and add ¼ cup water. Keep it warm, not hot.",
    pro: "Crush cardamom pods fresh if you have them. The fragrance is noticeably brighter than ground.",
  },
  "blueberry-basil": {
    thick: "Use frozen wild blueberries. The frozen fruit makes it naturally thick without yogurt.",
    thin: "Add ¼ cup cold water and strain through a fine mesh. Serve very cold.",
    pro: "Add the basil last, for just a few seconds in the blender. Over-blending can turn it slightly bitter.",
  },
  "papaya-lime": {
    thick: "Add 2 tbsp more coconut yogurt for an especially smooth, creamy glass.",
    thin: "Blend with ¼ cup cold water and strain. Papaya thins beautifully, almost like juice.",
    pro: "Let papaya ripen until it's fully yielding. The riper it is, the sweeter and silkier the glass.",
  },
  "peach-saffron": {
    thick: "Use ½ cup almond milk and add 1 tbsp almond butter. Luxurious texture.",
    thin: "Add ¼ cup extra almond milk. Serve over a single large ice cube.",
    pro: "Let the saffron steep in the warm almond milk for 10 minutes before blending, for a deeper color and aroma.",
  },
  "fig-vanilla": {
    thick: "Use ¾ cup oat milk and blend in 2 tbsp almond butter. This is a full meal.",
    thin: "1¼ cups oat milk and strain. The natural sweetness of fig makes it work as a light drink.",
    pro: "If you can, scrape in a vanilla bean. The flavor is worth it.",
  },
  "cucumber-mint": {
    thick: "This one is best thin. For something thicker, freeze it in ice pop molds instead.",
    thin: "Add ¼ cup more sparkling water at the end, without blending the bubbles. Serve right away.",
    pro: "Leave the cucumber unpeeled for a greener color and a fresher flavor.",
  },
  "apricot-almond": {
    thick:
      "Add 1 tbsp almond butter and use only ½ cup oat milk. Let it rest 2 minutes; it thickens as it sits.",
    thin: "Use 1 cup oat milk and add a splash of cold water. Strain for a delicate, pale gold pour.",
    pro: "Use ripe apricots that yield to gentle pressure. They are sweetest and most fragrant at peak ripeness.",
  },
  "kiwi-spinach": {
    thick: "Freeze the banana half first. It smooths the sharpness of the kiwi and adds body.",
    thin: "Skip the banana, add ¼ cup more almond milk. Strain for a completely clear, jewel-green glass.",
    pro: "Kiwi skin is edible and adds extra fiber. Try blending whole if your blender is powerful.",
  },
  "vanilla-chia": {
    thick: "Add an extra tablespoon of chia and let it sit overnight rather than a few hours.",
    thin: "Use 1¼ cups oat milk in the mix. The ratio is everything with chia.",
    pro: "Stir twice during the first 10 minutes in the fridge to prevent clumps and keep the texture smooth.",
  },
  "ginger-pear": {
    thick: "Add ½ banana and blend the ginger fully. Warming and filling.",
    thin: "For a clear, spicy version, press the pear and ginger through a juicer instead of blending.",
    pro: "Freeze the pear first if you want it cold and thick. Fresh pear makes it thinner and more delicate.",
  },
  "honey-almond": {
    thick: "Use 2 tbsp almond butter instead of 1 and reduce oat milk to ¾ cup.",
    thin: "1¼ cups oat milk and just ½ tbsp almond butter. Warm and silky.",
    pro: "Warm it gently without boiling, then stir in the honey off the heat.",
  },
  "bonus-cacao-tonic": {
    thick:
      "Add 1 tbsp almond butter and reduce to ¾ cup oat milk. It turns richer, closer to hot chocolate.",
    thin: "Use 1¼ cups oat milk and just whisk. No need to blend.",
    pro: "Whisk the cacao into a splash of the warm milk first, then add the rest, so it stays smooth.",
  },
  "bonus-rose-collagen": {
    thick: "Add 2 tbsp coconut yogurt and stir gently, without over-mixing.",
    thin: "More sparkling water, less sparkling. The lighter it is, the more elegant.",
    pro: "Add the sparkling water last, after everything else is mixed.",
  },
  "bonus-green-glow": {
    thick: "Freeze the banana half first. It turns completely smooth and green.",
    thin: "Skip the banana, strain, serve very cold.",
    pro: "Blend the mint for just 3 seconds. Any longer and it can turn bitter.",
  },
  "bonus-warm-elixir": {
    thick:
      "Muddle the berries hard before adding the tea. Let it steep together for 2 extra minutes.",
    thin: "Strain and serve hot without muddling, for a clean, garnet-colored cup.",
    pro: "Let it steep the full 6 minutes for the deepest color and ginger warmth.",
  },
  "bonus-glow-sorbet": {
    thick: "Use less coconut yogurt and blend from frozen. It comes out like ice cream.",
    thin: "Add 2 tbsp oat milk and blend until completely smooth.",
    pro: "Pre-freeze your bowl. Cold bowl, cold sorbet, right consistency.",
  },
};

export const JOURNAL_PROMPTS: Record<number, (name: string) => string> = {
  1: (n) => `What would make this morning feel good for you, ${n}?`,
  2: () => `What do you want to make room for today?`,
  3: () => `What's one small thing you're looking forward to?`,
  4: () => `What's on your mind this morning?`,
  5: () => `What's one thing you'd like to get done today?`,
  6: () => `What's something small you enjoyed yesterday?`,
  7: (n) => `One week in, ${n}. What would you like to keep doing?`,
  8: () => `What would a gentle pace look like today?`,
  9: () => `What's an idea you keep coming back to?`,
  10: () => `Which glass this week did you enjoy most?`,
  11: () => `What's one thing you'd like to try this week?`,
  12: () => `Who would you like to catch up with soon?`,
  13: () => `What's a small moment from this week you'd like to remember?`,
  14: (n) => `You're halfway, ${n}. What do you want to keep?`,
  15: () => `What's one thing that can wait until tomorrow?`,
  16: () => `What's something you're curious about right now?`,
  17: () => `What feels easier than it did on Day 1?`,
  18: () => `What would you like your mornings to look like after Day 21?`,
  19: () => `What would make tomorrow morning simpler?`,
  20: () => `Which recipe would you make again, and what would you change?`,
  21: (n) => `Last morning, ${n}. What would you like to carry into next week?`,
};

const SETS = {
  A: [
    "Tired is information, not failure. Your body is asking you to slow the morning, not push it.",
    "Rest is part of the ritual. Tomorrow's glass will be waiting.",
    "Today, do less. The ritual is the glass; everything else can wait.",
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
        note: "1 cup per use; frozen works",
      },
      { id: "raspberries", name: "Raspberries", note: "Fresh or frozen" },
      { id: "blueberries", name: "Blueberries", note: "Wild if available" },
      { id: "strawberries", name: "Strawberries" },
      { id: "banana", name: "Banana", note: "Slightly green = more prebiotic fiber" },
      { id: "plum", name: "Plum (2 to 3)", note: "Ripe, any variety" },
      { id: "watermelon", name: "Watermelon" },
      { id: "black-fig", name: "Black figs (4 to 6)", note: "Fresh or dried" },
      { id: "beet", name: "Beet (2 small)", note: "Pre-roast for the week" },
      { id: "tart-cherry", name: "Tart cherries", note: "Frozen or jarred unsweetened" },
      { id: "peach", name: "Peach or nectarine" },
      { id: "kiwi", name: "Kiwi (2)" },
      { id: "orange", name: "Orange" },
      { id: "lime", name: "Lime (4 to 5)" },
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
        note: "Optional. 30 servings a jar: one scoop a morning would cover all 21 days, with 9 left over",
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
      { id: "saffron", name: "Saffron (pinch jar)", note: "For Peach & Saffron" },
      { id: "cardamom", name: "Cardamom (ground)" },
    ],
  },
  {
    name: "Quick Mornings",
    items: [
      { id: "qg-frozen-berries", name: "Frozen mixed berries", note: "Berry Yogurt Shake" },
      { id: "qg-frozen-cherries", name: "Frozen cherries", note: "Chocolate Cherry Smoothie" },
      { id: "qg-frozen-mango", name: "Frozen mango", note: "Mango Papaya Smoothie" },
      { id: "qg-frozen-papaya", name: "Frozen papaya", note: "Or extra mango" },
      { id: "qg-frozen-pineapple", name: "Frozen pineapple", note: "Cucumber Pineapple Cooler" },
      { id: "qg-cucumber", name: "Cucumber", note: "Cucumber Pineapple Cooler" },
      { id: "qg-greek-yogurt", name: "Greek yogurt or kefir", note: "Most quick recipes" },
      { id: "qg-coconut-water", name: "Coconut water", note: "Three quick recipes" },
      { id: "qg-cold-brew", name: "Cold brew or chilled coffee", note: "Mocha Banana Smoothie" },
      { id: "qg-flax", name: "Ground flax", note: "Or use chia seeds" },
      { id: "qg-vanilla", name: "Vanilla extract", note: "Pomegranate & Vanilla" },
      { id: "qg-protein", name: "Vanilla protein (optional)", note: "Mocha Banana Smoothie" },
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
