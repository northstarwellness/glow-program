/**
 * "Why these ingredients": recipe-specific nutrition notes (2026-09-30).
 *
 * Each point follows ingredient → nutrient or food component → established role, from NIH
 * Office of Dietary Supplements fact sheets, USDA FoodData Central and, where needed,
 * peer-reviewed human research. Amounts are USDA-based estimates for the recipe as written,
 * excluding optional items. The full evidence table (statement, support, source, limits,
 * final wording) is in glow-program-review-evidence/2026-09-30-recipe-first/.
 * Radiant Reds is never counted here; see recipe-reds.ts.
 */

export type WhyPoint = { title: string; summary: string; detail: string; sources: string[] };
export type RecipeWhy = { intro: string; points: WhyPoint[] };
export type WhySource = { title: string; publisher: string; url: string };

export const RECIPE_WHY: Record<string, RecipeWhy> = {
  "pomegranate-elixir": {
    intro:
      "A tart, deep red glass built from two fruits that bring real texture and substance: pomegranate arils and raspberries, both of which keep their fiber when blended whole.",
    points: [
      {
        title: "Fiber from whole fruit",
        summary:
          "Blending the pomegranate arils and raspberries whole keeps their fiber in the glass. Fiber is the part of plant foods the body does not digest, and most adults eat less than recommended.",
        detail:
          "Using USDA values, 1 cup of arils (USDA lists a cup at 87 g, though a firmly filled cup can weigh closer to 170 g) plus ½ cup raspberries (about 62 g) gives roughly 7 to 11 g of fiber, depending on how full your cup is. The Dietary Guidelines list fiber as a nutrient many Americans under-consume.",
        sources: ["fdc-pomegranate-169134", "fdc-raspberries-167755", "dga-2020"],
      },
      {
        title: "Vitamin C for collagen",
        summary:
          "Raspberries, pomegranate and half a lime together bring vitamin C, which the body needs to make collagen, a protein in skin, tendons and connective tissue, and which acts as an antioxidant.",
        detail:
          "Estimated at about 30 to 40 mg of vitamin C (USDA values for the fruit and about 22 g of lime juice), roughly half of the 75 mg daily amount recommended for adult women. Vitamin C is also needed to make some neurotransmitters, according to NIH.",
        sources: [
          "ods-vitaminc",
          "fdc-raspberries-167755",
          "fdc-pomegranate-169134",
          "fdc-limejuice-168156",
        ],
      },
      {
        title: "Where the ruby color comes from",
        summary:
          "Pomegranate's deep red comes partly from anthocyanins, plant pigments, and the fruit also contains ellagitannins such as punicalagins, a family of plant compounds studied in pomegranate research.",
        detail:
          "Punicalagins are concentrated mostly in the peel and pith, so the arils in this glass contain far less than pomegranate extracts used in research. We mention them to explain what the fruit is made of, not to promise a result.",
        sources: ["pmid-22593938", "pmid-28970777"],
      },
    ],
  },
  "berry-bloom": {
    intro:
      "Blueberries and strawberries meet banana and chia here, and the two-minute rest gives the chia time to thicken the glass into something softer and more spoonable.",
    points: [
      {
        title: "Vitamin C from strawberries",
        summary:
          "Strawberries carry most of this glass's vitamin C, which the body needs to make collagen, a structural protein in skin and connective tissue, and which acts as an antioxidant.",
        detail:
          "Assuming 1 cup of berries split evenly between strawberries (about 76 g) and blueberries (about 74 g), plus half a banana, the glass has about 55 mg of vitamin C by USDA values, roughly three quarters of the 75 mg recommended daily for adult women. More strawberries in your mix means more vitamin C.",
        sources: [
          "ods-vitaminc",
          "fdc-strawberries-167762",
          "fdc-blueberries-171711",
          "fdc-banana-173944",
        ],
      },
      {
        title: "Chia's plant omega-3",
        summary:
          "One tablespoon of chia brings alpha-linolenic acid (ALA), an omega-3 fat the body cannot make on its own, so it has to come from food.",
        detail:
          "USDA lists chia at about 17.8 g ALA per 100 g, so 1 tablespoon (about 12 g) gives roughly 2 g of ALA. NIH sets an adequate intake of 1.1 g a day for adult women. The body converts only a small share of ALA into the longer omega-3s found in fish.",
        sources: ["ods-omega3", "fdc-chia-170554"],
      },
      {
        title: "Fiber that thickens the glass",
        summary:
          "Chia seeds absorb liquid and form a gel, which is why this smoothie thickens as it rests. Together with the berries and banana, they add fiber to your morning.",
        detail:
          "By USDA values: chia about 4 g, berries about 3 g, half a banana about 1.5 g, so roughly 9 g of fiber in the glass. The Dietary Guidelines note most adults eat less fiber than recommended.",
        sources: [
          "fdc-chia-170554",
          "fdc-strawberries-167762",
          "fdc-blueberries-171711",
          "fdc-banana-173944",
          "dga-2020",
        ],
      },
    ],
  },
  "cherry-cacao": {
    intro:
      "Tart cherries, cacao and almond butter make a dark, dessert-like glass. The cacao and almond butter do more than add richness: they bring minerals most fruit smoothies lack.",
    points: [
      {
        title: "Magnesium from cacao and almond",
        summary:
          "Unsweetened cacao and almond butter both contain magnesium, a mineral NIH describes as a helper for more than 300 enzyme systems, including those for protein building and muscle and nerve function.",
        detail:
          "Estimated at about 100 mg of magnesium for the whole glass (1 tbsp cocoa powder about 27 mg, 1 tbsp almond butter about 45 mg, the rest from cherries and oat milk, USDA values). That is roughly a third of the 310 to 320 mg recommended daily for adult women.",
        sources: [
          "ods-magnesium",
          "fdc-cocoa-169593",
          "fdc-almondbutter-168588",
          "fdc-sourcherries-173954",
        ],
      },
      {
        title: "Vitamin E from almond butter",
        summary:
          "A tablespoon of almond butter adds vitamin E, a fat-soluble vitamin that works as an antioxidant in the body, and its fat helps make the glass creamy and satisfying.",
        detail:
          "About 4 mg of vitamin E per tablespoon (16 g) by USDA values, around a quarter of the 15 mg adult recommendation. Almond butter also adds about 3 g of protein.",
        sources: ["ods-vitamine", "fdc-almondbutter-168588"],
      },
      {
        title: "Two kinds of dark color",
        summary:
          "Tart cherries get their deep red from anthocyanins, a family of plant pigments, while cacao contains flavanols, another group of plant compounds, which is where its bitterness comes from.",
        detail:
          "We describe these compounds so you know what is in the glass. Cacao's flavanol content varies widely with processing, and alkalization (Dutch process) removes much of them, so choose natural unsweetened cacao or cocoa if you want to keep them. A tablespoon of cocoa also contains about 12 mg of caffeine, far less than a cup of coffee but not zero.",
        sources: ["pmid-28970777", "fdc-cocoa-169593"],
      },
    ],
  },
  "plum-rose": {
    intro:
      "A soft, fragrant bowl: two ripe plums blended with coconut yogurt and a little rose water. This is a lighter recipe, and its value is mostly in the fruit.",
    points: [
      {
        title: "Plums in their skins",
        summary:
          "Blending two whole plums, skins on, keeps the fruit's fiber and its red-purple skin pigments, anthocyanins, in the bowl.",
        detail:
          "Two medium plums (about 132 g) give roughly 2 g of fiber by USDA values. Much of a plum's color sits in the skin, which is why we leave it on.",
        sources: ["fdc-plums-169949", "pmid-28970777", "dga-2020"],
      },
      {
        title: "A little vitamin C",
        summary:
          "Two plums add a modest amount of vitamin C, which the body uses to make collagen and which acts as an antioxidant.",
        detail:
          "About 12 mg of vitamin C by USDA values, around a sixth of the 75 mg recommended daily for adult women. A squeeze of lemon or a handful of berries would add more if you want it.",
        sources: ["ods-vitaminc", "fdc-plums-169949"],
      },
    ],
  },
  "watermelon-reds": {
    intro:
      "Watermelon and cooled hibiscus tea make this the most thirst-quenching glass in the collection: more than a cup and a half of fluid before you even add ice.",
    points: [
      {
        title: "A glass that counts as fluid",
        summary:
          "Watermelon is about 91% water, and it is blended here with a full cup of hibiscus tea. Water helps the body keep a normal temperature and cushions joints, and foods count toward fluid intake.",
        detail:
          "By USDA values, 2 cups of diced watermelon (about 304 g) contain roughly 280 g of water, about 1 cup, and the tea adds another cup. The CDC notes that fruits and vegetables with a high water content can add to your fluid intake.",
        sources: ["cdc-water", "fdc-watermelon-167765"],
      },
      {
        title: "Watermelon's red pigment",
        summary:
          "Watermelon gets its red from lycopene, a carotenoid pigment, and it also provides a little vitamin A and vitamin C.",
        detail:
          "USDA lists about 4.5 mg of lycopene per 100 g of watermelon, so roughly 14 mg in 2 cups. The same 2 cups provide about 25 mg of vitamin C, and lime juice adds a few milligrams more. Lycopene is described here as a pigment; we make no health claim for it.",
        sources: ["fdc-watermelon-167765", "ods-vitaminc", "ods-vitamina"],
      },
      {
        title: "Hibiscus color and tartness",
        summary:
          "The ruby color and cranberry-like tartness come from dried hibiscus flowers, whose red is from anthocyanin pigments.",
        detail:
          "Brewed hibiscus tea contributes very little in the way of vitamins or minerals; its role here is color, tartness and fluid.",
        sources: ["pmid-28970777"],
      },
    ],
  },
  "fig-almond": {
    intro:
      "Three black figs give this glass its jammy sweetness and body, and a small handful of almonds turns it creamy while adding nutrients of their own.",
    points: [
      {
        title: "Fiber from figs and almonds",
        summary:
          "Figs are full of tiny edible seeds and soft skin, all blended in, so their fiber stays in the glass, and the almonds add a little more.",
        detail:
          "By USDA values, 3 medium figs (about 150 g) give roughly 4 g of fiber and a small handful of almonds (assumed about 14 g, 11 or 12 almonds) about 2 g, so around 6 g in total. The Dietary Guidelines note most adults eat less fiber than recommended.",
        sources: ["fdc-figs-173021", "fdc-almonds-170567", "dga-2020"],
      },
      {
        title: "Vitamin E and magnesium from almonds",
        summary:
          "Almonds contain vitamin E, a fat-soluble vitamin that acts as an antioxidant, and magnesium, which helps more than 300 enzyme systems do their work, including muscle and nerve function.",
        detail:
          "A 14 g handful gives about 3.5 mg of vitamin E (adult recommendation 15 mg) and about 38 mg of magnesium by USDA values. A bigger handful scales these up.",
        sources: ["ods-vitamine", "ods-magnesium", "fdc-almonds-170567"],
      },
      {
        title: "Potassium from fruit and oat milk",
        summary:
          "Figs and oat milk both contribute potassium, a mineral every cell uses to maintain fluid balance and that muscles and nerves need to work normally.",
        detail:
          "Roughly 800 mg of potassium in the glass by USDA values (figs about 350 mg, oat milk about 355 mg, almonds about 100 mg). NIH lists 2,600 mg a day as adequate for adult women. Oat milk potassium varies by brand.",
        sources: ["ods-potassium", "fdc-figs-173021", "fdc-oatmilk-2257046"],
      },
    ],
  },
  "beet-glow": {
    intro:
      "Roasted beet, raspberries and fresh orange juice make an earthy, bright glass. The beet brings the color and the folate; the orange and raspberries bring the vitamin C.",
    points: [
      {
        title: "Folate from beet and orange",
        summary:
          "Beets and orange juice both contain folate, a B vitamin the body needs to make DNA and to divide cells, which is why it matters every day, not only in special circumstances.",
        detail:
          "About 100 mcg DFE of folate by USDA values (1 small cooked beet about 66 mcg, juice of 1 orange about 26 mcg, raspberries about 13 mcg), roughly a quarter of the 400 mcg daily amount for adults. Roasting and steaming both lose some folate; USDA's value is for boiled beets.",
        sources: [
          "ods-folate",
          "fdc-beets-169146",
          "fdc-orangejuice-169098",
          "fdc-raspberries-167755",
        ],
      },
      {
        title: "Vitamin C from orange and raspberry",
        summary:
          "The juice of one orange plus half a cup of raspberries bring vitamin C, which the body needs to make collagen and which acts as an antioxidant.",
        detail:
          "About 60 mg of vitamin C by USDA values, around four fifths of the 75 mg recommended daily for adult women.",
        sources: ["ods-vitaminc", "fdc-orangejuice-169098", "fdc-raspberries-167755"],
      },
      {
        title: "Beet's jewel color",
        summary:
          "Beets get their deep magenta from betalains, a group of plant pigments different from the anthocyanins in berries.",
        detail:
          "Betalains are why beet stains everything it touches. We describe them as pigments; we make no health claim for them.",
        sources: ["pmid-25875121"],
      },
    ],
  },
  "golden-turmeric": {
    intro:
      "A warm golden cup rather than a smoothie: gently heated oat milk whisked with turmeric, cinnamon and black pepper, finished with honey and crushed almond.",
    points: [
      {
        title: "Calcium in fortified oat milk",
        summary:
          "A cup of fortified oat milk can provide a meaningful share of daily calcium, the mineral that makes up bones and teeth and that muscles and nerves also rely on.",
        detail:
          "Most store-bought oat milks are fortified, but amounts differ by brand, so check your carton. USDA's oat milk sample (a market average of fortified products) shows about 350 mg of calcium per cup, roughly a third of the 1,000 mg recommended for women 19 to 50. Many cartons also add vitamin D, which helps the body absorb calcium. Unfortified or homemade oat milk contains very little calcium.",
        sources: ["ods-calcium", "ods-vitamind", "fdc-oatmilk-2257046"],
      },
      {
        title: "Turmeric for color and flavor",
        summary:
          "The golden color comes from curcumin, turmeric's natural pigment. At half a teaspoon, turmeric here is a flavor and color ingredient, not a meaningful source of nutrients.",
        detail:
          "Half a teaspoon of ground turmeric weighs about 1.5 g. Black pepper is the traditional pairing and adds warmth to the flavor.",
        sources: ["fdc-turmeric-172231"],
      },
    ],
  },
  "matcha-cloud": {
    intro:
      "A pale green, iced matcha drink softened with banana and almond milk. Because matcha is the whole tea leaf ground to powder, you drink the leaf itself, not just an infusion.",
    points: [
      {
        title: "The whole tea leaf",
        summary:
          "Matcha is powdered green tea leaf, so it carries the leaf's catechins, including EGCG, the plant compounds green tea is best known for, and its natural caffeine.",
        detail:
          "Caffeine in matcha varies by brand and grade, so check your package if you are watching intake. The FDA cites 400 mg a day as an amount not generally associated with negative effects for most healthy adults; people who are pregnant or sensitive to caffeine may want less.",
        sources: ["fda-caffeine"],
      },
      {
        title: "Potassium and B6 from banana",
        summary:
          "Half a banana adds potassium, which cells use to maintain fluid balance and nerves and muscles need to work, plus vitamin B6, which helps more than 100 enzymes, mostly in protein metabolism.",
        detail:
          "By USDA values, half a medium banana (about 59 g) gives roughly 210 mg of potassium and 0.2 mg of vitamin B6 (about a sixth of the 1.3 mg adult recommendation).",
        sources: ["ods-potassium", "ods-vitaminb6", "fdc-banana-173944"],
      },
      {
        title: "What your almond milk adds",
        summary:
          "Many almond milks are fortified with calcium and vitamin E, so ¾ cup can add a useful amount of both. Brands differ a lot, so check your carton.",
        detail:
          "USDA's unsweetened almond milk entry lists about 330 mg of calcium and about 11 mg of vitamin E in ¾ cup (180 g), reflecting fortification. Unfortified almond milk contains very little of either.",
        sources: ["ods-calcium", "ods-vitamine", "fdc-almondmilk-174832"],
      },
    ],
  },
  "lavender-honey": {
    intro:
      "A warm floral tea rather than a smoothie: culinary lavender steeped in hot water, finished with honey and lemon. Its gift is a slow, fragrant cup of fluid.",
    points: [
      {
        title: "A warm cup of fluid",
        summary:
          "This is mostly water, and that is its real contribution. Fluids help the body keep a normal temperature and cushion joints, and a warm cup can be an easy first drink of the day.",
        detail:
          "One cup (about 240 ml) of water, plus a squeeze of lemon. The CDC describes water's roles in temperature regulation and cushioning joints and tissues.",
        sources: ["cdc-water"],
      },
      {
        title: "Flavor, honestly",
        summary:
          "Lavender, lemon, mint and honey are here for aroma and flavor. In these amounts they add very little in the way of vitamins or minerals, and honey adds a small amount of sugar.",
        detail:
          "A teaspoon of honey (about 7 g) is roughly 20 calories, almost all from sugar, by USDA values. Use culinary-grade lavender only.",
        sources: ["fdc-honey-169640"],
      },
    ],
  },
  "rose-cardamom": {
    intro:
      "A warm, spiced mylk: oat milk heated with crushed cardamom and cinnamon, then finished off the heat with rose water and honey. Most of its nutrition comes from the milk.",
    points: [
      {
        title: "Calcium, if your oat milk is fortified",
        summary:
          "One cup of fortified oat milk can supply about a third of an adult woman's daily calcium, the mineral in bones and teeth that muscles and nerves also depend on.",
        detail:
          "Most store-bought oat milks are fortified, but amounts differ by brand, so check your carton. USDA's oat milk entry, averaged from fortified retail products, lists about 350 mg of calcium per cup, compared with the 1,000 mg recommended daily for women 19 to 50. Cartons that also add vitamin D help, because vitamin D helps the body absorb calcium. Homemade oat milk contains very little calcium.",
        sources: ["ods-calcium", "ods-vitamind", "fdc-oatmilk-2257046"],
      },
      {
        title: "Spices and rose for aroma",
        summary:
          "Cardamom, cinnamon and rose water are used in pinches and teaspoons, so they shape the aroma and flavor rather than adding meaningful nutrients.",
        detail:
          "Warm the spices in the milk to release their fragrance, and add rose water off the heat so its scent does not cook away.",
        sources: [],
      },
    ],
  },
  "blueberry-basil": {
    intro:
      "Wild blueberries, banana and a few fresh basil leaves blended with almond milk and lemon zest. Wild blueberries are smaller than cultivated ones, so there are more skins in every cup.",
    points: [
      {
        title: "Fiber from wild blueberries",
        summary:
          "A cup of frozen wild blueberries adds fiber, and because the berries are small, you get a lot of skin, which is where their deep blue anthocyanin pigments sit.",
        detail:
          "USDA lists 1 cup of frozen wild blueberries (140 g) at about 6 g of fiber; with half a banana, the glass has roughly 8 g. The Dietary Guidelines note most adults eat less fiber than recommended.",
        sources: ["fdc-wildblueberries-173949", "fdc-banana-173944", "dga-2020", "pmid-28970777"],
      },
      {
        title: "Manganese from wild blueberries",
        summary:
          "Wild blueberries contain manganese, a trace mineral that many enzymes need to work, including enzymes involved in forming bone.",
        detail:
          "USDA lists about 2.9 mg of manganese per 100 g of frozen wild blueberries, so roughly 4 mg per cup, above the 1.8 mg daily adequate intake for adult women and below the 11 mg upper limit. Values for cultivated blueberries are much lower.",
        sources: ["ods-manganese", "fdc-wildblueberries-173949"],
      },
      {
        title: "What your almond milk adds",
        summary:
          "A cup of fortified almond milk can add calcium and vitamin E. Fortification differs by brand, so check your carton.",
        detail:
          "USDA's unsweetened almond milk entry lists about 440 mg of calcium and 15 mg of vitamin E per cup (240 g), reflecting added nutrients. Unfortified almond milk contains very little of either.",
        sources: ["ods-calcium", "ods-vitamine", "fdc-almondmilk-174832"],
      },
    ],
  },
  "papaya-lime": {
    intro:
      "Ripe papaya and fresh lime, lightened with a spoon of coconut yogurt and torn mint. Together they bring nearly twice the daily vitamin C amount recommended for adult women.",
    points: [
      {
        title: "Vitamin C for collagen",
        summary:
          "Papaya and lime together bring a full day's worth of vitamin C, which the body needs to make collagen, a structural protein in skin and connective tissue, and which acts as an antioxidant.",
        detail:
          "By USDA values, 1½ cups of papaya (about 218 g) give roughly 130 mg of vitamin C and the juice of one lime about 13 mg, so about 145 mg in all, compared with the 75 mg recommended daily for adult women. Vitamin C also helps the body absorb the iron in plant foods.",
        sources: ["ods-vitaminc", "fdc-papaya-169926", "fdc-limejuice-168156"],
      },
      {
        title: "Folate for making new cells",
        summary:
          "Papaya also contains folate, the B vitamin the body uses to make DNA and to divide cells.",
        detail:
          "About 80 mcg DFE of folate in 1½ cups of papaya by USDA values, roughly a fifth of the 400 mcg daily amount for adults.",
        sources: ["ods-folate", "fdc-papaya-169926"],
      },
      {
        title: "Papaya's orange color",
        summary:
          "Papaya's coral flesh comes from carotenoids, including beta-carotene and beta-cryptoxanthin, which the body can convert to vitamin A for normal vision.",
        detail:
          "About 100 mcg RAE of vitamin A activity in 1½ cups by USDA values, around a seventh of the 700 mcg recommended for adult women.",
        sources: ["ods-vitamina", "fdc-papaya-169926"],
      },
    ],
  },
  "peach-saffron": {
    intro:
      "A ripe peach blended with almond milk and honey, perfumed with a pinch of saffron. It is a gentle, golden glass where flavor leads and the milk carries most of the nutrition.",
    points: [
      {
        title: "What your almond milk adds",
        summary:
          "The almond milk here, about ⅔ cup in total, can add calcium and vitamin E if it is fortified. Calcium is the main mineral in bones and teeth; vitamin E acts as an antioxidant. Check your carton.",
        detail:
          "USDA's unsweetened almond milk entry lists about 275 mg of calcium and 9.5 mg of vitamin E in about 150 g, reflecting fortification. Unfortified almond milk contains very little of either.",
        sources: ["ods-calcium", "ods-vitamine", "fdc-almondmilk-174832"],
      },
      {
        title: "Potassium and fiber from peach",
        summary:
          "One ripe peach adds potassium, which cells use to maintain fluid balance and nerves and muscles need to work normally, along with a little fiber from its skin and flesh.",
        detail:
          "A medium peach (about 150 g) provides roughly 285 mg of potassium and 2 g of fiber by USDA values; with the almond milk, the glass has around 385 mg of potassium.",
        sources: ["ods-potassium", "fdc-peaches-169928", "fdc-almondmilk-174832"],
      },
    ],
  },
  "fig-vanilla": {
    intro:
      "Four figs blended with oat milk and vanilla make the silkiest glass in the collection, with figs doing double duty as sweetener and body.",
    points: [
      {
        title: "Fiber from four figs",
        summary:
          "Blended whole, four figs keep their skins and tiny seeds in the glass, which is where their fiber comes from.",
        detail:
          "By USDA values, 4 medium fresh figs (about 200 g) provide roughly 6 g of fiber. The Dietary Guidelines note most adults eat less fiber than recommended.",
        sources: ["fdc-figs-173021", "dga-2020"],
      },
      {
        title: "Calcium from figs and oat milk",
        summary:
          "Figs contain some calcium of their own, unusual for fruit, and fortified oat milk adds several times that. Calcium is the main mineral in bones and teeth, and muscles and nerves use it too.",
        detail:
          "Most store-bought oat milks are fortified, but amounts differ by brand, so check your carton. About 70 mg of calcium from 4 figs and about 355 mg from a cup of fortified oat milk by USDA values, roughly 425 mg together, compared with the 1,000 mg recommended daily for women 19 to 50.",
        sources: ["ods-calcium", "fdc-figs-173021", "fdc-oatmilk-2257046"],
      },
      {
        title: "Potassium in every sip",
        summary:
          "Figs and oat milk together contribute potassium, which every cell uses to maintain fluid balance and which nerves and muscles need to work normally.",
        detail:
          "Roughly 820 mg of potassium by USDA values (figs about 465 mg, oat milk about 355 mg), toward the 2,600 mg adequate intake NIH lists for adult women.",
        sources: ["ods-potassium", "fdc-figs-173021", "fdc-oatmilk-2257046"],
      },
    ],
  },
  "cucumber-mint": {
    intro:
      "A crisp, strained cooler of cucumber, lime and mint, topped with sparkling water. It is light by design, and its main contribution is refreshing fluid.",
    points: [
      {
        title: "Mostly refreshing fluid",
        summary:
          "Cucumber is about 95% water, and with sparkling water on top this glass is primarily fluid. Water helps the body keep a normal temperature and cushion joints.",
        detail:
          "One cucumber (about 300 g) contains roughly 285 g of water by USDA values, a little more than a cup, before the sparkling water. The CDC notes that fruits and vegetables with a lot of water add to fluid intake.",
        sources: ["cdc-water", "fdc-cucumber-168409"],
      },
      {
        title: "Vitamin K and potassium, before straining",
        summary:
          "A whole cucumber contains vitamin K, which the body needs for normal blood clotting and healthy bones, and potassium. Straining removes some of what is in the pulp and peel.",
        detail:
          "By USDA values, a whole unpeeled cucumber (301 g) has about 50 mcg of vitamin K (adequate intake for adult women: 90 mcg) and about 440 mg of potassium. How much remains after straining is not measured. If you take a blood thinner such as warfarin, NIH advises keeping vitamin K intake consistent.",
        sources: ["ods-vitamink", "ods-potassium", "fdc-cucumber-168409"],
      },
    ],
  },
  "apricot-almond": {
    intro:
      "Three ripe apricots blended with almonds and oat milk make a soft, golden glass. The apricots bring the color; the almonds bring creaminess and a few nutrients of their own.",
    points: [
      {
        title: "Beta-carotene becomes vitamin A",
        summary:
          "Apricots get their orange color from beta-carotene, which the body can convert into vitamin A, a vitamin needed for normal vision and for the heart, lungs and other organs to work properly.",
        detail:
          "By USDA values, 3 fresh apricots (about 105 g) provide roughly 1.1 mg of beta-carotene, or about 100 mcg RAE of vitamin A activity, around a seventh of the 700 mcg recommended daily for adult women.",
        sources: ["ods-vitamina", "fdc-apricots-171697"],
      },
      {
        title: "Vitamin E and magnesium from almonds",
        summary:
          "A small handful of almonds adds vitamin E, a fat-soluble vitamin that acts as an antioxidant, and magnesium, which more than 300 enzyme systems rely on, including those for muscle and nerve function.",
        detail:
          "Assuming about 14 g of almonds (11 or 12 nuts), USDA values give about 3.5 mg of vitamin E and about 38 mg of magnesium, with a little more vitamin E (about 1 mg) from the apricots.",
        sources: ["ods-vitamine", "ods-magnesium", "fdc-almonds-170567", "fdc-apricots-171697"],
      },
      {
        title: "Potassium from fruit and oat milk",
        summary:
          "Apricots, almonds and oat milk each contribute potassium, which every cell uses to maintain fluid balance and nerves and muscles need to work normally.",
        detail:
          "Roughly 640 mg of potassium by USDA values (apricots about 270 mg, oat milk ¾ cup about 265 mg, almonds about 100 mg), toward the 2,600 mg adequate intake for adult women.",
        sources: [
          "ods-potassium",
          "fdc-apricots-171697",
          "fdc-oatmilk-2257046",
          "fdc-almonds-170567",
        ],
      },
    ],
  },
  "kiwi-spinach": {
    intro:
      "Two kiwis and a handful of baby spinach do most of the nutritional work here, with half a banana for body and lime to keep it bright.",
    points: [
      {
        title: "Vitamin C from kiwi",
        summary:
          "Two kiwis bring about 130 mg of vitamin C. Your body needs vitamin C to make collagen, and it also works as an antioxidant in the body.",
        detail:
          "Counting the spinach, banana and lime too, the glass comes to about 140 to 150 mg, more than the 75 mg recommended daily for adult women. Estimate from USDA FoodData Central (green kiwifruit, raw, about 69 g each). Vitamin C starts to break down once fruit is cut, so blending just before drinking keeps the most.",
        sources: ["ods-vitaminc", "fdc-kiwi-168153", "fdc-spinach-168462"],
      },
      {
        title: "Vitamin K from spinach",
        summary:
          "A cup-sized handful of baby spinach (about 30 g) has about 145 mcg of vitamin K. The body uses vitamin K to make proteins needed for normal blood clotting and bone.",
        detail:
          "With the kiwi added, the glass holds roughly 200 mcg of vitamin K. The adequate intake for adult women is 90 mcg a day. A handful is not a precise measure, so treat this as a rough figure. USDA FoodData Central, spinach, raw (1 cup = 30 g).",
        sources: ["ods-vitamink", "fdc-spinach-168462", "fdc-kiwi-168153"],
      },
      {
        title: "Folate from the greens",
        summary:
          "Spinach, kiwi and banana together bring about 100 mcg of folate. Folate is needed to make DNA and for normal cell division.",
        detail:
          "That is roughly a quarter of the 400 mcg DFE recommended daily for adults. Most comes from the spinach (about 58 mcg per 30 g), with kiwi adding about 35 mcg. Estimate from USDA FoodData Central; a bigger handful of spinach raises it.",
        sources: ["ods-folate", "fdc-spinach-168462", "fdc-kiwi-168153", "fdc-banana-173944"],
      },
    ],
  },
  "vanilla-chia": {
    intro:
      "This one is a make-ahead pudding rather than a blended smoothie. Three tablespoons of chia do nearly all the nutritional work while they soak overnight.",
    points: [
      {
        title: "Plant omega-3 (ALA)",
        summary:
          "Three tablespoons of chia hold about 5 to 6 g of ALA, a plant omega-3. Your body cannot make ALA, so it has to come from food, and omega-3s form part of every cell membrane.",
        detail:
          "The adequate intake for adult women is 1.1 g of ALA a day. The body converts only a small share of ALA into the longer omega-3s EPA and DHA (reported below 15 percent), so ALA is not a substitute for them. Estimate from USDA FoodData Central, chia seeds, dried (about 17.8 g ALA per 100 g), assuming 10 to 12 g per tablespoon.",
        sources: ["ods-omega3", "fdc-chia-170554"],
      },
      {
        title: "Fiber from chia",
        summary:
          "The same three tablespoons carry about 10 to 12 g of fiber. That is close to half the 25 to 28 g of daily fiber the Dietary Guidelines suggest for adult women.",
        detail:
          "Chia's fiber is also why it sets: the seeds absorb liquid overnight and thicken it into a pudding. Most Americans eat less fiber than recommended, according to the Dietary Guidelines. USDA FoodData Central, chia seeds, dried (34.4 g fiber per 100 g).",
        sources: ["dga-2020", "fdc-chia-170554"],
      },
      {
        title: "Magnesium from chia",
        summary:
          "Chia adds about 100 to 120 mg of magnesium. Magnesium is a helper for more than 300 enzyme systems, including those for making protein and for normal muscle and nerve function.",
        detail:
          "That is about a third of the 310 to 320 mg recommended daily for adult women. Chia also brings about 190 to 230 mg of calcium, and a fortified oat milk adds more (check your carton). The crushed almond topping adds a little more magnesium; it is not counted because no amount is given.",
        sources: ["ods-magnesium", "ods-calcium", "fdc-chia-170554"],
      },
    ],
  },
  "ginger-pear": {
    intro:
      "A whole ripe pear blended with fresh ginger and a little orange juice. Blending keeps the pear's fiber in the glass, which juicing would leave behind.",
    points: [
      {
        title: "Fiber from a whole pear",
        summary:
          "One medium pear, blended with its skin, brings about 5 g of fiber. That is around a fifth of the 25 to 28 g the Dietary Guidelines suggest daily for adult women.",
        detail:
          "Much of a pear's fiber sits in and just under the skin, so leave it on if you can. USDA FoodData Central, pears, raw (3.1 g fiber per 100 g, medium pear about 178 g). A peeled or smaller pear gives less.",
        sources: ["dga-2020", "fdc-pear-169118"],
      },
      {
        title: "Vitamin C from orange and pear",
        summary:
          "The orange juice and pear together give about 30 mg of vitamin C, which the body needs to make collagen and which works as an antioxidant in the body.",
        detail:
          "Juice of half an orange (about 43 g) has about 21 mg, and the pear about 8 mg. Together that is roughly 40 percent of the 75 mg recommended daily for adult women. Estimates from USDA FoodData Central.",
        sources: ["ods-vitaminc", "fdc-orangejuice-169098", "fdc-pear-169118"],
      },
      {
        title: "Where the warmth comes from",
        summary:
          "Fresh ginger's heat comes from its pungent compounds, mainly gingerols. At a thumb-sized piece, ginger is here for flavor rather than for nutrients.",
        detail:
          "A thumb of ginger is roughly 10 g, which USDA lists at about 8 calories with only trace vitamins and minerals. Cinnamon at a dusting is likewise a flavor ingredient.",
        sources: ["pmid-21491265", "fdc-ginger-169231"],
      },
    ],
  },
  "honey-almond": {
    intro:
      "A simple cup built on one tablespoon of almond butter and a cup of oat milk. Most of what it offers nutritionally comes from the almond butter.",
    points: [
      {
        title: "Vitamin E from almond butter",
        summary:
          "One tablespoon of almond butter has about 4 mg of vitamin E, roughly a quarter of the 15 mg adults need daily. Vitamin E is a fat-soluble nutrient with antioxidant activity.",
        detail:
          "Almonds naturally contain vitamin E, a nutrient that dissolves in fat, and the almond butter's own fat carries it. Estimate from USDA FoodData Central, almond butter, plain (24.2 mg per 100 g, 1 tbsp = 16 g).",
        sources: ["ods-vitamine", "fdc-almondbutter-168588"],
      },
      {
        title: "Magnesium from almond butter",
        summary:
          "The same tablespoon brings about 45 mg of magnesium, a mineral that helps more than 300 enzyme systems, including those for normal muscle and nerve function.",
        detail:
          "That is about 14 percent of the 310 to 320 mg recommended daily for adult women. Almond butter also adds about 3 g of protein. USDA FoodData Central, almond butter, plain.",
        sources: ["ods-magnesium", "fdc-almondbutter-168588"],
      },
      {
        title: "Calcium if your oat milk is fortified",
        summary:
          "Many oat milks are fortified with calcium, which the body uses for bones and teeth and for normal muscle and nerve function. Check your carton to see how much yours has.",
        detail:
          "Oat milk contains very little calcium on its own; any meaningful amount is added by the maker, and brands differ, so no number is given here.",
        sources: ["ods-calcium"],
      },
    ],
  },
  "bonus-cacao-tonic": {
    intro:
      "A warm cup of oat milk whisked with a tablespoon of cacao. The cacao brings a little more than flavor, including a small amount of caffeine.",
    points: [
      {
        title: "Cacao flavanols",
        summary:
          "Cacao contains flavanols such as epicatechin and catechin, a family of plant compounds. Natural (non-Dutch-processed) cocoa keeps noticeably more of them than alkalized cocoa.",
        detail:
          "In one analysis of commercial cocoa powders, alkalizing (Dutching) removed about 60 percent of the flavonoid content on average. If you want to keep more flavanols, choose natural cocoa or raw cacao powder. The amount in one tablespoon varies too much by product to give a figure.",
        sources: ["pmid-18412367"],
      },
      {
        title: "Copper from cacao",
        summary:
          "One tablespoon of unsweetened cocoa has about 0.2 mg of copper, around a fifth of the 900 mcg adults need daily. Copper helps enzymes involved in forming connective tissue and in handling iron.",
        detail:
          "The same tablespoon has about 27 mg of magnesium. Estimates from USDA FoodData Central, cocoa, dry powder, unsweetened (1 tbsp = 5.4 g). Raw cacao products are not listed separately and may differ somewhat.",
        sources: ["ods-copper", "ods-magnesium", "fdc-cocoa-169593"],
      },
      {
        title: "A little caffeine",
        summary:
          "A tablespoon of cocoa has about 12 mg of caffeine, far less than a cup of coffee but not zero. If caffeine affects your sleep, enjoy this earlier in the day.",
        detail:
          "For comparison, the FDA puts regular brewed coffee at about 113 to 247 mg per 12 fluid ounces, and cites 400 mg a day as an amount most adults can have. Cocoa also contains theobromine, a related compound. USDA FoodData Central, cocoa, dry powder, unsweetened.",
        sources: ["fda-caffeine", "fdc-cocoa-169593"],
      },
    ],
  },
  "bonus-rose-collagen": {
    intro:
      "A sparkling sip of muddled strawberry and lime with a touch of rose. Its nutrition comes almost entirely from four strawberries and the lime juice.",
    points: [
      {
        title: "Vitamin C from strawberry and lime",
        summary:
          "Four medium strawberries and the lime juice give about 35 mg of vitamin C. Your body needs vitamin C to make collagen, and it works as an antioxidant in the body.",
        detail:
          "That is a little under half the 75 mg recommended daily for adult women. Strawberries (about 12 g each) supply roughly 28 mg and the juice of half a lime about 7 mg. Estimates from USDA FoodData Central.",
        sources: ["ods-vitaminc", "fdc-strawberry-167762", "fdc-limejuice-168156"],
      },
      {
        title: "A good partner for plant iron",
        summary:
          "Vitamin C improves how well you absorb nonheme iron, the form of iron found in plant foods, so this pairs well with a breakfast of oats, greens or beans.",
        detail:
          "The drink itself carries very little iron. The benefit applies to iron eaten at the same time.",
        sources: ["ods-vitaminc"],
      },
      {
        title: "Where the red comes from",
        summary:
          "Strawberries get their red color from anthocyanins, natural pigments that give many red, purple and blue fruits their color.",
        detail:
          "Anthocyanins are a type of polyphenol. Their amount in four berries is modest and varies with ripeness and variety, so no figure is given.",
        sources: ["pmid-28970777"],
      },
    ],
  },
  "bonus-green-glow": {
    intro:
      "A large, light green blend of a whole cucumber, two kiwis and mint. Cucumber is about 95 percent water, so this drinks more like a cooler than a thick smoothie.",
    points: [
      {
        title: "Vitamin C from kiwi",
        summary:
          "Two kiwis bring about 130 mg of vitamin C, and the whole glass about 150 mg. The body needs vitamin C to make collagen, and it works as an antioxidant in the body.",
        detail:
          "That is about twice the 75 mg recommended daily for adult women. Kiwi supplies most of it, with smaller amounts from cucumber, banana and lime. USDA FoodData Central, green kiwifruit (about 69 g each).",
        sources: ["ods-vitaminc", "fdc-kiwi-168153", "fdc-cucumber-168409"],
      },
      {
        title: "Potassium from the whole glass",
        summary:
          "Cucumber, kiwi and banana together bring about 1,200 mg of potassium. Potassium helps maintain normal fluid balance inside cells and is needed for normal cell function.",
        detail:
          "That is a bit under half the 2,600 mg adequate intake for adult women. A whole cucumber (about 300 g) and two kiwis each contribute about 430 to 440 mg. Estimates from USDA FoodData Central.",
        sources: ["ods-potassium", "fdc-cucumber-168409", "fdc-kiwi-168153", "fdc-banana-173944"],
      },
      {
        title: "Vitamin K from kiwi and cucumber",
        summary:
          "Kiwi and cucumber skin together add about 100 mcg of vitamin K, which the body uses to make proteins needed for normal blood clotting and bone.",
        detail:
          "The adequate intake for adult women is 90 mcg a day. Peeling the cucumber lowers this. USDA FoodData Central, cucumber with peel and green kiwifruit.",
        sources: ["ods-vitamink", "fdc-cucumber-168409", "fdc-kiwi-168153"],
      },
    ],
  },
  "bonus-warm-elixir": {
    intro:
      "A steeped, strained cup of hibiscus, ginger and blueberry. Because it is strained, this is closer to a fruit tea than a smoothie, and its value is color, warmth and flavor.",
    points: [
      {
        title: "Deep red from anthocyanins",
        summary:
          "Hibiscus gets its deep red color mainly from anthocyanins (delphinidin and cyanidin compounds), and blueberries add their own. Anthocyanins are natural plant pigments, part of the polyphenol family.",
        detail:
          "How much ends up in the cup depends on how much hibiscus you use and how long it steeps, so no amount is given. Heat and straining change what stays in the cup.",
        sources: ["pmid-25038696", "pmid-28970777"],
      },
      {
        title: "A trace mineral from the tea",
        summary:
          "USDA lists brewed hibiscus tea at about 1 mg of manganese per cup. Manganese is a trace mineral that works as a helper for many of the body's enzymes.",
        detail:
          "The adequate intake for adult women is 1.8 mg a day. This comes from a single USDA entry for brewed hibiscus tea, and brew strength varies a lot, so treat it as approximate.",
        sources: ["ods-manganese", "fdc-hibiscustea-171946"],
      },
    ],
  },
  "bonus-glow-sorbet": {
    intro:
      "A spoonable frozen bowl of banana, blueberries and almond butter. The whole banana and the almond butter carry most of its nutrition.",
    points: [
      {
        title: "Vitamin B6 from banana",
        summary:
          "One banana has about 0.4 mg of vitamin B6, roughly a third of the 1.3 mg adult women need daily. B6 takes part in more than 100 enzyme reactions, mostly in handling protein.",
        detail:
          "It is also involved in making hemoglobin, the protein in red blood cells that carries oxygen. USDA FoodData Central, bananas, raw (medium banana about 118 g).",
        sources: ["ods-vitaminb6", "fdc-banana-173944"],
      },
      {
        title: "Vitamin E from almond butter",
        summary:
          "A tablespoon of almond butter adds about 4 mg of vitamin E, roughly a quarter of the 15 mg adults need daily. Vitamin E is a fat-soluble nutrient with antioxidant activity.",
        detail:
          "Blueberries add a little more (about 0.4 mg in half a cup). USDA FoodData Central, almond butter, plain (1 tbsp = 16 g).",
        sources: ["ods-vitamine", "fdc-almondbutter-168588", "fdc-blueberryfrozen-173950"],
      },
      {
        title: "Fiber and potassium",
        summary:
          "The bowl holds about 7 g of fiber and about 580 mg of potassium, which helps maintain normal fluid balance inside cells.",
        detail:
          "Fiber: banana about 3 g, blueberries about 2 g, almond butter about 1.7 g. That is roughly a quarter of the 25 to 28 g daily the Dietary Guidelines suggest for adult women. Potassium is about 22 percent of the 2,600 mg adequate intake. Estimates from USDA FoodData Central; coconut yogurt and honey not counted.",
        sources: [
          "dga-2020",
          "ods-potassium",
          "fdc-banana-173944",
          "fdc-blueberryfrozen-173950",
          "fdc-almondbutter-168588",
        ],
      },
    ],
  },
  "berry-reds-yogurt-shake": {
    intro:
      "Frozen berries, yogurt or kefir, almond milk and a teaspoon of chia. The yogurt choice changes the protein more than anything else in the glass.",
    points: [
      {
        title: "Protein from Greek yogurt",
        summary:
          "With half a cup of Greek yogurt, the shake has about 13 to 14 g of protein; with kefir, about 7 g. Protein supplies the amino acids your body uses to build and maintain its cells and tissues.",
        detail:
          "Greek yogurt alone gives about 11 to 12 g per half cup, and plain lowfat kefir about 4.5 g. Greek yogurt also adds about 120 to 130 mg of calcium, and fortified almond milk adds more (check your carton). Estimates from USDA FoodData Central, Greek yogurt (nonfat and whole milk) and plain lowfat kefir; banana not counted.",
        sources: [
          "medlineplus-protein",
          "fdc-greekyogurtnonfat-170894",
          "fdc-greekyogurtwhole-171304",
          "fdc-kefir-170904",
        ],
      },
      {
        title: "Live cultures",
        summary:
          "Yogurt and kefir are fermented foods made with live cultures. Look for 'live and active cultures' on the label if you want them in your glass.",
        detail:
          "Not every fermented product contains live cultures by the time you eat it, and not every culture has been studied as a probiotic. This is a description of the food, not a health promise.",
        sources: ["ods-probiotics"],
      },
      {
        title: "Fiber and a plant omega-3",
        summary:
          "A cup of mixed berries plus the chia gives roughly 4 to 9 g of fiber. The teaspoon of chia alone adds about 0.7 g of ALA, a plant omega-3 the body cannot make.",
        detail:
          "Fiber depends on your berry mix: a cup of raspberries has about 8 g, blueberries about 4 g and strawberries about 3 g. The adequate intake for ALA is 1.1 g a day for adult women, so one teaspoon of chia covers over half. Estimates from USDA FoodData Central (frozen strawberries, frozen blueberries, raspberries, chia).",
        sources: [
          "dga-2020",
          "ods-omega3",
          "fdc-chia-170554",
          "fdc-raspberry-167755",
          "fdc-blueberryfrozen-173950",
          "fdc-strawberryfrozen-168173",
        ],
      },
    ],
  },
  "pomegranate-vanilla-glow": {
    intro:
      "Pomegranate juice, frozen strawberries and Greek yogurt, blended light and pourable. Strawberries carry the vitamin C and the yogurt carries the protein.",
    points: [
      {
        title: "Vitamin C from strawberries",
        summary:
          "A cup of frozen strawberries brings about 60 mg of vitamin C. The body needs vitamin C to make collagen, and it works as an antioxidant in the body.",
        detail:
          "That is about 80 percent of the 75 mg recommended daily for adult women. Bottled pomegranate juice adds almost none. USDA FoodData Central, strawberries, frozen, unsweetened (1 cup unthawed = 149 g).",
        sources: ["ods-vitaminc", "fdc-strawberryfrozen-168173", "fdc-pomegranatejuice-167787"],
      },
      {
        title: "Protein from Greek yogurt",
        summary:
          "Half a cup of Greek yogurt gives about 11 to 12 g of protein, the amino acids your body uses to build and maintain its cells and tissues.",
        detail:
          "It also brings about 0.9 mcg of vitamin B12 (over a third of the 2.4 mcg adults need daily), which the body needs for healthy red blood cell formation. USDA FoodData Central, Greek yogurt, plain.",
        sources: [
          "medlineplus-protein",
          "ods-vitaminb12",
          "fdc-greekyogurtnonfat-170894",
          "fdc-greekyogurtwhole-171304",
        ],
      },
      {
        title: "What's in pomegranate",
        summary:
          "Pomegranate contains polyphenols, including ellagitannins such as punicalagin and the anthocyanins behind its deep red color.",
        detail:
          "Levels vary widely with the fruit variety and how the juice is made, so no amount is given. Choose 100 percent pomegranate juice rather than a juice cocktail. Half a cup of juice also carries about 16 g of natural sugar and about 265 mg of potassium (USDA FoodData Central, pomegranate juice, bottled).",
        sources: ["pmid-40326706", "pmid-28970777", "fdc-pomegranatejuice-167787"],
      },
    ],
  },
  "cucumber-mint-lightness": {
    intro:
      "Cucumber, frozen pineapple, lime and mint in coconut water, blended thin and cold. Pineapple does most of the nutritional lifting.",
    points: [
      {
        title: "Vitamin C from pineapple",
        summary:
          "A cup of pineapple plus the lime gives about 85 mg of vitamin C, a little over the 75 mg recommended daily for adult women. Vitamin C is needed to make collagen and works as an antioxidant.",
        detail:
          "Pineapple supplies about 79 mg per cup, lime juice about 7 mg and cucumber about 4 mg. Coconut water is not counted because some brands add vitamin C. Estimates from USDA FoodData Central, pineapple, raw (1 cup chunks = 165 g).",
        sources: ["ods-vitaminc", "fdc-pineapple-169124", "fdc-limejuice-168156"],
      },
      {
        title: "Potassium from coconut water",
        summary:
          "Coconut water, cucumber and pineapple together bring roughly 750 to 900 mg of potassium, which helps maintain normal fluid balance inside cells.",
        detail:
          "Three quarters of a cup of coconut water holds about 300 to 460 mg depending on the product, half a cucumber about 220 mg, and pineapple about 180 mg. That is roughly a third of the 2,600 mg adequate intake for adult women. USDA FoodData Central.",
        sources: [
          "ods-potassium",
          "fdc-coconutwater-174831",
          "fdc-coconutwater-170174",
          "fdc-cucumber-168409",
          "fdc-pineapple-169124",
        ],
      },
      {
        title: "Manganese from pineapple",
        summary:
          "A cup of pineapple has about 1.5 mg of manganese, most of the 1.8 mg adult women need daily. Manganese works as a helper for many of the body's enzymes.",
        detail:
          "The teaspoon of chia adds about 0.7 g of ALA, a plant omega-3, and a little fiber. Mint at four or five leaves is flavor only. USDA FoodData Central, pineapple, raw.",
        sources: ["ods-manganese", "fdc-pineapple-169124", "fdc-chia-170554"],
      },
    ],
  },
  "cherry-cacao-calm-glow": {
    intro:
      "Frozen cherries, cacao, banana and Greek yogurt make a velvety chocolate-cherry glass, with protein from the Greek yogurt.",
    points: [
      {
        title: "Protein from Greek yogurt",
        summary:
          "With half a cup of Greek yogurt, the glass has about 15 g of protein. Protein supplies the amino acids your body uses to build and maintain its cells and tissues.",
        detail:
          "Greek yogurt gives about 11 to 12 g; cherries, cacao, banana and almond milk add about 4 g between them. USDA FoodData Central.",
        sources: ["medlineplus-protein", "fdc-greekyogurtnonfat-170894", "fdc-cherry-171719"],
      },
      {
        title: "Potassium from cherries and banana",
        summary:
          "The whole glass brings about 900 mg of potassium, led by the cherries and banana. Potassium helps maintain normal fluid balance inside cells and is needed for normal cell function.",
        detail:
          "That is about a third of the 2,600 mg adequate intake for adult women. A cup of pitted cherries has about 340 mg and half a banana about 210 mg. USDA FoodData Central (sweet cherries, raw, 1 cup pitted = 154 g).",
        sources: ["ods-potassium", "fdc-cherry-171719", "fdc-banana-173944", "fdc-cocoa-169593"],
      },
      {
        title: "Cherry pigments and cacao flavanols",
        summary:
          "Cherries get their dark red color from anthocyanins, and cacao contains flavanols. Both are families of plant compounds in the polyphenol group.",
        detail:
          "The tablespoon of cacao also adds about 0.2 mg of copper, which helps enzymes involved in forming connective tissue, and about 12 mg of caffeine. Natural (non-Dutch-processed) cocoa keeps more flavanols.",
        sources: ["pmid-28970777", "pmid-18412367", "ods-copper", "fdc-cocoa-169593"],
      },
    ],
  },
  "peach-ginger-gut-glow": {
    intro:
      "Peaches, fresh ginger, flax or chia and yogurt or kefir, thinned with coconut water. Your seed and dairy choices shape the nutrition most.",
    points: [
      {
        title: "Plant omega-3 from flax or chia",
        summary:
          "A tablespoon of ground flax has about 1.6 g of ALA, and a tablespoon of chia about 2 g. Both exceed the 1.1 g women need daily, and your body cannot make ALA itself.",
        detail:
          "Omega-3s are part of the membranes around every cell. Ground flax is used because whole flaxseeds often pass through undigested. The seeds and peaches also give about 4 to 6 g of fiber. USDA FoodData Central (flaxseed, 1 tbsp ground = 7 g; chia about 12 g per tbsp).",
        sources: ["ods-omega3", "fdc-flaxseed-169414", "fdc-chia-170554", "fdc-peach-169928"],
      },
      {
        title: "Protein from yogurt or kefir",
        summary:
          "With Greek yogurt, the glass has about 15 g of protein; with kefir, about 7 g. Protein supplies the amino acids your body uses to build and maintain its cells and tissues.",
        detail:
          "Greek yogurt gives about 11 to 12 g per half cup, lowfat kefir about 4.5 g, and the peaches, seeds and coconut water add about 3 g. USDA FoodData Central.",
        sources: ["medlineplus-protein", "fdc-greekyogurtnonfat-170894", "fdc-kefir-170904"],
      },
      {
        title: "Live cultures",
        summary:
          "Yogurt and kefir are fermented foods made with live cultures. Look for 'live and active cultures' on the label if you want them in your glass.",
        detail:
          "Not every fermented product still has live cultures when you eat it, and not every culture has been studied as a probiotic. Ginger at half an inch is here for its warm flavor.",
        sources: ["ods-probiotics", "pmid-21491265"],
      },
    ],
  },
  "mocha-reds-morning": {
    intro:
      "Coffee, cacao, a frozen banana and protein powder or Greek yogurt in one creamy glass. Here is what each part actually contributes.",
    points: [
      {
        title: "How much caffeine",
        summary:
          "Half a cup of regular brewed coffee has roughly 40 to 80 mg of caffeine, and the cacao adds about 12 mg. Cold brew is often stronger, and concentrate much stronger.",
        detail:
          "The FDA puts regular brewed coffee at about 113 to 247 mg per 12 fluid ounces and cites 400 mg a day as an amount most adults can have; if you are pregnant or breastfeeding, the FDA suggests asking your provider. Decaf or half-caf lowers the total. USDA FoodData Central lists brewed coffee at about 48 mg per half cup.",
        sources: ["fda-caffeine", "fdc-coffee-171890", "fdc-cocoa-169593"],
      },
      {
        title: "Protein, your choice",
        summary:
          "Half a cup of Greek yogurt gives about 11 to 12 g of protein; protein powder varies by brand, so check your label. Protein supplies the amino acids your body uses to build and maintain tissues.",
        detail:
          "With yogurt, the whole glass comes to about 15 g of protein including the banana, cacao and almond milk. Protein powders vary too much to estimate. USDA FoodData Central, Greek yogurt, plain.",
        sources: ["medlineplus-protein", "fdc-greekyogurtnonfat-170894"],
      },
      {
        title: "Banana's B6 and potassium",
        summary:
          "A whole banana brings about 0.4 mg of vitamin B6, roughly a third of your daily need, and about 420 mg of potassium, which helps maintain normal fluid balance inside cells.",
        detail:
          "Vitamin B6 takes part in more than 100 enzyme reactions, mostly in handling protein. The glass as a whole has about 820 mg of potassium, roughly a third of the 2,600 mg adequate intake for adult women. USDA FoodData Central.",
        sources: ["ods-vitaminb6", "ods-potassium", "fdc-banana-173944"],
      },
    ],
  },
  "tropical-reds-quickie": {
    intro:
      "Mango, papaya and lime in coconut water, with a teaspoon of chia. The orange fruit brings a noticeable set of vitamins.",
    points: [
      {
        title: "Vitamin C from mango and papaya",
        summary:
          "A cup of mango and half a cup of papaya give about 100 mg of vitamin C, and the lime about 7 mg more. The body needs vitamin C to make collagen, and it works as an antioxidant.",
        detail:
          "That is more than the 75 mg recommended daily for adult women. Mango supplies about 60 mg and papaya about 43 mg. Coconut water is not counted because some brands add vitamin C. USDA FoodData Central (mango 1 cup = 165 g; papaya 1/2 cup about 70 g).",
        sources: ["ods-vitaminc", "fdc-mango-169910", "fdc-papaya-169926", "fdc-limejuice-168156"],
      },
      {
        title: "Carotenoids for vitamin A",
        summary:
          "Mango and papaya contain beta-carotene and related carotenoids, which your body converts to vitamin A. Vitamin A is essential for vision and for normal cell growth.",
        detail:
          "Together they give about 120 mcg RAE of vitamin A, roughly a sixth of the 700 mcg recommended daily for adult women. Carotenoids are the pigments behind the orange color. USDA FoodData Central.",
        sources: ["ods-vitamina", "fdc-mango-169910", "fdc-papaya-169926"],
      },
      {
        title: "Folate from mango",
        summary:
          "The mango and papaya bring about 100 mcg of folate, roughly a quarter of the 400 mcg adults need daily. Folate is needed to make DNA and for normal cell division.",
        detail:
          "Mango carries most of it (about 71 mcg per cup). The teaspoon of chia adds about 0.7 g of ALA, a plant omega-3. USDA FoodData Central.",
        sources: ["ods-folate", "fdc-mango-169910", "fdc-papaya-169926", "fdc-chia-170554"],
      },
    ],
  },
};

