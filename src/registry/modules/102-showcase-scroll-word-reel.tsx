"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Module 102 — Showcase, Scroll Word Reel
 * A pinned, full-screen closing statement over a live WebGL grain-gradient
 * blob: a brand name with a vertically scrolling word beside it ("STUDIO
 * VISION"). The reel is driven by scroll position, not a timer — as you scroll
 * through the pin it steps through the whole word list once, from the first
 * word to the last, and rests on the last one.
 *
 * Originally built as the closing section of a client's landing page, where
 * the brand was an SVG wordmark; here the brand is a text prop so the module
 * is self-contained. Client copy and brand colours are replaced with neutral
 * defaults; everything client-specific is a prop.
 *
 * The lockup sizes itself to fill its container: the brand and the word grow
 * together (one shared font size) until the *widest* word in the list would
 * overflow. Sizing off the widest word, not the visible one, is what stops
 * the layout jumping as the reel steps — a long word reserves the space a
 * short one leaves empty, and a thin line fills the gap after the short ones
 * so the row reads as deliberate. If sitting side by side would shrink the
 * type below `STACK_BELOW_F`, it stacks instead — content-driven rather than
 * a fixed breakpoint, so the switch happens when the words actually stop
 * fitting. Widths come from a hidden block measured at a reference size, so
 * text is never re-measured as the layout changes; the measure re-runs once
 * webfonts have loaded.
 *
 * `HeroShader`-style backdrop: `GrainGradient` from @paper-design/shaders-react
 * is loaded client-side only (WebGL needs a real browser; keeping it out of
 * the server bundle means it never blocks first paint), with a CSS gradient
 * standing in until it arrives or if WebGL is unavailable. Its slow rotate/
 * pulse cycle is recomputed at ~12 updates a second rather than 60 (a full
 * revolution takes about three minutes, so more is wasted React renders), it
 * stops animating while off-screen, and `maxPixelCount` caps GPU work on
 * high-DPI displays. The backdrop sits inside the *sticky* h-screen box, not
 * the outer pin section — `absolute inset-0` fills the nearest positioned
 * ancestor, and `position: sticky` qualifies as one, so it fills exactly the
 * pinned viewport-height box and stays with it instead of stretching across
 * the whole scroll track.
 *
 * Same `h-[Nvh]` + `sticky` pin technique as modules 80/84/100. `PIN_VH` has
 * to clear 100 with real room to spare: the sticky child only has
 * `PIN_VH - 100`vh of scroll to stay pinned, so anything at or below 100
 * never engages. 220 leaves 120vh across the word changes.
 *
 * Bespoke scroll choreography, not part of the A–K effect catalog, same
 * reasoning as modules 80, 99, 100 and 101.
 */

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.GrainGradient),
  { ssr: false },
);

const DEFAULT_WORDS = [
  "IDEAS",
  "STORIES",
  "DESIGN",
  "CRAFT",
  "GROWTH",
  "COMMUNITY",
  "CULTURE",
  "PURPOSE",
  "IMPACT",
  "FUTURE",
];

const DEFAULT_COLORS = ["#21223e", "#142a5e", "#193487", "#1f68c5", "#2699d9", "#3fd0e6", "#5ef0f2"];
const DEFAULT_COLOR_BACK = "#0d1a33";
const DEFAULT_FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const PIN_VH = 220;

/** Font-size ceiling for the lockup, in px. */
const MAX_F = 224;
const MIN_F = 20;
/** If side-by-side would drop the type below this (px), stack instead. */
const STACK_BELOW_F = 46;
/** Font size used purely for measurement; the real size is derived from it. */
const MEASURE_PX = 100;
/** Reel line height as a multiple of the font size — clear of the caps, so only one word shows. */
const LINE_RATIO = 1.1;

const BASE_SCALE = 2.0;
const SPEED = 0.3;
/** Twelve updates a second is visually identical to 60 for a cycle this slow. */
const FRAME_MS = 80;
/** Caps GPU work on high-DPI displays; the effect is soft enough not to show it. */
const MAX_PIXELS = 1920 * 1080;

