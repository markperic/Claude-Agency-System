"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";
import { Logo } from "./Logo";

const INTRO_SECONDS = 2.6;

/**
 * Logo that traces its outline, then fills in. Scrolling plays the same
 * animation backwards: `scrollSpan()` returns the scroll distance (px) over
 * which it fully un-draws.
 */
export function HeroLogo({ title, className = "", scrollSpan }: { title: string; className?: string; scrollSpan: () => number }) {
  const ref = useRef<HTMLDivElement>(null);
  const span = useRef(scrollSpan);
  useEffect(() => {
    span.current = scrollSpan;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const strokes = root.querySelectorAll("[data-logo-stroke]");
      const fill = root.querySelector("[data-logo-fill]");

      // 0 → 0.7: outlines draw on. 0.6 → 1: fill fades in as the outlines fade out.
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.fromTo(strokes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut", stagger: { amount: 0.15 } }, 0)
        .fromTo(fill, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, 0.6)
        .fromTo(strokes, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.7);

      const state = { intro: 0, scroll: 0 };
      const render = () => {
        tl.progress(state.intro * (1 - state.scroll));
      };
      render();
      gsap.set(root, { visibility: "visible" });

      const intro = gsap.to(state, { intro: 1, duration: INTRO_SECONDS, ease: "none", delay: 0.2, onUpdate: render });
      const trigger = ScrollTrigger.create({
        start: 0,
        end: () => span.current(),
        onUpdate: (self) => {
          state.scroll = self.progress;
          render();
        },
        onRefresh: (self) => {
          state.scroll = self.progress;
          render();
        },
      });

      return () => {
        intro.kill();
        trigger.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={`motion-safe:invisible ${className}`}>
      <Logo title={title} traceable className="size-full" />
    </div>
  );
}
