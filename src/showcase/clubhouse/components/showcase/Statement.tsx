"use client";

import { motion, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useDetached, useScrollValue } from "@/showcase/clubhouse/lib/motion";
import { colour } from "./palette";

/**
 * Pinned statement on a colour field (Atmos). The background morphs from one palette colour to another
 * while the statement fills in word by word. Wrap words in *asterisks* to accent them.
 */
export function Statement({ eyebrow, text, from = "cream", to = "paddock" }: { eyebrow?: string; text?: string; from?: string; to?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const a = colour(from);
  const b = colour(to);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useDetached(scrollYProgress);
  const bg = useScrollValue(p, [0.15, 0.45], [a.bg, b.bg]);
  const fg = useScrollValue(p, [0.15, 0.45], [a.fg, b.fg]);

  if (!text) return null;
  const words = parseWords(text);

  if (reduce) {
    return (
      <section ref={ref} className="py-32" style={{ background: b.bg, color: b.fg }}>
        <p className="mx-auto max-w-5xl px-4 text-center font-display text-4xl leading-tight sm:text-6xl">{text.replace(/\*/g, "")}</p>
      </section>
    );
  }

  return (
    <motion.section ref={ref} className="relative h-[230svh]" style={{ background: bg, color: fg }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center px-4 text-center sm:px-8">
        {eyebrow && (
          <p className="eyebrow mb-8" style={{ color: b.accent }}>
            {eyebrow}
          </p>
        )}
        <p className="max-w-6xl font-display text-[2.6rem] leading-[1.06] [text-wrap:balance] sm:text-7xl lg:text-[6.2rem]" aria-label={text.replace(/\*/g, "")}>
          {words.map((w, i) => (
            <Word key={i} p={p} i={i} n={words.length} accent={b.accent} word={w.word} emph={w.emph} />
          ))}
        </p>
      </div>
    </motion.section>
  );
}

function parseWords(text: string) {
  const out: { word: string; emph: boolean }[] = [];
  let inEmph = false;
  for (const raw of text.split(/\s+/)) {
    const opens = raw.startsWith("*");
    const closes = /\*[.,!?;:]*$/.test(raw) && (raw.length > 1 || inEmph);
    out.push({ word: raw.replace(/\*/g, ""), emph: inEmph || opens });
    if (opens) inEmph = true;
    if (closes) inEmph = false;
  }
  return out;
}

function Word({ p, i, n, word, emph, accent }: { p: MotionValue<number>; i: number; n: number; word: string; emph: boolean; accent: string }) {
  const start = 0.32 + (i / n) * 0.5;
  const opacity = useScrollValue(p, [start, start + 0.5 / n + 0.04], [0.14, 1]);
  return (
    <motion.span aria-hidden className="mr-[0.22em] inline-block" style={{ opacity, color: emph ? accent : undefined }}>
      {word}
    </motion.span>
  );
}
