"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  cubicBezier,
  easeInOut,
  easeOut,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Module 100 — Showcase, Scroll Text Ring
 * A pinned, full-screen scroll set piece: a two-line title ("What / we do")
 * rises from an invisible horizon, a single string of service words runs in
 * along a straight line, goes once around the title as a ring, and carries
 * straight on out the other side — then the title collapses onto one line
 * and the services resolve beneath it as a staggered list.
 *
 * Originally built for a client's "What we do" section and lifted out here
 * as a reusable module. Client copy and brand colours are replaced with
 * neutral defaults; everything that was client-specific is a prop.
 *
 * `scrollYProgress` (p, 0-1) over a 500vh pin drives three overlapping phases:
 *
 *   1. The title rises from the horizon (the bottom edge of an
 *      `overflow-hidden` box) — each line translates up out of it.
 *   2. The words run through as one continuous "text train": a single string
 *      of letters that enters from off-screen left along a straight line
 *      tangent to the top of the ring, goes once around the title, and
 *      carries on out to the right along the same line. Scroll moves every
 *      letter along the one path; there is no separate orbit or pause —
 *      halfway through, the train happens to fill the ring.
 *   3. The title collapses onto one line and the service lines resolve
 *      beneath it, the pair centred together.
 *
 * Each letter is its own element placed by distance along the path (`v`,
 * px; v<0 is the entry line, v>=0 is the circle) rather than with SVG
 * textPath, so the whole train can slide along the path. Letter widths come
 * from canvas `measureText` (re-run once webfonts load), using the same
 * `fontFamily` the letters render in. The font size is solved so the words
 * plus their dots fill exactly 360°, so it needs no per-breakpoint tuning —
 * only the radius R, which is derived from the stage size.
 *
 * Progress is re-published through a plain motion value (`p`) rather than
 * using `scrollYProgress` directly: transforms derived straight from
 * `useScroll` can be handed to the browser as native scroll-timeline
 * animations, which don't honour every one of the multi-stop ranges used
 * here consistently. Deriving from a JS-driven value keeps every phase on
 * one clock.
 *
 * Reduced motion gets the end state (title + list) as a plain static block.
 * Bespoke scroll choreography, not part of the A–K effect catalog, same
 * reasoning as modules 80 and 99.
 */

export type TextRingItem = {
  /** The word that travels around the ring, and is highlighted in the list. */
  word: string;
  /** The list line it ends on, e.g. "BUILD IDENTITY THROUGH". */
  line: string;
  /** Shorter word for the list when `word` is too long for narrow screens. */
  short?: string;
};

const DEFAULT_ITEMS: TextRingItem[] = [
  { word: "BRAND", line: "BUILD IDENTITY THROUGH" },
  { word: "CREATIVE", line: "CREATE ATTENTION THROUGH" },
  { word: "PRINT PRODUCTION", line: "SHAPE EXPERIENCE THROUGH", short: "PRINT" },
  { word: "MARKETING", line: "LEAVE A MEMORY THROUGH" },
];

const DEFAULT_FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const RING_WEIGHT = 700;
const REF_PX = 100;
const GAP_RATIO = 0.55; // space either side of a dot, relative to font size
const DOT = "•";
const PIN_VH = 500;

type RingLetter = { ch: string; v: number };
type RingLayout = { fontPx: number; letters: RingLetter[] };

