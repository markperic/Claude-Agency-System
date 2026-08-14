import Image from "next/image";
import { Reveal, ScrollReveal, HoverLift } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { ArrowRight, Play } from "lucide-react";

/**
 * Module 24 — Hero, Device Split with Play Button
 * Split hero: copy + CTA left, a browser-window mockup right with a
 * Pexels placeholder photo standing in for the video frame, and a
 * centered play button on Effect I (hover lift). Visual scales in on Effect E.
 */
export default function HeroDeviceSplit() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            See it in action
          </Reveal>
          <Reveal effect="A" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Watch a page get built in under a minute
          </Reveal>
          <Reveal
            effect="A"
            as="p"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-6 text-lg text-zinc-600"
          >
            A two-minute walkthrough of the module workflow, from a plain
            English instruction to a finished section.
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

        <ScrollReveal effect="E" className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-1.5 bg-zinc-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="relative flex aspect-video items-center justify-center">
            <Image
              src={PLACEHOLDER_IMAGES.landscape11.src}
              alt={PLACEHOLDER_IMAGES.landscape11.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-zinc-950/10" />
            <HoverLift as="button" className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Play className="ml-1 h-6 w-6 fill-zinc-950 text-zinc-950" />
            </HoverLift>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
