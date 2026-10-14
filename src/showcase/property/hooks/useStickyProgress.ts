"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";

/** Desktop layout with motion allowed. */
export const MOTION_DESKTOP = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";
/** Mobile layout with motion allowed. */
export const MOTION_MOBILE = "(max-width: 900px) and (prefers-reduced-motion: no-preference)";
/** Any layout with motion allowed. */
export const MOTION_ANY = "(prefers-reduced-motion: no-preference)";

/**
 * Reports scroll progress (0 → 1) through a tall wrapper that holds a CSS
 * `position: sticky` child: 0 when the wrapper's top reaches the top of the
 * viewport, 1 when its bottom reaches the bottom. No ScrollTrigger pinning.
 */
export function useStickyProgress(
  wrapperRef: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  query: string = MOTION_ANY,
) {
  const callback = useRef(onProgress);
  useEffect(() => {
    callback.current = onProgress;
  });

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(query, () => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => callback.current(self.progress),
        onRefresh: (self) => callback.current(self.progress),
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [wrapperRef, query]);
}
