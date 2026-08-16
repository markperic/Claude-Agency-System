"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { ScrollReveal } from "@/registry/lib/motion-variants";

const ROTATION = [
  { image: PLACEHOLDER_IMAGES.wallpaper01, word: "Bold" },
  { image: PLACEHOLDER_IMAGES.wallpaper02, word: "Honest" },
  { image: PLACEHOLDER_IMAGES.wallpaper03, word: "Considered" },
  { image: PLACEHOLDER_IMAGES.wallpaper05, word: "Bespoke" },
];

/**
 * Module 85 — CTA, Rotating Word Closer
 * "Design Real" / a 3-up coverflow carousel (center image sharp and raised,
 * the previous/next images flanking it, dimmed and smaller) / "[Word]
 * Systems." — checking the reference site's actual closing section showed
 * its "rotating image" is this 3-item coverflow, not a single image
 * swapping in place (an earlier version of this module only did the
 * latter). Cycles on a timer; a small, self-contained flourish for the
 * bottom of a page, hence the `cta` category rather than `showcase`.
 */
export default function CtaRotatingWordCloser() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATION.length), 2200);
    return () => clearInterval(id);
  }, []);

  const prev = ROTATION[(index - 1 + ROTATION.length) % ROTATION.length];
  const current = ROTATION[index];
  const next = ROTATION[(index + 1) % ROTATION.length];

  return (
    <section className="overflow-hidden bg-zinc-950 px-6 py-32">
      <div className="mx-auto max-w-4xl text-center">
        <ScrollReveal effect="B" as="p" className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          Design Real
        </ScrollReveal>

        <div className="relative mx-auto mt-10 flex h-56 items-center justify-center sm:h-80">
          <div className="absolute h-36 w-48 -translate-x-36 overflow-hidden rounded-2xl opacity-40 sm:h-52 sm:w-72 sm:-translate-x-52">
            <Image src={prev.image.src} alt="" fill sizes="300px" className="object-cover" />
          </div>
          <div className="absolute h-36 w-48 translate-x-36 overflow-hidden rounded-2xl opacity-40 sm:h-52 sm:w-72 sm:translate-x-52">
            <Image src={next.image.src} alt="" fill sizes="300px" className="object-cover" />
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 h-56 w-56 overflow-hidden rounded-2xl shadow-xl sm:h-80 sm:w-80"
            >
              <Image src={current.image.src} alt={current.image.alt} fill sizes="360px" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-10 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {current.word}
            </motion.span>
          </AnimatePresence>{" "}
          Systems.
        </p>

        <p className="mt-16 text-sm text-zinc-500">
          Designed &amp; built with Claude Code — a numbered module library.
        </p>
      </div>
    </section>
  );
}
