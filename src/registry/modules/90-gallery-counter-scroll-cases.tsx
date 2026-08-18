"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { useScrollValue } from "@/registry/lib/motion-variants";

type Case = { n: string; name: string; image: { src: string; alt: string } };

const ROW_A: Case[] = [
  { n: "001", name: "Harbour Line", image: PLACEHOLDER_IMAGES.landscape03 },
  { n: "002", name: "Ridgeworks", image: PLACEHOLDER_IMAGES.landscape06 },
  { n: "003", name: "Northfield", image: PLACEHOLDER_IMAGES.landscape10 },
  { n: "004", name: "Salt & Stone", image: PLACEHOLDER_IMAGES.landscape12 },
];

const ROW_B: Case[] = [
  { n: "005", name: "The Meridian", image: PLACEHOLDER_IMAGES.landscape14 },
  { n: "006", name: "Old Quarter", image: PLACEHOLDER_IMAGES.landscape07 },
  { n: "007", name: "Lantern Row", image: PLACEHOLDER_IMAGES.landscape11 },
  { n: "008", name: "Fieldhouse", image: PLACEHOLDER_IMAGES.landscape05 },
];

function Row({ items }: { items: Case[] }) {
  // Doubled so the row still fills the viewport at either end of its travel.
  const doubled = [...items, ...items];
  return (
    <div className="flex w-max gap-4">
      {doubled.map((item, i) => (
        <article key={`${item.n}-${i}`} className="group w-[52vw] shrink-0 sm:w-[34vw] lg:w-[23vw]">
          <div className="relative aspect-[3/2] overflow-hidden bg-black">
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 640px) 52vw, (max-width: 1024px) 34vw, 23vw"
              className="object-cover opacity-90 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:opacity-100"
            />
          </div>
          <div className="mt-3 flex items-baseline justify-between text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white">
            <span className="text-white/50">{item.n}</span>
            <span>{item.name}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * Module 90 — Gallery, Counter-Scroll Cases
 * A pinned case index: two rows of work that slide past each other in
 * opposite directions as you scroll through the pin, so the section reads
 * as a moving contact sheet rather than a static grid. Each row's offset is
 * a `useTransform` slice off the shared `scrollYProgress`, so it scrubs
 * both ways — this is Effect H's parallax logic on a horizontal axis, one
 * row negative and one positive.
 *
 * Each row's item list is rendered twice so neither end runs out of cards
 * mid-travel. Sized at 260vh; the travel finishes by 88% of progress,
 * leaving a hold before release.
 */
export default function GalleryCounterScrollCases({
  title = "Selected work",
  eyebrow = "Case index",
}: {
  title?: string;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const rowA = useTransform(scrollYProgress, [0, 0.88], ["2%", "-42%"]);
  const rowB = useTransform(scrollYProgress, [0, 0.88], ["-44%", "0%"]);
  const titleOpacity = useScrollValue(scrollYProgress, [0, 0.1, 0.85, 0.95], [0, 1, 1, 0.4]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-black">
      {/* Pinned, and its stack is vertically centred — so the padding centres
          the content in whatever height is left below the host page's floating
          chrome rather than behind it. Resolves to 0 on pages that float
          nothing (see --page-chrome in globals.css). */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[var(--page-chrome)]">
        <motion.div
          style={{ opacity: titleOpacity }}
          className="mb-10 flex items-baseline justify-between px-6 md:px-10"
        >
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-white">
            {title}
          </h2>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/50">
            {eyebrow}
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div style={{ x: rowA }}>
            <Row items={ROW_A} />
          </motion.div>
          <motion.div style={{ x: rowB }}>
            <Row items={ROW_B} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
