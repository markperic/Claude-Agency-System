"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 81 — Stats, Animated Bar Chart
 * Three columns whose fill grows from the bottom, one at a time, gated
 * directly by scroll distance rather than a timed `whileInView` stagger —
 * pinned the same way modules 78/80/82 pin (`h-[Nvh]` + `sticky top-0`), with
 * each bar's `scaleY` mapped to its own slice of the pin's scroll progress
 * via `useTransform`. Because every bar's fill is a pure function of
 * `scrollYProgress` (not a one-shot animation triggered on enter), scrolling
 * back up runs the same mapping backwards for free — no separate reverse
 * logic needed, and no risk of bars all filling in near-simultaneously on a
 * fast scroll the way a timed stagger could. The sticky frame anchors
 * content to the bottom (`justify-end` + a modest `pb`) rather than
 * centering it — the content block is much shorter than a full viewport,
 * and centering split that leftover space into equal bands above the
 * heading and below the bar labels. Because both bands are just empty dark
 * background, shrinking the frame's own height doesn't help (the same
 * amount of emptiness just shows up outside the frame instead of inside
 * it) — the fix has to move the content itself, not the frame, so the
 * slack collects above the heading instead of below the bars. The heading
 * is sized in container-query width units (`cqw`, against the
 * `[container-type:inline-size]` wrapper) rather than fixed breakpoint
 * sizes, so it always spans the full width of its container edge-to-edge
 * on one line at any desktop/tablet width — a fixed `text-Nxl` scale would
 * either overflow at some widths or leave slack at others. Mobile drops
 * the container-query sizing for a larger fixed size that wraps onto two
 * lines instead, since a one-line fit at phone widths would force the text
 * down to an illegibly small size.
 */
const STATS: { value: number; height: string; label: string; range: [number, number] }[] = [
  { value: 55, height: "h-40", label: "of small business sites run on an unmodified template", range: [0.06, 0.32] },
  { value: 78, height: "h-56", label: "of visitors say design quality shapes how much they trust a brand", range: [0.38, 0.64] },
  { value: 92, height: "h-72", label: "of designers say deadlines force them to skip craft", range: [0.7, 0.96] },
];

function Bar({ stat, scrollYProgress }: { stat: (typeof STATS)[number]; scrollYProgress: MotionValue<number> }) {
  const scaleY = useTransform(scrollYProgress, stat.range, [0, 1]);
  return (
    <div className="flex flex-col">
      <div className={`relative w-full ${stat.height} overflow-hidden rounded-t-xl bg-white/5`}>
        <motion.div
          style={{ scaleY, transformOrigin: "bottom" }}
          className="absolute inset-0 flex items-start justify-center bg-lime-400 pt-4"
        >
          <span className="text-3xl font-bold text-zinc-950">{stat.value}%</span>
        </motion.div>
      </div>
      <p className="mt-4 text-sm text-zinc-400">{stat.label}</p>
    </div>
  );
}

export default function StatsBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative h-[210vh] bg-zinc-950">
      <div className="sticky top-0 flex h-screen flex-col justify-end px-6 pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-5xl [container-type:inline-size]">
          <ScrollReveal effect="A" as="p" className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            The state of design
          </ScrollReveal>
          <ScrollReveal
            effect="A"
            as="h2"
            className="text-[9.8vw] leading-[1.1] font-semibold tracking-tight text-white sm:text-nowrap sm:text-[6.9cqw]"
          >
            Design is broken. The data is clear.
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:items-end">
            {STATS.map((stat) => (
              <Bar key={stat.label} stat={stat} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
