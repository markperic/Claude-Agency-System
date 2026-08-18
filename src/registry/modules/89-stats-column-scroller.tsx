"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { useScrollValue } from "@/registry/lib/motion-variants";
import { cn } from "@/lib/utils";

const BACKDROPS = [
  PLACEHOLDER_IMAGES.landscape02,
  PLACEHOLDER_IMAGES.landscape08,
  PLACEHOLDER_IMAGES.landscape13,
];

type Stat = { figure: string; note: string };
type Align = "left" | "center" | "right";

/**
 * One column per screen position. Each column cycles through its own stats
 * independently — the whole point of the section is that they never swap in
 * unison.
 */
const COLUMNS: { align: Align; stats: Stat[] }[] = [
  {
    align: "left",
    stats: [
      { figure: "35+", note: "Specialists with three to seventeen years in the market" },
      { figure: "71%", note: "Of clients come back for a second or third acquisition" },
      { figure: "0", note: "Transactions cancelled for non-payment since founding" },
    ],
  },
  {
    align: "center",
    stats: [
      { figure: "160M", note: "Average monthly transaction volume across the book" },
      { figure: "03", note: "Ranked among the top three partners for our developers" },
      { figure: "32%", note: "Of monthly revenue originates in the partner network" },
    ],
  },
  {
    align: "right",
    stats: [
      { figure: "06", note: "Languages spoken in-house, no interpreters, no delay" },
      { figure: "38K", note: "Vetted investors already in the network worldwide" },
      { figure: "24/7", note: "Coverage across the time zones our clients live in" },
    ],
  },
];

/**
 * When each column advances to its next stat. Staggered left → centre → right
 * so a "round" ripples across the frame rather than snapping all at once, and
 * so at any moment you can be reading one column's new figure while the other
 * two still hold their old ones.
 */
const COLUMN_STEPS: number[][] = [
  [0, 0.24, 0.56],
  [0, 0.32, 0.64],
  [0, 0.4, 0.72],
];

/**
 * The backdrop and the standfirst change only *after* a full round of column
 * swaps has finished (the last column moves at 0.40, then 0.72), so the image
 * transition reads as a chapter break rather than competing with the numbers.
 */
const SCENE_STEPS = [0, 0.46, 0.78];

const SCENES = [
  "A practice built on judgement, not listings.",
  "Every mandate handled by the people who won it.",
  "Returns you can model, not returns you have to hope for.",
];

/**
 * Opacity + offset for item `index` of a swapping set, given the progress
 * points at which each item becomes the active one.
 *
 * Opacity and travel share one input ramp so they stay locked together: an
 * item rises into place as it fades in, holds, then keeps rising as it fades
 * out. The travel is what makes this readable — two oversized figures
 * crossfading on the same baseline just double-expose into an unreadable
 * smudge at the midpoint, however short the fade.
 *
 * The first item is already on screen at progress 0 so it only ever leaves;
 * the last never leaves so it only arrives; the rest do both. Building the
 * ramp this way keeps every input array monotonic and inside [0,1] without
 * clamping a hand-written range — worth caring about because the opacity
 * feeds `useScrollValue`, and an out-of-range or backwards offset is the
 * exact shape that used to crash the WAAPI path.
 *
 * Requires at least two steps.
 */
function useSwap(
  progress: MotionValue<number>,
  steps: number[],
  index: number,
  fade = 0.035,
  travel = 115,
) {
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;
  const start = steps[index];
  const next = isLast ? 1 : steps[index + 1];

  const input = isFirst ? [next - fade, next] : isLast ? [start - fade, start] : [start - fade, start, next - fade, next];
  const fades = isFirst ? [1, 0] : isLast ? [0, 1] : [0, 1, 1, 0];
  const travels = isFirst ? [0, -travel] : isLast ? [travel, 0] : [travel, 0, 0, -travel];

  return {
    opacity: useScrollValue(progress, input, fades),
    y: useTransform(progress, input, travels),
  };
}

const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "sm:text-center",
  right: "sm:text-right",
};

