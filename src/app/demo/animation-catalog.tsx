"use client";

import { useState } from "react";
import {
  ScrollReveal,
  StaggerGroup,
  ParallaxImage,
  HoverLift,
  ShimmerText,
  effectCatalog,
  type AnimationEffect,
} from "@/registry/lib/motion-variants";

/**
 * Not one of the 15 numbered modules — a standalone showcase of the
 * effectCatalog itself. Several letters (C, D, I, J) aren't used by any
 * module yet, so this is the only place in the repo they're demonstrated.
 * The replay button remounts the entrance/scroll effects (their key changes)
 * since Reveal/ScrollReveal/ShimmerText only play once per mount.
 */
export default function AnimationCatalog() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <section id="animation-catalog" className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
              Effect catalog
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Effects A–J
            </h2>
            <p className="mt-3 max-w-xl text-zinc-400">
              Every animated element in every module pulls from this fixed
              vocabulary. Effect H replays as you scroll inside its own box;
              I replays on hover; everything else replays with the button.
            </p>
          </div>
          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            ↻ Replay A–G, J
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* A — Fade Up */}
          <EffectCard letter="A">
            <ScrollReveal
              key={replayKey}
              effect="A"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Fades up
            </ScrollReveal>
          </EffectCard>

          {/* B — Fade In */}
          <EffectCard letter="B">
            <ScrollReveal
              key={replayKey}
              effect="B"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Plain fade
            </ScrollReveal>
          </EffectCard>

          {/* C — Slide From Left */}
          <EffectCard letter="C">
            <ScrollReveal
              key={replayKey}
              effect="C"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              From the left
            </ScrollReveal>
          </EffectCard>

          {/* D — Slide From Right */}
          <EffectCard letter="D">
            <ScrollReveal
              key={replayKey}
              effect="D"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              From the right
            </ScrollReveal>
          </EffectCard>

          {/* E — Scale In */}
          <EffectCard letter="E">
            <ScrollReveal
              key={replayKey}
              effect="E"
              className="h-12 w-12 rounded-xl bg-gradient-to-br from-zinc-200 to-white"
            />
          </EffectCard>

          {/* F — Stagger Group */}
          <EffectCard letter="F">
            <StaggerGroup key={replayKey} className="flex items-center gap-2">
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
              <ScrollReveal effect="A" className="h-8 w-8 rounded-full bg-white" />
            </StaggerGroup>
          </EffectCard>

          {/* G — Scroll Reveal */}
          <EffectCard letter="G">
            <ScrollReveal
              key={replayKey}
              effect="G"
              className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950"
            >
              Reveals on scroll
            </ScrollReveal>
          </EffectCard>

          {/* H — Scroll Parallax (self-contained scroll box) */}
          <EffectCard letter="H" hint="scroll inside this box">
            <div className="h-24 w-full overflow-y-auto rounded-lg bg-white/5">
              <div className="flex h-56 items-center justify-center">
                <ParallaxImage
                  strength={36}
                  className="h-14 w-14 rounded-lg bg-gradient-to-br from-zinc-200 to-white"
                />
              </div>
            </div>
          </EffectCard>

          {/* I — Hover Lift */}
          <EffectCard letter="I" hint="hover or tap">
            <HoverLift className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-medium text-zinc-950">
              Hover me
            </HoverLift>
          </EffectCard>

          {/* J — Gradient Shimmer */}
          <EffectCard letter="J">
            <div key={replayKey}>
              <ShimmerText className="text-base font-semibold">
                Gradient shimmer
              </ShimmerText>
            </div>
          </EffectCard>
        </div>
      </div>
    </section>
  );
}

function EffectCard({
  letter,
  hint,
  children,
}: {
  letter: AnimationEffect;
  hint?: string;
  children: React.ReactNode;
}) {
  const meta = effectCatalog[letter];
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-2xl font-bold text-white">{letter}</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium tracking-wide text-zinc-400 uppercase">
          {meta.kind}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-white">{meta.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">{meta.description}</p>
      <div className="mt-4 flex h-24 items-center justify-center rounded-xl bg-white/[0.04]">
        {children}
      </div>
      {hint && <p className="mt-2 text-center text-[10px] text-zinc-600">{hint}</p>}
    </div>
  );
}