function ShaderBackdrop({ colors, colorBack }: { colors: string[]; colorBack: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [motionState, setMotionState] = useState({ rotation: 0, scale: BASE_SCALE });

  // Stop animating once the backdrop scrolls out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || !visible) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      // Time-based, not frame-counted, so it runs at the same speed on a 120Hz screen.
      const t = ((now - start) / 1000) * 0.3;
      setMotionState({ rotation: (t * 6) % 360, scale: BASE_SCALE * (1 + 0.12 * Math.sin(t * 0.5)) });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldReduceMotion, visible]);

  // Shown before the shader mounts, and if WebGL is unavailable.
  const staticGradient = `radial-gradient(120% 100% at 50% 50%, ${colors[colors.length - 2] ?? colors[0]}, ${colors[Math.floor(colors.length / 2)] ?? colors[0]} 40%, ${colorBack} 80%)`;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{ background: colorBack }}
    >
      <div className="absolute inset-0" style={{ background: staticGradient }} />
      <div className="absolute inset-0">
        <GrainGradient
          colors={colors}
          colorBack={colorBack}
          shape="blob"
          softness={0.92}
          intensity={0.6}
          noise={0.6}
          speed={shouldReduceMotion || !visible ? 0 : SPEED}
          scale={motionState.scale}
          rotation={motionState.rotation}
          offsetX={0}
          offsetY={0}
          fit="cover"
          width="100%"
          height="100%"
          maxPixelCount={MAX_PIXELS}
        />
      </div>
    </div>
  );
}

