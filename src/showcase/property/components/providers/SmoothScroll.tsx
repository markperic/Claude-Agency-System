"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";
import { usePrefersReducedMotion } from "@/showcase/property/hooks/usePrefersReducedMotion";

// Reference values (reference/stack.json). autoRaf is off only because the
// GSAP ticker drives lenis.raf below.
const LENIS_OPTIONS = { lerp: 0.07, autoResize: true, autoRaf: false };

function GsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <>
      {/* Reduced motion: no Lenis, native scrolling. ScrollTrigger still works. */}
      {!reducedMotion && (
        <>
          <ReactLenis root options={LENIS_OPTIONS} />
          <GsapSync />
        </>
      )}
      {children}
    </>
  );
}
