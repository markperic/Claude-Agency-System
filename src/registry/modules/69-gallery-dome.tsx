"use client";

import { useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 69 — Gallery, Dome
 * A wraparound sphere of image tiles, built entirely from CSS 3D transforms
 * driven off custom properties — drag to rotate, click a tile to see it
 * fly out into a centered, full-size view. Adapted from a community
 * DomeGallery component. Two real adaptations from the source: the drag
 * gesture (rotation + flick inertia) was rebuilt on plain pointer events
 * with a small velocity-sample buffer instead of `@use-gesture/react`, so
 * this module adds zero new dependencies; and its stylesheet — the source
 * shipped a sibling .css file — is inlined via a `<style>` tag the same way
 * module 66's corridor keyframes are, since nothing else in this catalog
 * imports a standalone CSS file. The CSS and the tile-opening/closing DOM
 * choreography (measuring rects, sequencing transitions) are kept close to
 * verbatim — dense, deliberate positioning math, not boilerplate to
 * simplify, same call as module 66's corridor and module 68's shader. Not
 * part of the A–J catalog. Title effect: A.
 */

type GalleryImage = { src: string; alt: string };
type DomeItem = { x: number; y: number; sizeX: number; sizeY: number; src: string; alt: string };

const IMAGES: GalleryImage[] = [
  { src: "https://images.pexels.com/photos/2081184/pexels-photo-2081184.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Triangular skylight casting light across a stairwell" },
  { src: "https://images.pexels.com/photos/3747070/pexels-photo-3747070.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Laptop on a desk in front of an industrial-style window" },
  { src: "https://images.pexels.com/photos/3062948/pexels-photo-3062948.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Minimal white architectural interior" },
  { src: "https://images.pexels.com/photos/265101/pexels-photo-265101.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Creative studio desk with a cactus and laptop" },
  { src: "https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Analytics dashboard displayed on a tablet" },
  { src: "https://images.pexels.com/photos/7449894/pexels-photo-7449894.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Minimal skincare product bottles on a studio set" },
  { src: "https://images.pexels.com/photos/1128207/pexels-photo-1128207.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Laptop open on a minimal desk by a window" },
  { src: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Website wireframe sketched out in a notebook" },
  { src: "https://images.pexels.com/photos/35658181/pexels-photo-35658181.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Silhouette of a woman against a vibrant ocean sunset" },
  { src: "https://images.pexels.com/photos/34340727/pexels-photo-34340727.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Silhouette of a man against a vibrant sunset sky" },
  { src: "https://images.pexels.com/photos/15784889/pexels-photo-15784889.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Double-exposure portrait blended with a cloudy sky and city skyline" },
  { src: "https://images.pexels.com/photos/36765627/pexels-photo-36765627.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop", alt: "Two designers reviewing color swatches and prints" },
];

const SEGMENTS = 35;
const FIT = 0.5;
const MIN_RADIUS = 600;
const PAD_FACTOR = 0.25;
const OVERLAY_COLOR = "#120F17";
const MAX_VERTICAL_ROTATION_DEG = 5;
const DRAG_SENSITIVITY = 20;
const DRAG_DAMPENING = 2;
const ENLARGE_TRANSITION_MS = 300;
const TILE_RADIUS = "20px";
const ENLARGE_RADIUS = "24px";
const GRAYSCALE = true;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: GalleryImage[], seg: number): DomeItem[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  const usedImages = Array.from({ length: totalSlots }, (_, i) => pool[i % pool.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

const DOME_CSS = `
.dome-root { position: relative; --radius: 520px; --viewer-pad: 72px;
  --circ: calc(var(--radius) * 3.14); --rot-y: calc((360deg / var(--segments-x)) / 2); --rot-x: calc((360deg / var(--segments-y)) / 2);
  --item-width: calc(var(--circ) / var(--segments-x)); --item-height: calc(var(--circ) / var(--segments-y)); }
.dome-root * { box-sizing: border-box; }
.dome-sphere, .dome-item, .dome-item__image { transform-style: preserve-3d; }
.dome-main { position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden; touch-action: none; user-select: none; background: transparent; }
.dome-stage { width: 100%; height: 100%; display: grid; place-items: center; perspective: calc(var(--radius) * 2); perspective-origin: 50% 50%; contain: layout paint size; }
.dome-sphere { transform: translateZ(calc(var(--radius) * -1)); will-change: transform; }
.dome-overlay, .dome-overlay--blur { position: absolute; inset: 0; margin: auto; z-index: 3; pointer-events: none; }
.dome-overlay { background-image: radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, #120F17) 100%); }
.dome-overlay--blur { -webkit-mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%); mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%); backdrop-filter: blur(3px); }
.dome-item { width: calc(var(--item-width) * var(--item-size-x)); height: calc(var(--item-height) * var(--item-size-y)); position: absolute; top: -999px; bottom: -999px; left: -999px; right: -999px; margin: auto;
  transform-origin: 50% 50%; backface-visibility: hidden; transition: transform 300ms; cursor: pointer; -webkit-tap-highlight-color: transparent; touch-action: manipulation; pointer-events: auto;
  transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) translateZ(var(--radius)); }
.dome-item:focus-visible { outline: 2px solid rgba(255,255,255,0.8); outline-offset: 2px; }
.dome-item__image { position: absolute; display: block; inset: 6px; border-radius: var(--tile-radius, 12px); background: transparent; overflow: hidden; backface-visibility: hidden;
  transition: transform 300ms; pointer-events: none; transform: translateZ(0); }
.dome-item__image img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; backface-visibility: hidden; filter: var(--image-filter, none); }
.dome-viewer { position: absolute; inset: 0; z-index: 20; pointer-events: none; display: flex; align-items: center; justify-content: center; padding: var(--viewer-pad); }
.dome-viewer .dome-frame { height: 100%; aspect-ratio: 1; border-radius: var(--enlarge-radius, 32px); display: flex; }
@media (max-aspect-ratio: 1/1) { .dome-viewer .dome-frame { height: auto; width: 100%; } }
.dome-viewer .dome-scrim { position: absolute; inset: 0; z-index: 10; background: transparent; pointer-events: none; }
.dome-root[data-enlarging='true'] .dome-viewer .dome-scrim { pointer-events: all; }
.dome-viewer .dome-enlarge { position: absolute; z-index: 30; border-radius: var(--enlarge-radius, 32px); overflow: hidden; transition: transform 500ms ease, opacity 500ms ease; transform-origin: top left; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); }
.dome-viewer .dome-enlarge img { width: 100%; height: 100%; object-fit: cover; filter: none; }
.dome-root .dome-enlarge-closing img { filter: none; }
.dome-edge-fade { position: absolute; left: 0; right: 0; height: 120px; z-index: 5; pointer-events: none; background: linear-gradient(to bottom, transparent, var(--overlay-blur-color, #120F17)); }
.dome-edge-fade--top { top: 0; transform: rotate(180deg); }
.dome-edge-fade--bottom { bottom: 0; }
`;

export default function GalleryDome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const focusedElRef = useRef<HTMLDivElement | null>(null);
  const originalTilePositionRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const samplesRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const pointerDownTileRef = useRef<HTMLDivElement | null>(null);

  const lockScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);
  const unlockScroll = useCallback(() => {
    if (rootRef.current?.getAttribute("data-enlarging") === "true") return;
    document.body.style.overflow = "";
  }, []);

  const items = useMemo(() => buildItems(IMAGES, SEGMENTS), []);

  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const aspect = w / h;
      const basis = aspect >= 1.3 ? w : minDim;
      let radius = basis * FIT;
      radius = Math.min(radius, h * 1.35);
      radius = clamp(radius, MIN_RADIUS, Infinity);
      const lockedRadius = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * PAD_FACTOR));
      root.style.setProperty("--radius", `${lockedRadius}px`);
      root.style.setProperty("--viewer-pad", `${viewerPad}px`);
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector<HTMLDivElement>(".dome-enlarge");
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();
        enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
        enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
        enlargedOverlay.style.width = `${frameR.width}px`;
        enlargedOverlay.style.height = `${frameR.height}px`;
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback((vx: number, vy: number) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(DRAG_DAMPENING, 0, 1);
    const frictionMul = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames = Math.round(90 + 270 * d);
    const step = () => {
      vX *= frictionMul;
      vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
        inertiaRAF.current = null;
        return;
      }
      if (++frames > maxFrames) {
        inertiaRAF.current = null;
        return;
      }
      const nextX = clamp(rotationRef.current.x - vY / 200, -MAX_VERTICAL_ROTATION_DEG, MAX_VERTICAL_ROTATION_DEG);
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nextX, y: nextY };
      applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia();
    inertiaRAF.current = requestAnimationFrame(step);
  }, [stopInertia]);

  const openItemFromElement = useCallback(
    (el: HTMLDivElement) => {
      if (openingRef.current) return;
      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();
      const parent = el.parentElement as HTMLElement;
      focusedElRef.current = el;
      el.setAttribute("data-focused", "true");
      const offsetX = getDataNumber(parent, "offsetX", 0);
      const offsetY = getDataNumber(parent, "offsetY", 0);
      const sizeX = getDataNumber(parent, "sizeX", 2);
      const sizeY = getDataNumber(parent, "sizeY", 2);
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, SEGMENTS);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;
      parent.style.setProperty("--rot-y-delta", `${rotY}deg`);
      parent.style.setProperty("--rot-x-delta", `${rotX}deg`);
      const refDiv = document.createElement("div");
      refDiv.className = "dome-item__image dome-item__image--reference";
      refDiv.style.opacity = "0";
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = mainRef.current?.getBoundingClientRect();
      const frameR = frameRef.current?.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false;
        focusedElRef.current = null;
        parent.removeChild(refDiv);
        unlockScroll();
        return;
      }

      originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
      el.style.visibility = "hidden";
      el.style.zIndex = "0";
      const overlay = document.createElement("div");
      overlay.className = "dome-enlarge";
      overlay.style.position = "absolute";
      overlay.style.left = frameR.left - mainR.left + "px";
      overlay.style.top = frameR.top - mainR.top + "px";
      overlay.style.width = frameR.width + "px";
      overlay.style.height = frameR.height + "px";
      overlay.style.opacity = "0";
      overlay.style.zIndex = "30";
      overlay.style.willChange = "transform, opacity";
      overlay.style.transformOrigin = "top left";
      overlay.style.transition = `transform ${ENLARGE_TRANSITION_MS}ms ease, opacity ${ENLARGE_TRANSITION_MS}ms ease`;
      const rawSrc = parent.dataset.src || el.querySelector("img")?.src || "";
      const img = document.createElement("img");
      img.src = rawSrc;
      overlay.appendChild(img);
      viewerRef.current?.appendChild(overlay);
      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      setTimeout(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = "1";
        overlay.style.transform = "translate(0px, 0px) scale(1, 1)";
        rootRef.current?.setAttribute("data-enlarging", "true");
      }, 16);
    },
    [lockScroll, unlockScroll]
  );

  // Plain pointer events replace the source's @use-gesture/react dependency.
  // A short rolling sample buffer stands in for that library's built-in
  // velocity tracking (px/ms, matching the MAX_V clamp above), with the
  // same total-movement fallback the source uses for slow/short drags.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (focusedElRef.current) return;
      stopInertia();
      draggingRef.current = true;
      movedRef.current = false;
      startRotRef.current = { ...rotationRef.current };
      startPosRef.current = { x: e.clientX, y: e.clientY };
      samplesRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      // Record which tile (if any) was under the pointer now, before
      // setPointerCapture below retargets every later event for this
      // pointer — including pointerup and the derived click — to `el`
      // itself. Reading e.target at pointerup would just be this element.
      pointerDownTileRef.current = (e.target as HTMLElement | null)?.closest<HTMLDivElement>(".dome-item") ?? null;
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
      const dxTotal = e.clientX - startPosRef.current.x;
      const dyTotal = e.clientY - startPosRef.current.y;
      if (!movedRef.current && dxTotal * dxTotal + dyTotal * dyTotal > 16) movedRef.current = true;

      const nextX = clamp(startRotRef.current.x - dyTotal / DRAG_SENSITIVITY, -MAX_VERTICAL_ROTATION_DEG, MAX_VERTICAL_ROTATION_DEG);
      const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / DRAG_SENSITIVITY);
      if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
      }

      const now = performance.now();
      samplesRef.current.push({ x: e.clientX, y: e.clientY, t: now });
      const cutoff = now - 80;
      while (samplesRef.current.length > 2 && samplesRef.current[0].t < cutoff) samplesRef.current.shift();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current || !startPosRef.current) return;
      draggingRef.current = false;
      const dxTotal = e.clientX - startPosRef.current.x;
      const dyTotal = e.clientY - startPosRef.current.y;

      const samples = samplesRef.current;
      let vx = 0;
      let vy = 0;
      if (samples.length >= 2) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = last.t - first.t;
        if (dt > 4) {
          vx = (last.x - first.x) / dt;
          vy = (last.y - first.y) / dt;
        }
      }
      if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001) {
        vx = clamp((dxTotal / DRAG_SENSITIVITY) * 0.02, -1.2, 1.2);
        vy = clamp((dyTotal / DRAG_SENSITIVITY) * 0.02, -1.2, 1.2);
      }
      const wasMoved = movedRef.current;
      if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
      if (wasMoved) lastDragEndAt.current = performance.now();
      movedRef.current = false;
      startPosRef.current = null;

      // `mainRef` captures the pointer above (needed so drag-rotate keeps
      // tracking even once the pointer leaves the tile it started on). Once
      // captured, e.target on pointerup (and the derived click event) is
      // retargeted to `mainRef` itself, not whatever tile is under the
      // cursor — so we resolve the tile from pointerDownTileRef (recorded
      // before capture kicked in) rather than e.target here. That
      // retargeting is also why onTileClick's React onClick never fires for
      // pointer input; it stays wired up only for keyboard (Enter/Space).
      if (!wasMoved && !openingRef.current && !focusedElRef.current) {
        const img = pointerDownTileRef.current?.querySelector<HTMLDivElement>(".dome-item__image");
        if (img) openItemFromElement(img);
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [startInertia, stopInertia, openItemFromElement]);

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement as HTMLElement;
      const overlay = viewerRef.current?.querySelector<HTMLDivElement>(".dome-enlarge");
      if (!overlay) return;
      const refDiv = parent.querySelector<HTMLDivElement>(".dome-item__image--reference");
      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        refDiv?.remove();
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        el.style.visibility = "";
        el.style.zIndex = "0";
        focusedElRef.current = null;
        rootRef.current?.removeAttribute("data-enlarging");
        openingRef.current = false;
        unlockScroll();
        return;
      }
      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current!.getBoundingClientRect();
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      };
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      };
      const animatingOverlay = document.createElement("div");
      animatingOverlay.className = "dome-enlarge-closing";
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius:var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${ENLARGE_TRANSITION_MS}ms ease-out;pointer-events:none;margin:0;transform:none;`;
      const originalImg = overlay.querySelector("img");
      if (originalImg) {
        const img = originalImg.cloneNode() as HTMLImageElement;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        animatingOverlay.appendChild(img);
      }
      overlay.remove();
      rootRef.current!.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();
      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + "px";
        animatingOverlay.style.top = originalPosRelativeToRoot.top + "px";
        animatingOverlay.style.width = originalPosRelativeToRoot.width + "px";
        animatingOverlay.style.height = originalPosRelativeToRoot.height + "px";
        animatingOverlay.style.opacity = "0";
      });
      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;
        refDiv?.remove();
        parent.style.transition = "none";
        el.style.transition = "none";
        parent.style.setProperty("--rot-y-delta", "0deg");
        parent.style.setProperty("--rot-x-delta", "0deg");
        requestAnimationFrame(() => {
          el.style.visibility = "";
          el.style.opacity = "0";
          el.style.zIndex = "0";
          focusedElRef.current = null;
          rootRef.current?.removeAttribute("data-enlarging");
          requestAnimationFrame(() => {
            parent.style.transition = "";
            el.style.transition = "opacity 300ms ease-out";
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              setTimeout(() => {
                el.style.transition = "";
                el.style.opacity = "";
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute("data-enlarging") !== "true") {
                  document.body.style.overflow = "";
                }
              }, 300);
            });
          });
        });
      };
      animatingOverlay.addEventListener("transitionend", cleanup, { once: true });
    };
    scrim.addEventListener("click", close);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      scrim.removeEventListener("click", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [unlockScroll]);

  // Kept for keyboard activation (Enter/Space on the focused tile) — that
  // fires a real "click" with no pointer event involved, so it's unaffected
  // by the pointer-capture issue the native onPointerUp above works around.
  const onTileClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingRef.current || movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      const img = e.currentTarget.querySelector<HTMLDivElement>(".dome-item__image");
      if (img) openItemFromElement(img);
    },
    [openItemFromElement]
  );

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const rootStyle = {
    "--segments-x": SEGMENTS,
    "--segments-y": SEGMENTS,
    "--overlay-blur-color": OVERLAY_COLOR,
    "--tile-radius": TILE_RADIUS,
    "--enlarge-radius": ENLARGE_RADIUS,
    "--image-filter": GRAYSCALE ? "grayscale(1)" : "none",
  } as CSSProperties;

  return (
    <section className="bg-[#120F17] px-6 py-24 sm:py-32">
      <style>{DOME_CSS}</style>
      <div className="mx-auto max-w-6xl">
        <Reveal effect="A" as="h2" className="mb-10 text-balance text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Drag through the archive
        </Reveal>

        <div ref={rootRef} className="dome-root h-[30rem] w-full overflow-hidden rounded-2xl sm:h-[36rem]" style={rootStyle}>
          <div ref={mainRef} className="dome-main">
            <div className="dome-stage">
              <div ref={sphereRef} className="dome-sphere">
                {items.map((it, i) => {
                  const itemStyle = {
                    "--offset-x": it.x,
                    "--offset-y": it.y,
                    "--item-size-x": it.sizeX,
                    "--item-size-y": it.sizeY,
                  } as CSSProperties;
                  return (
                    <div
                      key={`${it.x},${it.y},${i}`}
                      className="dome-item"
                      data-src={it.src}
                      data-offset-x={it.x}
                      data-offset-y={it.y}
                      data-size-x={it.sizeX}
                      data-size-y={it.sizeY}
                      style={itemStyle}
                      role="button"
                      tabIndex={0}
                      aria-label={it.alt || "Open image"}
                      onClick={onTileClick}
                    >
                      <div className="dome-item__image">
                        <img src={it.src} draggable={false} alt={it.alt} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dome-overlay" />
            <div className="dome-overlay dome-overlay--blur" />
            <div className="dome-edge-fade dome-edge-fade--top" />
            <div className="dome-edge-fade dome-edge-fade--bottom" />

            <div className="dome-viewer" ref={viewerRef}>
              <div ref={scrimRef} className="dome-scrim" />
              <div ref={frameRef} className="dome-frame" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
