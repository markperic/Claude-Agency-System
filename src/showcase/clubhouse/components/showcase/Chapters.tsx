"use client";

import { motion, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useDetached, useIsDesktop, useScrollValue } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { colour } from "./palette";

export type Chapter = {
  key: string;
  title: string;
  kicker?: string;
  text?: string;
  image?: Img;
  colour?: string;
  cta?: { label: string; href: string };
};

/**
 * Venue chapters (Atmos "01 Dry Season" pattern): full-screen colour cards that pin in turn.
 * Each new chapter slides up over the last, which sinks back — scaling down and tilting away in perspective.
 * One scroll progress for the whole stack; chapter i is "covered" over [i/(n-1), (i+1)/(n-1)].
 * Below md the cards simply stack (no pinning), keeping their colour fields.
 */
export function Chapters({ items }: { items: Chapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useDetached(scrollYProgress);
  const n = items.length;

  return (
    <div ref={ref} className="relative bg-forest-deep">
      {items.map((c, i) => (
        <ChapterCard key={c.key} c={c} i={i} n={n} p={p} still={!!reduce || !desktop || i === n - 1} />
      ))}
    </div>
  );
}

function ChapterCard({ c, i, n, p, still }: { c: Chapter; i: number; n: number; p: MotionValue<number>; still: boolean }) {
  const pal = colour(c.colour);
  const span = n > 1 ? 1 / (n - 1) : 1;
  const from = i * span;
  const to = Math.min(1, from + span);
  const scale = useScrollValue(p, [from, to], [1, 0.84]);
  const rotateX = useScrollValue(p, [from, to], [0, 9]);
  const dim = useScrollValue(p, [from, to], [0, 0.6]);
  const imgY = useScrollValue(p, [Math.max(0, from - span), to], ["-6%", "6%"]);
  const num = String(i + 1).padStart(2, "0");

  return (
    <section id={c.key} className="relative md:sticky md:top-0 md:h-[100svh]" style={{ perspective: 1400 }} aria-label={c.title}>
      <motion.div
        className="relative flex h-full min-h-[100svh] origin-top flex-col overflow-hidden md:min-h-0"
        style={{ background: pal.bg, color: pal.fg, ...(still ? {} : { scale, rotateX }) }}
      >
        <div className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col px-4 pb-10 pt-28 sm:px-8 md:pb-10 md:pt-44">
          <div className="flex items-start justify-between gap-6">
            <span className="font-display text-6xl leading-none tabular-nums sm:text-8xl lg:text-[9rem]" style={{ color: pal.accent }}>
              {num}
            </span>
            <h2 className="text-right font-display text-5xl leading-[0.95] [text-wrap:balance] sm:text-7xl lg:text-[8.5rem]">{c.title}</h2>
          </div>

          <div className="mt-10 grid items-start gap-8 md:mt-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4 lg:col-span-3">
              {c.kicker && (
                <p className="eyebrow mb-4" style={{ color: pal.accent }}>
                  {c.kicker}
                </p>
              )}
              {c.text && <p className="text-base leading-relaxed sm:text-lg" style={{ color: pal.fg }}>{c.text}</p>}
              {c.cta?.label && (
                <a
                  href={c.cta.href}
                  className="btn group mt-8 transition-[filter,gap] hover:gap-3 hover:brightness-110"
                  style={{ background: pal.accent, color: pal.bg }}
                >
                  {c.cta.label} <span aria-hidden>→</span>
                </a>
              )}
            </div>
            {c.image && (
              <div className="relative aspect-[16/10] overflow-hidden md:col-span-8 md:col-start-5 md:aspect-auto md:h-[46svh] lg:col-span-8 lg:col-start-5">
                <motion.div className="absolute inset-[-8%_0]" style={still ? undefined : { y: imgY }}>
                  <ClubImage image={c.image} fill className="object-cover" sizes="(min-width: 768px) 66vw, 100vw" />
                </motion.div>
              </div>
            )}
          </div>
        </div>
        {!still && <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />}
      </motion.div>
    </section>
  );
}
