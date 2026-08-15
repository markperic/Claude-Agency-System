"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { animate, type Easing } from "motion/react";
import { Reveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES, type PlaceholderImage } from "@/registry/lib/placeholder-images";

/**
 * Module 71 — Gallery, Depth Carousel
 * A stack of cards receding into a CSS 3D perspective — drag, scroll-wheel,
 * arrow keys, or the prev/next controls step the focused card forward while
 * the rest fall back in depth, darken, and blur. Adapted from a community
 * DepthCarousel component. Two real adaptations from the source: GSAP was
 * dropped in favor of `animate()` from `motion/react` (already a repo
 * dependency, same swap as module 68's shader tween) to drive the fractional
 * scroll position, and the large prop-configurable API (item list, sizing,
 * depth/spread/tilt tuning, autoplay) was collapsed to a fixed default
 * config to match how every other module in this catalog is a self-contained
 * section rather than a reusable component — autoplay in particular was
 * dropped rather than left wired-up-but-off, since neither sibling gallery
 * module (68, 69) autoplays either; this one is drag/scroll/keyboard driven
 * only. The per-frame depth/opacity/blur math is kept close to verbatim —
 * dense, deliberate positioning math, not boilerplate to simplify, same call
 * as modules 66, 68, and 69. Title effect: A. The carousel itself is fully
 * custom (CSS 3D transforms + pointer drag + wheel), not part of the A–J
 * catalog.
 */

const IMAGES: PlaceholderImage[] = [
  PLACEHOLDER_IMAGES.portrait01,
  PLACEHOLDER_IMAGES.portrait02,
  PLACEHOLDER_IMAGES.portrait03,
  PLACEHOLDER_IMAGES.portrait04,
  PLACEHOLDER_IMAGES.portrait06,
  PLACEHOLDER_IMAGES.portrait07,
  PLACEHOLDER_IMAGES.portrait09,
  PLACEHOLDER_IMAGES.landscape04,
];
const COUNT = IMAGES.length;

const CARD_WIDTH = 300;
const CARD_HEIGHT = 380;
const CARD_RADIUS = 20;
const PERSPECTIVE = 1400;
const DEPTH = 220;
const SPREAD = 90;
const TILT = 22;
const VISIBLE_CARDS = 4;
const FALLOFF = 0.2;
const BLUR = 6;
const DURATION = 0.7;
const EASE: Easing = [0.22, 1, 0.36, 1];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const CAROUSEL_CSS = `
.depth-carousel { position: relative; display: flex; align-items: center; justify-content: center;
  perspective: ${PERSPECTIVE}px; perspective-origin: 50% 50%; touch-action: pan-y; outline: none; user-select: none; cursor: grab; }
.depth-carousel:active { cursor: grabbing; }
.depth-carousel:focus-visible { outline: 2px solid rgba(255, 255, 255, 0.5); outline-offset: 4px; border-radius: 12px; }
.depth-carousel__stage { position: absolute; inset: 0; transform-style: preserve-3d; }
.depth-carousel__card { position: absolute; top: 50%; left: 50%; transform-origin: center center; overflow: hidden;
  background: #0b0d12; box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.65), 0 8px 20px -10px rgba(0, 0, 0, 0.5);
  will-change: transform, opacity, filter; cursor: pointer; transform: translate(-50%, -50%); }
.depth-carousel__img { object-fit: cover; pointer-events: none; }
.depth-carousel__tint { position: absolute; inset: 0; opacity: 0; pointer-events: none; mix-blend-mode: multiply; background: #05060a; }
.depth-carousel__arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 3000; width: 42px; height: 42px;
  display: grid; place-items: center; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 999px;
  background: rgba(18, 20, 26, 0.55); backdrop-filter: blur(8px); color: #fff; cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
.depth-carousel__arrow:hover { background: rgba(28, 31, 40, 0.85); border-color: rgba(255, 255, 255, 0.4); }
.depth-carousel__arrow:active { transform: translateY(-50%) scale(0.94); }
.depth-carousel__arrow--prev { left: 16px; }
.depth-carousel__arrow--next { right: 16px; }
.depth-carousel__dots { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 32px; }
.depth-carousel__dot { width: 10px; height: 10px; padding: 0; border: none; border-radius: 999px;
  background: rgba(255, 255, 255, 0.32); cursor: pointer; transition: width 0.25s ease, background 0.25s ease; }
.depth-carousel__dot.is-active { width: 28px; background: #fff; }
@media (prefers-reduced-motion: reduce) {
  .depth-carousel__card { will-change: auto; }
  .depth-carousel__arrow, .depth-carousel__dot { transition: none; }
}
`;

