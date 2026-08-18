import type { CSSProperties } from "react";
import {
  Faq,
  Footer,
  HeroSequence,
  Process,
  ReasoningCarousel,
  SplitTransition,
  StackingCards,
  StillBand,
  Team,
  WhyUs,
  ZoomStatement,
} from "./sections";
import NavSplitCurtain from "@/registry/modules/98-nav-split-curtain";
import { TOKENS } from "./content";
import { anton, clashGrotesk } from "@/fonts";

/**
 * The page's sections, in order, with the label each one should carry in a nav.
 * Not currently mounted to anything — the pill that used it was removed pending
 * a rethink — but the section ids it names are real and set in `sections.tsx`,
 * so it stays as the single place that list is written down.
 *
 * Labels are the section's own subject rather than its mechanic — a reader
 * picking "Method" wants the content, and has no idea it happens to be built as
 * a splitting hinge.
 *
 * `studio-space` is the odd one: it is a full-bleed parallax image band with no
 * heading of its own, so its label is invented rather than taken from the page.
 * It earns a slot because the scrollspy walks this list to decide the current
 * chapter, and omitting a section would leave the pill showing the previous
 * one across a whole screen of scrolling.
 */
export const CHAPTERS = [
  { id: "studio", label: "Studio" },
  { id: "classes", label: "Classes" },
  { id: "ethos", label: "Ethos" },
  { id: "reasoning", label: "Reasoning" },
  { id: "method", label: "Method" },
  { id: "instructors", label: "Instructors" },
  { id: "process", label: "Process" },
  { id: "why-us", label: "Why us" },
  { id: "studio-space", label: "The space" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];
export const metadata = {
  title: "Pilates — Forma Reformer Studio",
  description:
    "Example page: a bold-display, high-negative-space studio layout built as a study of agencefoudre.com's scroll architecture.",
};

/**
 * Example page 3 — "Pilates Studio"
 *
 * Built as a sequence of pinned stages rather than a stack of blocks. Read
 * top to bottom, the page is: a card that holds the centre of the screen
 * while the type travels past it and the colour turns over → a deck of class
 * cards that flies in from the right and assembles → a statement that scales
 * through the viewport → a hinge that folds open to reveal the method.
 *
 * The colour rhythm is the structure, so it is worth reading as a sequence:
 *   [bone ⇢ pine] → pine → blush → pine → bone → bone → bone → pine
 * Only the first bracketed stage animates its background; the rest are flat
 * fills, because more than one animated turnover per page stops being
 * punctuation and starts being a tic.
 *
 * Palette and display stack live here as custom properties so the page can be
 * re-skinned from one place and `sections.tsx` never hard-codes a value.
 *
 * The sections are local to this example rather than numbered catalog
 * modules. That is a deliberate deviation from MODULE-LIBRARY.md that should
 * not outlive the design review — the hero sequence, the stacking deck and
 * the hinge are all worth promoting into the catalog once they settle.
 */
export default function PilatesExamplePage() {
  return (
    <main
      className={`${anton.variable} ${clashGrotesk.variable}`}
      style={
        {
          "--bone": TOKENS.bone,
          "--ink": TOKENS.ink,
          "--pine": TOKENS.pine,
          "--rose": TOKENS.rose,
          "--blush": TOKENS.blush,
          // The page's one edge inset. Anything anchored to a viewport edge —
          // the hero lockup, the nav, the footer marquee — insets by this and
          // nothing else, so a block sitting in a corner reads as the same
          // distance from both edges instead of inheriting whatever padding
          // its own container happened to carry. Scales with the viewport but
          // stops growing on wide displays, where a proportional gutter starts
          // to look like a margin.
          "--gutter": "clamp(1.25rem, 2.5vw, 2.75rem)",
          // Module 86's palette hooks. Rose is the one surface that holds up
          // against all three page backgrounds — it reads on bone, on blush and
          // on pine — which a pill has to do on a page whose sections alternate
          // underneath it.
          // Pine, not rose, because the pill has to read against two different
          // grounds: bone while the page is closed, and the rose curtain while
          // it is open. A rose pill disappears into its own curtain.
          "--nav-surface": TOKENS.pine,
          "--nav-panel": TOKENS.rose,
          "--nav-text": "#fff",
          "--nav-muted": "rgb(255 255 255 / 0.65)",
          "--nav-border": "rgb(255 255 255 / 0.28)",
          "--nav-rule": "rgb(255 255 255 / 0.12)",
          "--nav-hover": "rgb(255 255 255 / 0.1)",
          // Resolves to the self-hosted, fingerprinted Anton emitted by
          // next/font/local, with its own fallback chain behind it.
          "--font-display": "var(--font-anton)",
          // Text face for everything that is not display type. Set on the page
          // root rather than the app layout so the rest of the module catalog
          // keeps its own system stack.
          fontFamily: "var(--font-body)",
          backgroundColor: TOKENS.bone,
          color: TOKENS.ink,
        } as CSSProperties
      }
    >
      <NavSplitCurtain links={CHAPTERS.map(({ id, label }) => ({ href: `#${id}`, label }))} />
      <HeroSequence />
      <StackingCards />
      <ZoomStatement />
      <ReasoningCarousel />
      <SplitTransition />
      <Team />
      <Process />
      <WhyUs />
      <StillBand />
      <Faq />
      <Footer />
    </main>
  );
}