function computeRing(R: number, items: TextRingItem[], fontFamily: string): RingLayout {
  const ctx = document.createElement("canvas").getContext("2d");
  const measure = (s: string) => {
    if (!ctx) return s.length * REF_PX * 0.68;
    ctx.font = `${RING_WEIGHT} ${REF_PX}px ${fontFamily}`;
    return ctx.measureText(s).width;
  };

  const dotW = measure(DOT);
  const gap = GAP_RATIO * REF_PX;
  const parts = items.map((it) => {
    const chars = [...it.word].map((ch) => ({ ch, w: measure(ch) }));
    const wordW = chars.reduce((a, c) => a + c.w, 0);
    return { chars, unitW: wordW + gap + dotW + gap };
  });
  const totalRef = parts.reduce((a, p) => a + p.unitW, 0);

  // Solve the font size so the train fills the full circumference exactly.
  const scale = (2 * Math.PI * R) / totalRef; // px per reference-px
  const fontPx = REF_PX * scale;

  // `v` is each letter's centre, in px along the path, measured from the
  // point where the entry line meets the top of the circle.
  const letters: RingLetter[] = [];
  let cursor = 0;
  for (const part of parts) {
    for (const c of part.chars) {
      const w = c.w * scale;
      if (c.ch !== " ") letters.push({ ch: c.ch, v: cursor + w / 2 });
      cursor += w;
    }
    cursor += gap * scale;
    letters.push({ ch: DOT, v: cursor + (dotW * scale) / 2 });
    cursor += dotW * scale + gap * scale;
  }

  return { fontPx, letters };
}

/**
 * Point + rotation at distance `v` along the path: the entry line (v < 0),
 * one lap of the circle, then the exit line (v past the circumference) —
 * both lines are the same tangent at the top of the ring, so the exit is
 * the entry's straight run continued to the right.
 */
function pathAt(v: number, R: number) {
  const C = 2 * Math.PI * R;
  if (v < 0) return { x: v, y: -R, rot: 0 };
  if (v > C) return { x: v - C, y: -R, rot: 0 };
  const a = v / R;
  return { x: R * Math.sin(a), y: -R * Math.cos(a), rot: (a * 180) / Math.PI };
}

function TrainLetter({
  advance,
  letter,
  R,
  fontPx,
}: {
  /** Px every letter has moved along the path from its settled position on the ring. */
  advance: MotionValue<number>;
  letter: RingLetter;
  R: number;
  fontPx: number;
}) {
  const transform = useTransform(advance, (a) => {
    const { x, y, rot } = pathAt(letter.v + a, R);
    return `translate(${x}px, ${y}px) rotate(${rot}deg) translate(-50%, -50%)`;
  });

  return (
    <motion.span
      className="absolute top-0 left-0 block leading-none whitespace-nowrap"
      style={{ fontSize: fontPx, transformOrigin: "0 0", transform }}
    >
      {letter.ch}
    </motion.span>
  );
}

function ListLine({ item, index }: { item: TextRingItem; index: number }) {
  return (
    <p
      className={`text-[clamp(0.85rem,3.3vw,2.4rem)] leading-tight whitespace-nowrap text-(--ring-ink) ${
        index % 2 === 0 ? "self-start" : "self-end"
      }`}
    >
      {item.line} <span className="ml-[0.35em] font-bold text-(--ring-accent)">{item.short ?? item.word}</span>
    </p>
  );
}

/** One list row: fades and lifts in over its own slice of the scroll range. */
function ListRow({
  p,
  item,
  index,
  start,
}: {
  p: MotionValue<number>;
  item: TextRingItem;
  index: number;
  start: number;
}) {
  const range: [number, number] = [start, start + 0.05];
  const opacity = useTransform(p, range, [0, 1]);
  const y = useTransform(p, range, [28, 0]);
  return (
    <motion.div style={{ opacity, y }} className="flex flex-col">
      <ListLine item={item} index={index} />
    </motion.div>
  );
}

const TITLE_CLASS = "font-extrabold leading-[0.88] tracking-tight text-(--ring-accent) uppercase";

