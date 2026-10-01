import { useEffect, useRef, useState } from "react";
import type { Recipe } from "@/lib/content";
import { smoothiePhotoSrc } from "@/lib/smoothie-photos";

interface Props {
  recipe: Recipe;
  className?: string;
  style?: React.CSSProperties;
}

/** Paints the recipe gradient immediately and fades the approved photo
 *  (recipe.image or a listed /images/smoothies/{id}.jpg) in only once it loads.
 *  SSR-safe: a photo that fails to load simply leaves the gradient in place. */
export function SmoothieImage({ recipe, className = "", style }: Props) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const src = smoothiePhotoSrc(recipe);

  // Catch images that finished loading before hydration attached onLoad
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      className={className}
      // Defaults first, so a caller can place it (e.g. position: absolute to fill a header).
      style={{ position: "relative", overflow: "hidden", ...style, background: recipe.gradient }}
    >
      {src && (
        <img
          ref={ref}
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
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
      )}
    </div>
  );
}
