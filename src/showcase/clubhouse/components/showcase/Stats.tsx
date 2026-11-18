"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "@/showcase/clubhouse/lib/motion";
import { SplitHeading } from "../motion/SplitHeading";
import { colour } from "./palette";

type Stat = { key: string; value: number; suffix?: string; label?: string; note?: string };

/**
 * Big-number band on a palette colour. Each figure counts up as it scrolls into view;
 * years (four digits) roll forward from a few decades earlier rather than from zero.
 */
export function Stats({ eyebrow, heading, items, colour: colourKey = "night" }: { eyebrow?: string; heading?: string; items?: Stat[]; colour?: string }) {
  const pal = colour(colourKey);
  if (!items?.length) return null;
  return (
    <section className="py-24 sm:py-36" style={{ background: pal.bg, color: pal.fg }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {eyebrow && (
          <p className="eyebrow mb-5" style={{ color: pal.accent }}>
            {eyebrow}
          </p>
        )}
        <SplitHeading text={heading} className="max-w-4xl font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl" mutedClassName="opacity-40" />
        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {items.map((it, i) => (
            <StatItem key={it.key} stat={it} index={i} accent={pal.accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, index, accent }: { stat: Stat; index: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const value = stat.value ?? 0;
  const from = value >= 1000 ? value - 50 : 0;

  useEffect(() => {
    if (!reduce && num.current && !inView) num.current.textContent = String(from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(from, value, {
      duration: 2,
      delay: index * 0.12,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (num.current) num.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, value, index]);

  return (
    <div ref={ref} className="relative pt-8">
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] origin-left"
        style={{ background: accent }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: index * 0.12 }}
      />
      <p className="font-display text-7xl leading-none tabular-nums sm:text-8xl" aria-label={`${value}${stat.suffix ?? ""}`}>
        <span ref={num}>{value}</span>
        {stat.suffix && <span style={{ color: accent }}>{stat.suffix}</span>}
      </p>
      {stat.label && <p className="mt-6 font-display text-2xl leading-snug">{stat.label}</p>}
      {stat.note && <p className="mt-2 text-sm leading-relaxed opacity-70">{stat.note}</p>}
    </div>
  );
}