export type ShowcaseTextRingProps = {
  /** Words that travel around the ring and end up in the list. Default: four sample services. */
  items?: TextRingItem[];
  /** Title first line. Default "What". */
  titleTop?: string;
  /** Title second line. Default "we do". */
  titleBottom?: string;
  /** Title and highlighted-word colour. */
  accent?: string;
  /** Ring letters and list text colour. */
  ink?: string;
  /** Section background. */
  background?: string;
  /** CSS font-family stack for the ring letters, the title and the list. Also used to measure the ring, so it must match what renders. */
  fontFamily?: string;
  /** Optional element id, for in-page nav links. */
  id?: string;
  /** Optional `data-nav-theme` value ("light" on a light background) for sites whose fixed header reads it. */
  navTheme?: string;
};

export default function ShowcaseTextRing({
  items = DEFAULT_ITEMS,
  titleTop = "What",
  titleBottom = "we do",
  accent = "#1d4ed8",
  ink = "#18181b",
  background = "#f5f4f1",
  fontFamily = DEFAULT_FONT_FAMILY,
  id,
  navTheme,
}: ShowcaseTextRingProps = {}) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Re-publish progress through a plain motion value — see the docblock.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));

  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [fontsKey, setFontsKey] = useState(0);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    document.fonts?.ready.then(() => setFontsKey((k) => k + 1)).catch(() => {});
  }, []);

  const R = size ? Math.min(size.w * 0.38, size.h * 0.33) : 0;
  const ring = useMemo(
    () => (R > 0 ? computeRing(R, items, fontFamily) : null),
    // fontsKey: re-measure once the webfont is actually available
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [R, fontsKey, items, fontFamily],
  );

  // Phase 1 — title rises from the horizon. Once it's up (p > 0.25) the clip
  // is dropped so the later one-line collapse isn't cut off at the box edge.
  const line1Y = useTransform(p, [0.0, 0.16], ["1.9em", "0em"], { ease: easeOut });
  const line2Y = useTransform(p, [0.05, 0.21], ["1.0em", "0em"], { ease: easeOut });
  const titleClip = useTransform(p, (v) => (v < 0.25 ? "inset(0px)" : "inset(-100vh -100vw)"));

  // Phase 2 — one continuous pass. `advance` runs from -travel (train fully
  // off-screen left) to +travel (fully off-screen right); `travel` is far
  // enough that the head letter starts, and the tail letter ends, outside
  // the stage. At advance = 0 the train exactly fills the ring.
  const travel = ring ? ring.letters[ring.letters.length - 1].v + (size?.w ?? 0) / 2 + R * 0.4 : 0;
  const pass = useTransform(p, [0.1, 0.6], [-1, 1], { ease: cubicBezier(0.35, 0, 0.65, 1) });
  const advance = useTransform(pass, (v) => v * travel);

  // Phase 3 — title collapses to one line and lifts away, list resolves.
  const [lineW, setLineW] = useState<{ w1: number; w2: number } | null>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const titleFont = R * 0.5;
  useLayoutEffect(() => {
    if (!line1Ref.current || !line2Ref.current) return;
    setLineW({ w1: line1Ref.current.offsetWidth, w2: line2Ref.current.offsetWidth });
  }, [titleFont, fontsKey, ring]);

  const spacePx = titleFont * 0.27;
  const { w1, w2 } = lineW ?? { w1: 0, w2: 0 };
  const oneLineW = w1 + spacePx + w2;
  const collapse: [number, number] = [0.62, 0.74];
  const slide: [number, number] = [0.62, 0.68]; // lines part sideways first…
  const line1X = useTransform(p, slide, [0, -(spacePx + w2) / 2], { ease: easeInOut });
  const line2X = useTransform(p, slide, [0, (w1 + spacePx) / 2], { ease: easeInOut });
  // …then line 2 lifts into line 1's row.
  const line2Lift = useTransform(p, [0.66, 0.72], [0, -titleFont * 0.88], { ease: easeInOut });
  const fitScale = oneLineW > 0 && size ? Math.min(1, (size.w * 0.88) / oneLineW) : 1;

  // Final layout: the one-line title + the list form a single block that is
  // vertically centred in the stage. Title and list heights are known, so
  // the block's offsets are plain arithmetic: the title sits `(gap+listH)/2`
  // above stage centre, and the list starts just below it.
  const listRef = useRef<HTMLDivElement>(null);
  const [listH, setListH] = useState(0);
  useLayoutEffect(() => {
    if (listRef.current) setListH(listRef.current.offsetHeight);
  }, [size, fontsKey, ring, items]);
  const H = size?.h ?? 0;
  const finalTitleH = titleFont * 0.88 * fitScale;
  const blockGap = Math.max(28, finalTitleH * 0.7);
  // Optical nudge: the title's line box sits taller above its capitals than
  // the list does below its last line, so the block reads slightly high.
  const optical = titleFont * 0.1;
  const listTop = H / 2 + (finalTitleH + blockGap - listH) / 2 + optical;
  const titleY = useTransform(p, collapse, [0, -(blockGap + listH) / 2 + optical], { ease: easeInOut });
  const titleScale = useTransform(p, collapse, [1, fitScale], { ease: easeInOut });

  // Rows start 0.03 apart from p = 0.68 (each takes 0.05), squeezed together
  // if there are so many that the last would run past the end of the pin.
  const rowStep = items.length > 1 ? Math.min(0.03, 0.14 / (items.length - 1)) : 0;

  const vars = {
    "--ring-accent": accent,
    "--ring-ink": ink,
    background,
    fontFamily,
  } as CSSProperties;

  if (reduceMotion) {
    return (
      <section id={id} data-nav-theme={navTheme} style={vars} className="px-6 py-24 min-[981px]:px-16">
        <h2 className={`${TITLE_CLASS} text-[clamp(3.5rem,14vw,10rem)]`}>
          {titleTop}
          <br />
          {titleBottom}
        </h2>
        <div className="mt-16 flex flex-col gap-8">
          {items.map((item, i) => (
            <ListLine key={item.word} item={item} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      data-nav-theme={navTheme}
      ref={sectionRef}
      className="relative"
      style={{ ...vars, height: `${PIN_VH}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        {/* Title. The overflow-hidden box is the "horizon": its bottom edge
            is where both lines emerge from. */}
        {ring && (
          <motion.div
            style={{ y: titleY, scale: titleScale }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.h2
              aria-label={`${titleTop} ${titleBottom}`}
              className={`${TITLE_CLASS} px-[0.06em] text-center`}
              style={{ fontSize: titleFont, clipPath: titleClip }}
            >
              <motion.span aria-hidden ref={line1Ref} className="mx-auto block w-fit" style={{ x: line1X }}>
                <motion.span className="block" style={{ y: line1Y }}>
                  {titleTop}
                </motion.span>
              </motion.span>
              <motion.span
                aria-hidden
                ref={line2Ref}
                className="mx-auto block w-fit"
                style={{ x: line2X, y: line2Lift }}
              >
                <motion.span className="block" style={{ y: line2Y }}>
                  {titleBottom}
                </motion.span>
              </motion.span>
            </motion.h2>
          </motion.div>
        )}

        {/* Train. Zero-size anchor at stage centre; every letter is placed
            from that point by its distance along the path. */}
        {ring && (
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-0 w-0 font-bold text-(--ring-ink) uppercase"
          >
            {ring.letters.map((letter, i) => (
              <TrainLetter key={i} advance={advance} letter={letter} R={R} fontPx={ring.fontPx} />
            ))}
          </div>
        )}

        {/* List */}
        <div
          ref={listRef}
          style={{ top: listTop }}
          className="absolute inset-x-0 mx-auto flex max-w-6xl flex-col gap-3 px-6 min-[981px]:gap-5 min-[981px]:px-16"
        >
          {items.map((item, i) => (
            <ListRow key={item.word} p={p} item={item} index={i} start={0.68 + i * rowStep} />
          ))}
        </div>
      </div>
    </section>
  );
}
