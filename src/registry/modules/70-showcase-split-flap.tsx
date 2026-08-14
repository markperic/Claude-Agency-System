"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 70 — Showcase, Split-Flap Display
 * An airport/train-station departures-board effect: each tile spins through
 * a few random characters before mechanically landing on the target letter.
 * Adapted from a community SplitFlapText component. The flip sequencing — a
 * small per-tile animation-plan array driven by one shared
 * requestAnimationFrame loop — is kept close to verbatim, same call as
 * module 66's corridor and module 69's dome: dense, deliberate timing math,
 * not boilerplate to simplify. Two real adaptations: the source's standalone
 * .css file is inlined via a `<style>` tag (module 66/69's pattern), and the
 * reduced-motion check is a one-time matchMedia read inside the animation
 * effect rather than a reactive hook + extra state, matching module 68's
 * approach. Not part of the A–J catalog. Title effect: A.
 */

const CHARSETS = {
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  numeric: "0123456789",
} as const;

type SplitFlapCharset = keyof typeof CHARSETS;

type SplitFlapTile = {
  current: string;
  next: string;
  flipping: boolean;
  tick: number;
};

type FlipPlan = {
  index: number;
  from: string;
  target: string;
  sequence: string[];
  start: number;
  step: number;
  done: boolean;
};

const toCssUnit = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

const normalizePhrase = (phrase: string, width: number) => phrase.padEnd(width, " ").slice(0, width);

const createTiles = (phrase: string): SplitFlapTile[] =>
  phrase.split("").map((char) => ({ current: char, next: char, flipping: false, tick: 0 }));

const sampleChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length)) || " ";

const buildSequence = (target: string, flips: number, charset: string) => {
  const steps: string[] = [];
  for (let i = 0; i < flips; i += 1) steps.push(sampleChar(charset));
  steps.push(target);
  return steps;
};

const DEFAULT_MESSAGES = ["BUILD PASSING", "QA COMPLETE", "SHIP APPROVED", "SITE LIVE"];

