"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { easeIn, easeOut, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CASTING, CLASSES, FAQS, INSTRUCTORS, PHOTOS, PROCESS, REASONING, REASONS, STUDIO, TOKENS } from "./content";

/**
 * Sections for the Pilates example page — a study of agencefoudre.com's
 * scroll architecture rebuilt around studio content.
 *
 * The page is a sequence of pinned "stages" rather than a stack of blocks.
 * Each stage is a tall section containing one `sticky` viewport, and every
 * animation inside it is scrubbed by that section's own `scrollYProgress`.
 * Doing it per-section rather than off one page-level progress value is what
 * keeps each stage reversible on scroll-up and independent of the ones around
 * it — adding a section never re-times its neighbours.
 *
 * Stages, in order:
 *   1. HeroSequence  — card pins, wordmark and headline travel past it,
 *                      colour turns over, side headlines arrive.
 *   2. StackingCards — class cards fly in from the right and stack centre.
 *   3. ZoomStatement — statement type scales through the viewport.
 *   4. SplitTransition — panels rotate away on a hinge to reveal what's behind.
 *
 * A colour-transition rule learned the hard way and applied throughout: never
 * crossfade a foreground and its background between the same two colours over
 * the same scroll range. Both land on the same midpoint simultaneously and the
 * content vanishes into its own background. Route the foreground through a
 * third colour that contrasts with both ends, and move it slightly ahead of
 * the background.
 */

/**
 * Display type. Anton carries its own weight, so this deliberately does not
 * set `font-black` — asking for 900 from a single-weight face makes the
 * browser synthesise a fake bold, which smears the stems at hero sizes.
 */
/**
 * The display setting for every title on this page.
 *
 * `leading-[0.85]` is not just tight tracking taste — it is what makes corner
 * anchoring work. Anton's em box is 1.513em (79/22 ascent/descent at 1em)
 * against a 0.85 line box, so the half-leading is negative and the baseline
 * lands within a fraction of a pixel of the block's bottom edge. A DISPLAY
 * block pinned with `bottom-[var(--gutter)]` therefore sits with its *baseline*
 * on the gutter, which is what the eye measures — measured here at 25.4px
 * bottom against 25.7px left. Anything that changes this leading breaks that
 * equality and the corner lockups start looking low.
 *
 * The overshoot on round caps (O, C, U — about 0.12em) is left to spill below
 * the baseline on purpose. Trimming it would push the flat-bottomed letters,
 * which are what the eye actually reads the edge from, visibly high.
 */
const DISPLAY =
  "font-[family-name:var(--font-display)] font-normal uppercase leading-[0.85] tracking-[-0.015em]";

/**
 * A line of display type that pushes up out of its own mask when scrolled
 * into view.
 *
 * The viewport trigger sits on the *mask*, and the inner span animates by
 * variant propagation. Putting `whileInView` on the inner span instead — the
 * obvious way to write this — deadlocks: at rest that span is translated a
 * full 110% down, which places it entirely outside its `overflow-hidden`
 * parent. IntersectionObserver intersects against ancestor clipping, so the
 * span reports a visible ratio of exactly 0 no matter where the page is
 * scrolled, waits for itself to come into view, and never animates. The text
 * renders, occupies layout, and is simply never seen.
 */
/**
 * Regroups a one-word-per-line stack into two words per line.
 *
 * Both groupings get rendered and toggled by breakpoint rather than reflowed,
 * because these lines are block spans, not wrapping text — there is no wrapping
 * for CSS to redo, so a single grouping cannot serve both widths. Only the
 * spans duplicate; the animated wrapper above them is shared, so the entrance
 * still runs once.
 */
function pairUp(words: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < words.length; i += 2) out.push(words.slice(i, i + 2).join(" "));
  return out;
}

function RevealLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      /* The mask needs slack below the baseline. DISPLAY sets 0.85 leading, but
         Anton's glyphs are taller than that line box, so `overflow-hidden`
         shaves the bottom off descenders and the tails of Q, G and R. The
         padding gives the mask room; the equal negative margin takes the space
         back out of the layout, so the reveal still looks tight. */
      className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <motion.span
        className={`block ${className}`}
        variants={{ hidden: { y: "110%" }, visible: { y: "0%" } }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/* --------------------------------------------------------- 1. hero stage */

/**
 * One card in the hero's three-card slot.
 *
 * Geometry follows the reference: all three cards are concentric in a single
 * slot at 2:3, the front one at full size and the pair behind it at 0.75
 * scale, rather than three independently placed cards. Everything you see
 * either side of the front card is those two peeking out from directly
 * behind it, which is why they converge so cleanly — "aligned" is their
 * natural resting state, not a position they have to be moved into.
 *
 * The flip is a real 3D rotation with two faces rather than a crossfade. A
 * crossfade dissolves one image into another and reads as a slideshow; a flip
 * keeps the card a solid object throughout, which is the whole premise of the
 * pinned sequence. `backfaceVisibility: hidden` on each face is what stops
 * the reversed image showing through as the card passes 90°.
 */
function FlipCard({
  front,
  back,
  x,
  scale,
  rotate,
  opacity,
  rotateY,
  className = "",
}: {
  front: string;
  back: string;
  /** Omitted by the centre card, which holds the middle of the slot. */
  x?: MotionValue<string> | string;
  /** In-plane tilt. Omitted by the centre card, which stays square. */
  rotate?: MotionValue<number> | number;
  /** Omitted by the centre card, which is never retired. */
  opacity?: MotionValue<number> | number;
  scale: MotionValue<number> | number;
  rotateY: MotionValue<number>;
  className?: string;
}) {
  const face =
    "absolute inset-0 overflow-hidden rounded-[24px] bg-black/5 [backface-visibility:hidden]";

  return (
    <motion.div className={`absolute h-full ${className}`} style={{ x, scale, rotate, opacity }}>
      <div className="relative h-full aspect-[45/68] [transform-style:preserve-3d]">
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{ rotateY }}
        >
          <div className={face}>
            <Image src={front} alt="" fill sizes="(max-width: 768px) 60vw, 32vw" className="object-cover" />
          </div>
          <div className={`${face} [transform:rotateY(180deg)]`}>
            <Image src={back} alt="" fill sizes="(max-width: 768px) 60vw, 32vw" className="object-cover" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * The opening stage. The card slot never moves; everything else is timed
 * against it.
 *
 * Beats, as fractions of this section's own scroll:
 * The section is 328vh, down from 440vh. Every beat keeps the absolute scroll
 * distance it had at 440vh — the fractions are scaled, not the pacing — and the
 * 112vh came out of two pieces of nothing: a pause between the headlines
 * landing and the exit starting, and the card's overtravel once it had already
 * left the frame.
 *
 * Beats, as fractions of this section's own scroll:
 *   0.00–0.214 the two outer cards converge to sit exactly behind the front one
 *   0.00–0.188 wordmark travels up past the slot and leaves
 *   0.00–0.456 the bottom-left lockup travels up past the slot and leaves
 *   0.13–0.32  background turns bone → pine, as the lockup clears mid-screen
 *      ~0.214  the outer cards are dropped as they finish hiding
 *   0.27–0.48  the centre card flips to its second image
 *   0.55–0.76  side headlines arrive at the edges
 *   0.77–1.00  the slot lifts 30vh, still holding the upper frame as the
 *              section's bottom edge arrives beneath it
 *   0.77–1.00  the side headlines rise with it at half pace, swinging outward
 *   0.88–0.99  the side headlines fade out behind it
 *
 * The cards sit above the type on z. The reference does the same, and it is
 * what makes the wordmark read as passing *behind* a solid object rather than
 * the two competing for the same plane. Type is separately kept clear of the
 * slot horizontally — the side headlines are capped at 30% width against a
 * slot that is 32vw wide and centred — so nothing ever actually collides.
 *
 * The first two beats deliberately overlap, and their easings are the reason
 * the lockup is never occluded on its way up. Geometry forces it: the lockup
 * rests only ~2vh below the outer cards' bottom edge, so under linear motion it
 * enters their band almost the instant scrolling starts, long before any
 * convergence could clear it. So the two curves are shaped against each other —
 * the cards pull in on an ease-out (most of the travel spent in the first
 * third of the beat, clearing the lockup's column early) while the lockup
 * leaves on an ease-in (barely moving at first, giving the cards their head
 * start). Swapping either for a linear ramp puts the cards back on top of the
 * type for the opening ~10% of the section.
 */
export function HeroSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* The turn starts at 0.10 because that is where the lockup clears the middle
     of the screen — measured, not chosen: resting at 75vh and rising on the
     ease-in below, its top crosses 60vh at p=0.088, 55vh at 0.103 and 50vh at
     0.117. The old 0.34 left a long dead scroll after the type had gone. */
  const background = useTransform(
    scrollYProgress,
    [0, 0.134, 0.322, 1],
    [TOKENS.bone, TOKENS.bone, TOKENS.pine, TOKENS.pine],
  );

  // Type leaves first.
  const wordmarkY = useTransform(scrollYProgress, [0, 0.188], ["0vh", "-78vh"]);
  // Gone before the background reaches pine. The wordmark is pine itself, so
  // any overlap with the turn would have it dissolve into its own backdrop.
  const wordmarkOpacity = useTransform(scrollYProgress, [0.08, 0.175], [1, 0]);
  // Rests at 0 because the lockup is anchored to the bottom-left corner, not
  // pushed down from the top. Same 150vh of travel as before, rebased.
  const headlineY = useTransform(scrollYProgress, [0, 0.456], ["0vh", "-150vh"], { ease: easeIn });
  // Travel still runs to 0.34 — that span is what the crossing above is
  // measured against — but the fade is pulled forward to clear the turn.
  const headlineOpacity = useTransform(scrollYProgress, [0.188, 0.322], [1, 0]);

  /* Outer cards: a touching row at rest, converging to concentric.
   *
   * 86% is derived, not eyeballed. `x` is a percentage of the element's own
   * width and Motion applies translate before scale, so an outer card at 0.75
   * scale needs (50% + 37.5%) = 87.5% of travel for its inner edge to meet the
   * centre card's outer edge exactly. 86 leaves a hair of overlap so a
   * sub-pixel rounding gap can never open between them. */
  const spread = useTransform(scrollYProgress, [0, 0.214], [1, 0], { ease: easeOut });
  const outerLeftX = useTransform(spread, (v) => `calc(var(--card-spread) * ${-v})`);
  const outerRightX = useTransform(spread, (v) => `calc(var(--card-spread) * ${v})`);

  /* The outer cards sit slightly off-square at rest, as the reference's do.
     Driven by `spread` rather than by scroll directly, so the tilt unwinds on
     exactly the same curve that pulls them in and is back to zero the moment
     they land behind the centre card — where any residual angle would show as
     a corner poking out from behind a card meant to be hiding them. Uneven
     angles on purpose: a matched pair reads as a mistake, a mismatched one as
     a hand. */
  const outerLeftRotate = useTransform(spread, (v) => v * -3.2);
  const outerRightRotate = useTransform(spread, (v) => v * 2.4);

  /* The outer cards retire as they finish hiding. Keeping them mounted meant
     they turned with the flip and rode along through the slot's exit, showing
     at the edges as soon as the centre card moved off its own footprint.
     Because `spread` is already 0 from 0.16 onward, this holds them at zero for
     the rest of the section.
   *
   * Derived from `spread`, deliberately, rather than read off scrollYProgress
   * over its own window. A plain `useTransform(scrollYProgress, [0.16, 0.19],
   * [1, 0])` is simple enough that Motion hands it to the compositor as a
   * ViewTimeline-backed WAAPI animation — and that accelerated effect does not
   * clamp past its last keyframe: at timeline progress 0.275, well beyond the
   * 0.19 stop and with fill "both", it still rendered opacity 0.105 while the
   * inline style read 1. Values computed from another MotionValue stay on the
   * main thread, where the clamp behaves. */
  const outerOpacity = useTransform(spread, (v) => Math.min(1, v / 0.02));

  // All three flip together, very slightly staggered so it reads as one object
  // turning rather than three synchronised panels.
  const flipFront = useTransform(scrollYProgress, [0.268, 0.483], [0, 180]);
  const flipOuter = useTransform(scrollYProgress, [0.296, 0.51], [0, 180]);

  // The slot leaves.
  /* The exit begins the moment the side headlines have landed, rather than
     after a pause, and the words fade out with the card rather than riding the
     sticky release. Together with the shorter section that is what closes the
     stretch of empty pine: the card clears the top around 0.91, the words are
     gone by 0.95, and the pine ends 18vh later instead of 150vh later. */
  /* Deliberately short. The card must still be in frame when the section's
     bottom edge arrives, and that is a structural requirement, not a matter of
     taste: anything that clears the frame early leaves a screenful of empty
     pine that still has to scroll past before the next section can appear.
     -118vh did it, and so did -76vh — matching page-scroll rate only meant the
     card reached the top edge exactly as the boundary reached the fold, which
     is still an empty screen.
   *
     At -30vh the card's bottom sits around 53vh at p=1, so it is holding the
     upper half of the frame as the blush edge comes in beneath it. The card
     then leaves because the page moves, not because of any transform of its
     own, which is what makes the handover continuous. The ascent reads as a
     lift into the next section rather than an exit from this one. */
  const slotY = useTransform(scrollYProgress, [0.769, 1], ["0vh", "-30vh"]);
  const slotScale = useTransform(scrollYProgress, [0.769, 1], [1, 0.86]);

  /* A main-thread passthrough of the section's progress.
   *
   * The two opacities below are shaped exactly like the transform Motion hands
   * to the compositor as a ViewTimeline — and that accelerated path does not
   * clamp past its last keyframe, so the words would creep back after the fade.
   * Reading them off a derived value keeps them where the clamp works. */
  const progress = useTransform(scrollYProgress, (v) => v);

  const leftX = useTransform(scrollYProgress, [0.549, 0.703], ["-18%", "0%"]);
  const leftOpacity = useTransform(progress, [0.549, 0.703, 0.88, 0.99], [0, 1, 1, 0]);
  const rightX = useTransform(scrollYProgress, [0.604, 0.758], ["18%", "0%"]);
  const rightOpacity = useTransform(progress, [0.604, 0.758, 0.88, 0.99], [0, 1, 1, 0]);

  /* The words leave with the card but at roughly half its pace — 55vh against
     the slot's 118vh over the same window. Moving together but not in lockstep
     is what gives the exit depth: matched speeds read as one flat plane
     sliding, and the type sitting still while the card climbs reads as the type
     being forgotten.
   *
   * They also swing out as they go, each away from the centre, pivoting on the
   * bottom outer corner so the top of the stack travels furthest. Small angles
   * on purpose — this is a turn away from the reader on the way out, not a
   * flourish. */
  const sideExitY = useTransform(progress, [0.769, 1], ["0vh", "-15vh"]);
  const leftExitRotate = useTransform(progress, [0.769, 1], [0, -7]);
  const rightExitRotate = useTransform(progress, [0.769, 1], [0, 7]);
  const sideColor = useTransform(
    scrollYProgress,
    [0, 0.322, 0.43, 1],
    [TOKENS.rose, TOKENS.rose, TOKENS.blush, TOKENS.blush],
  );

  return (
    <motion.section id="studio" ref={sectionRef} className="relative h-[328vh]" style={{ backgroundColor: background }}>
      {/* --wordmark-size is shared rather than repeated: the slot hangs off the
          wordmark's baseline, so both have to agree on the type size exactly. */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1600px", "--wordmark-size": "clamp(2.5rem, 14.5vw, 20rem)" } as CSSProperties}
      >
        {/* Type layer — below the cards on z. */}
        <motion.h1
          /* 14.5vw is derived from the reference, not picked: there the
             wordmark spans ~79% of the viewport width. Measured in the browser,
             "Pilates studio" sets to 5.466em in Anton, and 0.79 / 5.466 ≈ 0.145
             em per vw. Re-derive this if the wordmark string changes — at two
             words it is twice the em width of one, and the previous 29vw (sized
             for "Pilates" alone at 2.73em) overflowed to 158% of the viewport.

             The longer string is the point: same 79% of width spread over twice
             the letters means a shorter cap height, so the slot crosses far
             less of it and the word stays readable behind the cards.

             Still clamped, because the slot is sized in vh and does not grow
             with the width. 20rem holds the proportion out to ~2200px.

             No max-width: capping the *box* while the font keeps growing only
             overflows it into the parent's `overflow-hidden`. The font clamp is
             what bounds this, not the box.

             pt-[0.3em] is optical, and has to be em rather than vh. Anton's
             ascent overflows a 0.9 line box by 0.303em, so the cap line lands
             above the box top and `overflow-hidden` shears the letter tops off.
             Padding pushes the content down without touching `transform`, which
             Motion owns here for `y`. In em it survives any font-size. */
          className={`${DISPLAY} pointer-events-none absolute inset-x-0 top-[2vh] z-10 px-[var(--gutter)] pt-[0.3em] text-center text-[length:var(--wordmark-size)] text-[color:var(--pine)]`}
          style={{ y: wordmarkY, opacity: wordmarkOpacity, lineHeight: 0.9 }}
        >
          {STUDIO.wordmark}
        </motion.h1>

        {/* The lockup sits in the bottom-left corner, inset by --gutter on both
            axes. `left`/`bottom` rather than padding on a full-width box: the
            old `inset-x-0` + `mx-auto max-w-7xl` centred the block, so its
            distance from the left edge grew with the viewport and stopped
            matching the distance from the bottom. */}
        <motion.div
          className="pointer-events-none absolute bottom-[var(--gutter)] left-[var(--gutter)] z-10"
          style={{ y: headlineY, opacity: headlineOpacity }}
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
              {STUDIO.eyebrow}
            </p>
            {/* Capped so the setting can never reach the centred slot. */}
            <h2 className={`${DISPLAY} text-[13vw] text-[color:var(--rose)] sm:max-w-[26vw] sm:text-[clamp(1.75rem,calc(2rem_+_3.9vw),5.6rem)]`}>
              {STUDIO.heroLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </motion.div>

        {/* Side headlines — also below the cards, and width-capped clear of them. */}
        {/* Above and below the slot on mobile, either side of it from sm up.
            Stacking them vertically is what lets the card grow — beside the
            slot each aside needed 46% of the width, which capped the card at
            whatever was left. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 sm:px-8">
          <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col justify-between pt-[calc(var(--gutter)_+_4.5rem)] pb-[7vh] sm:h-auto sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <motion.h2
              /* Sized off the longest word rather than the longest line. Set
                 one word per line, the widest thing here is "METHOD," at about
                 3.7em in Anton, so the cap is what keeps it inside its column;
                 four lines at 0.85 leading come to 3.4em of height, which is
                 what keeps it inside the fold. */
              className={`${DISPLAY} max-w-[80%] text-[13vw] sm:max-w-[34%] sm:text-[clamp(2rem,8vw,7rem)]`}
              /* Overrides DISPLAY's 0.85 locally. Anton's caps are ~0.92em, so
                 at 0.85 consecutive lines touch — fine for a two-line lockup,
                 crowded for a four-line stack. 1.02 opens a ~0.1em gap.
                 Set inline rather than as a second `leading-` class: both would
                 be present and the winner would be decided by stylesheet order,
                 not by the order written here. It also must not move into
                 DISPLAY, where the 0.85 is what puts the corner lockup's
                 baseline on the gutter. */
              style={{
                x: leftX,
                y: sideExitY,
                rotate: leftExitRotate,
                transformOrigin: "left bottom",
                opacity: leftOpacity,
                color: sideColor,
                lineHeight: 1.02,
              }}
            >
              <span className="block sm:hidden">
                {pairUp(STUDIO.heroAside.left).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden sm:block">
                {STUDIO.heroAside.left.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </motion.h2>
            <motion.h2
              className={`${DISPLAY} self-end max-w-[80%] text-right text-[13vw] sm:max-w-[34%] sm:self-auto sm:text-[clamp(2rem,8vw,7rem)]`}
              style={{
                x: rightX,
                y: sideExitY,
                rotate: rightExitRotate,
                transformOrigin: "right bottom",
                opacity: rightOpacity,
                color: sideColor,
                lineHeight: 1.02,
              }}
            >
              <span className="block sm:hidden">
                {pairUp(STUDIO.heroAside.right).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden sm:block">
                {STUDIO.heroAside.right.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </motion.h2>
          </div>
        </div>

        {/* The slot: three concentric cards, above everything. */}
        <motion.div
          /* Plainly centred in the fold. The trade-off is deliberate: the slot
             is sized in vh with a vw bound, while the wordmark above it is sized
             in vw, so how much of the wordmark the cards cross is a function of
             viewport aspect rather than a fixed amount — wider crops more. An
             earlier version hung the slot off the wordmark's baseline to pin
             that overlap at 35% everywhere, which held the number steady but
             left the cards sitting high on a squarish viewport with dead space
             beneath them. Centred reads better at the sizes that matter. */
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ y: slotY, scale: slotScale }}
        >
          {/* Height-driven so the slot keeps the reference's proportions on any
              viewport; width follows from the 45:68 aspect.

              66vh matches the reference, where the centre card runs about 68%
              of the fold. That is deliberately tall enough to cross the
              wordmark: the cards are meant to occlude its middle letters while
              the outer ones stay readable, which is the whole composition. The
              earlier 44vh was too short to read as an overlap and too tall to
              read as clearance, so it just looked like a collision.

              The vw term is what stops the trio running off the sides. Height
              alone is not enough: the cards are sized in vh but laid out
              side by side, so on a squarish viewport a 66vh card is wide enough
              that the spread overflows. The row spans cardW * (1 + 2 * spread),
              and cardW is 45/68 of the height, so bounding the whole row to
              ~78% of the width gives 66vh ≤ 43vw at the sm spread of 86%, and
              ~92% of the width gives 52vh ≤ 64vw at the base spread of 58%.
              Below those crossovers the width governs and the cards shrink to
              fit rather than bleeding off.
           *
              The mobile numbers are the same calculation run the other way.
              With the asides stacked above and below rather than beside, the
              full width is free, so the limit should be height — but the row's
              width is `2 x max(0.5, spread + 0.375) x cardWidth`, and at a 58%
              spread that is 1.91x the card, which capped it well below the
              space available. Dropping the spread to 18% makes the row only
              1.11x the card, and height finally binds: 104vw crosses 52vh at
              this aspect, so the card is as large as the gap between the two
              asides allows. The cost is that the outer cards peek rather than
              fan, which at phone width they effectively did anyway. */}
          <div className="relative flex h-[min(52vh,104vw)] max-h-[720px] items-center justify-center [--card-spread:18%] sm:h-[min(66vh,43vw)] sm:[--card-spread:86%]">
            <FlipCard
              front={PHOTOS[CASTING.heroFront[1]]}
              back={PHOTOS[CASTING.heroBack[1]]}
              x={outerLeftX}
              scale={0.75}
              rotate={outerLeftRotate}
              opacity={outerOpacity}
              rotateY={flipOuter}
            />
            <FlipCard
              front={PHOTOS[CASTING.heroFront[2]]}
              back={PHOTOS[CASTING.heroBack[2]]}
              x={outerRightX}
              scale={0.75}
              rotate={outerRightRotate}
              opacity={outerOpacity}
              rotateY={flipOuter}
            />
            <FlipCard
              front={PHOTOS[CASTING.heroFront[0]]}
              back={PHOTOS[CASTING.heroBack[0]]}
              scale={1}
              rotateY={flipFront}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ---------------------------------------------------- 2. stacking cards */

/**
 * When each card flies in, as a slice of the section's own scroll.
 *
 * Cards and list rows both read from this, so the two can never disagree about
 * when a card lands — the previous version keyed the rows off a separate
 * hand-written range and they drifted apart whenever either was retuned.
 *
 * Windows overlap by design: a card starts its run well before the previous one
 * has settled, so the pile builds as one continuous motion rather than a queue
 * of discrete arrivals. `SPAN_END` leaves the last of the section clear so the
 * finished stack holds for a beat before the section ends.
 */
const CARD_SPAN_END = 0.82;

function cardWindow(index: number, total: number): [number, number] {
  const step = CARD_SPAN_END / total;
  const start = index * step;
  return [start, Math.min(1, start + step * 1.9)];
}

/**
 * One card flying in from the right and landing on the pile.
 *
 * Every card lands on the same spot in the centre of the screen, each on top of
 * the last, rather than the deck arriving as a rigid row and collapsing
 * afterwards. Landing in one place is what frees the left of the screen for the
 * type — the old row needed the full width to hold six cards before it folded.
 *
 * The resting angle fans slightly from the card's distance either side of
 * centre, so the pile reads as physical cards dropped on each other rather than
 * one image with a hard edge. It is computed, so it stays symmetrical for any
 * number of cards.
 */
function StackCard({
  entry,
  index,
  total,
  progress,
}: {
  entry: (typeof CLASSES)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = cardWindow(index, total);

  /* Far enough right to be clear of the frame before its window opens — the
     card is only off-screen because of this offset, not because it is unmounted,
     so it must start beyond the viewport edge at every width. */
  const ENTRY_X = 320;
  const restRotate = (index - (total - 1) / 2) * 1.6;

  const x = useTransform(progress, [start, end], [`${ENTRY_X}%`, "0%"]);
  const rotate = useTransform(progress, [start, end], [9, restRotate]);

  return (
    <motion.article
      className="absolute w-[62vw] max-w-[330px]"
      style={{ x, rotate, zIndex: index }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-black/5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <Image
          src={PHOTOS[CASTING.classes[index]]}
          alt=""
          fill
          sizes="(max-width: 768px) 62vw, 330px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pt-16">
          <div className="mb-2 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--pine)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className={`${DISPLAY} text-2xl leading-none text-white`}>{entry.title}</h3>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * One row of the class list, lit as its own card flies in.
 *
 * Reads `cardWindow` rather than carrying its own ranges, so a row can never
 * light at a different moment than the card it names.
 */
function ClassCue({
  title,
  index,
  total,
  progress,
}: {
  title: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = cardWindow(index, total);

  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  const x = useTransform(progress, [start, end], [-8, 0]);

  return (
    <motion.li
      className={`${DISPLAY} text-[clamp(1.05rem,2.6vw,2.3rem)] leading-[1.32] text-[color:var(--pine)]`}
      style={{ opacity, x }}
    >
      {title}
    </motion.li>
  );
}

/** The timetable, delivered as a deck that assembles itself in the centre of the screen. */
export function StackingCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* A main-thread passthrough, for the same reason the hero needs one: a
     transform read straight off `scrollYProgress` is simple enough that Motion
     hands it to the compositor as a ViewTimeline-backed animation, and that
     accelerated path does not clamp past its final keyframe. Measured here, a
     list row whose card had long since landed sat at opacity 0.37 instead of 1,
     with its inline style still reading the initial 0.28. Everything in this
     section reads from `progress` so nothing is eligible for that path. */
  const progress = useTransform(scrollYProgress, (v) => v);

  const labelOpacity = useTransform(progress, [0, 0.06, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section id="classes" ref={sectionRef} className="relative h-[360vh] bg-[color:var(--blush)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          /* Dropped to 18vh so the eyebrow clears the fixed nav pill, which sits
             at --gutter from the top and would otherwise crowd it.
           *
             The width is measured against the pile rather than set as a flat
             fraction of the viewport. The cards land centred at 330px wide, so
             the pile's left edge sits 180px left of centre — 165px of half-width
             plus the ~15px the resting fan adds to the bounding box, which is
             easy to forget and worth the measurement. From a 32px gutter,
             leaving an 18px gap means the column can be at most
             50vw - 180 - 32 - 18 = 50vw - 230px. A flat 34vw cleared that by
             only 8px at 1280 and overlapped the pile outright by ~50px at 900,
             because the column grows with the viewport while the pile does not.
             Capped at 400px so it stops widening once the type has room. */
          className="absolute left-4 top-[14vh] z-40 w-[min(72vw,420px)] sm:left-8 sm:top-[18vh] sm:w-[min(calc(50vw-230px),400px)]"
          style={{ opacity: labelOpacity }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
            What we teach
          </p>
          <h2 className={`${DISPLAY} mb-7 text-[11vw] leading-[0.9] text-[color:var(--pine)] sm:text-[clamp(1.5rem,5vw,4.4rem)]`}>
            The timetable
          </h2>

          {/* A pile that lands in one place necessarily buries five of its six
              cards, so the deck alone cannot carry the content. The list keeps
              every class readable and doubles as a progress indicator: each row
              lights as its own card flies in, off the same `cardWindow` the
              cards use, so the two can never disagree. */}
          <ul className="hidden sm:block">
            {CLASSES.map((entry, index) => (
              <ClassCue
                key={entry.title}
                title={entry.title}
                index={index}
                total={CLASSES.length}
                progress={progress}
              />
            ))}
          </ul>
        </motion.div>

        {CLASSES.map((entry, index) => (
          <StackCard
            key={entry.title}
            entry={entry}
            index={index}
            total={CLASSES.length}
            progress={progress}
          />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------- 3. zoom statement */

/**
 * The full-screen zoom. Statement type scales from small to past the edges of
 * the viewport while a photograph counter-zooms behind it, so the two move
 * against each other and the frame feels like it is being pushed through
 * rather than scrolled past.
 *
 * The type does not fade out. It holds full opacity and keeps growing until the
 * next section arrives over it, so the statement is pushed through the frame
 * rather than dissolving inside it — the handover, not the type, is what ends
 * the beat. An earlier version faded from 0.72 to avoid ending on a wall of one
 * or two letters, but that traded the whole point of the zoom for a tidy
 * finish, and left the last stretch of the section holding nothing.
 */
export function ZoomStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Main-thread passthrough — a transform read straight off `scrollYProgress`
     is eligible for Motion's ViewTimeline path, which does not clamp past its
     final keyframe. Opacities are where that shows. */
  const progress = useTransform(scrollYProgress, (v) => v);

  const textScale = useTransform(scrollYProgress, [0, 1], [0.32, 3.6]);
  // Fades in, then holds. No exit — the next section covers it.
  const textOpacity = useTransform(progress, [0, 0.12], [0, 1]);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.45, 1]);
  const imageOpacity = useTransform(progress, [0, 0.25, 0.85], [0.15, 0.4, 0.1]);

  return (
    <section id="ethos" ref={sectionRef} className="relative h-[280vh] bg-[color:var(--pine)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, opacity: imageOpacity }}
        >
          <Image src={PHOTOS[CASTING.zoom]} alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>

        <motion.h2
          className={`${DISPLAY} relative z-10 px-6 text-center text-[clamp(2rem,11vw,9.5rem)] text-[color:var(--blush)]`}
          style={{ scale: textScale, opacity: textOpacity }}
        >
          Aim true
          <br />
          <span className="text-[color:var(--rose)]">and move well.</span>
        </motion.h2>
      </div>
    </section>
  );
}

/* ------------------------------------------------- 3b. reasoning carousel */

/**
 * One card orbiting the carousel.
 *
 * Rather than tweening between hand-placed slots, each card is given a phase
 * offset and its position is derived trigonometrically from that phase. The
 * card rides a circle seen edge-on: `sin` drives horizontal travel, `cos`
 * drives depth, and depth is expressed as scale, opacity and z-index together
 * so the three can never disagree about which card is in front.
 *
 * The advantage over discrete slots is that it genuinely loops. There is no
 * seam where the last card has to jump back to first position, because no card
 * ever occupies a "last" slot — it just keeps going round, and the modulo
 * wraps its phase without any visual discontinuity.
 */
function CarouselCard({
  src,
  index,
  total,
  progress,
}: {
  src: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const TURNS = 1.15;

  /* Every output is rounded to three decimals, and that is a correctness fix
   * rather than tidiness. Motion rounds these values when it serialises them
   * into the server-rendered style attribute, but applies them at full
   * precision on the client — so raw trig output produces `0.50252` on the
   * server against `0.5025203265468894` on the client, and React reports a
   * hydration mismatch for every card on every property. Rounding first makes
   * both sides agree exactly. Three decimals is far below what a sub-pixel
   * transform can express, so nothing is visibly lost. */
  const round = (value: number) => Math.round(value * 1000) / 1000;

  const angle = useTransform(progress, (p) => ((p * TURNS + index / total) % 1) * Math.PI * 2);
  // Remapped from [-1,1] to [0,1] so it reads as "how much toward the front".
  const front = (a: number) => Math.cos(a) * 0.5 + 0.5;

  const x = useTransform(angle, (a) => `calc(var(--orbit) * ${round(Math.sin(a))})`);
  const scale = useTransform(angle, (a) => round(0.72 + 0.28 * front(a)));
  const zIndex = useTransform(angle, (a) => Math.round(front(a) * 100));

  /* No opacity on the cards themselves. Fading them made the ones behind
     translucent, so the card in front showed through its neighbours and the
     stack stopped reading as solid objects. Depth is carried by scale and
     z-order, and by a scrim laid *over* each card — darkening a card leaves it
     opaque, where fading it does not. */
  const scrim = useTransform(angle, (a) => round(0.2 - 0.2 * front(a)));

  return (
    <motion.div className="absolute h-full" style={{ x, scale, zIndex }}>
      <div className="relative h-full aspect-[45/68] overflow-hidden rounded-[24px] bg-black/10 shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
        <Image src={src} alt="" fill sizes="(max-width: 768px) 60vw, 26vw" className="object-cover" />
        <motion.div className="absolute inset-0 bg-[color:var(--pine)]" style={{ opacity: scrim }} />
      </div>
    </motion.div>
  );
}

/** Headline split to both edges, with a rotating carousel of images between them. */
export function ReasoningCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cards = CASTING.carousel.map((i) => PHOTOS[i]);

  /* Main-thread passthrough — see the hero. A transform read straight off
     `scrollYProgress` is eligible for Motion's ViewTimeline path, which does
     not clamp past its final keyframe. */
  const progress = useTransform(scrollYProgress, (v) => v);
  const copyOpacity = useTransform(progress, [0.72, 0.88], [0, 1]);

  return (
    <section id="reasoning" ref={sectionRef} className="relative h-[300vh] bg-[color:var(--bone)]">
      {/* Full width to the page gutter, not `max-w-7xl`. The cap parked the
          headlines inland on anything wide — the carousel is centred on the
          viewport regardless, so capping the row only ever cost the type its
          room. */}
      {/* Top padding clears the fixed nav pill, which sits at --gutter and is
          12 tall — the stacked column is centred, so without it the first
          headline centres up underneath the button. */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-[var(--gutter)] pt-[calc(var(--gutter)_+_4.5rem)] sm:pt-0">
        {/* Stacked below `sm`. The three-column split is a desktop composition:
            at 390px the carousel column came out 119px wide holding 242px
            cards, so they flew off both edges while the headlines were crushed
            to slivers. Stacked, each part gets the full width. */}
        <div className="flex w-full flex-col items-center gap-7 sm:flex-row sm:justify-between sm:gap-0">
          {/* Set one word per line, so the column is sized by the longest word
              rather than the longest phrase — "thinking," is the widest here.
              Leading is opened to 1.02 for the same reason it is on the hero's
              side headlines: DISPLAY's 0.85 is tighter than Anton's ~0.92em
              caps, so stacked lines touch.
           *
              The size is derived from where the cards actually reach, which is
              the real constraint — not from the column, and not from taste.
              Working it back: the cards are sized off height, `min(46vh,500px)`
              at 45:68, so a card is `min(30.4vh,331px)` wide; they orbit to
              ±82% of that about the viewport centre, so the nearest edge any
              card reaches is `50vw - 1.32 x cardWidth`. Leaving 56px for the
              gutter and a gap, and dividing by the widest word's em width gives
              the expression below. That divisor is copy-dependent and worth
              re-deriving whenever the words change: "CHANGE" sets to 2.85em
              where "THINKING," set to 3.56em, and leaving the old figure in
              place cost 25% of the available size for nothing.
           *
              It has to track height as well as width because the cards do: on a
              1280x800 viewport that resolves to ~91px, and on 1280x1080 to
              ~52px, since the taller frame grows the cards and the orbit with
              them. A flat vw value cannot express that — 7.5vw looked right at
              one size and put the comma underneath a card. */}
          <h2
            className={`${DISPLAY} w-full shrink-0 text-[13vw] text-[color:var(--pine)] sm:w-[30%] sm:text-[clamp(1.5rem,calc(17.5vw_-_min(14.1vh,153px)_-_20px),9rem)]`}
            style={{ lineHeight: 1.02 }}
          >
            <span className="block sm:hidden">
              {pairUp(REASONING.left).map((line) => (
                <RevealLine key={line}>{line}</RevealLine>
              ))}
            </span>
            <span className="hidden sm:block">
              {REASONING.left.map((line) => (
                <RevealLine key={line}>{line}</RevealLine>
              ))}
            </span>
          </h2>

          {/* --orbit is the same idea as the hero's --card-spread: the sweep is
              a percentage of the card's own width, so it has to come down on
              mobile or the cards leave the screen — and, as in the hero, buying
              it back is what lets the image grow. The row spans
              2 x max(0.5, orbit + 0.375) x cardWidth, so at 44% it was 1.63x
              the card and width bound the height well below the space the
              stacked headlines had freed. At 30% it is 1.35x, and 48vh fits
              across with room to spare. */}
          <div className="relative flex h-[min(42vh,88vw)] max-h-[500px] w-full items-center justify-center [--orbit:30%] sm:h-[46vh] sm:w-[34%] sm:[--orbit:82%]">
            {cards.map((src, index) => (
              <CarouselCard
                key={src}
                src={src}
                index={index}
                total={cards.length}
                progress={scrollYProgress}
              />
            ))}
          </div>

          <h2
            className={`${DISPLAY} w-full shrink-0 text-right text-[13vw] text-[color:var(--rose)] sm:w-[30%] sm:text-[clamp(1.5rem,calc(17.5vw_-_min(14.1vh,153px)_-_20px),9rem)]`}
            style={{ lineHeight: 1.02 }}
          >
            <span className="block sm:hidden">
              {pairUp(REASONING.right).map((line) => (
                <RevealLine key={line}>{line}</RevealLine>
              ))}
            </span>
            <span className="hidden sm:block">
              {REASONING.right.map((line) => (
                <RevealLine key={line}>{line}</RevealLine>
              ))}
            </span>
          </h2>

          {/* In the flow on mobile, pinned to the fold from sm up. Absolute
              positioning was fine while this was three columns, but once the
              headlines stack, the column is tall enough that a paragraph pinned
              to `bottom-[8vh]` lands on top of the second headline. In the flow
              it simply follows it.
           *
              Left-aligned there too: centred copy sitting under a left-aligned
              stack reads as a different element rather than the same thought.
           *
              Sizing was raised from 0.95rem at 70% ink, which was body-copy
              scale on a page where everything around it is display type — it
              read as a caption and got skipped. The alpha was costing as much
              legibility as the size. */}
          <motion.p
            className="w-full text-left text-[clamp(1.05rem,1.55vw,1.5rem)] leading-[1.55] text-[color:var(--ink)]/85 sm:absolute sm:inset-x-0 sm:bottom-[8vh] sm:mx-auto sm:w-auto sm:max-w-2xl sm:px-6 sm:text-center"
            style={{ opacity: copyOpacity }}
          >
            {REASONING.body}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- 4. split transition */

/**
 * The hinge. Two panels covering the viewport rotate away from a central
 * seam — the top hinging on its own top edge, the bottom on its bottom edge —
 * to reveal the section behind them, with a mark rotating at the seam as they
 * part.
 *
 * `perspective` has to sit on the container rather than the panels: applied
 * to an element that is itself rotating, it is computed per-element and the
 * two halves end up with independent vanishing points, so they visibly fail
 * to meet at the seam. On the parent they share one.
 *
 * `backfaceVisibility: hidden` matters once a panel passes 90° — without it
 * the reverse face keeps painting and the panel appears to fold back into
 * frame instead of clearing it.
 */
export function SplitTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* A split, not a door. The panels translate straight off the top and bottom
     edges rather than rotating on a hinge — a rotation always reads as a lid
     opening towards you, because the near edge grows while the far edge
     shrinks. Sliding keeps both panels the same size for the whole move, so
     the screen reads as a single surface being parted down the middle. No
     perspective is involved, which also means no 3D rasterisation cost. */
  const topY = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "-100%"]);
  const bottomY = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);
  /* No opacity animation on the reveal, deliberately.
   *
   * The panels physically cover the copy, so fading it in as well is doing the
   * same job twice — and doing it worse, because the two never agree. On this
   * page transform-driven values track scroll faithfully while opacity-driven
   * ones consistently lag behind them, so the type was still sitting at
   * roughly half strength long after the panels had fully parted, which reads
   * as washed-out colour rather than as a reveal.
   *
   * Letting the panels alone do the revealing is both simpler and truer to
   * what a split actually is. Scale stays, because it is a transform and
   * therefore keeps time correctly. */
  const revealScale = useTransform(scrollYProgress, [0.5, 0.86], [0.94, 1]);

  return (
    <section id="method" ref={sectionRef} className="relative h-[220vh] bg-[color:var(--bone)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ scale: revealScale }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
            The method
          </p>
          {/* 23vw fills 95% of the width on mobile, measured rather than
              guessed: "CONTROL IS" is the longer line at 4.137em, and
              0.95 / 4.137 = 0.23. Re-derive if the copy changes. */}
          <h2 className={`${DISPLAY} text-[23vw] leading-[0.82] text-[color:var(--pine)] sm:text-[clamp(2rem,calc(1.75rem_+_11.8vw),12.5rem)]`}>
            Control is
            <br />
            <span className="text-[color:var(--rose)]">strength.</span>
          </h2>
        </motion.div>

        {/* Each panel carries a full-viewport image anchored to its own outer
            edge — the top half pinned to the top of the screen, the bottom half
            to the bottom — so closed, the two line up into one continuous
            photograph across the seam, and parted, each half takes its own
            portion with it. Anchoring both to `inset-0` instead would show the
            same top crop twice and the seam would read as a mistake.
         *
            `isolate` on each panel is what keeps the blend honest: without a
            stacking context of its own, `mix-blend-multiply` composites against
            everything painted beneath the panel — including the copy it is
            supposed to be hiding — so the headline ghosts through the closed
            curtain. With it, the image blends only with the panel's own pine. */}
        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-1/2 isolate overflow-hidden bg-[color:var(--pine)]"
          style={{ y: topY }}
        >
          <div className="absolute inset-x-0 top-0 h-screen mix-blend-multiply">
            <Image
              src={PHOTOS[CASTING.split]}
              alt=""
              fill
              sizes="100vw"
              /* Lifted before it blends. Multiply only darkens, and it is
                 landing on pine, which is already dark — straight from the file
                 the panels came back as near-black with the subject barely
                 readable. Brightening the source first puts the product back in
                 the midtones, so the photograph reads and the green still
                 tints it rather than swallowing it. */
              className="object-cover brightness-[1.85] contrast-[0.95]"
            />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 h-1/2 isolate overflow-hidden bg-[color:var(--pine)]"
          style={{ y: bottomY }}
        >
          <div className="absolute inset-x-0 bottom-0 h-screen mix-blend-multiply">
            <Image
              src={PHOTOS[CASTING.split]}
              alt=""
              fill
              sizes="100vw"
              className="object-cover brightness-[1.85] contrast-[0.95]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- team */

/**
 * One portrait rising from the lower row into the covering row.
 *
 * Cards travel on Y only and each owns a slice of the section's progress, so
 * they arrive left to right rather than together. Their landing row sits on
 * top of the headline by design — the type is meant to end up occluded, and
 * the cards are given a higher z-index so the occlusion is deterministic
 * rather than a side effect of document order.
 */
function TeamCard({
  instructor,
  photo,
  index,
  total,
  progress,
}: {
  instructor: (typeof INSTRUCTORS)[number];
  photo: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const span = 0.58 / total;
  const start = index * span;
  const end = start + span * 1.5;

  const y = useTransform(progress, [start, end], ["46vh", "0vh"]);

  /* The same fan the hero slot and the timetable pile use, so a card behaves
     the same way wherever it appears on the page. Computed from the card's
     distance either side of centre, so it stays symmetrical for any number of
     portraits, and unwound from a steeper entry angle rather than applied flat
     — a card that rises already square reads as a slide, not a placement. */
  const restRotate = (index - (total - 1) / 2) * 1.9;
  const rotate = useTransform(progress, [start, end], [restRotate * 2.4, restRotate]);

  /* No opacity animation. The cards have to be fully opaque to do their job —
     the point of the sequence is that they cover the headline — and a card
     that rises into place while still translucent lets the type ghost through
     it, which reads as a z-order bug rather than an effect. Travel alone
     carries the entrance. */

  return (
    <motion.article className="group relative w-full sm:w-[22%]" style={{ y, rotate }}>
      <div className="relative aspect-[45/58] overflow-hidden rounded-[18px] bg-black/20 shadow-[0_28px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(max-width: 1024px) 45vw, 22vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {/* Caption sits inside the card, not beneath it. Below the card it
            lands in the same band as the headline's last line and the two
            collide — and since the headline is deliberately being covered,
            there is no arrangement of the row that keeps a caption outside it
            clear. Inside the frame the caption is always legible and the card
            stays a single object. */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12">
          <h3 className={`${DISPLAY} text-lg leading-none text-white`}>{instructor.name}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--rose)]">
            {instructor.discipline}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * The team, as a covering action rather than a grid.
 *
 * The headline is set centred and full-width, and the portraits rise from a
 * row beneath it to a row across it, one after another, until the type is
 * behind them. The section then releases and scrolls on with the headline
 * still covered — the reveal is the covering, not an eventual uncovering.
 */
export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const team = INSTRUCTORS.slice(0, 4);

  /* Main-thread passthrough — see the hero. */
  const progress = useTransform(scrollYProgress, (v) => v);

  /* The headline steps back as the portraits arrive, by changing colour rather
     than by fading. Fading to a third left it washed out — reading as type that
     had failed to load rather than type deliberately behind something — because
     opacity takes the letterforms toward the background's value without ever
     belonging to it. Moving to a lifted pine keeps the words fully opaque and
     crisp while sitting only a step off the ground they are on, which is what
     lets the portraits take the foreground.
   *
     Both colours travel, so the blush/rose pairing holds at the start and
     converges as it recedes; leaving the accent behind would have it flare out
     of a headline that is otherwise stepping back. */
  const headlineColor = useTransform(progress, [0.05, 0.45], [TOKENS.blush, TOKENS.pineLift]);
  const accentColor = useTransform(progress, [0.05, 0.45], [TOKENS.rose, TOKENS.pineLift]);

  return (
    <section id="instructors" ref={sectionRef} className="relative h-[260vh] bg-[color:var(--pine)]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-8">
        <p className="absolute top-[12vh] text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--blush)]/60">
          Who teaches you
        </p>

        <motion.h2
          className={`${DISPLAY} pointer-events-none absolute inset-x-0 z-0 px-4 text-center text-[clamp(2rem,calc(2.2rem_+_10.2vw),11rem)]`}
          style={{ color: headlineColor }}
        >
          Qualified
          <br />
          and in
          <br />
          <motion.span style={{ color: accentColor }}>the room</motion.span>
        </motion.h2>

        {/* Two up on mobile, four across from sm. At four abreast each portrait
            came out 84px wide on a phone — the faces were unreadable and the
            captions inside them worse. Two columns give ~171px, and the row of
            four is a desktop composition anyway. */}
        <div className="relative z-10 grid w-full max-w-6xl grid-cols-2 gap-4 sm:flex sm:items-start sm:justify-between sm:gap-0">
          {team.map((instructor, index) => (
            <TeamCard
              key={instructor.name}
              instructor={instructor}
              photo={PHOTOS[CASTING.team[index]]}
              index={index}
              total={team.length}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- process */

export function Process() {
  return (
    <section id="process" className="relative bg-[color:var(--bone)] px-4 pt-28 pb-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Leading opened to 1.02 for the same reason as the hero's side
            headlines — DISPLAY's 0.85 is tighter than Anton's ~0.92em caps, so
            stacked lines touch. Set inline rather than as a second `leading-`
            class, since two would both be present and stylesheet order, not
            attribute order, would pick the winner.
         *
            The second line takes the rose, so the pair breaks by colour as well
            as by line. RevealLine passes `className` to the span it animates,
            which is the element that needs it — colouring the h2 twice would
            not work, and colouring the mask would be overridden. */}
        <h2
          className={`${DISPLAY} mb-7 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,calc(2rem_+_3.9vw),5.6rem)]`}
          style={{ lineHeight: 1.02 }}
        >
          <RevealLine>We prefer</RevealLine>
          <RevealLine delay={0.08} className="text-[color:var(--rose)]">
            this order.
          </RevealLine>
        </h2>
        <p className="mb-14 max-w-xl text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.6] text-[color:var(--ink)]/80">
          Every programme runs through the same five stages, in the same sequence. It is the
          sequence, more than any single exercise, that produces the result.
        </p>

        {PROCESS.map((entry, index) => (
          <motion.div
            key={entry.step}
            className="relative grid grid-cols-1 gap-4 py-9 sm:grid-cols-[6rem_1fr_2fr]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
          >
            <motion.span
              className="absolute inset-x-0 top-0 h-px origin-left bg-[color:var(--pine)]/25"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className={`${DISPLAY} text-3xl text-[color:var(--rose)]`}>{entry.step}</span>
            <h3 className={`${DISPLAY} text-3xl text-[color:var(--pine)] sm:text-4xl`}>{entry.title}</h3>
            <p className="text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6] text-[color:var(--ink)]/80">
              {entry.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- why us */

export function WhyUs() {
  return (
    <section id="why-us" className="relative bg-[color:var(--bone)] px-4 pt-14 pb-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className={`${DISPLAY} mb-14 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,calc(2rem_+_3.9vw),5.6rem)]`}>
          <RevealLine>Why here</RevealLine>
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.65, delay: index * 0.08 }}
            >
              <h3 className={`${DISPLAY} mb-3 text-[1.7rem] leading-[1.05] text-[color:var(--rose)]`}>{reason.title}</h3>
              <p className="text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6] text-[color:var(--ink)]/80">
                {reason.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- still band */

/**
 * A full-bleed photograph between "Why here" and the FAQ.
 *
 * The three flow sections either side of it are one long unbroken run of bone
 * with nothing but type in it, and by the third the page has lost its rhythm.
 * The band is a rest — no copy, no interaction, just a held image that parallaxes
 * slightly against the scroll so it does not read as a static block.
 *
 * The parallax range is deliberately small. The image is scaled to 118% and
 * moved across ±9% of that overflow, so it can never expose an edge no matter
 * where the section sits in the viewport.
 */
export function StillBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section id="studio-space" ref={sectionRef} className="relative h-[62vh] overflow-hidden bg-[color:var(--pine)]">
      <motion.div className="absolute inset-0 h-[118%] -top-[9%]" style={{ y }}>
        <Image
          src={PHOTOS[CASTING.band]}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="relative bg-[color:var(--bone)] px-4 pt-14 pb-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2
          className={`${DISPLAY} mb-14 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,calc(2rem_+_3.9vw),5.6rem)]`}
          style={{ lineHeight: 1.02 }}
        >
          <RevealLine>Small questions,</RevealLine>
          <RevealLine delay={0.08} className="text-[color:var(--rose)]">
            big answers
          </RevealLine>
        </h2>

        <div className="max-w-3xl">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="border-t border-[color:var(--pine)]/20 last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className={`${DISPLAY} max-w-[85%] text-xl leading-[1.15] text-[color:var(--pine)] sm:text-[1.6rem]`}>{faq.q}</span>
                  <motion.span
                    className="shrink-0 text-2xl leading-none text-[color:var(--rose)]"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    +
                  </motion.span>
                </button>

                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="pb-6 pr-12 text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6] text-[color:var(--ink)]/80">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer */

/**
 * Duplicated content plus a -50% translate is the only way to loop a marquee
 * without a seam; the keyframes already exist in globals.css as
 * `--animate-marquee`, registered there alongside Tailwind's own utilities.
 */
export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-[color:var(--pine)] pt-24 text-[color:var(--blush)]">
      <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Contact</p>
        {/* The page's other two-line display headline, given the same leading so
            the stacked lines are not the only ones on the page still touching. */}
        <h2
          className={`${DISPLAY} mb-8 text-[10vw] sm:text-[clamp(1.75rem,calc(1.9rem_+_3.6vw),5.2rem)]`}
          style={{ lineHeight: 1.02 }}
        >
          <RevealLine>Come and</RevealLine>
          <RevealLine delay={0.08}>move with us.</RevealLine>
        </h2>
        <p className="mb-8 max-w-md text-[0.95rem] leading-relaxed opacity-75">
          Three introductory classes, one reduced rate, no membership. Tell us what your body has
          been doing lately and we&rsquo;ll put you in the right room.
        </p>
        <motion.a
          href="#"
          className="inline-block rounded-full bg-[color:var(--rose)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Book an intro week
        </motion.a>
      </div>

      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <span key={copy} className={`${DISPLAY} shrink-0 pr-8 text-[clamp(3rem,16vw,14rem)] opacity-15`} aria-hidden={copy === 1}>
            {`${STUDIO.wordmark} — ${STUDIO.wordmark} — `}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 text-xs opacity-50 sm:px-8">
        © 2026 {STUDIO.name} Pilates. Example page — photography from Unsplash.
      </div>
    </footer>
  );
}
