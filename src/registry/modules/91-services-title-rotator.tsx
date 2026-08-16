"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

type Service = { title: string[]; blurb: string; image: { src: string; alt: string } };

const SERVICES: Service[] = [
  {
    title: ["Market reads", "& property", "selection"],
    blurb: "Advisors with finance backgrounds, retrained every quarter on what the market is actually doing.",
    image: PLACEHOLDER_IMAGES.landscape12,
  },
  {
    title: ["Residency", "& licensing", "assistance"],
    blurb: "Paperwork, permits, and registrations sequenced so nothing waits on anything else.",
    image: PLACEHOLDER_IMAGES.landscape08,
  },
  {
    title: ["Private", "viewings", "& concierge"],
    blurb: "Access to assets before they list, and the people who look after them once they're yours.",
    image: PLACEHOLDER_IMAGES.landscape02,
  },
];

const AUTOPLAY_MS = 6000;

/**
 * Module 91 — Services, Title Rotator
 * A three-up services block presented one at a time: the headline rotates
 * vertically (each line clipped and pushed up out of its own mask, the
 * classic split-flap-adjacent typographic swap), while the image panel
 * crossfades in step and a counter reads 01 / 03. Advances on a timer and
 * on the prev/next controls; interacting resets the timer rather than
 * killing autoplay, so the section keeps moving if the visitor stops.
 *
 * Not a scroll-linked module — this one runs on its own clock, so it needs
 * no pin and no `useScroll`. Line entry is Effect F's stagger idea done
 * with an explicit per-line delay because the lines mount and unmount on
 * every change rather than once on view.
 */
export default function ServicesTitleRotator({
  eyebrow = "What we do",
}: {
  eyebrow?: string;
}) {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((prev) => (next + SERVICES.length) % SERVICES.length);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setIndex((prev) => (prev + 1) % SERVICES.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, tick]);

  const service = SERVICES[index];

  return (
    <section className="relative bg-[#0a0a0a] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:px-10 lg:grid-cols-[1fr_minmax(0,46%)] lg:items-center lg:gap-16">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/50">
            {eyebrow}
          </p>

          {/* Rotating headline — each line masked and swapped independently */}
          <h2 className="mt-8">
            {service.title.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${index}-${i}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                    className="block text-[clamp(2rem,4.6vw,3.75rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.045em]"
                  >
                    {line}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))}
          </h2>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
            <div className="min-h-[3.5rem] max-w-[46ch]">
              <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/50">
                {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 text-sm leading-snug text-white/70"
                >
                  {service.blurb}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous service"
                className="rounded-full border border-white/25 px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next service"
                className="rounded-full border border-white/25 px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Image panel */}
        <div className="relative aspect-[4/3] overflow-hidden bg-black lg:aspect-[3/4]">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
