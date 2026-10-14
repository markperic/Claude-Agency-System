import { useId } from "react";
import { LOGO_SHAPES, LOGO_VIEWBOX } from "./logo-data";

type LogoProps = {
  title: string;
  className?: string;
  /** Adds the outline layer used by the draw-on animation (see HeroLogo). */
  traceable?: boolean;
};

/**
 * Brand logo in a single colour (`currentColor`), drawn from the shape data in
 * logo-data.ts (the supplied Property Group artwork).
 */
export function Logo({ title, className = "", traceable = false }: LogoProps) {
  const maskId = useId();
  const [x, y, width, height] = LOGO_VIEWBOX;
  return (
    <svg viewBox={LOGO_VIEWBOX.join(" ")} role="img" aria-label={title} className={className}>
      <mask id={maskId} maskUnits="userSpaceOnUse" x={x} y={y} width={width} height={height}>
        {LOGO_SHAPES.map((shape, i) => (
          <path key={i} d={shape.d} fill={shape.kind === "ink" ? "white" : "black"} />
        ))}
      </mask>
      <rect data-logo-fill x={x} y={y} width={width} height={height} fill="currentColor" mask={`url(#${maskId})`} />
      {traceable && (
        <g fill="none" stroke="currentColor" strokeWidth={width / 300} strokeLinejoin="round">
          {LOGO_SHAPES.filter((shape) => shape.kind === "ink").map((shape, i) => (
            <path key={i} data-logo-stroke d={shape.d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
          ))}
        </g>
      )}
    </svg>
  );
}
