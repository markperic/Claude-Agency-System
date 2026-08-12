import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 01 — Hero, Centered
 * A single-column hero: eyebrow, headline, subhead, two CTAs. No image.
 * Title effect: B (Fade In). Body/CTA group: F (Stagger) of Effect A children.
 */
export default function HeroCentered() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-500 uppercase">
          For growing teams
        </Reveal>

        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Ship a site your clients actually love
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-600">
            A composable module library and a starter kit for building fast,
            consistent marketing sites — without starting from a blank page.
          </Reveal>

          <Reveal effect="A" as="div" className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
            >
              View the library
            </a>
          </Reveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
