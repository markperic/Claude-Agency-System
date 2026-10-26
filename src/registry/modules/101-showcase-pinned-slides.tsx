"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  easeInOut,
  easeOut,
  type MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 101 — Showcase, Pinned Service Slides
 * Full-screen service slides on one pinned stage. Each slide is a 50/50
 * split: a large title, tagline and dot points on the left, an image on the
 * right (stacked on mobile). The slides sit side by side on one track inside
 * a pinned full-screen stage; scroll holds on a slide, then slides the whole
 * track sideways to the next (hold, slide, hold, slide…). Prev/next arrows
 * and a "01 / 04" counter sit bottom-left.
 *
 * Originally built as the second half of a client's "What we do" section and
 * lifted out here as a reusable module. Client copy, photography and brand
 * colours are replaced with neutral defaults; everything client-specific is
 * a prop.
 *
 * Scroll budget (in vh) is `HOLD_VH` per slide plus `SLIDE_VH` per slide-over,
 * so the pin's total length is derived from how many slides there are — adding
 * or removing a slide re-times everything on its own.
 *
 * Each title is a stack of chunks (`title: ["Prod", "uction"]`) that rise out
 * of a clipped box as their slide slides in, staggered line by line. The
 * type is sized from the column it sits in (container-query units, so the
 * widest chunk exactly fills the column) and also capped by a height budget
 * split across its lines, so a three-line title can't push the bullets off
 * screen or, on the stacked mobile layout, eat into the image. The widths come
 * from `CAP_EM`, a rough table of capital-letter advance widths for a heavy
 * geometric sans — it only needs to rank chunks by width, not be exact, so
 * it is fine for other fonts of similar proportions.
 *
 * Scroll progress is re-published through a plain motion value (`p`) rather
 * than using `scrollYProgress` directly, so the multi-stop ranges run on the
 * JS clock instead of being handed to the browser as native scroll-timeline
 * animations, which don't honour every one of them consistently.
 *
 * Images use `unoptimized` for .gif/.webp so Next doesn't flatten an
 * animation, and every slide after the first is `eager`: slides sit
 * off-screen to the side of the pinned track, so lazy loading would only
 * start fetching as one slides into view. A slide's image can set
 * `fit: "contain"` plus a matching `bg` to show a whole image with a flat
 * background (e.g. a product on a solid colour) without cropping it.
 *
 * Reduced motion gets the slides as ordinary stacked full-screen sections
 * instead. Bespoke scroll choreography, not part of the A–K effect catalog,
 * same reasoning as modules 80, 99 and 100.
 */

export type ServiceSlide = {
  /** Plain name, for accessibility labels and keys. */
  name: string;
  /** Heading split into stacked chunks, e.g. ["Crea", "tive"]. */
  title: string[];
  tagline: string;
  points: string[];
  image: {
    src: string;
    alt: string;
    /** "cover" (default) fills the panel; "contain" shows the whole image. */
    fit?: "cover" | "contain";
    /** Panel colour behind the image — matters for "contain". */
    bg?: string;
  };
};