export default function GalleryDepthCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tintRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const posRef = useRef(0);
  const focusRef = useRef(0);
  const tweenRef = useRef<ReturnType<typeof animate> | null>(null);
  const scaleRef = useRef(1);
  const reducedRef = useRef(false);

  const dragRef = useRef<{ x: number; startPos: number; lastX: number; lastT: number; v: number; moved: boolean } | null>(null);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [active, setActive] = useState(0);

  const layout = useCallback((pos: number) => {
    const sc = scaleRef.current;
    for (let i = 0; i < COUNT; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      d = ((d % COUNT) + COUNT) % COUNT;
      if (d > COUNT / 2) d -= COUNT;

      const back = Math.max(0, d);
      const shown = Math.abs(d) <= VISIBLE_CARDS + 0.5;

      const tz = -DEPTH * d;
      const tx = SPREAD * d;
      const ry = TILT * clamp(d, 0, 1);

      let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
      if (!shown) opacity = 0;

      const brightness = Math.max(0.15, 1 - back * FALLOFF);
      const blurPx = Math.min(BLUR, (back / VISIBLE_CARDS) * BLUR);
      const zi = Math.round(2000 - d * 20);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
      el.style.zIndex = String(zi);
      el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";

      const tint = tintRefs.current[i];
      if (tint) tint.style.opacity = clamp(back * FALLOFF * 1.25, 0, 0.86).toFixed(3);
    }
  }, []);

  const tweenTo = useCallback(
    (target: number, shouldAnimate: boolean) => {
      tweenRef.current?.stop();
      const dur = shouldAnimate && !reducedRef.current ? DURATION : 0;
      tweenRef.current = animate(posRef.current, target, {
        duration: dur,
        ease: EASE,
        onUpdate: (latest) => {
          posRef.current = latest;
          layout(latest);
        },
        onComplete: () => {
          posRef.current = ((posRef.current % COUNT) + COUNT) % COUNT;
          layout(posRef.current);
        },
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex: number, shouldAnimate = true) => {
      const idx = ((rawIndex % COUNT) + COUNT) % COUNT;
      let delta = idx - posRef.current;
      delta = ((delta % COUNT) + COUNT) % COUNT;
      if (delta > COUNT / 2) delta -= COUNT;
      tweenTo(posRef.current + delta, shouldAnimate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        setActive(idx);
      }
    },
    [tweenTo]
  );

  const navigateBy = useCallback((step: number) => setFocus(focusRef.current + step, true), [setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      const needed = CARD_WIDTH + SPREAD * 2 + 120;
      scaleRef.current = clamp(w / needed, 0.4, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      tweenRef.current?.stop();
      const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const delta = e.deltaMode === 1 ? raw * 24 : raw;
      const step = clamp(delta / (CARD_WIDTH * 0.9), -0.6, 0.6);
      posRef.current += step;
      layout(posRef.current);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setFocus(Math.round(posRef.current), true), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [layout, setFocus]);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    tweenRef.current?.stop();
    dragRef.current = { x: e.clientX, startPos: posRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false };
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const stepPx = Math.max(CARD_WIDTH * 0.55 * scaleRef.current, 40);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(e.pointerId);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout]
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const stepPx = Math.max(CARD_WIDTH * 0.55 * scaleRef.current, 40);
    const projected = posRef.current - (drag.v * 180) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateBy(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateBy(1);
      }
    },
    [navigateBy]
  );

  const onCardClick = useCallback(
    (index: number) => {
      if (dragRef.current?.moved) return;
      setFocus(index, true);
    },
    [setFocus]
  );

  useEffect(() => {
    reducedRef.current = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    layout(posRef.current);
  }, [layout]);

  useEffect(
    () => () => {
      tweenRef.current?.stop();
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    },
    []
  );

  return (
    <section className="bg-[#05060a] px-6 pb-32 pt-24 sm:pb-40 sm:pt-32">
      <style>{CAROUSEL_CSS}</style>
      <div className="mx-auto max-w-6xl">
        <Reveal effect="A" as="h2" className="mb-10 text-balance text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Recent work, layer by layer
        </Reveal>

        <div
          ref={rootRef}
          className="depth-carousel h-[24rem] w-full sm:h-[28rem]"
          role="group"
          aria-roledescription="carousel"
          aria-label="Project gallery"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
        >
          <div className="depth-carousel__stage">
            {IMAGES.map((item, i) => (
              <div
                key={item.src}
                className="depth-carousel__card"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: CARD_RADIUS }}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${COUNT}`}
                aria-hidden={active !== i}
                onClick={() => onCardClick(i)}
              >
                <Image
                  className="depth-carousel__img"
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="300px"
                  draggable={false}
                />
                <span
                  className="depth-carousel__tint"
                  ref={(el) => {
                    tintRefs.current[i] = el;
                  }}
                />
              </div>
            ))}
          </div>

          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="Previous slide" onClick={() => navigateBy(-1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="Next slide" onClick={() => navigateBy(1)}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
          {IMAGES.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              className={`depth-carousel__dot${active === i ? " is-active" : ""}`}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