export const WHY_SOURCES: Record<string, WhySource> = {
  "cdc-water": {
    title: "About Water and Healthier Drinks",
    publisher: "U.S. Centers for Disease Control and Prevention",
    url: "https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html",
  },
  "dga-2020": {
    title: "Dietary Guidelines for Americans, 2020-2025",
    publisher: "U.S. Department of Agriculture and U.S. Department of Health and Human Services",
    url: "https://www.dietaryguidelines.gov/sites/default/files/2021-03/Dietary_Guidelines_for_Americans-2020-2025.pdf",
  },
  "fda-caffeine": {
    title: "Spilling the Beans: How Much Caffeine Is Too Much?",
    publisher: "U.S. Food and Drug Administration",
    url: "https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much",
  },
  "fdc-almondbutter-168588": {
    title:
      "FoodData Central, SR Legacy: Nuts, almond butter, plain, without salt added (fdcId 168588)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168588/nutrients",
  },
  "fdc-almondmilk-174832": {
    title: "Beverages, almond milk, unsweetened, shelf stable (FoodData Central, fdcId 174832)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/174832/nutrients",
  },
  "fdc-almonds-170567": {
    title: "Nuts, almonds (FoodData Central, fdcId 170567)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/170567/nutrients",
  },
  "fdc-apricots-171697": {
    title: "Apricots, raw (FoodData Central, fdcId 171697)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/171697/nutrients",
  },
  "fdc-banana-173944": {
    title: "FoodData Central, SR Legacy: Bananas, raw (fdcId 173944)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/173944/nutrients",
  },
  "fdc-beets-169146": {
    title: "Beets, cooked, boiled, drained (FoodData Central, fdcId 169146)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/169146/nutrients",
  },
  "fdc-blueberries-171711": {
    title: "Blueberries, raw (FoodData Central, fdcId 171711)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/171711/nutrients",
  },
  "fdc-blueberryfrozen-173950": {
    title: "FoodData Central, SR Legacy: Blueberries, frozen, unsweetened (fdcId 173950)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/173950/nutrients",
  },
  "fdc-cherry-171719": {
    title: "FoodData Central, SR Legacy: Cherries, sweet, raw (fdcId 171719)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/171719/nutrients",
  },
  "fdc-chia-170554": {
    title: "FoodData Central, SR Legacy: Seeds, chia seeds, dried (fdcId 170554)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/170554/nutrients",
  },
  "fdc-cocoa-169593": {
    title: "FoodData Central, SR Legacy: Cocoa, dry powder, unsweetened (fdcId 169593)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169593/nutrients",
  },
  "fdc-coconutwater-170174": {
    title: "FoodData Central, SR Legacy: Nuts, coconut water (liquid from coconuts) (fdcId 170174)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/170174/nutrients",
  },
  "fdc-coconutwater-174831": {
    title:
      "FoodData Central, SR Legacy: Beverages, Coconut water, ready-to-drink, unsweetened (fdcId 174831)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/174831/nutrients",
  },
  "fdc-coffee-171890": {
    title:
      "FoodData Central, SR Legacy: Beverages, coffee, brewed, prepared with tap water (fdcId 171890)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/171890/nutrients",
  },
  "fdc-cucumber-168409": {
    title: "FoodData Central, SR Legacy: Cucumber, with peel, raw (fdcId 168409)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168409/nutrients",
  },
  "fdc-figs-173021": {
    title: "Figs, raw (FoodData Central, fdcId 173021)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/173021/nutrients",
  },
  "fdc-flaxseed-169414": {
    title: "FoodData Central, SR Legacy: Seeds, flaxseed (fdcId 169414)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169414/nutrients",
  },
  "fdc-ginger-169231": {
    title: "FoodData Central, SR Legacy: Ginger root, raw (fdcId 169231)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169231/nutrients",
  },
  "fdc-greekyogurtnonfat-170894": {
    title: "FoodData Central, SR Legacy: Yogurt, Greek, plain, nonfat (fdcId 170894)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/170894/nutrients",
  },
  "fdc-greekyogurtwhole-171304": {
    title: "FoodData Central, SR Legacy: Yogurt, Greek, plain, whole milk (fdcId 171304)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/171304/nutrients",
  },
  "fdc-hibiscustea-171946": {
    title: "FoodData Central, SR Legacy: Beverages, tea, hibiscus, brewed (fdcId 171946)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/171946/nutrients",
  },
  "fdc-honey-169640": {
    title: "Honey (FoodData Central, fdcId 169640)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/169640/nutrients",
  },
  "fdc-kefir-170904": {
    title: "FoodData Central, SR Legacy: Kefir, lowfat, plain, LIFEWAY (fdcId 170904)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/170904/nutrients",
  },
  "fdc-kiwi-168153": {
    title: "FoodData Central, SR Legacy: Kiwifruit, green, raw (fdcId 168153)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168153/nutrients",
  },
  "fdc-limejuice-168156": {
    title: "FoodData Central, SR Legacy: Lime juice, raw (fdcId 168156)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168156/nutrients",
  },
  "fdc-mango-169910": {
    title: "FoodData Central, SR Legacy: Mangos, raw (fdcId 169910)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169910/nutrients",
  },
  "fdc-oatmilk-2257046": {
    title: "Oat milk, unsweetened, plain, refrigerated (FoodData Central, fdcId 2257046)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/2257046/nutrients",
  },
  "fdc-orangejuice-169098": {
    title: "FoodData Central, SR Legacy: Orange juice, raw (fdcId 169098)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169098/nutrients",
  },
  "fdc-papaya-169926": {
    title: "FoodData Central, SR Legacy: Papayas, raw (fdcId 169926)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169926/nutrients",
  },
  "fdc-peach-169928": {
    title: "FoodData Central, SR Legacy: Peaches, yellow, raw (fdcId 169928)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169928/nutrients",
  },
  "fdc-peaches-169928": {
    title: "Peaches, yellow, raw (FoodData Central, fdcId 169928)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/169928/nutrients",
  },
  "fdc-pear-169118": {
    title: "FoodData Central, SR Legacy: Pears, raw (fdcId 169118)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169118/nutrients",
  },
  "fdc-pineapple-169124": {
    title: "FoodData Central, SR Legacy: Pineapple, raw, all varieties (fdcId 169124)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/169124/nutrients",
  },
  "fdc-plums-169949": {
    title: "Plums, raw (FoodData Central, fdcId 169949)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/169949/nutrients",
  },
  "fdc-pomegranate-169134": {
    title: "Pomegranates, raw (FoodData Central, fdcId 169134)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/169134/nutrients",
  },
  "fdc-pomegranatejuice-167787": {
    title: "FoodData Central, SR Legacy: Pomegranate juice, bottled (fdcId 167787)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/167787/nutrients",
  },
  "fdc-raspberries-167755": {
    title: "Raspberries, raw (FoodData Central, fdcId 167755)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/167755/nutrients",
  },
  "fdc-raspberry-167755": {
    title: "FoodData Central, SR Legacy: Raspberries, raw (fdcId 167755)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/167755/nutrients",
  },
  "fdc-sourcherries-173954": {
    title: "Cherries, sour, red, raw (FoodData Central, fdcId 173954)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/173954/nutrients",
  },
  "fdc-spinach-168462": {
    title: "FoodData Central, SR Legacy: Spinach, raw (fdcId 168462)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168462/nutrients",
  },
  "fdc-strawberries-167762": {
    title: "Strawberries, raw (FoodData Central, fdcId 167762)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/167762/nutrients",
  },
  "fdc-strawberry-167762": {
    title: "FoodData Central, SR Legacy: Strawberries, raw (fdcId 167762)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/167762/nutrients",
  },
  "fdc-strawberryfrozen-168173": {
    title: "FoodData Central, SR Legacy: Strawberries, frozen, unsweetened (fdcId 168173)",
    publisher: "U.S. Department of Agriculture, Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/food-details/168173/nutrients",
  },
  "fdc-turmeric-172231": {
    title: "Spices, turmeric, ground (FoodData Central, fdcId 172231)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/172231/nutrients",
  },
  "fdc-watermelon-167765": {
    title: "Watermelon, raw (FoodData Central, fdcId 167765)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/167765/nutrients",
  },
  "fdc-wildblueberries-173949": {
    title: "Blueberries, wild, frozen (FoodData Central, fdcId 173949)",
    publisher: "USDA Agricultural Research Service, FoodData Central",
    url: "https://fdc.nal.usda.gov/food-details/173949/nutrients",
  },
  "medlineplus-protein": {
    title: "Protein in diet",
    publisher: "MedlinePlus, National Library of Medicine",
    url: "https://medlineplus.gov/ency/article/002467.htm",
  },
  "ods-calcium": {
    title: "Calcium: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/",
  },
  "ods-copper": {
    title: "Copper: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/",
  },
  "ods-folate": {
    title: "Folate: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/",
  },
  "ods-magnesium": {
    title: "Magnesium: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/",
  },
  "ods-manganese": {
    title: "Manganese: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Manganese-HealthProfessional/",
  },
  "ods-omega3": {
    title: "Omega-3 Fatty Acids: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
  },
  "ods-potassium": {
    title: "Potassium: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/",
  },
  "ods-probiotics": {
    title: "Probiotics: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/Probiotics-HealthProfessional/",
  },
  "ods-vitamina": {
    title: "Vitamin A and Carotenoids: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
  },
  "ods-vitaminb12": {
    title: "Vitamin B12: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
  },
  "ods-vitaminb6": {
    title: "Vitamin B6: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/",
  },
  "ods-vitaminc": {
    title: "Vitamin C: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/",
  },
  "ods-vitamind": {
    title: "Vitamin D: Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
  },
  "ods-vitamine": {
    title: "Vitamin E: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/",
  },
  "ods-vitamink": {
    title: "Vitamin K: Fact Sheet for Health Professionals",
    publisher: "Office of Dietary Supplements, National Institutes of Health",
    url: "https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/",
  },
  "pmid-18412367": {
    title:
      "Andres-Lacueva C et al. Flavanol and flavonol contents of cocoa powder products: influence of the manufacturing process. J Agric Food Chem. 2008",
    publisher: "PubMed, National Library of Medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/18412367/",
  },
  "pmid-21491265": {
    title: "Ginger and its health claims: molecular aspects. Crit Rev Food Sci Nutr. 2011",
    publisher: "PubMed, National Library of Medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/21491265/",
  },
  "pmid-22593938": {
    title:
      "Pomegranate Ellagitannins (Herbal Medicine: Biomolecular and Clinical Aspects, 2nd ed., 2011, ch. 6)",
    publisher: "PubMed / NCBI Bookshelf",
    url: "https://pubmed.ncbi.nlm.nih.gov/22593938/",
  },
  "pmid-25038696": {
    title:
      "Da-Costa-Rocha I et al. Hibiscus sabdariffa L. - a phytochemical and pharmacological review. Food Chem. 2014",
    publisher: "PubMed, National Library of Medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/25038696/",
  },
  "pmid-25875121": {
    title:
      "The potential benefits of red beetroot supplementation in health and disease (Clifford et al., Nutrients 2015)",
    publisher: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/25875121/",
  },
  "pmid-28970777": {
    title:
      "Khoo HE et al. Anthocyanidins and anthocyanins: colored pigments as food, pharmaceutical ingredients, and the potential health benefits. Food Nutr Res. 2017",
    publisher: "PubMed, National Library of Medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/28970777/",
  },
  "pmid-40326706": {
    title:
      "Liu C et al. Pomegranate: historical origins, nutritional composition, health functions and processing development research. Crit Rev Food Sci Nutr. 2025",
    publisher: "PubMed, National Library of Medicine",
    url: "https://pubmed.ncbi.nlm.nih.gov/40326706/",
  },
};
