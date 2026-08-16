"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { cn } from "@/lib/utils";

type Location = {
  city: string;
  timeZone: string;
  building: string;
  blurb: string;
  backdrop: { src: string; alt: string };
  thumbs: { src: string; alt: string }[];
};

const LOCATIONS: Location[] = [
  {
    city: "Northport",
    timeZone: "Europe/Lisbon",
    building: "Harbour House",
    blurb:
      "The harbour office is where the majority of our transactions are structured — three floors of advisory, legal, and design working in the same room rather than passing files between buildings.",
    backdrop: PLACEHOLDER_IMAGES.landscape10,
    thumbs: [
      PLACEHOLDER_IMAGES.landscape03,
      PLACEHOLDER_IMAGES.landscape14,
      PLACEHOLDER_IMAGES.portrait06,
      PLACEHOLDER_IMAGES.landscape11,
    ],
  },
  {
    city: "Vallecrest",
    timeZone: "America/Denver",
    building: "The Foundry",
    blurb:
      "Our second studio covers the western portfolio and the relocation practice, close enough to the assets that a site visit is a morning rather than a trip.",
    backdrop: PLACEHOLDER_IMAGES.landscape12,
    thumbs: [
      PLACEHOLDER_IMAGES.landscape05,
      PLACEHOLDER_IMAGES.portrait03,
      PLACEHOLDER_IMAGES.landscape08,
      PLACEHOLDER_IMAGES.portrait07,
    ],
  },
];

/** Local wall-clock for a location, so the panel reads as staffed right now. */
function LocalClock({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  // Renders empty on the server and on first paint, then fills in — the value
  // is clock-dependent, so rendering it during SSR would guarantee a mismatch.
  return <span className="tabular-nums">{time ? `(${time})` : " "}</span>;
}

/**
 * Module 96 — Locations, Tabbed Panel
 * A full-height office/location panel: tabs across the top, an oversized
 * city name, a short description, and a strip of supporting photographs,
 * all sitting over a backdrop that crossfades when the tab changes. Each
 * location shows its own live local time, which is what makes the section
 * read as two staffed offices rather than two addresses.
 *
 * The clock is deliberately client-only — it renders blank on the server and
 * fills in after mount, because a time value rendered during SSR is
 * guaranteed to disagree with the client a moment later and would produce a
 * hydration mismatch.
 *
 * Interaction-driven, not scroll-driven; the crossfade is `AnimatePresence`
 * rather than a lettered effect, since it swaps between states instead of
 * playing on entry.
 */
export default function LocationsTabbedPanel({
  eyebrow = "Where we work",
}: {
  eyebrow?: string;
}) {
  const [index, setIndex] = useState(0);
  const location = LOCATIONS[index];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Crossfading backdrop */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={location.backdrop.src}
            alt={location.backdrop.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/60" />

      {/* Extra top padding below `sm` only: the tabs sit at the top of the
          frame, and on a narrow screen a page-level floating element (the
          chapter pill on the estate example) overlaps them enough to swallow
          taps on the first tab. Wide screens spread the row edge-to-edge, so
          nothing collides there. */}
      <div className="relative flex min-h-screen flex-col justify-between gap-12 p-6 pt-20 sm:pt-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/60">
            {eyebrow}
          </p>
          <ul className="flex gap-2">
            {LOCATIONS.map((item, i) => (
              <li key={item.city}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={i === index}
                  className={cn(
                    "rounded-full border px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors",
                    i === index
                      ? "border-white bg-white text-black"
                      : "border-white/30 text-white/70 hover:border-white hover:text-white",
                  )}
                >
                  {item.city}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,38%)] lg:items-end lg:gap-16"
          >
            <div>
              <h2 className="text-[clamp(2.75rem,9vw,8rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.05em]">
                {location.city}
              </h2>
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/60">
                <span>Office at {location.building}</span>
                <LocalClock timeZone={location.timeZone} />
              </p>
            </div>
            <p className="max-w-[46ch] text-sm leading-relaxed text-white/75">{location.blurb}</p>
          </motion.div>
        </AnimatePresence>

        {/* Supporting strip */}
        <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3">
            {location.thumbs.map((thumb, i) => (
              <motion.div
                key={`${index}-${thumb.src}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 * i }}
                className="relative aspect-[4/3] w-[58vw] shrink-0 overflow-hidden bg-black sm:w-[34vw] lg:w-[19vw]"
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt}
                  fill
                  sizes="(max-width: 640px) 58vw, (max-width: 1024px) 34vw, 19vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