function SplitFlapBoard({
  messages = DEFAULT_MESSAGES,
  flipDuration = 0.12,
  stagger = 0.06,
  cycleDelay = 2400,
  charset = "alphanumeric",
  flipsPerChar = 8,
  tileColor = "#0a0a0a",
  textColor = "#fbbf24",
  tileRadius = 6,
  gap = 6,
  fontSize = "clamp(1.25rem, 4vw, 2.5rem)",
  loop = true,
  padTo = 0,
  className = "",
}: {
  messages?: string[];
  flipDuration?: number;
  stagger?: number;
  cycleDelay?: number;
  charset?: SplitFlapCharset;
  flipsPerChar?: number;
  tileColor?: string;
  textColor?: string;
  tileRadius?: number | string;
  gap?: number | string;
  fontSize?: number | string;
  loop?: boolean;
  padTo?: number;
  className?: string;
}) {
  const rafRef = useRef<number | null>(null);
  const cycleTimerRef = useRef<number | null>(null);

  // Joining to a single string (rather than depending on `messages` itself)
  // keeps this memo stable across renders even if a caller passes a fresh
  // array literal each time, since the useEffect below only needs to restart
  // the cycle when the actual phrases change, not the array reference.
  const phrasesKey = messages.map((m) => String(m ?? "")).join("\u001f");
  const phrases = useMemo(() => phrasesKey.split("\u001f"), [phrasesKey]);

  const width = useMemo(() => {
    const longest = phrases.reduce((max, phrase) => Math.max(max, phrase.length), 1);
    return Math.max(1, Math.ceil(padTo || 0), longest);
  }, [padTo, phrases]);

  const normalizedPhrases = useMemo(() => phrases.map((phrase) => normalizePhrase(phrase, width)), [phrases, width]);

  // Lazy initializers only — this board's `messages` is static for every
  // catalog usage, so there's no need to react to it changing after mount.
  const currentTextRef = useRef(normalizedPhrases[0] || "");
  const [tiles, setTiles] = useState<SplitFlapTile[]>(() => createTiles(normalizedPhrases[0] || ""));

  useEffect(() => {
    const clearAnimation = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (cycleTimerRef.current) {
        window.clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
    };

    clearAnimation();

    if (normalizedPhrases.length <= 1) return clearAnimation;

    let phraseIndex = 0;
    let cancelled = false;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const safeFlipMs = Math.max(40, flipDuration * 1000);
    const safeStaggerMs = Math.max(0, stagger * 1000);
    const safeCycleDelay = Math.max(400, cycleDelay);
    const safeFlips = Math.max(0, Math.floor(flipsPerChar));
    const activeCharset = CHARSETS[charset] ?? CHARSETS.alphanumeric;

    const animateTo = (targetPhrase: string) => {
      if (prefersReducedMotion) {
        currentTextRef.current = targetPhrase;
        setTiles(createTiles(targetPhrase));
        return 0;
      }

      const fromPhrase = normalizePhrase(currentTextRef.current, width);
      const targetChars = targetPhrase.split("");

      const plans: FlipPlan[] = targetChars
        .map((targetChar, index) => {
          const fromChar = fromPhrase[index] || " ";
          if (fromChar === targetChar) return null;
          return {
            index,
            from: fromChar,
            target: targetChar,
            sequence: buildSequence(targetChar, safeFlips, activeCharset),
            start: index * safeStaggerMs,
            step: -1,
            done: false,
          };
        })
        .filter((plan): plan is FlipPlan => plan !== null);

      if (!plans.length) {
        currentTextRef.current = targetPhrase;
        setTiles(createTiles(targetPhrase));
        return 0;
      }

      const totalDuration = plans.reduce((max, plan) => Math.max(max, plan.start + plan.sequence.length * safeFlipMs), 0);
      const startedAt = performance.now();

      const updateTiles = (updates: { index: number; current: string; next: string; done: boolean }[]) => {
        setTiles((previous) => {
          const nextTiles = [...previous];
          updates.forEach((update) => {
            const tile = nextTiles[update.index];
            if (!tile) return;
            nextTiles[update.index] = {
              current: update.current,
              next: update.next,
              flipping: !update.done,
              tick: tile.tick + 1,
            };
          });
          return nextTiles;
        });
      };

      const tick = (now: number) => {
        if (cancelled) return;

        const elapsed = now - startedAt;
        const updates: { index: number; current: string; next: string; done: boolean }[] = [];
        let shouldContinue = false;

        plans.forEach((plan) => {
          const localElapsed = elapsed - plan.start;
          if (localElapsed < 0) {
            shouldContinue = true;
            return;
          }

          const step = Math.floor(localElapsed / safeFlipMs);

          if (step < plan.sequence.length) {
            shouldContinue = true;
            if (step !== plan.step) {
              plan.step = step;
              updates.push({
                index: plan.index,
                current: step === 0 ? plan.from : plan.sequence[step - 1],
                next: plan.sequence[step],
                done: false,
              });
            }
          } else if (!plan.done) {
            plan.done = true;
            updates.push({ index: plan.index, current: plan.target, next: plan.target, done: true });
          }
        });

        if (updates.length > 0) updateTiles(updates);

        if (shouldContinue) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          currentTextRef.current = targetPhrase;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
      return totalDuration;
    };

    const scheduleNext = (delay: number) => {
      cycleTimerRef.current = window.setTimeout(() => {
        if (cancelled) return;

        const nextIndex = phraseIndex + 1;
        if (nextIndex >= normalizedPhrases.length && !loop) return;

        phraseIndex = nextIndex % normalizedPhrases.length;
        const animationDuration = animateTo(normalizedPhrases[phraseIndex]);
        scheduleNext(safeCycleDelay + animationDuration);
      }, delay);
    };

    scheduleNext(safeCycleDelay);

    return () => {
      cancelled = true;
      clearAnimation();
    };
  }, [normalizedPhrases, width, loop, cycleDelay, flipDuration, stagger, flipsPerChar, charset]);

  const settledText = tiles.map((tile) => tile.current).join("").trimEnd();
  const boardStyle = {
    "--split-flap-tile-color": tileColor,
    "--split-flap-text-color": textColor,
    "--split-flap-radius": toCssUnit(tileRadius),
    "--split-flap-gap": toCssUnit(gap),
    "--split-flap-font-size": toCssUnit(fontSize),
    "--split-flap-flip-duration": `${Math.max(0.04, flipDuration)}s`,
  } as CSSProperties;

  return (
    <div className={`split-flap-text ${className}`.trim()} style={boardStyle} role="text" aria-label={settledText || undefined}>
      {tiles.map((tile, index) => (
        <span className="split-flap-text__tile" aria-hidden="true" key={`${index}-${tiles.length}`}>
          <span className="split-flap-text__half split-flap-text__half--top">
            <span className="split-flap-text__char">{tile.current === " " ? " " : tile.current}</span>
          </span>
          <span className="split-flap-text__half split-flap-text__half--bottom">
            <span className="split-flap-text__char">{tile.flipping ? tile.next : tile.current}</span>
          </span>

          {tile.flipping && (
            <>
              <span className="split-flap-text__flap split-flap-text__flap--front" key={`front-${index}-${tile.tick}`}>
                <span className="split-flap-text__char">{tile.current === " " ? " " : tile.current}</span>
              </span>
              <span className="split-flap-text__flap split-flap-text__flap--back" key={`back-${index}-${tile.tick}`}>
                <span className="split-flap-text__char">{tile.next === " " ? " " : tile.next}</span>
              </span>
            </>
          )}
        </span>
      ))}
    </div>
  );
}

const SPLIT_FLAP_CSS = `
.split-flap-text { display: inline-flex; align-items: center; gap: var(--split-flap-gap, 6px); color: var(--split-flap-text-color, #f8fafc);
  font-family: 'SFMono-Regular', 'Roboto Mono', 'Cascadia Code', 'Liberation Mono', Menlo, monospace; font-size: var(--split-flap-font-size, 40px);
  font-weight: 760; line-height: 1; letter-spacing: 0.035em; white-space: pre; user-select: none; font-variant-numeric: tabular-nums; }
.split-flap-text__tile { position: relative; width: 0.78em; height: 1.08em; overflow: hidden; border-radius: var(--split-flap-radius, 6px);
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.16), transparent 44%),
    linear-gradient(180deg, color-mix(in srgb, var(--split-flap-tile-color, #0a0a0a) 82%, white), var(--split-flap-tile-color, #0a0a0a));
  box-shadow: 0 0.035em 0.08em rgba(255, 255, 255, 0.08) inset, 0 -0.05em 0.1em rgba(0, 0, 0, 0.38) inset, 0 0.16em 0.38em rgba(0, 0, 0, 0.28);
  perspective: 520px; transform-style: preserve-3d; isolation: isolate; }
.split-flap-text__tile::before { content: ''; position: absolute; z-index: 8; top: calc(50% - 0.5px); left: 0; width: 100%; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18) 18%, rgba(0, 0, 0, 0.64) 50%, rgba(255, 255, 255, 0.14) 82%, transparent);
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.08), 0 1px 0 rgba(0, 0, 0, 0.5); pointer-events: none; }
.split-flap-text__tile::after { content: ''; position: absolute; inset: 0; z-index: 9; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: inherit; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2) inset; pointer-events: none; }
.split-flap-text__half, .split-flap-text__flap { position: absolute; left: 0; width: 100%; height: 50%; overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 34%), var(--split-flap-tile-color, #0a0a0a); backface-visibility: hidden; }
.split-flap-text__half--top, .split-flap-text__flap--front { top: 0; }
.split-flap-text__half--bottom, .split-flap-text__flap--back { bottom: 0;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.06), transparent 38%), color-mix(in srgb, var(--split-flap-tile-color, #0a0a0a) 92%, black); }
.split-flap-text__char { position: absolute; left: 0; width: 100%; height: 200%; display: flex; align-items: center; justify-content: center;
  color: var(--split-flap-text-color, #fbbf24); text-shadow: 0 0.025em 0 rgba(255, 255, 255, 0.16), 0 0.09em 0.16em rgba(0, 0, 0, 0.42); }
.split-flap-text__half--top .split-flap-text__char, .split-flap-text__flap--front .split-flap-text__char { top: 0; }
.split-flap-text__half--bottom .split-flap-text__char, .split-flap-text__flap--back .split-flap-text__char { bottom: 0; }
.split-flap-text__flap { z-index: 6; will-change: transform, filter; transform-style: preserve-3d; }
.split-flap-text__flap--front { transform-origin: center bottom; animation: split-flap-front var(--split-flap-flip-duration, 0.12s) cubic-bezier(0.23, 1, 0.32, 1) both; }
.split-flap-text__flap--back { transform-origin: center top; transform: rotateX(90deg);
  animation: split-flap-back var(--split-flap-flip-duration, 0.12s) cubic-bezier(0.23, 1, 0.32, 1) both; }
@keyframes split-flap-front { 0% { transform: rotateX(0deg); filter: brightness(1.08); } 100% { transform: rotateX(-90deg); filter: brightness(0.52); } }
@keyframes split-flap-back { 0%, 45% { transform: rotateX(90deg); filter: brightness(0.58); } 100% { transform: rotateX(0deg); filter: brightness(1); } }
@media (prefers-reduced-motion: reduce) { .split-flap-text__flap { animation: none !important; } }
`;

export default function ShowcaseSplitFlap() {
  return (
    <section className="bg-zinc-950 px-6 py-24 sm:py-32">
      <style>{SPLIT_FLAP_CSS}</style>
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Live status</p>
        <Reveal effect="A" as="h2" className="mt-2 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Every deploy, on the board
        </Reveal>

        <div className="mt-12 flex justify-center overflow-x-auto rounded-2xl bg-black/40 px-6 py-10 sm:px-12">
          <SplitFlapBoard />
        </div>
      </div>
    </section>
  );
}
