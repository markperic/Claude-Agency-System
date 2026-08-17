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
 * slack collects above the heading instead of below the bars.
 *
 * That holds while the section is pinned, but not on the way in. Bottom
 * anchoring puts the whole slack above the heading, so as this section
 * rises into view the reader crosses all of it before reaching any content
 * — arriving from module 80's video, that band is the first thing they see.
 * Hence `sm:h-[82vh]` rather than a flat `h-screen`: the frame is what
 * positions the bottom-anchored content, so trimming it lifts the content by
 * that 18vh on entry. The trade is 18vh of dark below the bar labels while
 * pinned, which reads as bottom margin because the content is bottom-heavy.
 *
 * All of that is `sm`-gated, because below `sm` the pin itself is wrong.
 * The bars stack into one column and the content runs taller than the
 * viewport, so there is nothing a pin can hold still: with `justify-end` the
 * excess overflowed out of the *top* of the frame and took the eyebrow and
 * heading with it, leaving a phone reader three bars and no title. Below `sm`
 * the section is therefore unpinned and auto-height, and the content simply
 * flows. The bars still fill off the same `scrollYProgress` — the mapping
 * never required a pin, only scroll range — so they animate and reverse there
 * exactly as they do on desktop, just over a shorter span. The heading
 * is sized in container-query width units (`cqw`, against the
 * `[container-type:inline-size]` wrapper) rather than fixed breakpoint
 * sizes, so it always spans the full width of its container edge-to-edge
 * on one line at any desktop/tablet width — a fixed `text-Nxl` scale would
 * either overflow at some widths or leave slack at others. Mobile drops
 * the container-query sizing for a larger fixed size that wraps onto two
 * lines instead, since a one-line fit at phone widths would force the text
 * down to an illegibly small size.
 */
const STATS: { value: number; height: number; label: string; range: [number, number] }[] = [
  { value: 55, height: 160, label: "of small business sites run on an unmodified template", range: [0.06, 0.32] },
  { value: 78, height: 224, label: "of visitors say design quality shapes how much they trust a brand", range: [0.38, 0.64] },
  { value: 92, height: 288, label: "of designers say deadlines force them to skip craft", range: [0.7, 0.96] },
];

/**
 * The percentage label is a sibling of the growing fill, not a child of it.
 * Nesting it inside meant it inherited the fill's `scaleY` and squashed flat
 * as the bar grew — correct-looking only at the two ends of the range, and
 * only ever seen intact because a finished bar sits at scaleY 1. Riding the
 * top edge of the fill is the effect we want, so the label translates by the
 * same amount the fill's top edge moves — `(1 - scaleY) * height` — which
 * tracks it exactly without inheriting the distortion. At scaleY 0 that
 * translation parks it a full bar-height down, past the container's
 * `overflow-hidden`, so an unfilled bar shows no label, same as before.
 * Heights are numbers rather than Tailwind classes because the offset needs
 * the pixel value; none of them varied by breakpoint anyway.
 */
function Bar({ stat, scrollYProgress }: { stat: (typeof STATS)[number]; scrollYProgress: MotionValue<number> }) {
  const scaleY = useTransform(scrollYProgress, stat.range, [0, 1]);
  const labelY = useTransform(scaleY, (v) => (1 - v) * stat.height);
  return (
    <div className="flex flex-col">
      <div
        style={{ height: stat.height }}
        className="relative w-full overflow-hidden rounded-t-xl bg-white/5"
      >
        <motion.div
          style={{ scaleY, transformOrigin: "bottom" }}
          className="absolute inset-0 bg-lime-400"
        />
        <motion.span
          style={{ y: labelY }}
          className="absolute inset-x-0 top-0 pt-4 text-center text-3xl font-bold text-zinc-950"
        >
          {stat.value}%
        </motion.span>
      </div>
      <p className="mt-4 text-sm text-zinc-400">{stat.label}</p>
    </div>
  );
}

export default function StatsBarChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative bg-zinc-950 sm:h-[190vh]">
      <div className="flex flex-col px-6 py-24 sm:sticky sm:top-0 sm:h-[82vh] sm:justify-end sm:py-0 sm:pb-28">
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
