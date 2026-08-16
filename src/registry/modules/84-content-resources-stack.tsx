"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

const LINKS = [
  { href: "/", label: "Browse the module catalog" },
  { href: "/demo/animations", label: "View the animation effect guide" },
  { href: "/example", label: "See a worked example page" },
  { href: "/demo/showcase", label: "Explore the showcase category" },
];

const CARDS: { label: string; meta: string; className: string; rotate: number; x: number; y: number; range: [number, number] }[] = [
  { label: "Module Library", meta: "80 modules and counting", className: "bg-zinc-950", rotate: -6, x: 0, y: 0, range: [0.05, 0.22] },
  { label: "Effect Catalog", meta: "11 named effects, A–K", className: "bg-lime-600", rotate: 4, x: 28, y: 44, range: [0.28, 0.45] },
  { label: "Component Registry", meta: "One JSON file, zero build step", className: "bg-indigo-600", rotate: -3, x: 56, y: 88, range: [0.51, 0.68] },
];

function Card({ card, zIndex, scrollYProgress }: { card: (typeof CARDS)[number]; zIndex: number; scrollYProgress: MotionValue<number> }) {
  const progress = useTransform(scrollYProgress, card.range, [0, 1]);
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  const y = useTransform(progress, [0, 1], [60, 0]);
  const rotate = useTransform(progress, [0, 1], [card.rotate * 2.5, card.rotate]);
  const scale = useTransform(progress, [0, 1], [0.9, 1]);

  return (
    <motion.div
      style={{ top: card.y, left: card.x, zIndex, opacity, y, rotate, scale }}
      className={`absolute flex h-64 w-64 flex-col justify-between rounded-2xl p-6 shadow-xl ${card.className}`}
    >
      <span className="text-xs font-medium tracking-wide text-white/60 uppercase">Resource</span>
      <div>
        <p className="text-xl font-semibold text-white">{card.label}</p>
        <p className="mt-1 text-sm text-white/70">{card.meta}</p>
      </div>
    </motion.div>
  );
}

/**
 * Module 84 — Content, Resources Stack
 * A "Playbook" section: the left column (heading, intro, real internal
 * links — unlike the reference site's PDFs, these actually go somewhere)
 * stays put while the right side is a tightly overlapping fan of cards that
 * reveal one at a time, gated by scroll distance rather than a timed
 * stagger — pinned the same way modules 78/80/81/82 pin (`h-[Nvh]` +
 * `sticky top-0`), with each card's opacity/position/rotation/scale mapped
 * to its own slice of the pin's scroll progress via `useTransform`. Because
 * each card's appearance is a pure function of `scrollYProgress` (not a
 * one-shot `whileInView` stagger), you have to actually scroll to bring the
 * next card in, and scrolling back up un-reveals them in reverse for free —
 * no separate reverse logic needed. The three card ranges are front-loaded
 * into the first ~68% of the pin's scroll progress, leaving the last ~32%
 * as a deliberate hold (same idea as module 82's blur-exit hold) so the
 * full stack stays on screen for a stretch before the section releases and
 * scrolls away — without that gap, the pin would release right as the last
 * card finished appearing, reading as the cards "disappearing" the moment
 * you kept scrolling. `overflow-hidden` (to clip the fan's
 * slight overlap past its box) has to live on the sticky element itself,
 * not on the outer pin `<section>` — an overflow-hidden *ancestor* of a
 * sticky element breaks its stickiness (it scrolls away with the page
 * instead of pinning), a classic CSS gotcha that isn't a problem for the
 * sticky element's own overflow.
 */
export default function ContentResourcesStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative h-[280vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-16 sm:grid-cols-2 sm:items-center">
          <div>
            <ScrollReveal effect="A" as="p" className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
              Playbook
            </ScrollReveal>
            <ScrollReveal effect="A" as="h2" className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Great design doesn&rsquo;t begin with inspiration.
            </ScrollReveal>
            <ScrollReveal effect="A" as="p" className="mt-4 max-w-md text-zinc-600">
              It begins with a system. The module library and effect catalog
              put craft back at the center of every build.
            </ScrollReveal>

            <ScrollReveal effect="A" as="div" className="mt-8 flex flex-col gap-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between border-b border-zinc-200 pb-3 text-zinc-800 transition-colors hover:text-zinc-950"
                >
                  <span className="font-medium">{link.label}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              ))}
            </ScrollReveal>
          </div>

          <div className="relative mx-auto h-80 w-full max-w-xs sm:mx-0">
            {CARDS.map((card, i) => (
              <Card key={card.label} card={card} zIndex={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
