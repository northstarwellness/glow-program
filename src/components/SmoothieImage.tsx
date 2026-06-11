import { useEffect, useRef, useState } from "react";
import type { Recipe } from "@/lib/content";

interface Props {
  recipe: Recipe;
  className?: string;
  style?: React.CSSProperties;
}

/** Paints the recipe gradient immediately and fades the photo
 *  (recipe.image or /images/smoothies/{id}.jpg) in only once it loads.
 *  SSR-safe: a missing photo simply leaves the gradient in place. */
export function SmoothieImage({ recipe, className = "", style }: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Catch images that finished loading before hydration attached onLoad
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      className={className}
      style={{ ...style, background: recipe.gradient, position: "relative", overflow: "hidden" }}
    >
      <img
        ref={ref}
        src={recipe.image ?? `/images/smoothies/${recipe.id}.jpg`}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
