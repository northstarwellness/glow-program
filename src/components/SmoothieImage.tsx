import { useState } from "react";

interface Props {
  id: string;
  gradient: string;
  className?: string;
}

/** Tries to load /images/smoothies/{id}.jpg; falls back to CSS gradient on any error. */
export function SmoothieImage({ id, gradient, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={className} style={{ background: gradient }} />;
  }

  return (
    <img
      src={`/images/smoothies/${id}.jpg`}
      alt=""
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setFailed(true)}
    />
  );
}
