"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { displayFont } from "@/registry/lib/display-font";
import { cn } from "@/lib/utils";

/**
 * Module 82 — Showcase, Blur Exit Statement
 * A pinned full-screen statement: already visible the instant the section
 * is reached (no fade-in dead zone tied to raw scroll progress — that used
 * to leave the section blank for the first 50vh of its scroll, which was
 * also what a same-page nav link jumping straight to this section's top
 * would land on). The whole line fades/rises in once via `ScrollReveal`
 * (Effect A, `whileInView`-triggered so it also fires immediately on an
 * anchor jump), then "REAL DESIGN" specifically fills in from white to the
 * site's lime accent as a continuous, scroll-scrubbed color transform tied
 * to `scrollYProgress` (same per-word color-mapping idea as module 78, just
 * applied to two words instead of a whole paragraph) — a punctuation
 * moment between bigger sections that stays in sharp focus throughout
 * rather than blurring on exit. Not part of the A–K catalog (a single-use
 * scroll transform, same reasoning modules 16/67/78/80 give for keeping
 * their scroll wiring local). Display font: same `displayFont` swap-point
 * as modules 78/79.
 */
export default function ShowcaseBlurExit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const fillColor = useTransform(scrollYProgress, [0.15, 0.55], ["#ffffff", "#a3e635"]);

  return (
    <section ref={ref} className="relative h-[160vh] bg-zinc-950">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <ScrollReveal
          effect="A"
          as="h2"
          className={cn(
            displayFont.className,
            "max-w-5xl text-center text-5xl uppercase leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl"
          )}
        >
          <motion.span style={{ color: fillColor }}>Real design</motion.span> can solve this.
        </ScrollReveal>
      </div>
    </section>
  );
}
