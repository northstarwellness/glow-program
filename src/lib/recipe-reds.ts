/**
 * Optional Radiant Reds section for each recipe (2026-09-30).
 *
 * Label-accurate only: blend totals from the Supplement Facts panel
 * (noure-claude-content-engine/brand/radiant-reds-supplement-facts-panel.md) and the
 * supplier listing's suggested use (brand/radiant-reds-ingredient-panel.md). The printed jar
 * directions, warnings and allergen statement are not yet on file, so nothing here restates them. No efficacy, synergy, absorption or multiplier claims:
 * no study compares a smoothie with and without this product, and the undisclosed
 * per-ingredient amounts cannot be shown to reach studied doses. Every recipe is
 * complete without it. Evidence record: glow-program-review-evidence/2026-09-30-recipe-first/.
 */

export const REDS_SECTION = {
  /**
   * Caution text as printed in the label artwork on file (NOURE-RA/02_radiant_reds/
   * 2026-07-09_radiant-reds-label-3.png, left panel; the supplier's standard regulatory text),
   * sentence case instead of capitals. Not yet confirmed against a photo of a printed jar.
   */
  caution:
    "Do not exceed recommended dose. Consult a physician if pregnant, nursing, under 18, or have a medical condition. Keep out of reach of children. Do not use if safety seal is damaged or missing. Store in a cool, dry place.",
  title: "Optional addition: Radiant Reds",
  whatItAdds:
    "One scoop of Radiant Reds adds a 2,000 mg Polyphenol Blend of red fruit and plant powders, a 700 mg blend of oat fiber and inulin, a 9-strain probiotic, and 2 g of dietary fiber. It also turns the glass a stronger red.",
  labelDetails:
    "One scoop is 4 g, and a jar holds 30 scoops. The label lists three blends: a 2,000 mg Polyphenol Blend with beet root listed first, then strawberry, hibiscus, raspberry, black currant, acai, blueberry, cranberry, grape seed, African mango and pomegranate; a 700 mg blend of oat fiber and inulin; and a 400 mg blend of cinnamon, green tea, ginger, turmeric, shilajit extract, bitter melon extract and black pepper extract, plus a 9-strain probiotic declared at 3.2 billion CFU at the time of manufacture. Ingredients in each blend are listed from most to least by weight within that blend, and the label does not disclose individual amounts. The supplier's product listing suggests one scoop in 6 to 8 oz of cold water or another beverage once a day, consumed within 10 minutes of mixing. Follow the directions and any warnings on your jar. It is entirely optional, and every recipe here is complete without it.",
} as const;

/**
 * Per-recipe card (release pass, 2026-09-30): a short headline and two or three points, built
 * only from (a) ingredients the recipe and the label's Polyphenol Blend share, (b) the blends the
 * label lists, never amounts, and (c) the supplier listing's suggested use (one scoop in 6 to 8 oz
 * of cold water or another beverage). No taste, color-shade, absorption or benefit predictions;
 * the earlier tartness and shade notes were removed as unverified.
 */
export type RedsRecipeNote = { headline: string; points: string[]; howTo: string };

/** The label's blends, in plain words. */
const BLENDS =
  "One scoop lists a 2,000 mg Polyphenol Blend of 11 fruit and plant powders, with beet root listed first.";
const FIBER =
  "The label also lists a 700 mg blend of oat fiber and inulin and a 9-strain probiotic.";
const NO_AMOUNTS = "The label doesn't say how much of any single ingredient a scoop contains.";
const WARM_POINT =
  "The supplier's listing suggests cold water or another beverage, so with this warm cup, a cold glass alongside fits best.";
const GREEN_POINT =
  "It's a red powder, so stirring it in will change the color of this green glass. A glass of cold water on the side keeps the green.";

const COLD_HOW = "Stir or blend one scoop into the finished glass.";
const WARM_HOW =
  "If you'd like it with this cup, stir one scoop into 6 to 8 oz of cold water to enjoy alongside.";
const GREEN_HOW =
  "Stir one scoop into the finished glass, or into 6 to 8 oz of cold water to enjoy alongside.";
const DUAL_HOW =
  "Cold version: stir or blend one scoop into the finished glass. Warm version: stir one scoop into 6 to 8 oz of cold water to enjoy alongside.";

