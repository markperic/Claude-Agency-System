import Image from "next/image";
import { Reveal, ScrollReveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

/**
 * Module 02 — Hero, Split with Visual
 * Two-column hero: copy + CTA on the left, a local placeholder photo on the right.
 * Title effect: A (Fade Up). Visual effect: E (Scale In), slightly delayed.
 */
export default function HeroSplit() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            New workflow
          </Reveal>
          <Reveal effect="A" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Compose pages from a library you already trust
          </Reveal>
          <Reveal
            effect="A"
            as="p"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-6 text-lg text-zinc-600"
          >
            Point Claude at a module number and it builds from a component
            that&apos;s already well-designed, responsive, and on-brand — not
            a fresh guess every time.
          </Reveal>
          <Reveal
            effect="A"
            as="div"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              See how it works
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <ScrollReveal effect="E" className="relative aspect-4/3 w-full overflow-hidden rounded-2xl">
          <Image
            src={PLACEHOLDER_IMAGES.landscape01.src}
            alt={PLACEHOLDER_IMAGES.landscape01.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
