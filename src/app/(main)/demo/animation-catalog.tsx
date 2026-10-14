"use client";

import { useState } from "react";
import {
  ScrollReveal,
  StaggerGroup,
  ParallaxImage,
  HoverLift,
  ShimmerText,
  SplitReveal,
  effectCatalog,
  type AnimationEffect,
} from "@/registry/lib/motion-variants";

/**
 * Not one of the numbered modules — a standalone showcase of the
 * effectCatalog itself. Several letters (C, D, I, J) aren't used by any
 * module yet, so this is the only place in the repo they're demonstrated.
 * Entrance/scroll effects (A-G, J, K) sit hidden until you hover the card —
 * they play on page load elsewhere in the site, but on a showcase page that
 * loads instantly there'd be nothing left to see by the time you looked.
 * Hovering remounts the demo (a fresh key) so it replays every time. H and I
 * are already interaction-driven (scroll the box / hover the pill) and skip
 * this gating.
 */
export default function AnimationCatalog() {
  return (
    <section id="animation-catalog" className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Effect catalog
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Effects A–K
          </h2>
          <p className="mt-3 max-w-xl text-zinc-400">
            Every animated element in every module pulls from this fixed
            vocabulary. Hover a card to play its effect — H plays as you
            scroll inside its own box, I plays on hover already.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* A — Fade Up */}
          <EffectCard letter="A" hint="hover to play">
            <ScrollReveal
              effect="A"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Fades up
            </ScrollReveal>
          </EffectCard>

          {/* B — Fade In */}
          <EffectCard letter="B" hint="hover to play">
            <ScrollReveal
              effect="B"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Plain fade
            </ScrollReveal>
          </EffectCard>

          {/* C — Slide From Left */}
          <EffectCard letter="C" hint="hover to play">
            <ScrollReveal
              effect="C"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              From the left
            </ScrollReveal>
          </EffectCard>

          {/* D — Slide From Right */}
          <EffectCard letter="D" hint="hover to play">
            <ScrollReveal
              effect="D"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              From the right
            </ScrollReveal>
          </EffectCard>

          {/* E — Scale In */}
          <EffectCard letter="E" hint="hover to play">
            <ScrollReveal
              effect="E"
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-zinc-200 to-white"
            />
          </EffectCard>

          {/* F — Stagger Group */}
          <EffectCard letter="F" hint="hover to play">
            <StaggerGroup className="flex items-center gap-2">
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
            </StaggerGroup>
          </EffectCard>

          {/* G — Scroll Reveal */}
          <EffectCard letter="G" hint="hover to play">
            <ScrollReveal
              effect="G"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Reveals on scroll
            </ScrollReveal>
          </EffectCard>

          {/* H — Scroll Parallax (self-contained scroll box) */}
          <EffectCard letter="H" hint="scroll inside this box" hoverToPlay={false}>
            <div className="h-24 w-full overflow-y-auto rounded-lg bg-white/5">
              <div className="flex h-56 items-center justify-center">
                <ParallaxImage strength={36} className="h-14 w-14 rounded-lg bg-white/5">
                  <div className="absolute inset-x-0 top-1/2 h-28 -translate-y-1/2 rounded-lg bg-gradient-to-br from-zinc-200 to-white" />
                </ParallaxImage>
              </div>
            </div>
          </EffectCard>

          {/* I — Hover Lift */}
          <EffectCard letter="I" hint="hover or tap" hoverToPlay={false}>
            <HoverLift className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950">
              Hover me
            </HoverLift>
          </EffectCard>

          {/* J — Gradient Shimmer */}
          <EffectCard letter="J" hint="hover to play">
            <ShimmerText className="text-base font-semibold">
              Gradient shimmer
            </ShimmerText>
          </EffectCard>

          {/* K — Text Reveal (Split) */}
          <EffectCard letter="K" hint="hover to play">
            <SplitReveal as="div" className="text-sm font-semibold text-white">
              Words stagger in
            </SplitReveal>
          </EffectCard>
        </div>
      </div>
    </section>
  );
}

function EffectCard({
  letter,
  hint,
  hoverToPlay = true,
  children,
}: {
  letter: AnimationEffect;
  hint?: string;
  hoverToPlay?: boolean;
  children: React.ReactNode;
}) {
  const meta = effectCatalog[letter];
  const [playKey, setPlayKey] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(!hoverToPlay);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      onMouseEnter={
        hoverToPlay
          ? () => {
              setPlayKey((k) => k + 1);
              setHasPlayed(true);
            }
          : undefined
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-2xl font-bold text-white">{letter}</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
          {meta.kind}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-white">{meta.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">{meta.description}</p>
      <div className="mt-4 flex h-24 items-center justify-center rounded-xl bg-white/[0.04]">
        {hasPlayed ? (
          <div key={playKey} className="contents">
            {children}
          </div>
        ) : (
          <span className="text-xs text-zinc-600">Hover to preview</span>
        )}
      </div>
      {hint && <p className="mt-2 text-center text-[10px] text-zinc-600">{hint}</p>}
    </div>
  );
}