const GENERIC = "Eleven red fruit and plant powders in one scoop";
const shared = (what: string, headline: string, how = COLD_HOW): RedsRecipeNote => ({
  headline,
  points: [what, FIBER, NO_AMOUNTS],
  howTo: how,
});
const plain = (how = COLD_HOW): RedsRecipeNote => ({
  headline: GENERIC,
  points: [BLENDS, FIBER],
  howTo: how,
});
const warm = (headline = "A cold red glass beside your warm cup"): RedsRecipeNote => ({
  headline,
  points: [BLENDS, WARM_POINT],
  howTo: WARM_HOW,
});
const green = (extra?: string): RedsRecipeNote => ({
  headline: "For a green glass, stir it in or keep it on the side",
  points: [extra ?? BLENDS, GREEN_POINT],
  howTo: GREEN_HOW,
});

/** One card per recipe. */
export const REDS_BY_RECIPE: Record<string, RedsRecipeNote> = {
  "pomegranate-elixir": shared(
    "Pomegranate and raspberry, the two fruits in this glass, are both in the label's Polyphenol Blend.",
    "Two sources of pomegranate in one glass",
  ),
  "berry-bloom": shared(
    "Blueberry and strawberry, both in this glass, are in the label's Polyphenol Blend.",
    "Your berries are on the label too",
  ),
  "cherry-cacao": plain(),
  "plum-rose": plain(),
  "watermelon-reds": shared(
    "Hibiscus is in your cooled tea and in the label's Polyphenol Blend.",
    "Hibiscus in the tea and in the scoop",
    "Make sure the hibiscus tea is fully cold, then stir or blend one scoop into the finished glass.",
  ),
  "fig-almond": plain(),
  "beet-glow": shared(
    "Beet root is listed first in the label's Polyphenol Blend, and raspberry is in it too.",
    "Beet in the glass, beet root first on the label",
  ),
  "golden-turmeric": warm(),
  "matcha-cloud": green(
    "Green tea is on the Radiant Reds label too, alongside the red fruit and plant powders.",
  ),
  "lavender-honey": warm(),
  "rose-cardamom": warm(),
  "blueberry-basil": shared(
    "Blueberry, the berry in this glass, is in the label's Polyphenol Blend.",
    "Blueberry in the glass and on the label",
  ),
  "papaya-lime": plain(),
  "peach-saffron": plain(
    "After the saffron milk has cooled and the glass is blended, stir or blend in one scoop.",
  ),
  "fig-vanilla": plain(),
  "cucumber-mint": green(),
  "apricot-almond": plain(),
  "kiwi-spinach": green(),
  "vanilla-chia": {
    headline: GENERIC,
    points: [
      BLENDS,
      "The supplier's listing suggests drinking it within 10 minutes of mixing, so add it in the morning, not the night before.",
    ],
    howTo:
      "In the morning, stir one scoop into 6 to 8 oz of cold water to enjoy alongside the pudding.",
  },
  "ginger-pear": { ...plain(DUAL_HOW) },
  "honey-almond": { ...plain(DUAL_HOW) },
  "bonus-cacao-tonic": warm(),
  "bonus-rose-collagen": shared(
    "Strawberry is listed second in the label's Polyphenol Blend, and it's the fruit in this spritz.",
    "Strawberry in the glass and on the label",
    "Stir one scoop into the muddled strawberries and lime, then top with sparkling water and rose water.",
  ),
  "bonus-green-glow": green(),
  "bonus-warm-elixir": {
    headline: "Hibiscus and blueberry, beside your warm cup",
    points: [
      "Hibiscus and blueberry, both in this cup, are in the label's Polyphenol Blend.",
      WARM_POINT,
    ],
    howTo: WARM_HOW,
  },
  "bonus-glow-sorbet": shared(
    "Blueberry, the berry in this bowl, is in the label's Polyphenol Blend.",
    "Blueberry in the bowl and on the label",
    "Add one scoop with the frozen banana and blueberries and blend.",
  ),
  "berry-reds-yogurt-shake": shared(
    "Frozen mixed berries often include strawberry, raspberry and blueberry, which are all in the label's Polyphenol Blend. Check your bag.",
    "Red berries in the glass and on the label",
  ),
  "pomegranate-vanilla-glow": shared(
    "Pomegranate and strawberry, both in this glass, are in the label's Polyphenol Blend.",
    "Two sources of pomegranate in one glass",
  ),
  "cucumber-mint-lightness": green(),
  "cherry-cacao-calm-glow": plain(),
  "peach-ginger-gut-glow": plain(),
  "mocha-reds-morning": {
    headline: "A note if you're watching caffeine",
    points: [
      BLENDS,
      "Green tea is on the label, and the label doesn't state a caffeine amount, so keep that in mind alongside your coffee.",
    ],
    howTo: COLD_HOW,
  },
  "tropical-reds-quickie": plain(),
};
