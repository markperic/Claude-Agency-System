"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 16 — Hero, Macbook Scroll Reveal
 * A tall sticky section: a laptop mockup "opens" (lid rotateX) and its
 * screen content scales up as the page scrolls past. Recreates the classic
 * Aceternity Macbook-scroll effect from scratch with motion's scroll hooks.
 * scrollYProgress is run through useSpring before driving any transform —
 * without it, a fast flick/fast programmatic scroll can leave the derived
 * opacity/scale values stuck on a stale (pre-jump) DOM write, since Motion
 * only re-flushes style on the next frame that value changes. The spring
 * keeps ticking every frame until it settles, which self-corrects that.
 * The screen shows a real website mockup image (public/mockup-website-hero.webp
 * — a licensed Freepik/Magnific template, cropped to just the browser frame
 * with the source's watermark removed). Title effect: B (Fade In).
 */
export default function HeroMacbookScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  const lidRotate = useTransform(smoothProgress, [0, 0.5], [-28, 0]);
  const screenScale = useTransform(smoothProgress, [0.3, 0.8], [0.85, 1]);
  const screenOpacity = useTransform(smoothProgress, [0.2, 0.45], [0, 1]);
  const wrapScale = useTransform(smoothProgress, [0, 0.5], [0.9, 1]);

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
              className="relative aspect-video w-full overflow-hidden rounded-b-sm"
            >
              <Image
                src="/mockup-website-hero.webp"
                alt="Website mockup: a travel landing page with a hero photo and booking panel"
                fill
                priority
                sizes="(min-width: 1024px) 672px, 100vw"
                className="object-cover object-top"
              />
            </motion.div>
          </motion.div>
          <div className="mx-auto h-3 w-full max-w-2xl rounded-b-2xl bg-zinc-300 shadow-lg" />
          <div className="mx-auto h-1.5 w-24 rounded-b-lg bg-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
