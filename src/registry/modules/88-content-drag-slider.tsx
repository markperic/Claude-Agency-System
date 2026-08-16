"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

type Card = { image: { src: string; alt: string }; label: string; caption: string };

const CARDS: Card[] = [
  { image: PLACEHOLDER_IMAGES.landscape05, label: "Advisory", caption: "Market reads, shortlists, and a point of view before you commit." },
  { image: PLACEHOLDER_IMAGES.landscape07, label: "Acquisition", caption: "Off-market access and negotiation handled end to end." },
  { image: PLACEHOLDER_IMAGES.landscape09, label: "Residency", caption: "Paperwork, permits, and relocation, sequenced so nothing stalls." },
  { image: PLACEHOLDER_IMAGES.landscape11, label: "Portfolio", caption: "Holdings reviewed on a schedule, not on a whim." },
  { image: PLACEHOLDER_IMAGES.landscape14, label: "Exit", caption: "Timing, staging, and buyers matched to the asset." },
];

const HONORS: [string, string][] = [
  ["35+", "Specialists across advisory, legal, and design"],
  ["71%", "Of clients return for a second acquisition"],
  ["06", "Languages spoken in-house"],
  ["38K", "Vetted investors in the network"],
];

/**
 * Module 88 — Content, Drag Slider
 * The horizontal counterpart to a vertical scroll section: a label, an
 * oversized statement, and a row of cards you drag sideways. A "DRAG" tag
 * follows the cursor while the pointer is over the rail — the affordance
 * that tells you the row is grabbable without printing an instruction on
 * the page.
 *
 * Drag is Motion's `drag="x"` with computed constraints rather than native
 * overflow scrolling, because the Lenis smooth-scroll wrapper (see
 * registry/lib/lenis-provider.tsx) owns wheel events site-wide; a pointer
 * drag sidesteps that entirely. The rail still falls back to a plain
 * horizontal scroll container on touch, where drag-to-scroll is native.
 *
 * Animation: Effect G (Scroll Reveal) on the heading block, Effect I-style
 * hover handled per-card. The cursor tag itself uses a spring rather than a
 * lettered effect — it tracks a pointer, not a scroll position.
 */
export default function ContentDragSlider({
  eyebrow = "About the practice",
  title = "Built on judgement, not inventory",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 480, damping: 40, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 480, damping: 40, mass: 0.4 });

  useEffect(() => {
    const measure = () => {
      const rail = railRef.current;
      const track = trackRef.current;
      if (!rail || !track) return;
      setMaxDrag(Math.max(0, track.scrollWidth - rail.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f1f1f1] py-24 text-[#0a0a0a] md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <ScrollReveal className="max-w-4xl">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
            {eyebrow}
          </p>
          <h2 className="mt-6 text-[clamp(2rem,5vw,4.25rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
            {title}
          </h2>
        </ScrollReveal>
      </div>

      {/* Drag rail */}
      <div
        ref={railRef}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onPointerMove={(e) => {
          const box = railRef.current?.getBoundingClientRect();
          if (!box) return;
          cursorX.set(e.clientX - box.left);
          cursorY.set(e.clientY - box.top);
        }}
        className="relative mt-16 overflow-hidden"
      >
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.06}
          dragMomentum
          className="flex w-max cursor-grab gap-4 px-6 active:cursor-grabbing md:px-10"
        >
          {CARDS.map((card) => (
            <article
              key={card.label}
              className="group w-[76vw] shrink-0 select-none sm:w-[46vw] lg:w-[30vw] xl:w-[26vw]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(max-width: 640px) 76vw, (max-width: 1024px) 46vw, 26vw"
                  draggable={false}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <h3 className="mt-4 text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em]">
                {card.label}
              </h3>
              <p className="mt-2 max-w-[34ch] text-sm leading-snug text-[#7a7a7a]">{card.caption}</p>
            </article>
          ))}
        </motion.div>

        {/* Cursor-following drag tag */}
        <motion.div
          style={{ x: springX, y: springY, opacity: hovering ? 1 : 0 }}
          className="pointer-events-none absolute left-0 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7a0c07] px-4 py-2 text-[0.625rem] font-bold uppercase leading-none tracking-[0.08em] text-white transition-opacity duration-300 md:block"
        >
          Drag
        </motion.div>
      </div>

      {/* Honors */}
      <div className="mx-auto mt-20 max-w-[1400px] px-6 md:px-10">
        <ul className="grid gap-x-8 gap-y-10 border-t border-black/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {HONORS.map(([figure, note]) => (
            <ScrollReveal as="li" key={figure}>
              <p className="text-[clamp(2rem,3.4vw,3rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.045em]">
                {figure}
              </p>
              <p className="mt-3 max-w-[28ch] text-sm leading-snug text-[#7a7a7a]">{note}</p>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
