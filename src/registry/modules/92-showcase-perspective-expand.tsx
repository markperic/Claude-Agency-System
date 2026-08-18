"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { useScrollValue } from "@/registry/lib/motion-variants";

const TITLE_LINES = ["Zero", "commission,", "exclusive", "access, full", "support"];

const BENEFITS: [string, string][] = [
  ["No buyer fees", "Our side of the transaction is paid by the developer, not by you."],
  ["One point of contact", "The advisor who wins the mandate is the one who runs it."],
  ["Residency handled", "Permits and paperwork for you and your household, start to finish."],
  ["Pre-market access", "Allocations released to the network before anything is listed."],
  ["Vetted partners", "Only developers with a delivery record we've audited ourselves."],
];

/** One title line, masked and pushed up across its own slice of progress. */
function Line({
  text,
  progress,
  range,
}: {
  text: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const y = useTransform(progress, range, ["105%", "0%"]);
  const opacity = useScrollValue(progress, range, [0, 1]);
  return (
    <span className="block overflow-hidden">
      <motion.span style={{ y, opacity }} className="block">
        {text}
      </motion.span>
    </span>
  );
}

/**
 * Module 92 — Showcase, Perspective Expand
 * A single image does the work of a section transition: it starts as a small
 * card tilted in 3D, then — scrubbed by scroll — rotates flat, grows to fill
 * the frame, and becomes the backdrop for the statement that follows. The
 * oversized headline then reveals line by line out of its own mask, and the
 * benefits list fades up underneath.
 *
 * All four beats hang off one pinned section's `scrollYProgress`, so the
 * whole thing reverses cleanly on scroll-up. The card's growth animates
 * width/height in viewport units rather than `scale`, so the photograph
 * never stretches and the corner radius doesn't distort as it opens. Its
 * start size comes from `--card-w`/`--card-h`, set per breakpoint, so the
 * card stays landscape on a phone instead of collapsing to a sliver.
 *
 * Note the `overflow-hidden` sits on the sticky frame itself, never on the
 * section — an ancestor with `overflow-hidden` silently breaks
 * `position: sticky`.
 *
 * `overflow-anchor: none` is a precaution, not the fix for anything observed.
 * Animating the card's width/height is a real layout change every frame, so
 * this section emits a continuous stream of layout shifts (measured ~0.42
 * across one pass) that scroll anchoring would otherwise be entitled to
 * "correct" by moving scrollTop while Lenis eases toward its own target.
 * Plausible, cheap to rule out, and worth keeping — but it was NOT the cause
 * of the intermittent "scroll stops dead here" this section was blamed for.
 * That was Lenis caching a stale scroll limit site-wide and clamping downward
 * scrolling to it; see registry/lib/lenis-provider.tsx. The tell was that the
 * native scrollbar could still drag past the barrier while the wheel could
 * not, which rules out anything in this file — a rendering or layout problem
 * cannot distinguish between the two input paths.
 */
export default function ShowcasePerspectiveExpand({
  eyebrow = "Why work with us",
  image = PLACEHOLDER_IMAGES.landscape04,
}: {
  eyebrow?: string;
  image?: { src: string; alt: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Beat 1 — the card unfolds and grows to full bleed.
  const rotateX = useTransform(scrollYProgress, [0, 0.26], [26, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.26], [-14, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.3], [4, 0]);

  // Growth is driven by one 0→1 scalar interpolated inside `calc()` against
  // `--card-w`/`--card-h` rather than by tweening "32vw"→"100vw" directly.
  // Those literals can't vary by breakpoint, and a card fixed at 32vw × 42vh
  // inverts from landscape on desktop to a tall sliver on a phone. Holding the
  // start size in custom properties lets Tailwind set it per breakpoint while
  // the interpolation stays a single shared value.
  const grow = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const width = useMotionTemplate`calc(var(--card-w) + (100vw - var(--card-w)) * ${grow})`;
  const height = useMotionTemplate`calc(var(--card-h) + (100vh - var(--card-h)) * ${grow})`;

  // Beat 2 — the frame darkens so the type has somewhere to sit.
  const scrimOpacity = useScrollValue(scrollYProgress, [0.24, 0.38], [0, 0.62]);

  // Beat 4 — benefits arrive after the last headline line has landed, and run
  // out at 0.97 rather than 0.88. The pin holds for the section's full 420vh
  // whatever the beats do, so ending early leaves a stretch of scrolling where
  // the screen is pinned and nothing at all changes — which reads as the page
  // having seized rather than as a deliberate hold.
  const listOpacity = useScrollValue(scrollYProgress, [0.84, 0.97], [0, 1]);
  const listY = useTransform(scrollYProgress, [0.84, 0.97], [28, 0]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-[#0a0a0a] [overflow-anchor:none]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden [perspective:1400px]">
        {/* Beat 1 — the expanding card */}
        <motion.div
          style={{ width, height, rotateX, rotateY, borderRadius: radius }}
          className="relative overflow-hidden bg-black [--card-h:30vh] [--card-w:78vw] [transform-style:preserve-3d] sm:[--card-h:38vh] sm:[--card-w:54vw] lg:[--card-h:42vh] lg:[--card-w:32vw]"
        >
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
          <motion.div style={{ opacity: scrimOpacity }} className="absolute inset-0 bg-black" />
        </motion.div>

        {/* Beats 3–4 — statement and list, over the expanded frame */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-6 text-white md:px-10">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/60">
            {eyebrow}
          </p>

          {/* The display size lives on the h2, not on the per-line spans, so
              the `ch` max-width below measures in display characters. Sizing
              the spans instead leaves the h2 at the inherited 16px, and each
              line's masking `overflow-hidden` then clips the words. */}
          <h2 className="mt-6 max-w-[12ch] text-[clamp(2.25rem,7.6vw,7rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.05em]">
            {TITLE_LINES.map((line, i) => (
              <Line
                key={line}
                text={line}
                progress={scrollYProgress}
                range={[0.34 + i * 0.09, 0.48 + i * 0.09]}
              />
            ))}
          </h2>

          <motion.ul
            style={{ opacity: listOpacity, y: listY }}
            className="mt-10 grid max-w-5xl gap-x-10 gap-y-5 border-t border-white/20 pt-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {BENEFITS.map(([label, note]) => (
              <li key={label}>
                <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em]">
                  {label}
                </p>
                <p className="mt-2 max-w-[32ch] text-[0.8125rem] leading-snug text-white/65">{note}</p>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