/** One stat, stacked with its siblings and swapped into view. */
function StatEntry({
  stat,
  progress,
  steps,
  index,
  align,
}: {
  stat: Stat;
  progress: MotionValue<number>;
  steps: number[];
  index: number;
  align: Align;
}) {
  const { opacity, y } = useSwap(progress, steps, index);

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn("absolute inset-x-0 top-0", ALIGN_CLASS[align])}
    >
      <p className="text-[clamp(3rem,7.4vw,9rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.055em] text-white">
        {stat.figure}
      </p>
      <p
        className={cn(
          "mt-5 max-w-[32ch] text-[clamp(0.75rem,0.9vw,1rem)] font-bold uppercase leading-[1.3] tracking-[-0.01em] text-white",
          align === "center" && "sm:mx-auto",
          align === "right" && "sm:ml-auto",
        )}
      >
        {stat.note}
      </p>
    </motion.div>
  );
}

/** The mid-frame standfirst, swapping in step with the backdrop. */
function Scene({
  text,
  progress,
  index,
}: {
  text: string;
  progress: MotionValue<number>;
  index: number;
}) {
  const { opacity, y } = useSwap(progress, SCENE_STEPS, index, 0.08, 20);
  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 top-0 mx-auto max-w-[68ch] text-center text-[clamp(0.8125rem,1.05vw,1.125rem)] font-bold uppercase leading-[1.35] tracking-[-0.01em] text-white"
    >
      {text}
    </motion.p>
  );
}

/** One full-bleed backdrop, opaque only across its own scene. */
function Backdrop({
  image,
  progress,
  index,
}: {
  image: { src: string; alt: string };
  progress: MotionValue<number>;
  index: number;
}) {
  const { opacity } = useSwap(progress, SCENE_STEPS, index, 0.08);
  const scale = useTransform(progress, [0, 1], [1.12, 1]);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
    </motion.div>
  );
}

/**
 * Module 89 — Stats, Column Scroller
 * A full-screen pinned section: three columns of figures sit across the top of
 * the frame at oversized display scale, and each one advances to its next stat
 * at a different point in the scroll. Underneath, a standfirst and the
 * full-bleed backdrop change together, but only once a full round of column
 * swaps has completed — so the numbers move against a stable image, then the
 * image resets the scene.
 *
 * The staggered schedule is the whole idea. Everything hangs off one shared
 * `scrollYProgress` via `useSwap`, so the section scrubs and reverses
 * exactly; a timed stagger would neither reverse nor hold position on a fast
 * flick. Opacities route through `useScrollValue` because this is a pinned
 * frame — see that helper for why a bare `useTransform` desyncs here.
 *
 * Deliberately edge-to-edge: no vignette, no inner scroll mask, and the
 * columns align left / centre / right against the viewport edges so the
 * figures read as one wide band rather than three boxes. Below `sm` the
 * columns stack and all align left, since edge-alignment needs width to read.
 */
export default function StatsColumnScroller({
  eyebrow = "By the numbers",
}: {
  eyebrow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative h-[380vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        {BACKDROPS.map((image, i) => (
          <Backdrop key={image.src} image={image} progress={scrollYProgress} index={i} />
        ))}
        <div className="absolute inset-0 bg-black/30" />

        {/* This section pins, so its top band is where content *rests* rather
            than somewhere it scrolls past — it has to clear whatever floating
            chrome the host page stacks above it. `--page-chrome` (globals.css)
            carries that height; the max() keeps the module's own 5rem/6rem on
            pages that float nothing, so the demo page is unaffected. Reading
            the token beats hardcoding a number: this padding was previously
            tuned to a chapter pill sitting at top-6, and silently became too
            small the moment that pill moved down. */}
        <div className="relative flex h-full flex-col px-5 pb-6 pt-[max(5rem,calc(var(--page-chrome)+1.5rem))] md:px-8 md:pb-8 md:pt-[max(6rem,calc(var(--page-chrome)+2rem))]">
          {/* Stat band across the top */}
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
            {COLUMNS.map((column, c) => (
              <div key={column.align} className="relative min-h-[clamp(9rem,14vw,15rem)]">
                {column.stats.map((stat, i) => (
                  <StatEntry
                    key={stat.figure}
                    stat={stat}
                    progress={scrollYProgress}
                    steps={COLUMN_STEPS[c]}
                    index={i}
                    align={column.align}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Standfirst, held in the middle of the frame */}
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              {SCENES.map((text, i) => (
                <Scene key={text} text={text} progress={scrollYProgress} index={i} />
              ))}
            </div>
          </div>

          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/70">
            {eyebrow}
          </p>
        </div>
      </div>
    </section>
  );
}
