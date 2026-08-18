"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
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
  rotateY,
  className = "",
}: {
  front: string;
  back: string;
  x: MotionValue<string>;
  scale: MotionValue<number> | number;
  rotateY: MotionValue<number>;
  className?: string;
}) {
  const face =
    "absolute inset-0 overflow-hidden rounded-[24px] bg-black/5 [backface-visibility:hidden]";

  return (
    <motion.div className={`absolute h-full ${className}`} style={{ x, scale }}>
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
 *   0.00–0.20  wordmark and headline travel up past the slot and leave
 *   0.20–0.34  the two outer cards converge to sit exactly behind the front one
 *   0.34–0.46  background turns bone → pine
 *   0.40–0.56  all three cards flip to their second image
 *   0.56–0.74  side headlines arrive at the edges
 *   0.80–1.00  the slot rises and leaves the frame
 *
 * The cards sit above the type on z. The reference does the same, and it is
 * what makes the wordmark read as passing *behind* a solid object rather than
 * the two competing for the same plane. Type is separately kept clear of the
 * slot horizontally — the side headlines are capped at 30% width against a
 * slot that is 32vw wide and centred — so nothing ever actually collides.
 */
export function HeroSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.34, 0.46, 1],
    [TOKENS.bone, TOKENS.bone, TOKENS.pine, TOKENS.pine],
  );

  // Type leaves first.
  const wordmarkY = useTransform(scrollYProgress, [0, 0.2], ["0vh", "-78vh"]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.12, 0.2], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.34], ["70vh", "-80vh"]);
  const headlineOpacity = useTransform(scrollYProgress, [0.26, 0.34], [1, 0]);

  /* Outer cards: a touching row at rest, converging to concentric.
   *
   * 86% is derived, not eyeballed. `x` is a percentage of the element's own
   * width and Motion applies translate before scale, so an outer card at 0.75
   * scale needs (50% + 37.5%) = 87.5% of travel for its inner edge to meet the
   * centre card's outer edge exactly. 86 leaves a hair of overlap so a
   * sub-pixel rounding gap can never open between them. */
  const spread = useTransform(scrollYProgress, [0.2, 0.34], [1, 0]);
  const outerLeftX = useTransform(spread, (v) => `calc(var(--card-spread) * ${-v})`);
  const outerRightX = useTransform(spread, (v) => `calc(var(--card-spread) * ${v})`);
  const centreX = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

  // All three flip together, very slightly staggered so it reads as one object
  // turning rather than three synchronised panels.
  const flipFront = useTransform(scrollYProgress, [0.4, 0.56], [0, 180]);
  const flipOuter = useTransform(scrollYProgress, [0.42, 0.58], [0, 180]);

  // The slot leaves.
  const slotY = useTransform(scrollYProgress, [0.8, 1], ["0vh", "-118vh"]);
  const slotScale = useTransform(scrollYProgress, [0.8, 1], [1, 0.86]);

  const leftX = useTransform(scrollYProgress, [0.56, 0.74], ["-18%", "0%"]);
  const leftOpacity = useTransform(scrollYProgress, [0.56, 0.74], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.62, 0.8], ["18%", "0%"]);
  const rightOpacity = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const sideColor = useTransform(
    scrollYProgress,
    [0, 0.46, 0.54, 1],
    [TOKENS.rose, TOKENS.rose, TOKENS.blush, TOKENS.blush],
  );

  return (
    <motion.section ref={sectionRef} className="relative h-[440vh]" style={{ backgroundColor: background }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: "1600px" }}>
        {/* Type layer — below the cards on z. */}
        <motion.h1
          /* Clamped, not raw vw. At 19vw the wordmark keeps growing past any
             sensible size on a wide display — 486px on a 2560 screen — and the
             card slot, which is sized in vh, does not grow with it, so the two
             fall out of proportion. The cap freezes the relationship at roughly
             what a 1400px window gives. */
          className={`${DISPLAY} pointer-events-none absolute inset-x-0 top-[4vh] z-10 mx-auto max-w-[1500px] px-[2vw] text-center text-[clamp(2.5rem,19vw,16.5rem)] text-[color:var(--pine)]`}
          style={{ y: wordmarkY, opacity: wordmarkOpacity, lineHeight: 0.98 }}
        >
          {STUDIO.wordmark}
        </motion.h1>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 sm:px-8"
          style={{ y: headlineY, opacity: headlineOpacity }}
        >
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
              {STUDIO.eyebrow}
            </p>
            {/* Capped so the setting can never reach the centred slot. */}
            <h2 className={`${DISPLAY} text-[13vw] text-[color:var(--rose)] sm:max-w-[26vw] sm:text-[clamp(1.75rem,6.5vw,5.6rem)]`}>
              {STUDIO.heroLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </motion.div>

        {/* Side headlines — also below the cards, and width-capped clear of them. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 sm:px-8">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between">
            <motion.h2
              className={`${DISPLAY} max-w-[42%] text-[8.5vw] sm:max-w-[30%] sm:text-[clamp(1.5rem,6vw,5.2rem)]`}
              style={{ x: leftX, opacity: leftOpacity, color: sideColor }}
            >
              We bring
              <br />
              the method,
            </motion.h2>
            <motion.h2
              className={`${DISPLAY} max-w-[42%] text-right text-[8.5vw] sm:max-w-[30%] sm:text-[clamp(1.5rem,6vw,5.2rem)]`}
              style={{ x: rightX, opacity: rightOpacity, color: sideColor }}
            >
              you bring
              <br />
              the work.
            </motion.h2>
          </div>
        </div>

        {/* The slot: three concentric cards, above everything. */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pb-[14vh]"
          style={{ y: slotY, scale: slotScale }}
        >
          {/* Height-driven so the slot keeps the reference's proportions on any
              viewport; width follows from the 45:68 aspect. */}
          {/* Height-driven so the slot keeps the reference's proportions on any
              viewport; width follows from the 45:68 aspect. Sat above centre to
              leave the lower third of the fold for the headline. */}
          <div className="relative flex h-[38vh] max-h-[470px] items-center justify-center [--card-spread:58%] sm:h-[44vh] sm:[--card-spread:86%]">
            <FlipCard
              front={PHOTOS[CASTING.heroFront[1]]}
              back={PHOTOS[CASTING.heroBack[1]]}
              x={outerLeftX}
              scale={0.75}
              rotateY={flipOuter}
            />
            <FlipCard
              front={PHOTOS[CASTING.heroFront[2]]}
              back={PHOTOS[CASTING.heroBack[2]]}
              x={outerRightX}
              scale={0.75}
              rotateY={flipOuter}
            />
            <FlipCard
              front={PHOTOS[CASTING.heroFront[0]]}
              back={PHOTOS[CASTING.heroBack[0]]}
              x={centreX}
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
 * One card flying in from the right and landing on the stack.
 *
 * Each card owns a slice of the parent's progress, and the slices overlap by
 * design — a card begins its run before the previous one has finished, so the
 * stack builds as a continuous motion instead of a queue of discrete arrivals.
 *
 * The landing offsets are computed from the card's distance either side of
 * centre, which keeps the finished stack symmetrical for any number of cards
 * rather than needing hand-tuned values per card.
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
  /*
   * Three positions, in order: off to the right as an evenly spaced row, the
   * row held in frame, then collapsed into the centre stack.
   *
   * Every card shares one entry offset, so the row travels as a rigid unit
   * rather than each card arriving on its own schedule — that is what makes it
   * read as one strip of cards sliding in rather than six independent
   * animations. The even spacing comes from the card's distance either side of
   * centre, so it holds for any number of cards.
   *
   * ROW_STEP is expressed in percent of the card's own width: 112 leaves a 12%
   * gutter between neighbours.
   */
  const ROW_STEP = 112;
  const ENTRY = 300;

  const offsetFromCentre = index - (total - 1) / 2;
  const rowX = offsetFromCentre * ROW_STEP;
  const stackX = offsetFromCentre * 7;

  const x = useTransform(
    progress,
    [0, 0.5, 0.64, 1],
    [`${rowX + ENTRY}%`, `${rowX}%`, `${rowX}%`, `${stackX}%`],
  );

  return (
    <motion.article
      className="absolute w-[62vw] max-w-[280px]"
      style={{ x, zIndex: index }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-black/5 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <Image
          src={PHOTOS[CASTING.classes[index]]}
          alt=""
          fill
          sizes="(max-width: 768px) 62vw, 280px"
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
 * One row of the class list, lit as its card crosses into frame.
 *
 * The cards now travel as a single rigid row and all settle together, so there
 * is no per-card landing moment to key off any more. Instead each row lights
 * across the strip's travel in index order, which still reads as "this one,
 * now this one" while matching what the eye actually sees arriving.
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
  const span = 0.5 / total;
  const lit = index * span;

  const opacity = useTransform(progress, [lit, lit + span], [0.28, 1]);
  const x = useTransform(progress, [lit, lit + span], [-6, 0]);

  return (
    <motion.li
      className={`${DISPLAY} text-base leading-[1.6] text-[color:var(--pine)]`}
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

  const labelOpacity = useTransform(scrollYProgress, [0, 0.06, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative h-[360vh] bg-[color:var(--blush)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          className="absolute left-4 top-[10vh] z-40 w-[min(34vw,420px)] sm:left-8"
          style={{ opacity: labelOpacity }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
            What we teach
          </p>
          <h2 className={`${DISPLAY} mb-8 text-[9vw] text-[color:var(--pine)] sm:text-[clamp(1.5rem,4vw,3.4rem)]`}>
            The timetable
          </h2>

          {/* A stack that lands in one place necessarily buries five of its six
              cards, so the deck alone cannot carry the content. The list keeps
              every class readable and doubles as a progress indicator: each
              row lights as its own card touches down, off the same ranges the
              cards use, so the two can never disagree. */}
          <ul className="hidden sm:block">
            {CLASSES.map((entry, index) => (
              <ClassCue
                key={entry.title}
                title={entry.title}
                index={index}
                total={CLASSES.length}
                progress={scrollYProgress}
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
            progress={scrollYProgress}
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
 * Opacity is deliberately keyed to fade before the type reaches its largest
 * size. Letting it scale to 4× at full opacity means the last thing on screen
 * is a wall of one or two letters, which reads as a rendering fault; fading
 * from 0.72 onward lets it dissolve while it still resolves as words.
 */
export function ZoomStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [0.32, 3.6]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.72, 0.94], [0, 1, 1, 0]);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.45, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85], [0.15, 0.4, 0.1]);

  return (
    <section ref={sectionRef} className="relative h-[280vh] bg-[color:var(--pine)]">
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

  const x = useTransform(angle, (a) => `${round(Math.sin(a) * 82)}%`);
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
  const copyOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-[color:var(--bone)]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <h2 className={`${DISPLAY} w-[30%] shrink-0 text-[7.5vw] text-[color:var(--pine)] sm:text-[clamp(1.25rem,4.6vw,4rem)]`}>
            {REASONING.left.map((line) => (
              <RevealLine key={line}>{line}</RevealLine>
            ))}
          </h2>

          <div className="relative flex h-[46vh] max-h-[500px] w-[34%] items-center justify-center">
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

          <h2 className={`${DISPLAY} w-[30%] shrink-0 text-right text-[7.5vw] text-[color:var(--rose)] sm:text-[clamp(1.25rem,4.6vw,4rem)]`}>
            {REASONING.right.map((line) => (
              <RevealLine key={line}>{line}</RevealLine>
            ))}
          </h2>
        </div>

        <motion.p
          className="absolute inset-x-0 bottom-[8vh] mx-auto max-w-xl px-6 text-center text-[0.95rem] leading-relaxed text-[color:var(--ink)]/70"
          style={{ opacity: copyOpacity }}
        >
          {REASONING.body}
        </motion.p>
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
    <section ref={sectionRef} className="relative h-[220vh] bg-[color:var(--bone)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ scale: revealScale }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--pine)]/60">
            The method
          </p>
          <h2 className={`${DISPLAY} text-[15vw] leading-[0.82] text-[color:var(--pine)] sm:text-[clamp(2rem,14vw,12.5rem)]`}>
            Control is
            <br />
            <span className="text-[color:var(--rose)]">strength.</span>
          </h2>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-1/2 bg-[color:var(--pine)]"
          style={{ y: topY }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-[color:var(--pine)]"
          style={{ y: bottomY }}
        />
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

  /* No opacity animation. The cards have to be fully opaque to do their job —
     the point of the sequence is that they cover the headline — and a card
     that rises into place while still translucent lets the type ghost through
     it, which reads as a z-order bug rather than an effect. Travel alone
     carries the entrance. */

  return (
    <motion.article className="group relative w-[22%]" style={{ y }}>
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

  /* The headline steps back as the portraits arrive. Covering type with images
     alone left the two fighting — the display face is heavy enough that it kept
     reading as the subject even with cards on top of it. Dropping it to a
     third makes the portraits the subject and leaves the words as texture
     behind them, which is what the covering was for. */
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.45], [1, 0.32]);

  return (
    <section ref={sectionRef} className="relative h-[260vh] bg-[color:var(--pine)]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-8">
        <p className="absolute top-[12vh] text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--blush)]/60">
          Who teaches you
        </p>

        <motion.h2
          className={`${DISPLAY} pointer-events-none absolute inset-x-0 z-0 px-4 text-center text-[clamp(2rem,13vw,11rem)] text-[color:var(--blush)]`}
          style={{ opacity: headlineOpacity }}
        >
          Qualified
          <br />
          and in
          <br />
          <span className="text-[color:var(--rose)]">the room</span>
        </motion.h2>

        <div className="relative z-10 flex w-full max-w-6xl items-start justify-between">
          {team.map((instructor, index) => (
            <TeamCard
              key={instructor.name}
              instructor={instructor}
              photo={PHOTOS[CASTING.team[index]]}
              index={index}
              total={team.length}
              progress={scrollYProgress}
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
    <section className="relative bg-[color:var(--bone)] px-4 pt-28 pb-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className={`${DISPLAY} mb-7 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,6.5vw,5.6rem)]`}>
          <RevealLine>We prefer</RevealLine>
          <RevealLine delay={0.08}>this order.</RevealLine>
        </h2>
        <p className="mb-14 max-w-md text-[0.95rem] leading-relaxed text-[color:var(--ink)]/70">
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
            <p className="text-[0.95rem] leading-relaxed text-[color:var(--ink)]/70">{entry.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- why us */

export function WhyUs() {
  return (
    <section className="relative bg-[color:var(--bone)] px-4 pt-14 pb-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className={`${DISPLAY} mb-14 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,6.5vw,5.6rem)]`}>
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
              <p className="text-[0.95rem] leading-relaxed text-[color:var(--ink)]/70">{reason.body}</p>
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
    <section ref={sectionRef} className="relative h-[62vh] overflow-hidden bg-[color:var(--pine)]">
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
    <section className="relative bg-[color:var(--bone)] px-4 pt-14 pb-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className={`${DISPLAY} mb-14 text-[11vw] text-[color:var(--pine)] sm:text-[clamp(1.75rem,6.5vw,5.6rem)]`}>
          <RevealLine>Small questions,</RevealLine>
          <RevealLine delay={0.08}>big answers</RevealLine>
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
                  <p className="pb-6 pr-12 text-[0.95rem] leading-relaxed text-[color:var(--ink)]/70">{faq.a}</p>
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
    <footer className="relative overflow-hidden bg-[color:var(--pine)] pt-24 text-[color:var(--blush)]">
      <div className="mx-auto mb-20 max-w-7xl px-4 sm:px-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Contact</p>
        <h2 className={`${DISPLAY} mb-8 text-[10vw] sm:text-[clamp(1.75rem,6vw,5.2rem)]`}>
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
