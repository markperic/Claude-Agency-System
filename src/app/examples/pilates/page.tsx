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
import { TOKENS } from "./content";
import { anton, clashGrotesk } from "@/fonts";

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
