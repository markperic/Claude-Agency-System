"use client";

import { Canvas } from "@react-three/fiber";
import { MagicCircle, StudioEnvironment, type MagicCircleProps } from "@/registry/lib/magic-circle";

export type RingSceneProps = Omit<MagicCircleProps, "squeeze"> & {
  squeeze: { get: () => number };
  /** Static lean, in radians, so the ring reads as a solid object rather than a logo. */
  tilt?: number;
};

/**
 * The canvas is transparent and the page paints its own background behind it.
 * That is the whole reason for rendering in-page instead of embedding a
 * viewer: the ring composites into the layout, so type can cross in front of
 * it and the section colour shows through the middle of the band.
 */
export default function RingScene({ squeeze, spin, tilt = 0.22, ...ring }: RingSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <StudioEnvironment />

      <group rotation={[tilt, 0, 0]}>
        <MagicCircle squeeze={squeeze} spin={spin} {...ring} />
      </group>
    </Canvas>
  );
}
