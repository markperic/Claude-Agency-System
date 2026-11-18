"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import { useDetached, useIsDesktop, useScrollValue } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";

/**
 * Pinned split title (Obys "GRIDS … S03"): two giant words sit side by side mid-screen, then part and
 * rise to the top corners while an intro — photo card growing from an inset, heading and copy — opens between them.
 */
export function SplitTitle({
  left = "The",
  right = "Clubhouse",
  eyebrow,
  heading,
  text,
  image,
  cta,
}: {
  left?: string;
  right?: string;
  eyebrow?: string;
  heading?: string;
  text?: string;
  image?: Img;
  cta?: { label: string; href: string };
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useDetached(scrollYProgress);

  const rise = useScrollValue(p, [0, 0.45], [0, 1]);
  const wordScale = useScrollValue(p, [0, 0.45], [1, 0.36]);
  const imgScale = useScrollValue(p, [0.15, 0.6], [0.55, 1]);
  const imgClip = useScrollValue(p, [0.15, 0.6], ["inset(18% 18% 18% 18%)", "inset(0% 0% 0% 0%)"]);
  const copyOpacity = useScrollValue(p, [0.4, 0.6], [0, 1]);
  const copyY = useScrollValue(p, [0.4, 0.6], [40, 0]);

  const copy = (
    <div>
      {eyebrow && <p className="eyebrow mb-5 text-gold">{eyebrow}</p>}
      {heading && <h2 className="font-display text-4xl leading-[1.05] text-forest [text-wrap:balance] sm:text-5xl">{heading}</h2>}
      {text && <p className="mt-6 text-lg leading-relaxed text-ink/80">{text}</p>}
      {cta?.label && (
        <a href={cta.href} className="btn-forest mt-8">
          {cta.label}
        </a>
      )}
    </div>
  );

  if (reduce || !desktop) {
    return (
      <section ref={ref} className="bg-cream px-4 py-20 sm:px-8">
        <p className="font-display text-[16vw] uppercase leading-[0.85] text-forest">{left}</p>
        <p className="text-right font-display text-[16vw] uppercase leading-[0.85] text-gold">{right}</p>
        {image && (
          <div className="relative my-10 aspect-[4/3] overflow-hidden">
            <ClubImage image={image} fill className="object-cover" sizes="100vw" />
          </div>
        )}
        {copy}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[260svh] bg-cream">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 px-6"
          style={{ "--t": rise, transform: "translateY(calc(-50% + var(--t) * (140px - 50svh + 13.6vw)))" } as never}
        >
          <motion.span className="block w-fit origin-top-left font-display text-[17vw] uppercase leading-[0.8] text-forest" style={{ scale: wordScale }}>
            {left}
          </motion.span>
          <div className="flex justify-end" style={{ transform: "translateY(calc(var(--t) * -13.6vw))" }}>
            <motion.span className="block origin-top-right font-display text-[17vw] uppercase leading-[0.8] text-gold" style={{ scale: wordScale }}>
              {right}
            </motion.span>
          </div>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 top-[24svh] mx-auto grid max-w-7xl grid-cols-12 items-center gap-10 px-8 pb-10">
          {image && (
            <motion.div className="relative col-span-6 h-[62svh] overflow-hidden" style={{ scale: imgScale, clipPath: imgClip }}>
              <ClubImage image={image} fill className="object-cover" sizes="50vw" />
            </motion.div>
          )}
          <motion.div className="col-span-5 col-start-8" style={{ opacity: copyOpacity, y: copyY }}>
            {copy}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
