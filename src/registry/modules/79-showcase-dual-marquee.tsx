"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { PLACEHOLDER_IMAGES, type PlaceholderImage } from "@/registry/lib/placeholder-images";
import { displayFont } from "@/registry/lib/display-font";
import { cn } from "@/lib/utils";

const ROW_ONE = ["Built for motion", "Designed to scroll", "Crafted, not templated"];

type RowTwoItem = { text: string } | { image: PlaceholderImage };

const ROW_TWO: RowTwoItem[] = [
  { text: "Pixel perfect" },
  { image: PLACEHOLDER_IMAGES.wallpaper04 },
  { text: "Deliberately bold" },
  { image: PLACEHOLDER_IMAGES.landscape09 },
  { text: "Scroll aware" },
  { image: PLACEHOLDER_IMAGES.wallpaperPortrait05 },
  { text: "Made to move" },
  { image: PLACEHOLDER_IMAGES.portrait06 },
];

/**
 * Module 79 — Showcase, Dual Scroll Marquee
 * Two oversized rows loop continuously in opposite directions via the
 * shared `animate-marquee`/`animate-marquee-reverse` keyframes (each row
 * duplicated once for a seamless loop, same technique as module 21's logo
 * wall) — with an added scroll-linked drift layered on top via Motion so
 * the rows visibly react as you scroll past, not just idle-loop. Not part
 * of the A–K catalog for the same reason Effect H isn't a static variant.
 * Display font: swap `displayFont` in registry/lib/display-font.ts for the
 * real Adobe Fonts kit when it's wired in — nothing else here changes.
 */
export default function ShowcaseDualMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftLeft = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const driftRight = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="overflow-hidden bg-white py-24">
      <motion.div
        style={{ x: driftLeft }}
        className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          className={cn(
            displayFont.className,
            "animate-marquee flex w-max items-center gap-10 text-6xl whitespace-nowrap uppercase tracking-tight text-zinc-950 sm:text-8xl"
          )}
        >
          {[...ROW_ONE, ...ROW_ONE, ...ROW_ONE, ...ROW_ONE].map((phrase, i) => (
            <span key={i} className="flex items-center gap-10">
              {phrase}
              <span className="text-lime-500">•</span>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{ x: driftRight }}
        className="mt-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          className={cn(
            displayFont.className,
            "animate-marquee-reverse flex w-max items-center gap-10 text-6xl whitespace-nowrap uppercase tracking-tight text-zinc-300 sm:text-8xl"
          )}
        >
          {[...ROW_TWO, ...ROW_TWO].map((item, i) =>
            "text" in item ? (
              <span key={i} className="flex items-center gap-10">
                {item.text}
                <span className="text-zinc-200">•</span>
              </span>
            ) : (
              <span key={i} className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-28">
                <Image src={item.image.src} alt={item.image.alt} fill sizes="140px" className="object-cover" />
              </span>
            )
          )}
        </div>
      </motion.div>
    </section>
  );
}
