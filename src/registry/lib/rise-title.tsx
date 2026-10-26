"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import {
  easeOut,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * RiseTitle — a big section title that rises out of an invisible horizon as it
 * scrolls into view. The bottom edge of the `overflow-hidden` heading box is
 * the horizon: each word starts just below it and rises into place, the first
 * word leading and the rest a beat behind. Scroll-linked, so it plays forwards
 * and backwards with the page. Lifted from a client's "What we do" scroll
 * section, whose title did exactly this, and shared by modules 103 and 104.
 *
 * Progress runs 0 -> 1 as the heading's top edge travels from 85% of the way
 * down the viewport up to 45% of the way down it, so the rise starts once the
 * heading is well on screen (not the moment its edge appears) and has landed
 * before the heading reaches its resting position.
 *
 * Progress is re-published through a plain motion value rather than used
 * straight from `scrollYProgress`: transforms derived directly from `useScroll`
 * can be handed to the browser as native scroll-timeline animations, which
 * don't honour multi-stop ranges consistently. Deriving from a JS-driven value
 * keeps every word on one clock.
 *
 * Sizing: the title is sized from the width of its own container (container
 * query units), so it fills a row the same way at any viewport. `fit` is the
 * title's widest line in ems at this weight and tracking — the font size is
 * `100cqw / fit`, so the line just fits — capped at `maxRem`. "OUR WORK"-length
 * titles are ~5-6em wide, "OUR PARTNERS" ~6.9em; leave a little slack. The
 * heading is `whitespace-nowrap`, so a `fit` that's too small shows as sideways
 * overflow rather than a wrap.
 *
 * Reduced motion gets the plain heading. Colour and font are the caller's
 * (`className` / `style`); weight, leading, tracking and caps are built in.
 */

/** One word, starting just below the heading box's bottom edge and rising to rest over its slice of the progress. */
function RiseWord({
  p,
  text,
  from,
  to,
}: {
  p: MotionValue<number>;
  text: string;
  from: number;
  to: number;
}) {
  const y = useTransform(p, [from, to], ["1.1em", "0em"], { ease: easeOut });
  return (
    <motion.span aria-hidden className="inline-block" style={{ y }}>
      {text}
    </motion.span>
  );
}

const BASE = "leading-[0.88] font-extrabold tracking-[-0.06em] whitespace-nowrap uppercase";

export function RiseTitle({
  words,
  className = "",
  style,
  fit = 7,
  maxRem = 10.3,
}: {
  /** The title, one entry per word group that rises separately (e.g. ["Our", "work"]). */
  words: string[];
  className?: string;
  style?: CSSProperties;
  /** Widest line of the title in ems; the font size is 100cqw / fit. */
  fit?: number;
  /** Font-size ceiling, in rem. */
  maxRem?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 45%"],
  });
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));
  // The "change" event only fires on scroll; pick up the starting value too
  // (e.g. a reload that restores a scrolled position, or an anchor jump).
  useEffect(() => {
    p.set(scrollYProgress.get());
  }, [p, scrollYProgress]);

  const label = words.join(" ");
  const headingStyle: CSSProperties = { ...style, fontSize: `min(calc(100cqw / ${fit}), ${maxRem}rem)` };

  return (
    <div className="w-full [container-type:inline-size]">
      {reduceMotion ? (
        <h2 className={`${BASE} ${className}`} style={headingStyle}>
          {label}
        </h2>
      ) : (
        <h2
          ref={ref}
          aria-label={label}
          className={`${BASE} ${className} overflow-hidden px-[0.04em]`}
          style={headingStyle}
        >
          {words.map((word, i) => (
            <Fragment key={word}>
              {i > 0 ? " " : null}
              <RiseWord p={p} text={word} from={i * 0.15} to={Math.min(0.95, 0.75 + i * 0.2)} />
            </Fragment>
          ))}
        </h2>
      )}
    </div>
  );
}
