import type { Recipe } from "@/lib/content";

/**
 * Recipe ids that have an approved photo at /images/smoothies/{id}.jpg.
 * Empty until approved originals are delivered — add an id here when its file
 * is committed to public/images/smoothies/. Unlisted recipes render the brand
 * gradient only, so no request is made for a file that doesn't exist.
 */
export const SMOOTHIE_PHOTO_IDS: ReadonlySet<string> = new Set<string>([]);

export const smoothiePhotoSrc = (recipe: Pick<Recipe, "id" | "image">) =>
  recipe.image ?? (SMOOTHIE_PHOTO_IDS.has(recipe.id) ? `/images/smoothies/${recipe.id}.jpg` : null);
