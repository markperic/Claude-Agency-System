"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

type Member = { name: string[]; role: string; bio: string; image: { src: string; alt: string } };

const TEAM: Member[] = [
  {
    name: ["Rowan", "Adeyemi"],
    role: "Founder & principal",
    image: PLACEHOLDER_IMAGES.person08,
    bio: "Fifteen years turning marketing spend into qualified demand, now spent making sure the right buyer sees the right asset first.",
  },
  {
    name: ["Sivan", "Kaur"],
    role: "Director of sales",
    image: PLACEHOLDER_IMAGES.person11,
    bio: "A decade of negotiation across three markets, with the instinct for when a deal is genuinely finished and when it only looks that way.",
  },
  {
    name: ["Tobias", "Lindqvist"],
    role: "Project director",
    image: PLACEHOLDER_IMAGES.person07,
    bio: "Runs the models, the forecasts, and the long-range planning that keep a portfolio defensible five years out rather than five months.",
  },
  {
    name: ["Marisol", "Ferrer"],
    role: "Head of client care",
    image: PLACEHOLDER_IMAGES.person05,
    bio: "Owns everything that happens after signature — handover, residency, and the hundred small things nobody warns you about.",
  },
];

const slide = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Module 94 — Team, Split Slider
 * A full-height split panel: portrait on one side, name and biography on the
 * other, advanced with prev/next. Both halves swap on the same beat but
 * travel in opposite vertical directions, which reads as one card being
 * turned over rather than two independent panels changing.
 *
 * Direction is tracked in state and passed to the variants as a custom
 * value, so stepping backwards genuinely reverses the motion instead of
 * replaying the forward animation. `mode="popLayout"` keeps the outgoing
 * half in flow while the incoming one arrives, so the panel never collapses
 * mid-transition.
 *
 * Runs on interaction, not scroll — no pin, no `useScroll`.
 */
export default function TeamSplitSlider({
  eyebrow = "The team",
}: {
  eyebrow?: string;
}) {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);

  const paginate = (step: number) =>
    setState(([i]) => [(i + step + TEAM.length) % TEAM.length, step]);

  const member = TEAM[index];

  return (
    <section className="relative bg-[#0a0a0a] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Portrait half */}
        <div className="relative min-h-[52vh] overflow-hidden bg-black lg:min-h-screen">
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={member.image.src}
                alt={member.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Copy half */}
        <div className="relative flex flex-col justify-between overflow-hidden p-6 md:p-10">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/50">
            {eyebrow}
          </p>

          <div className="py-12">
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.9, ease: EASE }}
              >
                <h3 className="text-[clamp(2.25rem,5vw,4.25rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.05em]">
                  {member.name.map((part) => (
                    <span key={part} className="block">
                      {part}
                    </span>
                  ))}
                </h3>
                <p className="mt-6 text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#c96a63]">
                  {member.role}
                </p>
                <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-white/70">{member.bio}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between border-t border-white/15 pt-6">
            <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-white/50">
              {String(index + 1).padStart(2, "0")} / {String(TEAM.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous team member"
                className="rounded-full border border-white/25 px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next team member"
                className="rounded-full border border-white/25 px-5 py-2.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
