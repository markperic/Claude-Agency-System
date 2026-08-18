"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferGeometry,
  MeshStandardMaterial,
  PMREMGenerator,
  type Group,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  createBandGeometry,
  deformBand,
  minorAxisForPerimeter,
} from "./magic-circle-geometry";

/** Ring radius at rest, in world units. Everything else is expressed against it. */
const BASE_RADIUS = 1;
const CIRCUMFERENCE = 2 * Math.PI * BASE_RADIUS;

/**
 * How far the squeezed axis shortens at squeeze = 1. A real magic circle
 * gives maybe 15–20% before the band fights back hard; 28% reads as a
 * committed press on screen without looking like the steel has yielded.
 */
const MAX_COMPRESSION = 0.28;

export type MagicCircleProps = {
  /**
   * Read once per frame rather than passed as a number, so scroll can drive
   * the ring without re-rendering React 60 times a second. Anything with a
   * `.get()` works — a Motion `MotionValue`, or a plain object standing in.
   */
  squeeze: { get: () => number };
  /**
   * Optional Y-axis rotation in radians, read per frame like `squeeze`. It
   * turns only the meshes — the lights and environment sit outside that inner
   * group, so the ring rotates *through* fixed studio lighting instead of
   * dragging its own highlights around with it.
   */
  spin?: { get: () => number };
  tubeRadius?: number;
  bandColor?: string;
};

/**
 * Soft studio lighting with no asset to download. `RoomEnvironment` is a
 * procedural box of emissive panels that ships inside three itself; running
 * it through PMREM gives the band the broad, wrapping highlight that makes a
 * matte surface read as a physical object. Analytic lights alone leave it
 * looking like flat-shaded plastic.
 *
 * Mount this as a direct child of `<Canvas>`, never inside a group:
 * `environment` is a property of Scene, so `attach` needs the scene itself as
 * its parent. Attaching declaratively rather than assigning `scene.environment`
 * in an effect also keeps R3F responsible for unsetting it on unmount.
 *
 * `pmrem.dispose()` right after `fromScene` is deliberate and safe — it frees
 * the generator's scratch buffers, while the render target it produced owns
 * the texture we keep.
 */
export function StudioEnvironment() {
  const renderer = useThree((state) => state.gl);

  const envTexture = useMemo(() => {
    const pmrem = new PMREMGenerator(renderer);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    return target.texture;
  }, [renderer]);

  return <primitive object={envTexture} attach="environment" />;
}

/**
 * A Pilates magic circle whose band deforms on demand.
 *
 * The two grips sit at θ = 0 and θ = π — the ends of the squeezed axis — so
 * they ride inward with it and stay welded to the band. Their own axis is the
 * curve tangent there, which is ±Y for every value of a and b, so a capsule
 * standing on Y is already correctly oriented and never needs re-aiming.
 *
 * Both the deform and the grip positions happen in `useFrame` off a ref, not
 * in React state. The geometry buffers are allocated once and rewritten in
 * place; nothing here allocates per frame.
 */
export function MagicCircle({
  squeeze,
  spin,
  tubeRadius = 0.055,
  bandColor = "#c9c4bb",
}: MagicCircleProps) {
  const meshGroupRef = useRef<Group>(null);
  const bandGeometry = useMemo<BufferGeometry>(() => createBandGeometry(), []);
  const bandMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: bandColor,
        roughness: 0.42,
        metalness: 0.35,
      }),
    [bandColor],
  );

  /*
   * Deliberately no dispose-on-unmount effect here.
   *
   * The obvious version — a `useEffect` returning a cleanup that disposes the
   * memoized geometry and materials — is silently fatal under React Strict
   * Mode. Strict Mode mounts, runs the cleanup, then mounts again, but
   * `useMemo` does not re-run across that simulated remount, so the second
   * mount draws with buffers that have already been released. WebGL raises
   * nothing and three raises nothing: the canvas simply renders empty, which
   * reads as "the model failed to load" rather than "the resources were freed."
   *
   * These objects live exactly as long as the component, and R3F disposes
   * objects attached to a mesh when that mesh unmounts, so there is nothing
   * left to clean up by hand.
   */

  useFrame(() => {
    const amount = Math.min(1, Math.max(0, squeeze.get()));

    const a = BASE_RADIUS * (1 - MAX_COMPRESSION * amount);
    const b = minorAxisForPerimeter(a, CIRCUMFERENCE);

    deformBand(bandGeometry, a, b, tubeRadius);


    if (spin && meshGroupRef.current) meshGroupRef.current.rotation.y = spin.get();
  });

  return (
    <group>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} />

      <group ref={meshGroupRef}>
        <mesh geometry={bandGeometry} material={bandMaterial} />
      </group>
    </group>
  );
}
