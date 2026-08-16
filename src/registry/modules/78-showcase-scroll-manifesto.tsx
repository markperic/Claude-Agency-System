"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { displayFont } from "@/registry/lib/display-font";
import { cn } from "@/lib/utils";

const WORDS = [
  "We", "don't", "animate", "for", "attention.", "We", "animate",
  "for", "clarity", "every", "scroll", "deliberate,", "every",
  "reveal", "earned,", "every", "detail", "considered", "until",
  "it", "feels", "unmistakably", "yours.",
];

const EMPHASIZED = new Set([8, 14, 22]);

function RevealWord({
  children,
  progress,
  range,
  emphasize,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  emphasize?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const color = useTransform(progress, range, emphasize ? ["#52525b", "#a3e635"] : ["#52525b", "#ffffff"]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

/**
 * Module 78 — Showcase, Scroll Reveal Manifesto
 * A pinned full-bleed section where a bold statement fills in word-by-word
 * as you scroll through it — continuously scroll-scrubbed (each word's
 * color/opacity tracks scroll position directly), unlike Effect K's
 * SplitReveal which plays once on load/view. Not part of the A–K catalog
 * for the same reason Effect H isn't a static variant: the per-word scroll
 * mapping needs its own useScroll/useTransform wiring per instance.
 * Display font: swap `displayFont` in registry/lib/display-font.ts for the
 * real Adobe Fonts kit when it's wired in — nothing else here changes.
 */
export default function ShowcaseScrollManifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative h-[250vh] bg-zinc-950">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={PLACEHOLDER_IMAGES.landscape08.src}
            alt={PLACEHOLDER_IMAGES.landscape08.alt}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-zinc-950/60" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollReveal effect="A" as="p" className="mb-6 text-sm font-medium tracking-wide text-zinc-400 uppercase">
            Scroll to reveal
          </ScrollReveal>
          <p className={cn(displayFont.className, "text-4xl leading-[1.1] uppercase tracking-tight sm:text-6xl")}>
            {WORDS.map((word, i) => (
              <RevealWord
                key={i}
                progress={scrollYProgress}
                range={[i / WORDS.length, (i + 1) / WORDS.length]}
                emphasize={EMPHASIZED.has(i)}
              >
                {word}
              </RevealWord>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