/** The brand + a vertically scrolling word, sized to fill its container. */
function WordReelLockup({
  brand,
  words,
  index,
  lineColor,
}: {
  brand: string;
  words: string[];
  index: number;
  lineColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState({
    fontPx: MIN_F,
    stacked: false,
    /** Brand width at the reference size. */
    brandW: 0,
    /** Per-word widths at the reference size, in list order. */
    wordWidths: [] as number[],
  });
  const [ready, setReady] = useState(false);

  const layout = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    const row = rowRef.current;
    if (!container || !measure || !row) return;

    // First child is the brand, the rest are the words, in order.
    const widths = [...measure.children].map((c) => c.getBoundingClientRect().width);
    const brandW = widths[0];
    const wordWidths = widths.slice(1);
    const widest = Math.max(...wordWidths);
    if (!brandW || !widest) return;

    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    const avail = container.clientWidth;

    // One font size for both: total = (brandW + widest) * F/100 + gap.
    const inlineF = ((avail - gap) / (brandW + widest)) * MEASURE_PX;
    if (inlineF >= STACK_BELOW_F) {
      setMetrics({ fontPx: Math.min(MAX_F, inlineF), stacked: false, brandW, wordWidths });
    } else {
      // Too tight for one line: stack, sized so the wider of the two fills the width.
      const f = (avail / Math.max(brandW, widest)) * MEASURE_PX;
      setMetrics({ fontPx: Math.min(MAX_F, Math.max(MIN_F, f)), stacked: true, brandW, wordWidths });
    }
    setReady(true);
  }, []);

  // Measure after fonts land — text metrics are wrong until the real font is in.
  useLayoutEffect(() => {
    layout();
    let observer: ResizeObserver | undefined;
    const el = containerRef.current;
    if (el) {
      observer = new ResizeObserver(layout);
      observer.observe(el);
    }
    document.fonts?.ready.then(layout).catch(() => {});
    return () => observer?.disconnect();
  }, [layout, brand, words]);

  const { fontPx, stacked, wordWidths } = metrics;
  const lineH = fontPx * LINE_RATIO;
  const active = Math.min(Math.max(index, 0), words.length - 1);

  // The reel window is fixed to the widest word so the row never changes width;
  // the line fills whatever a shorter word leaves, pinned to the right edge.
  const maxWordW = wordWidths.length > 0 ? (Math.max(...wordWidths) * fontPx) / MEASURE_PX : undefined;
  const currentW = wordWidths.length > 0 ? (wordWidths[Math.min(active, wordWidths.length - 1)] * fontPx) / MEASURE_PX : undefined;
  const lineGap = fontPx * 0.1;
  const lineWidth = maxWordW !== undefined && currentW !== undefined ? Math.max(0, maxWordW - currentW - lineGap) : 0;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl overflow-hidden"
      style={{ opacity: ready ? 1 : 0, transition: "opacity .25s ease" }}
    >
      <span className="sr-only">
        {brand} {words.join(", ")}
      </span>

      {/* Off-screen measuring block: the brand then every word at a fixed
          reference size. `absolute` only clips inside this container's own
          `overflow-hidden` because the container is `relative`, and each row
          is `w-max` so it reports its own width rather than its parent's. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 w-max"
        style={{ fontSize: MEASURE_PX, lineHeight: 1 }}
      >
        <div className="w-max whitespace-nowrap" style={{ fontWeight: 800 }}>
          {brand}
        </div>
        {words.map((word, i) => (
          <div key={`${word}-${i}`} className="w-max whitespace-nowrap" style={{ fontWeight: 400 }}>
            {word}
          </div>
        ))}
      </div>

      <div
        ref={rowRef}
        aria-hidden="true"
        className={`flex gap-[clamp(8px,1.4vw,20px)] ${stacked ? "flex-col items-center" : "items-center justify-center"}`}
      >
        <span className="block leading-none font-extrabold whitespace-nowrap" style={{ fontSize: fontPx }}>
          {brand}
        </span>

        {/* The reel: a fixed-size window with a taller track sliding behind it. */}
        <div className="relative shrink-0 overflow-hidden" style={{ height: lineH, width: maxWordW }}>
          <div
            style={{
              transform: `translateY(-${active * lineH}px)`,
              transition: "transform .6s cubic-bezier(.6,.05,.2,1)",
              willChange: "transform",
            }}
          >
            {words.map((word, i) => (
              <div key={`${word}-${i}`} className="flex items-center whitespace-nowrap" style={{ height: lineH }}>
                <span className="block" style={{ fontSize: fontPx, fontWeight: 400, lineHeight: 1 }}>
                  {word}
                </span>
              </div>
            ))}
          </div>

          <div
            className="absolute top-1/2 right-0 rounded-full"
            style={{
              height: Math.max(2, fontPx * 0.03),
              width: lineWidth,
              background: lineColor,
              transform: "translateY(-50%)",
              transition: "width .6s cubic-bezier(.6,.05,.2,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export type ShowcaseScrollWordReelProps = {
  /** The brand name, set at the same size as the reel. */
  brand?: string;
  /** Words the reel steps through once as you scroll, resting on the last. */
  words?: string[];
  /** Shader gradient palette, dark to light. */
  colors?: string[];
  /** Shader backdrop base colour. */
  colorBack?: string;
  /** Brand and word colour. */
  textColor?: string;
  /** The thin line that fills the gap after a short word. */
  lineColor?: string;
  /** CSS font-family stack for the lockup. Also used to measure it, so pass the real stack. */
  fontFamily?: string;
  /** Optional element id, for in-page nav links. */
  id?: string;
  /** Optional `data-nav-theme` value for sites whose fixed header reads it. */
  navTheme?: string;
};

export default function ShowcaseScrollWordReel({
  brand = "STUDIO",
  words = DEFAULT_WORDS,
  colors = DEFAULT_COLORS,
  colorBack = DEFAULT_COLOR_BACK,
  textColor = "#ffffff",
  lineColor = "#5ef0f2",
  fontFamily = DEFAULT_FONT_FAMILY,
  id,
  navTheme,
}: ShowcaseScrollWordReelProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, words.length - 1)]);

  const [index, setIndex] = useState(0);
  useMotionValueEvent(rawIndex, "change", (latest) => {
    setIndex(Math.round(Math.min(words.length - 1, Math.max(0, latest))));
  });

  const vars = { color: textColor, fontFamily } as CSSProperties;

  return (
    <section id={id} data-nav-theme={navTheme} ref={ref} className="relative" style={{ ...vars, height: `${PIN_VH}vh` }}>
      {/* py-40, not pt-40: `items-center` centres within the *padded* box, so
          top-only padding pulls the centred content down with it. Matching
          bottom padding keeps clearance for a fixed header while leaving the
          centroid at true vertical centre. */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 py-40 min-[981px]:px-16">
        <ShaderBackdrop colors={colors} colorBack={colorBack} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <WordReelLockup brand={brand} words={words} index={index} lineColor={lineColor} />
        </motion.div>
      </div>
    </section>
  );
}
