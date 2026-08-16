"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * App-wide inertial smooth scroll. Mounted once at the root layout — not
 * per-page. Skips Lenis entirely when the user prefers reduced motion,
 * leaving native scroll untouched, matching the reduced-motion checks
 * modules 66/68/70/71 already do for their own animations.
 *
 * Nothing else needs to sync to this: Motion's useScroll/useTransform
 * (ParallaxImage/Effect H, and the scroll-linked heroes in modules 16 and 67)
 * read real window scroll position, which Lenis's default mode still drives
 * every frame — just eased instead of instant.
 *
 * allowNestedScroll is on because Lenis otherwise hijacks wheel events
 * globally, which breaks any module with its own internal scroll region
 * (e.g. the Effect H demo box on /demo/animations) — with it on, Lenis
 * detects nested scrollables and lets them scroll natively instead.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, allowNestedScroll: true });
    return () => lenis.destroy();
  }, []);

  return children;
}
