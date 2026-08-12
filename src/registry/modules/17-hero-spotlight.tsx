import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 17 — Hero, Spotlight
 * Dark hero with a blurred radial "spotlight" glow behind centered copy.
 * Title effect: B (Fade In). Body/CTA group: F (Stagger) of Effect A.
 */
export default function HeroSpotlight() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-400 uppercase">
          Spotlight
        </Reveal>

        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Every section, lit exactly right
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-400">
            A soft radial glow and a faded grid — the kind of dark hero
            background that makes a headline feel expensive.
          </Reveal>

          <Reveal effect="A" as="div" className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              View the library
            </a>
          </Reveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
