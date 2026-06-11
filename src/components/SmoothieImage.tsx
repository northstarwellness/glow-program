import { useState } from "react";
import type { Recipe } from "@/lib/content";

interface Props {
  recipe: Recipe;
  className?: string;
  style?: React.CSSProperties;
}

/** Tries to load the recipe photo (recipe.image or /images/smoothies/{id}.jpg);
 *  falls back to the recipe's CSS gradient on any error. */
export function SmoothieImage({ recipe, className = "", style }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={className} style={{ ...style, background: recipe.gradient }} />;
  }

  return (
    <img
      src={recipe.image ?? `/images/smoothies/${recipe.id}.jpg`}
      alt=""
      className={className}
      style={{ ...style, objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
}
