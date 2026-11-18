"use client";

import { useEffect, useState } from "react";
import { useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";

/**
 * Re-publishes a scroll-derived value through a plain motion value.
 * Transforms taken straight from `useScroll` can be promoted to native scroll-timeline animations,
 * which don't honour multi-stop ranges consistently; a detached value keeps everything on one JS clock.
 */
export function useScrollValue<T extends string | number>(source: MotionValue<number>, input: number[], output: T[]): MotionValue<T> {
  const mapped = useTransform(source, input, output);
  const detached = useMotionValue<T>(mapped.get());
  useMotionValueEvent(mapped, "change", (latest) => detached.set(latest));
  return detached;
}

/** Detached copy of a progress value, seeded with its current value (reloads that restore scroll position). */
export function useDetached(source: MotionValue<number>) {
  const p = useMotionValue(source.get());
  useMotionValueEvent(source, "change", (v) => p.set(v));
  useEffect(() => p.set(source.get()), [p, source]);
  return p;
}

/** True from the given breakpoint up. Pinned/3D set pieces fall back to simple stacks below it. */
export function useIsDesktop(query = "(min-width: 768px)") {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
