"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { PLACEHOLDER_IMAGES, type PlaceholderImage } from "@/registry/lib/placeholder-images";

export type FilmstripItem = {
  title: string;
  credit: string;
  meta: string[];
  accent: string;
  image: PlaceholderImage;
};

const DEFAULT_ITEMS: FilmstripItem[] = [
  { title: "Orbit\nLine", credit: "OPENING NIGHT", meta: ["FRI JUN 12", "8 PM", "STUDIO ONE"], accent: "#1b3a6b", image: PLACEHOLDER_IMAGES.landscape06 },
  { title: "Hollow\nStars", credit: "LATE SESSION", meta: ["SAT JUN 13", "10 PM", "THE ANNEX"], accent: "#4b2e83", image: PLACEHOLDER_IMAGES.landscape13 },
  { title: "Slot\nCanyon", credit: "AFTER HOURS", meta: ["SAT JUN 13", "1 AM", "THE ANNEX"], accent: "#2a2a5e", image: PLACEHOLDER_IMAGES.landscape04 },
  { title: "Fluid\nBloom", credit: "MAIN STAGE", meta: ["SUN JUN 14", "6 PM", "STUDIO ONE"], accent: "#b23a6b", image: PLACEHOLDER_IMAGES.wallpaperPortrait01 },
  { title: "Marble\nRibbon", credit: "CLOSING SET", meta: ["SUN JUN 14", "11 PM", "THE ANNEX"], accent: "#5b3fa0", image: PLACEHOLDER_IMAGES.wallpaperPortrait03 },
  { title: "Lone\nTree", credit: "SUNRISE SESSION", meta: ["MON JUN 15", "5 AM", "OVERLOOK"], accent: "#1f4b5e", image: PLACEHOLDER_IMAGES.portrait04 },
  { title: "Blue\nHour", credit: "ROAD SESSION", meta: ["MON JUN 15", "9 PM", "STUDIO ONE"], accent: "#1c3f6e", image: PLACEHOLDER_IMAGES.landscape11 },
];

const DESKTOP_VISIBLE = 5;
const MOBILE_VISIBLE = 3;

type ConfettiPiece = {
  x: number;
  y: number;
  size: number;
  color: string;
  vy: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotation: number;
  rotSpeed: number;
};

/**
 * A continuous, looping confetti fall — not a one-shot burst, since this
 * sits behind a persistent hero rather than firing on an event. Canvas
 * rather than N animated DOM nodes: ~70 pieces redrawn every frame is
 * cheap on canvas and would be needless layout/paint work as individual
 * motion.divs. Skips entirely under prefers-reduced-motion, same check
 * modules 66/68/70/71 already do for their own animations.
 */
