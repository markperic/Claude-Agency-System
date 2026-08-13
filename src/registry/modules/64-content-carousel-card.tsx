"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 64 — Content, Carousel Card
 * One large image + copy card at a time, stepped through with prev/next
 * controls and dot pagination. Local carousel state, not part of the A–J
 * catalog — same pattern as module 28's tabs. Adapted from 21st.dev's
 * Carousel Card (abishek1512): stock photo URLs swapped for this repo's
 * usual gradient placeholders, and lorem ipsum swapped for real copy, so a
 * client project can drop real images straight into the placeholder divs.
 */
const CARDS = [
  {
    id: 1,
    gradient: "from-zinc-100 to-zinc-200",
    content:
      "Every page starts the same way: pick modules by number, not by describing a layout from scratch. Module 2 for the hero, module 5 for the pitch, module 9 for pricing — each one already responsive, already on-brand, already tested against the rest of the catalog.",
  },
  {
    id: 2,
    gradient: "from-zinc-200 to-zinc-300",
    content:
      "Clients sign off on a wireframe built from real, working sections instead of a static mockup — so the thing they approve is the thing that ships. No gap between the comp and the code, no surprises when the page goes live.",
  },
  {
    id: 3,
    gradient: "from-zinc-100 to-zinc-300",
    content:
      "Ten named animation effects, used consistently everywhere instead of invented per section. A hero on Effect B and a feature grid on Effect F still feel like they belong to the same product, because they're pulling from the same small vocabulary.",
  },
  {
    id: 4,
    gradient: "from-zinc-200 to-zinc-200",
    content:
      "Nothing here is a one-off. A module built for one client project is just as usable on the next one — swap the copy, the colors, the images, and the section still holds together the way it was designed to.",
  },
  {
    id: 5,
    gradient: "from-zinc-100 to-zinc-200",
    content:
      "The catalog isn't fixed at fifteen or sixty sections — it grows as new patterns get built, numbered, and added to the manifest. Every module added this month is available to every project started next month.",
  },
];

export default function ContentCarouselCard() {
  const [index, setIndex] = useState(0);
  const card = CARDS[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + CARDS.length) % CARDS.length);
  }

  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          One card at a time, worth reading in full
        </ScrollReveal>

        <div className="relative mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-200 sm:grid-cols-2"
            >
              <div className={cn("aspect-4/3 bg-gradient-to-br sm:aspect-auto", card.gradient)} />
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="text-sm font-medium text-zinc-400">
                  {String(card.id).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg text-zinc-700">{card.content}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous card"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-2">
              {CARDS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to card ${i + 1}`}
                  className={cn("h-2 w-2 rounded-full transition-colors", i === index ? "bg-zinc-950" : "bg-zinc-300")}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Next card"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
