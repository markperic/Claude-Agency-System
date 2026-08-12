"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 16 — Hero, Macbook Scroll Reveal
 * A tall sticky section: a laptop mockup "opens" (lid rotateX) and its
 * screen content scales up as the page scrolls past. Recreates the classic
 * Aceternity Macbook-scroll effect from scratch with motion's scroll hooks —
 * no image asset, the screen is a built-in gradient mock UI like the rest
 * of this catalog's placeholders. Title effect: B (Fade In).
 */
export default function HeroMacbookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lidRotate = useTransform(scrollYProgress, [0, 0.5], [-28, 0]);
  const screenScale = useTransform(scrollYProgress, [0.3, 0.8], [0.85, 1]);
  const screenOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const wrapScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  return (
    <section ref={containerRef} className="relative h-[220vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <Reveal
          effect="B"
          as="h2"
          className="mb-12 text-balance text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl"
        >
          Ship a demo your clients open and just get it
        </Reveal>

        <motion.div
          style={{ scale: wrapScale, perspective: 1200 }}
          className="w-full max-w-3xl"
        >
          <motion.div
            style={{ rotateX: lidRotate, transformOrigin: "bottom center" }}
            className="mx-auto w-full max-w-2xl rounded-t-xl border border-zinc-300 bg-zinc-900 p-2 shadow-2xl"
          >
            <div className="flex items-center gap-1.5 rounded-t-md bg-zinc-800 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            </div>
            <motion.div
              style={{ scale: screenScale, opacity: screenOpacity }}
              className="aspect-video w-full overflow-hidden rounded-b-sm bg-gradient-to-br from-zinc-100 via-white to-zinc-200"
            >
              <div className="flex h-full flex-col gap-3 p-6">
                <div className="h-3 w-1/3 rounded bg-zinc-300" />
                <div className="h-3 w-1/2 rounded bg-zinc-200" />
                <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
                  <div className="rounded-lg bg-zinc-200/70" />
                  <div className="rounded-lg bg-zinc-200/70" />
                  <div className="rounded-lg bg-zinc-200/70" />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <div className="mx-auto h-3 w-full max-w-2xl rounded-b-2xl bg-zinc-300 shadow-lg" />
          <div className="mx-auto h-1.5 w-24 rounded-b-lg bg-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
