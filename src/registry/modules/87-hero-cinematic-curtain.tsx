"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { useScrollValue } from "@/registry/lib/motion-variants";

const SLIDES = [
  PLACEHOLDER_IMAGES.landscape03,
  PLACEHOLDER_IMAGES.landscape12,
  PLACEHOLDER_IMAGES.landscape10,
];

/**
 * The contents of the closing frame: the still, a flat accent tint blended
 * over it, and the heading. Rendered once per split half.
 *
 * `mix-blend-overlay` rather than a flat alpha wash: overlay keeps the
 * photograph's own light and shade (it screens where the image is bright and
 * multiplies where it's dark) instead of veiling it uniformly, so the still
 * still reads as a photograph rather than a colour swatch. The heading sits
 * after the tint and carries no blend mode of its own, so it stays clean
 * white on top rather than being tinted along with the image.
 *
 * `decorative` marks the right-hand copy, whose half is already `aria-hidden`
 * — it drops the alt text and the heading from the accessibility tree so the
 * duplicate isn't announced twice.
 */
function ClosingFrame({
  accent,
  heading,
  headingOpacity,
  decorative = false,
}: {
  accent: string;
  heading: string;
  headingOpacity: MotionValue<number>;
  decorative?: boolean;
}) {
  return (
    <>
      <Image
        src={SLIDES[2].src}
        alt={decorative ? "" : SLIDES[2].alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.p
          style={{ opacity: headingOpacity }}
          className="max-w-[15ch] text-center text-[clamp(1.75rem,5.6vw,5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em] text-white"
        >
          {heading}
        </motion.p>
      </div>
    </>
  );
}

/**
 * Module 87 — Hero, Cinematic Curtain
 * The "opening title sequence" hero: a pinned full-bleed frame that plays a
 * six-beat scroll-scrubbed timeline before the page proper begins —
 *   1. the backdrop settles from a 1.12 zoom while the headline holds,
 *   2. the headline lifts away,
 *   3. a hairline of accent colour draws itself out of the centre point on
 *      scaleY, holds at full height, then wipes outward on scaleX until it
 *      floods the frame (the "curtain"),
 *   4. two stills reveal through expanding clip-paths, a rectangle from the
 *      centre then a diamond,
 *   5. a closing still scales up from zero and holds,
 *   6. that still splits down the middle and the two halves slide apart,
 *      uncovering a light panel with a statement rising into it — which is
 *      also the handoff into the light section that follows.
 *
 * Every beat is scrubbed off one shared `scrollYProgress`, never a timed
 * stagger, so scrolling back up rewinds the sequence exactly. Sized at
 * 520vh: ~100vh of readable hold at the top, ~340vh of sequence, ~80vh of
 * end hold so the reveal isn't yanked away the instant it lands.
 *
 * Uses no lettered A–K effect: like modules 78 and 84, the per-beat scroll
 * mapping needs its own useScroll/useTransform wiring and can't be a static
 * variant. See MODULE-LIBRARY.md.
 */
export default function HeroCinematicCurtain({
  eyebrow = "Full-cycle advisory",
  headline = "A studio for places\nworth staying in",
  accent = "#7a0c07",
  zoomHeading = "Space is the last real luxury",
  revealLabel = "About",
  revealStatement = "An advisory practice for residential and commercial property, pairing people with places built to outlast the reason they were bought.",
}: {
  eyebrow?: string;
  headline?: string;
  accent?: string;
  zoomHeading?: string;
  revealLabel?: string;
  revealStatement?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Beat 1–2 — backdrop settles, headline lifts away.
  const bgScale = useTransform(scrollYProgress, [0, 0.24], [1.12, 1]);
  const bgY = useTransform(scrollYProgress, [0, 0.24], ["0%", "-6%"]);
  const titleY = useTransform(scrollYProgress, [0, 0.22], [0, -70]);
  const titleOpacity = useScrollValue(scrollYProgress, [0.12, 0.22], [1, 0]);

  // Beat 3 — the curtain, in three legs. It starts fully hidden, draws itself
  // out of the centre point as a hairline (scaleY), holds at full height while
  // the headline finishes clearing, then wipes outward (scaleX) to flood the
  // frame. Splitting the draw from the wipe is what makes the line read as a
  // deliberate mark rather than a panel that was always there — both legs run
  // off `origin-center`, so the line grows from the middle in both axes.
  const curtainDraw = useTransform(scrollYProgress, [0.05, 0.19], [0, 1]);
  const curtainWipe = useTransform(scrollYProgress, [0.28, 0.38], [0.006, 1]);

  // Beat 4 — two clip reveals. `inset` shrinks to 0 (rectangle opening from
  // the centre); the diamond grows its four vertices past 50% to cover.
  const insetPct = useTransform(scrollYProgress, [0.4, 0.52], [50, 0]);
  const insetClip = useMotionTemplate`inset(${insetPct}% ${insetPct}%)`;

  const diamond = useTransform(scrollYProgress, [0.52, 0.64], [0, 100]);
  const dTop = useTransform(diamond, (v) => 50 - v);
  const dRight = useTransform(diamond, (v) => 50 + v);
  const dBottom = useTransform(diamond, (v) => 50 + v);
  const dLeft = useTransform(diamond, (v) => 50 - v);
  const diamondClip = useMotionTemplate`polygon(50% ${dTop}%, ${dRight}% 50%, 50% ${dBottom}%, ${dLeft}% 50%)`;

  // Beat 5 — the closing still scales up from nothing, then holds. Its heading
  // rides the same scale (it lives inside the frame), so this only needs to
  // fade it up once the frame is big enough for type to be legible in it.
  const finalScale = useTransform(scrollYProgress, [0.66, 0.76], [0, 1]);
  // Explicit <number>: the literal [0, 1] would otherwise infer as
  // MotionValue<0 | 1>, which won't satisfy the MotionValue<number> prop below.
  const zoomHeadingOpacity = useScrollValue<number>(scrollYProgress, [0.7, 0.78], [0, 1]);

  // Beat 6 — the split. The closing still is drawn twice, each copy clipped to
  // one half, and the halves slide apart to uncover the panel behind them.
  // Splitting one layer rather than the whole stack is what keeps this cheap:
  // by this point the closing still covers everything beneath it, so nothing
  // else needs a second copy. 52vw of travel clears the viewport with margin.
  const splitLeft = useTransform(scrollYProgress, [0.82, 0.96], ["0vw", "-52vw"]);
  const splitRight = useTransform(scrollYProgress, [0.82, 0.96], ["0vw", "52vw"]);

  // The panel behind is opaque, so it can only switch on while the closing
  // still is already covering the frame — otherwise it would blank the hero
  // from the first pixel of scroll. 0.76→0.79 sits inside that cover.
  const panelOpacity = useScrollValue(scrollYProgress, [0.76, 0.79], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.82, 0.98], [140, 0]);
  const revealOpacity = useScrollValue(scrollYProgress, [0.84, 0.94], [0, 1]);

  // Chrome fades out once the curtain starts moving and never comes back.
  const chromeOpacity = useScrollValue(scrollYProgress, [0.2, 0.3], [1, 0]);

  return (
    <section ref={ref} className="relative h-[440vh] bg-black [overflow-anchor:none]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Beat 1 — backdrop */}
        <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0">
          <Image
            src={PLACEHOLDER_IMAGES.landscape01.src}
            alt={PLACEHOLDER_IMAGES.landscape01.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>

        {/* Beat 2 — headline */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-0 flex items-center justify-center px-7 md:px-6"
        >
          <h1 className="max-w-5xl text-center text-[clamp(2.25rem,5.4vw,4.75rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em] text-white [text-wrap:balance]">
            {headline.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Beat 3 — the curtain: draws vertically, then wipes horizontally */}
        <motion.div
          style={{ scaleX: curtainWipe, scaleY: curtainDraw, backgroundColor: accent }}
          className="absolute inset-0 origin-center"
        />

        {/* Beat 4 — clip reveals */}
        <motion.div style={{ clipPath: insetClip }} className="absolute inset-0">
          <Image src={SLIDES[0].src} alt={SLIDES[0].alt} fill sizes="100vw" className="object-cover" />
        </motion.div>

        <motion.div style={{ clipPath: diamondClip }} className="absolute inset-0">
          <Image src={SLIDES[1].src} alt={SLIDES[1].alt} fill sizes="100vw" className="object-cover" />
        </motion.div>

        {/* Beat 6 — the panel uncovered by the split, sitting under the
            closing still and above everything earlier in the stack. */}
        <motion.div
          style={{ opacity: panelOpacity }}
          className="absolute inset-0 flex items-center justify-center bg-[#f1f1f1] px-6 md:px-10"
        >
          <motion.div style={{ y: revealY, opacity: revealOpacity }} className="max-w-4xl text-center">
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
              {revealLabel}
            </p>
            <p className="mt-6 font-serif text-[clamp(1.375rem,3.4vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-[#0a0a0a]">
              {revealStatement}
            </p>
          </motion.div>
        </motion.div>

        {/* Beat 5–6 — closing still, drawn as two halves that scale up as one
            frame (no gap while x is 0) and then slide apart. The clips overlap
            by 0.2% so no hairline seam shows down the middle mid-scale.

            The tint and heading live *inside* each half rather than over the
            top of both, which is what makes them zoom with the image and then
            get cut cleanly down the middle by the split — each half carries
            its own portion of the word. Both halves lay their contents out at
            full frame size, so the two heading fragments stay in register
            until the halves actually separate. */}
        <motion.div
          style={{ scale: finalScale, x: splitLeft, clipPath: "inset(0 49.9% 0 0)" }}
          className="absolute inset-0 origin-center"
        >
          <ClosingFrame accent={accent} heading={zoomHeading} headingOpacity={zoomHeadingOpacity} />
        </motion.div>
        <motion.div
          aria-hidden
          style={{ scale: finalScale, x: splitRight, clipPath: "inset(0 0 0 49.9%)" }}
          className="absolute inset-0 origin-center"
        >
          <ClosingFrame accent={accent} heading={zoomHeading} headingOpacity={zoomHeadingOpacity} decorative />
        </motion.div>

        {/* Overlay chrome — edge marks, present only for the first beat */}
        <motion.div
          style={{ opacity: chromeOpacity }}
          className="pointer-events-none absolute inset-0 text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white"
        >
          {/* Held at mid-height on the left and right edges, level with the
              headline. Horizontal padding only: `-translate-y-1/2` offsets by
              the element's own height, so vertical padding here would throw
              the centring off by half of whatever it added.

              Below md the two marks turn to run vertically up the edges. Laid
              out horizontally they cross the middle of a narrow viewport and
              land on top of the headline, which is also why the right-hand one
              used to be hidden outright on mobile — turned, both fit. The turn
              is `writing-mode`, not a rotate transform: writing-mode gives the
              flex row a genuinely tall-and-narrow box to place at each edge,
              whereas a rotated box still measures full width and the two marks
              would collide in the centre while merely being drawn sideways.
              `rotate-180` on the left one makes it read bottom-to-top, the
              usual pairing against a top-to-bottom mark on the right.

              Turning them is not on its own enough: the headline's widest line
              still bit ~4px into each strip. The clearance below md is
              structural rather than a measured gap — the marks sit in a `px-2`
              gutter and are 11px wide, so they can never extend past x=19,
              while the headline block's `px-7` starts its content at x=28.
              Text cannot render outside its own content box, so the two are
              guaranteed apart at every viewport width rather than merely at
              the one that was checked. Widths too narrow for the headline's
              measure wrap it, which is the correct outcome. */}
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-2 md:px-8">
            <span className="rotate-180 [writing-mode:vertical-rl] md:rotate-0 md:[writing-mode:horizontal-tb]">{eyebrow}</span>
            <span className="[writing-mode:vertical-rl] md:[writing-mode:horizontal-tb]">Let&rsquo;s discuss &#8599;</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
            <span>Scroll</span>
            <span>01 &mdash; Introduction</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
