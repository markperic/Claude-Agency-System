import { Reveal, ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 46 — CTA, Split with Visual
 * Copy + CTA left, gradient visual right — a closing section with more
 * visual weight than the plain banner (module 12). Effect: A on copy, E on
 * the visual.
 */
export default function CtaSplitVisual() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Ready when you are
          </Reveal>
          <Reveal effect="A" as="h2" className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Build your next page in an afternoon, not a sprint
          </Reveal>
          <Reveal
            effect="A"
            as="div"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-8"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <ScrollReveal effect="E" className="aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
      </div>
    </section>
  );
}