const DEFAULT_SLIDES: ServiceSlide[] = [
  {
    name: "Strategy",
    title: ["Strategy"],
    tagline: "Where you’re headed",
    points: ["Research + Discovery", "Positioning", "Roadmaps", "Measurement"],
    image: { ...PLACEHOLDER_IMAGES.portrait07, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Design",
    title: ["De", "sign"],
    tagline: "How you look",
    points: [
      "Identity Systems",
      "Interface Design",
      "Illustration",
      "Motion Design",
      "Packaging",
      "Presentation Design",
      "Design Guidelines",
    ],
    image: { ...PLACEHOLDER_IMAGES.wallpaperPortrait03, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Production",
    title: ["Prod", "uction"],
    tagline: "How it gets made",
    points: ["Photography", "Videography", "Print + Finishing", "Installation", "Prototyping"],
    image: { ...PLACEHOLDER_IMAGES.portrait05, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Growth",
    title: ["Growth"],
    tagline: "How you’re found",
    points: [
      "Campaign Planning",
      "Social Media",
      "Paid Advertising",
      "Email Marketing",
      "Community",
      "SEO",
      "Analytics + Reporting",
    ],
    image: { ...PLACEHOLDER_IMAGES.portrait02, fit: "cover", bg: "#e4e4e7" },
  },
];

const DEFAULT_FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Scroll budget, in vh: how long each slide holds, and how long each slide-over takes. */
const HOLD_VH = 55;
const SLIDE_VH = 70;
const spanVh = (n: number) => n * HOLD_VH + (n - 1) * SLIDE_VH;

/**
 * One chunk of a heading, rising out of the clipped heading box (the
 * "horizon" is the box's bottom edge) as scroll brings its slide in. `from`
 * and `to` are progress values (0-1) for the whole pinned section.
 */
function RiseLine({
  p,
  text,
  lineIndex,
  lineCount,
  from,
  to,
}: {
  p: MotionValue<number>;
  text: string;
  lineIndex: number;
  lineCount: number;
  from: number;
  to: number;
}) {
  // Each line starts just below the box's bottom edge, and the lines are
  // staggered across the rise window.
  const stagger = (to - from) * 0.12 * lineIndex;
  const startEm = (lineCount - lineIndex) * 0.86 + 0.1;
  const y = useTransform(p, [from + stagger, to], [`${startEm}em`, "0em"], { ease: easeOut });
  return (
    <motion.span aria-hidden className="block" style={{ y }}>
      {text}
    </motion.span>
  );
}

/**
 * Approximate advance widths (em) of heavy geometric-sans capitals, already
 * scaled to include the tight tracking used on the headings. Only used to
 * work out which chunk of a heading is widest so the type can be sized to
 * fill the column — it doesn't need to be exact, just proportionate.
 */
const CAP_EM: Record<string, number> = {
  A: 0.7, B: 0.67, C: 0.69, D: 0.7, E: 0.58, F: 0.55, G: 0.74, H: 0.72, I: 0.27, J: 0.48,
  K: 0.69, L: 0.53, M: 0.88, N: 0.72, O: 0.77, P: 0.65, Q: 0.77, R: 0.67, S: 0.62, T: 0.56,
  U: 0.7, V: 0.69, W: 0.98, X: 0.69, Y: 0.65, Z: 0.62,
};
const chunkEm = (chunk: string) =>
  [...chunk.toUpperCase()].reduce((sum, ch) => sum + (CAP_EM[ch] ?? 0.7), 0);

function SlideView({
  slide,
  index,
  total,
  pinned,
  p,
}: {
  slide: ServiceSlide;
  index: number;
  total: number;
  pinned: boolean;
  /** Pinned section progress; when given, the heading rises in on scroll. */
  p?: MotionValue<number>;
}) {
  // The rise starts as the slide is half-way in and finishes early in its hold.
  const span = spanVh(total);
  const holdStart = (index * (HOLD_VH + SLIDE_VH)) / span;
  const riseFrom = Math.max(0, holdStart - (SLIDE_VH * 0.5) / span);
  const riseTo = holdStart + (HOLD_VH * 0.4) / span;
  const { image } = slide;
  const fit = image.fit ?? "cover";
  return (
    <section
      aria-label={slide.name}
      className={
        pinned
          ? "grid h-full shrink-0 grid-cols-1 grid-rows-[auto_1fr] bg-(--slides-bg) min-[981px]:grid-cols-2 min-[981px]:grid-rows-1"
          : "grid min-h-screen grid-cols-1 bg-(--slides-bg) min-[981px]:grid-cols-2"
      }
      style={pinned ? { width: `${100 / total}%` } : undefined}
    >
      <div className="flex items-center px-6 pt-24 pb-6 min-[981px]:px-12 min-[981px]:pt-24 min-[981px]:pb-28">
        {/* Stacked layout (< 981px): title + tagline in the left column, dot
            points in the right, image underneath. Desktop: one column, all
            three stacked. */}
        <div className="grid w-full grid-cols-2 items-start gap-x-4 sm:gap-x-8 min-[981px]:block">
          <div className="min-w-0 [container-type:inline-size]">
            {/* Stacked chunks at every width, sized so the widest chunk fills
                the column (cqw = % of the column width) — but also capped by a
                height budget (--title-vh) split across the lines, so a
                three-line heading can't push the bullets off screen or, on the
                stacked layout, eat into the image's height. */}
            <h2
              aria-label={slide.name}
              style={{
                fontSize: `min(${(95 / Math.max(...slide.title.map(chunkEm))).toFixed(2)}cqw, calc(var(--title-vh) / ${(slide.title.length * 0.86).toFixed(2)}), 13rem)`,
              }}
              className="overflow-hidden pr-[0.04em] pb-[0.04em] leading-[0.86] font-extrabold tracking-[-0.03em] text-(--slides-accent) uppercase [--title-vh:24vh] min-[981px]:[--title-vh:32vh]"
            >
              {slide.title.map((chunk, i) =>
                p ? (
                  <RiseLine
                    key={chunk}
                    p={p}
                    text={chunk}
                    lineIndex={i}
                    lineCount={slide.title.length}
                    from={riseFrom}
                    to={riseTo}
                  />
                ) : (
                  <span key={chunk} aria-hidden className="block">
                    {chunk}
                  </span>
                ),
              )}
            </h2>

            {/* One line, sized to the column the same way as the heading
                (regular-weight caps average ~0.62em per letter, plus a margin). */}
            <p
              style={{
                ["--tag" as string]: `min(${(95 / (slide.tagline.length * 0.64)).toFixed(2)}cqw, 2.25rem)`,
              }}
              className="mt-3 text-[clamp(0.85rem,2.6vw,1.5rem)] leading-tight text-(--slides-ink) uppercase min-[981px]:mt-5 min-[981px]:text-[length:var(--tag)] min-[981px]:leading-none min-[981px]:whitespace-nowrap"
            >
              {slide.tagline}
            </p>
          </div>
          <ul className="mt-1 text-[clamp(0.8rem,2.5vw,1.4rem)] leading-[1.15] font-semibold text-(--slides-ink) min-[981px]:mt-8 min-[981px]:text-[clamp(1rem,2.6vw,2.6rem)] min-[981px]:leading-[1.12]">
            {slide.points.map((point) => (
              <li key={point} className="flex gap-[0.45em]">
                <span aria-hidden>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`relative ${pinned ? "min-h-0" : "h-[70vh] min-[981px]:h-auto"}`}
        style={{ backgroundColor: image.bg ?? "#e4e4e7" }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 981px) 50vw, 100vw"
          unoptimized={/\.(gif|webp)$/.test(image.src)}
          loading={index === 0 ? undefined : "eager"}
          priority={index === 0}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
    </section>
  );
}

function PinnedSlides({ slides, id, navTheme, vars }: { slides: ServiceSlide[]; id?: string; navTheme?: string; vars: CSSProperties }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // Mirror progress into a plain motion value — see the docblock.
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));

  // hold, slide, hold, slide … as stops along 0-1 of the pinned scroll.
  // Within a hold the output is flat; between one hold's end and the next
  // hold's start it eases from one slide's offset to the next.
  const n = slides.length;
  const SPAN_VH = spanVh(n);
  const inputRange: number[] = [];
  const outputRange: string[] = [];
  for (let i = 0; i < n; i++) {
    const holdStart = (i * (HOLD_VH + SLIDE_VH)) / SPAN_VH;
    const holdEnd = holdStart + HOLD_VH / SPAN_VH;
    inputRange.push(holdStart, holdEnd);
    outputRange.push(`${(-100 / n) * i}%`, `${(-100 / n) * i}%`);
  }
  const x = useTransform(p, inputRange, outputRange, { ease: easeInOut });

  // Which slide is showing (switches at the midpoint of each slide-over).
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const t = v * SPAN_VH;
    setCurrent(Math.min(n - 1, Math.max(0, Math.floor((t + SLIDE_VH / 2) / (HOLD_VH + SLIDE_VH)))));
  });

  // Arrows scroll the page to the middle of the target slide's hold, so the
  // track's scroll-linked position lands exactly on it.
  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const target = ((i * (HOLD_VH + SLIDE_VH) + HOLD_VH / 2) / SPAN_VH) * span;
    window.scrollTo({ top: top + target, behavior: "smooth" });
  };
  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--slides-ink)_25%,transparent)] bg-(--slides-bg) text-(--slides-ink) transition-colors hover:border-(--slides-accent) hover:bg-(--slides-accent) hover:text-white disabled:pointer-events-none disabled:opacity-30 min-[981px]:size-12";

  return (
    <section
      id={id}
      ref={sectionRef}
      data-nav-theme={navTheme}
      className="relative"
      style={{ ...vars, height: `${SPAN_VH + 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x, width: `${n * 100}%` }} className="flex h-full">
          {slides.map((slide, i) => (
            <SlideView key={slide.name} slide={slide} index={i} total={n} pinned p={p} />
          ))}
        </motion.div>

        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 min-[981px]:bottom-10 min-[981px]:left-12">
          <button
            type="button"
            aria-label="Previous service"
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
            className={arrow}
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            disabled={current === n - 1}
            onClick={() => goTo(current + 1)}
            className={arrow}
          >
            <ArrowRight className="size-5" />
          </button>
          <p
            aria-live="polite"
            className="ml-1 rounded-full bg-(--slides-bg) px-2 py-1 text-sm font-semibold tracking-wide text-(--slides-ink) tabular-nums"
          >
            {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

export type ShowcasePinnedSlidesProps = {
  /** The slides, in order. Default: four sample services with placeholder photos. */
  slides?: ServiceSlide[];
  /** Title and hover colour. */
  accent?: string;
  /** Tagline, bullets and arrow-button text colour. */
  ink?: string;
  /** Slide and button background. */
  background?: string;
  /** CSS font-family stack for everything in the section. */
  fontFamily?: string;
  /** Optional element id, for in-page nav links. */
  id?: string;
  /** Optional `data-nav-theme` value ("light" on a light background) for sites whose fixed header reads it. */
  navTheme?: string;
};

export default function ShowcasePinnedSlides({
  slides = DEFAULT_SLIDES,
  accent = "#1d4ed8",
  ink = "#18181b",
  background = "#f5f4f1",
  fontFamily = DEFAULT_FONT_FAMILY,
  id,
  navTheme,
}: ShowcasePinnedSlidesProps = {}) {
  const reduceMotion = useReducedMotion();
  const vars = {
    "--slides-accent": accent,
    "--slides-ink": ink,
    "--slides-bg": background,
    fontFamily,
  } as CSSProperties;

  if (reduceMotion) {
    return (
      <div id={id} data-nav-theme={navTheme} style={vars}>
        {slides.map((slide, i) => (
          <SlideView key={slide.name} slide={slide} index={i} total={slides.length} pinned={false} />
        ))}
      </div>
    );
  }
  return <PinnedSlides slides={slides} id={id} navTheme={navTheme} vars={vars} />;
}
