import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 19 — Hero, Grid Background
 * Light hero with a faint CSS grid-line background, faded via a radial
 * mask so it's strongest behind the headline and disappears at the edges.
 * Title effect: A (Fade Up).
 */
export default function HeroGrid() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_35%,black_20%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal
          effect="A"
          as="span"
          className="mb-5 inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 uppercase"
        >
          New module
        </Reveal>

        <Reveal effect="A" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Structure you can feel before you read a word
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-600">
            A faded grid gives the page a sense of precision — the kind of
            background a dashboard or dev-tool landing page reaches for.
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
