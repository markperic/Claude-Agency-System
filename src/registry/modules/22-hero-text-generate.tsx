import { Reveal, ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

const HEADLINE = "Watch every word arrive exactly when it should";

/**
 * Module 22 — Hero, Text Generate
 * The headline is split into words and staggered in via Effect F wrapping
 * Effect A children — same vocabulary as the rest of the catalog, just
 * applied at word granularity instead of section granularity.
 */
export default function HeroTextGenerate() {
  const words = HEADLINE.split(" ");

  return (
    <section className="bg-white px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Text generate
        </Reveal>

        <StaggerGroup
          as="h1"
          className="flex flex-wrap justify-center gap-x-3 text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl"
        >
          {words.map((word, i) => (
            <ScrollReveal key={`${word}-${i}`} effect="A" as="span">
              {word}
            </ScrollReveal>
          ))}
        </StaggerGroup>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-600">
            Each word plays Effect A on its own tiny delay, so the headline
            visibly builds itself rather than just appearing.
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