function ConfettiField({ colors }: { colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let pieces: ConfettiPiece[] = [];
    const COUNT = 70;

    const makePiece = (randomizeY: boolean): ConfettiPiece => ({
      x: Math.random() * width,
      y: randomizeY ? Math.random() * height : -20,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffffff",
      vy: 22 + Math.random() * 26,
      swayAmp: 12 + Math.random() * 18,
      swayFreq: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 2,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      // setTransform, not scale — scale compounds on every resize call
      // since the canvas context isn't reset between them.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pieces = Array.from({ length: COUNT }, () => makePiece(true));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (const p of pieces) {
        p.y += p.vy * dt;
        p.rotation += p.rotSpeed * dt;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        const sway = Math.sin(p.y * 0.01 * p.swayFreq + p.phase) * p.swayAmp;
        ctx.save();
        ctx.translate(p.x + sway, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [colors]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}

/**
 * Module 99 — Hero, Filmstrip Carousel
 * A full-bleed hero over an ambient wallpaper backdrop — three blurred,
 * slowly-drifting gradient blobs (the same `animate-aurora` keyframe as
 * module 18) sampled from the item accents, plus a per-active-item colour
 * wash that crossfades on focus change, a dark vignette, and a continuous
 * confetti fall. Below it a filmstrip of items shares one top edge; the
 * focused card unfurls to ~34vh tall and grows to 1.6x flex-width while the
 * rest stay clipped to ~16vh at 1x width, so the strip reads as an
 * equalizer rather than a plain row of thumbnails, and the focused card
 * lands close to a portrait photo aspect instead of a tall sliver. Drag the
 * strip, click a card, use the prev/next arrows, or arrow keys — all move
 * focus by one.
 *
 * Only a window of items renders at once — DESKTOP_VISIBLE (5, so the
 * focused card plus two either side) and MOBILE_VISIBLE (3, focused plus
 * one either side, via `hidden sm:block` on the two outermost desktop
 * slots) — rather than the full item count. Fewer, larger slots is what
 * gets the focused card closer to a normal photo aspect: cramming all of
 * `items` across the strip forces every card thinner the more there are.
 * The window still comes out of `centered` (below), so it's always the
 * true nearest neighbours of the focused card, not a fixed array slice.
 *
 * The backdrop is deliberately not the focused item's own photo blown up —
 * showing the same photo twice at once (full-bleed behind, and sharp in the
 * filmstrip) reads as repetitive rather than rich, so the backdrop is fully
 * decoupled from `image` and never loads the full-size photos at all — only
 * the filmstrip's ~35vw thumbnails do, which is also strictly less image
 * weight than crossfading `items.length` full-bleed photos every render.
 *
 * Deliberately not wheel-driven, unlike module 71's depth carousel. An
 * earlier version captured wheel input (native non-passive listener +
 * data-lenis-prevent, to stop both the browser's native scroll and
 * site-wide Lenis from also scrolling the page underneath it) so scrolling
 * over the hero drove the carousel instead. In practice that trapped the
 * user: since this hero is a full h-screen section, there was no way to
 * wheel-scroll past it without first dragging the scrollbar or knowing to
 * move the mouse off the hero. Prev/next arrow buttons on the filmstrip
 * replace that as the discoverable click-based way to step through without
 * needing to hit a thumbnail precisely — wheel now scrolls the page like
 * everywhere else on the site.
 *
 * Drag is accumulator-based rather than continuous like module 71's depth
 * carousel — this carousel only ever needs to land on a whole card (there's
 * no in-between depth position to render), so a distance threshold that
 * fires one discrete step is simpler than tracking a fractional position
 * and tweening it back to rest.
 *
 * Fully custom interaction (drag/keyboard/arrow-buttons + the height tween
 * on the focused card), not part of the A–K effect catalog — same call as
 * modules 71, 68, and 69 for carousels with per-frame positioning math.
 *
 * primaryCta/secondaryCta are optional and render as a persistent pill pair
 * under the title block, for pages that want a hero-level call to action
 * alongside the carousel. `confetti` defaults on; set false to keep the
 * wallpaper backdrop without the falling pieces.
 *
 * The filmstrip keeps the focused card centred at all times rather than
 * wherever its index falls in `items` — `centered` (below) is `items`
 * rotated so `active` always lands at the middle slot, re-derived every
 * render. Cards keep their identity across the reorder via the `key` (each
 * item's image src), so React reorders existing DOM nodes on a key match
 * instead of remounting, which is what lets `layout="position"` on each
 * motion.button FLIP-animate the slide into its new slot.
 *
 * Both the per-item colour wash and the filmstrip card height are driven by
 * Motion's `animate` prop alone, which is JS-applied post-hydration — so
 * each also carries a matching CSS class/utility (opacity-0/100, h-[16vh])
 * as a synchronous fallback. Without it, every wash layer paints fully
 * visible for the first frame (all stacked at the browser's default opacity
 * 1) and every filmstrip card collapses to 0 height, which is also what was
 * tripping Next's Image "fill has a height of 0" and stale-LCP-candidate
 * warnings before this was added.
 */
export default function HeroFilmstripCarousel({
  items = DEFAULT_ITEMS,
  brand = "STUDIO",
  primaryCta,
  secondaryCta,
  confetti = true,
}: {
  items?: FilmstripItem[];
  brand?: string;
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  confetti?: boolean;
} = {}) {
  const count = items.length;
  const [active, setActive] = useState(Math.min(3, count - 1));

  const dragRef = useRef<{ x: number } | null>(null);

  const goTo = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);
  const step = useCallback((d: number) => setActive((a) => ((a + d) % count + count) % count), [count]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 40) {
        step(dx > 0 ? -1 : 1);
        dragRef.current = { x: e.clientX };
      }
    },
    [step]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    },
    [step]
  );

  const current = items[active];
  const blobColors = [items[0].accent, items[Math.floor(count / 2)].accent, items[count - 1].accent];

  // Rotated so the active item always renders at the middle slot — the
  // filmstrip's flex order comes from array position, so centering focus
  // means reordering the array itself rather than just restyling the active
  // card. `layout="position"` lets Motion FLIP-animate each card sliding to
  // its new slot when React reorders the DOM on a key match; "position"
  // rather than the default so it only tracks x/y and doesn't fight the
  // explicit flexGrow/height tween below over which one owns size.
  const half = Math.floor(count / 2);
  const centered = Array.from({ length: count }, (_, slot) => {
    const originalIndex = (((active - half + slot) % count) + count) % count;
    return { item: items[originalIndex], originalIndex };
  });

  // Windowed to DESKTOP_VISIBLE/MOBILE_VISIBLE — see docstring. `visible` is
  // always centred on `active` because it's sliced out of `centered`, which
  // already guarantees that.
  const visibleCount = Math.min(DESKTOP_VISIBLE, count);
  const desktopHalf = Math.floor(visibleCount / 2);
  const startSlot = half - desktopHalf;
  const visible = centered.slice(startSlot, startSlot + visibleCount);
  const mobileVisibleCount = Math.min(MOBILE_VISIBLE, visibleCount);
  const mobileEdge = Math.floor((visibleCount - mobileVisibleCount) / 2);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#05060a] outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="animate-aurora absolute -left-1/4 top-[-10%] h-[60vw] w-[60vw] rounded-full opacity-40 blur-[100px]"
          style={{ backgroundColor: blobColors[0] }}
        />
        <div
          className="animate-aurora absolute right-[-15%] top-[10%] h-[55vw] w-[55vw] rounded-full opacity-35 blur-[100px] [animation-delay:-4s]"
          style={{ backgroundColor: blobColors[1] }}
        />
        <div
          className="animate-aurora absolute bottom-[-20%] left-[20%] h-[58vw] w-[58vw] rounded-full opacity-35 blur-[100px] [animation-delay:-8s]"
          style={{ backgroundColor: blobColors[2] }}
        />

        {/* opacity-0/opacity-100 classes alongside the animate prop: Motion's
            animate-only opacity is JS-applied post-hydration, so without a
            CSS-level match every wash layer would paint fully visible (all
            stacked at default opacity 1) for the first frame. */}
        {items.map((item, i) => (
          <motion.div
            key={item.image.src}
            className={`absolute inset-0 mix-blend-overlay ${i === active ? "opacity-100" : "opacity-0"}`}
            animate={{ opacity: i === active ? 0.4 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: item.accent }}
          />
        ))}

        <div className="absolute inset-0 bg-black/55" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }}
        />
        {confetti && <ConfettiField colors={blobColors} />}
      </div>

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white md:p-8">
        <span>{brand}</span>
        <span className="tabular-nums opacity-70">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute left-6 top-[24%] z-10 max-w-lg text-white md:left-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="whitespace-pre-line text-[clamp(2rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.03em]">
              {current.title}
            </h1>
            <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.15em] opacity-80">{current.credit}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] opacity-70">
              {current.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryCta && (
              <a
                href={primaryCta.href}
                target={primaryCta.external ? "_blank" : undefined}
                rel={primaryCta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-transform hover:scale-105"
              >
                {primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            {secondaryCta && (
              <a
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition-transform hover:scale-105"
              >
                {secondaryCta.label}
              </a>
            )}
          </div>
        )}
      </div>

      <div
        className="absolute inset-x-0 bottom-8 z-10 flex items-start gap-1 px-1 sm:gap-1.5 sm:px-2 md:bottom-12"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="tablist"
        aria-label="Slides"
      >
        {visible.map(({ item, originalIndex }, i) => {
          const isMobileHidden = i < mobileEdge || i >= visible.length - mobileEdge;
          return (
            <motion.button
              key={item.image.src}
              layout="position"
              type="button"
              role="tab"
              aria-selected={originalIndex === active}
              aria-label={item.title.replace("\n", " ")}
              onClick={() => goTo(originalIndex)}
              className={`relative h-[16vh] flex-1 cursor-pointer overflow-hidden rounded-xl ${isMobileHidden ? "hidden sm:block" : ""}`}
              animate={{ flexGrow: originalIndex === active ? 1.6 : 1, height: originalIndex === active ? "34vh" : "16vh" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                priority={originalIndex === active}
                sizes="35vw"
                className="object-cover"
                draggable={false}
              />
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: originalIndex === active ? 0 : 0.55, backgroundColor: "#05060a" }}
              />
            </motion.button>
          );
        })}

        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous"
          className="absolute left-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:left-3 sm:h-10 sm:w-10"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next"
          className="absolute right-2 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:right-3 sm:h-10 sm:w-10"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
