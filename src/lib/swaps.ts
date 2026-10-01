/**
 * Simple swaps for ingredients that can be hard to find or not to someone's taste.
 * Each swap is tied to the recipes that actually use the ingredient, and its amount
 * follows the recipe's own step (e.g. "1 cup tart cherries"). Swaps change taste or
 * texture; they are not presented as nutritional equivalents, and they never change a
 * recipe or the saved grocery list.
 */
export type Swap = {
  id: string;
  ingredient: string;
  swap: string;
  note: string;
  /** Recipe ids whose ingredient list contains `match`. */
  recipes: string[];
  match: string;
};

export const SWAPS: Swap[] = [
  {
    id: "pomegranate",
    ingredient: "Pomegranate seeds (1 cup)",
    swap: "1 cup frozen pomegranate arils, or ½ cup unsweetened pomegranate juice",
    note: "Juice makes a thinner glass; use a little less oat milk.",
    recipes: ["pomegranate-elixir"],
    match: "Pomegranate",
  },
  {
    id: "tart-cherry",
    ingredient: "Tart cherries (1 cup)",
    swap: "1 cup frozen dark sweet cherries plus a squeeze of lemon",
    note: "Sweeter and less tart.",
    recipes: ["cherry-cacao"],
    match: "Tart cherry",
  },
  {
    id: "black-fig",
    ingredient: "Fresh black figs (3)",
    swap: "3 dried figs, soaked in warm water for 10 minutes",
    note: "Sweeter and a little thicker.",
    recipes: ["fig-almond", "fig-vanilla"],
    match: "Black fig",
  },
  {
    id: "rose-water",
    ingredient: "Rose water (1 tsp)",
    swap: "Leave it out, or use ¼ tsp vanilla extract",
    note: "Less floral; the rest of the recipe stays the same.",
    recipes: ["plum-rose", "rose-cardamom", "bonus-rose-collagen"],
    match: "Rose water",
  },
  {
    id: "hibiscus-tea",
    ingredient: "Hibiscus tea (1 cup, cooled)",
    swap: "1 cup cold water with an extra squeeze of lime",
    note: "Lighter in color and less tart.",
    recipes: ["watermelon-reds", "bonus-warm-elixir"],
    match: "Hibiscus tea",
  },
  {
    id: "coconut-yogurt",
    ingredient: "Coconut yogurt (½ cup)",
    swap: "½ cup plain Greek or regular yogurt",
    note: "Tangier and thicker. Contains dairy.",
    recipes: ["plum-rose", "papaya-lime", "bonus-glow-sorbet"],
    match: "Coconut yogurt",
  },
  {
    id: "plant-milk",
    ingredient: "Oat or almond milk",
    swap: "Any unsweetened milk you like, same amount",
    note: "Body and sweetness vary by milk.",
    recipes: ["pomegranate-elixir", "cherry-cacao", "fig-almond", "berry-bloom", "matcha-cloud"],
    match: "milk",
  },
  {
    id: "cacao",
    ingredient: "Cacao (1 tbsp)",
    swap: "1 tbsp unsweetened cocoa powder",
    note: "Slightly milder chocolate flavor.",
    recipes: ["cherry-cacao", "bonus-cacao-tonic"],
    match: "Cacao",
  },
  {
    id: "almond-butter",
    ingredient: "Almond butter (1 tbsp)",
    swap: "1 tbsp cashew, peanut or sunflower seed butter",
    note: "Sunflower seed butter is a nut-free option; the flavor changes.",
    recipes: ["cherry-cacao"],
    match: "Almond butter",
  },
  {
    id: "beet",
    ingredient: "Beet (1 small, roasted or steamed)",
    swap: "1 small pre-cooked beet from the produce aisle",
    note: "Same result, no roasting.",
    recipes: ["beet-glow"],
    match: "Beet",
  },
  {
    id: "ginger",
    ingredient: "Fresh ginger",
    swap: "¼ tsp ground ginger for each ½ inch of fresh ginger",
    note: "Warmer and less bright.",
    recipes: ["beet-glow", "ginger-pear", "bonus-warm-elixir"],
    match: "Ginger",
  },
  {
    id: "honey",
    ingredient: "Honey",
    swap: "Maple syrup, same amount",
    note: "A plant-based option with a deeper sweetness.",
    recipes: ["plum-rose", "golden-turmeric", "matcha-cloud"],
    match: "Honey",
  },
  {
    id: "chia",
    ingredient: "Chia seeds",
    swap: "Ground flaxseed, same amount",
    note: "Nuttier, and it thickens less.",
    recipes: ["berry-bloom", "vanilla-chia"],
    match: "Chia",
  },
];
