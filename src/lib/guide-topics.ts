/**
 * Ritual Guide topics as short sheets (release pass, 2026-09-30): a descriptive heading, one
 * short introduction and three takeaways, all drawn from the article text in `ARTICLES`
 * (src/lib/content.ts), which stays available in full under "Read more" with its sources.
 * Nothing here adds a fact that the article does not state.
 */
export type GuideTopic = {
  /** Tile label, a few words. */
  short: string;
  /** One line on the tile, so it is clear what opens. */
  teaser: string;
  intro: string;
  takeaways: [string, string, string];
  sources: { label: string; url: string }[];
};

export const GUIDE_TOPICS: Record<string, GuideTopic> = {
  polyphenols: {
    short: "Polyphenols",
    teaser: "What they are and where the color comes from",
    intro:
      "Polyphenols are plant compounds that help plants cope with sun, heat and pests, and they give many fruits, flowers and roots their color.",
    takeaways: [
      "The families in this ritual: anthocyanins (deep reds and purples), ellagitannins (pomegranate, raspberry) and flavanols (cacao, green tea).",
      "Some are absorbed directly. Many travel on to the gut, where bacteria break them into smaller compounds that researchers are still studying.",
      "That's why the ritual favors variety and consistency over any single superfood.",
    ],
    sources: [
      {
        label:
          "Manach C. et al. Polyphenols: food sources and bioavailability. Am J Clin Nutr, 2004.",
        url: "https://pubmed.ncbi.nlm.nih.gov/15113710/",
      },
      {
        label:
          "Cardona F. et al. Benefits of polyphenols on gut microbiota and implications in human health. J Nutr Biochem, 2013.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23849454/",
      },
    ],
  },
  "gut-skin": {
    short: "The gut-skin axis",
    teaser: "What researchers mean, simply",
    intro:
      "The gut-skin axis is the phrase researchers use for the ways your digestive system and your skin appear to be connected.",
    takeaways: [
      "It is an active area of study, and much of it is still being worked out.",
      "What is well established is simpler: a varied diet with fiber, water and colorful plants is part of taking good care of yourself.",
      "Your 21 Mornings build on that everyday idea: one colorful glass and a few quiet minutes each morning.",
    ],
    sources: [
      {
        label:
          "Salem I. et al. The Gut Microbiome as a Major Regulator of the Gut-Skin Axis. Front Microbiol, 2018.",
        url: "https://pubmed.ncbi.nlm.nih.gov/30042740/",
      },
    ],
  },
  "morning-timing": {
    short: "Why mornings",
    teaser: "How a fixed moment makes the habit easier",
    intro:
      "Habits stick best when they are tied to a moment you already have. For most of us, that is the first quiet minutes of the morning.",
    takeaways: [
      "Anchoring the glass to the same time every day means you never have to decide.",
      "The ritual becomes simply what happens after you wake up: blend, pour, sip.",
      "A calm, colorful start sets a steady tone for the rest of your day.",
    ],
    sources: [
      {
        label: "Gardner B., Lally P., Wardle J. Making health habitual. Br J Gen Pract, 2012.",
        url: "https://pubmed.ncbi.nlm.nih.gov/23211256/",
      },
    ],
  },
  "reading-skin": {
    short: "Noticing your mornings",
    teaser: "What to pay attention to, week by week",
    intro:
      "Your skin renews itself slowly, over weeks, and everyone's skin is different, so this reset asks you to notice rather than expect.",
    takeaways: [
      "Days 1 to 7: focus on the routine and notice how your mornings feel.",
      "Days 8 to 14: take a quiet photo in natural light if you would like a private record.",
      "Days 15 to 21: look back through your journal and notice what has become easier.",
    ],
    sources: [],
  },
  "reds-ingredients": {
    short: "What's in Radiant Reds",
    teaser: "The blends on the label, in plain words",
    intro:
      "Radiant Reds is built around red fruit and plant powders. This is what the label lists, and what it does not tell you.",
    takeaways: [
      "The 2,000 mg Polyphenol Blend lists beet root first, then strawberry, hibiscus, raspberry, black currant, acai, blueberry, cranberry, grape seed, African mango and pomegranate.",
      "A 700 mg blend of oat fiber and inulin and a 9-strain probiotic are listed too.",
      "The label does not state how much of any single ingredient or plant compound one scoop contains.",
    ],
    sources: [{ label: "Radiant Reds Supplement Facts panel (on the jar).", url: "" }],
  },
  "after-21": {
    short: "After 21 days",
    teaser: "How to keep the ritual going",
    intro:
      "Twenty-one mornings are a real start, and the morning glass is worth keeping after Day 21.",
    takeaways: [
      "Don't treat day 22 as the end: the ritual you kept for 21 days can carry you to day 121.",
      "Keep the morning glass and the slow start, and rotate the recipes.",
      "Habits often take longer than three weeks to feel automatic, so keeping going matters.",
    ],
    sources: [
      {
        label:
          "Lally P. et al. How are habits formed: Modelling habit formation in the real world. Eur J Soc Psychol, 2010.",
        url: "https://doi.org/10.1002/ejsp.674",
      },
    ],
  },
};
