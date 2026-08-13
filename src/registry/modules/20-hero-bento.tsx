import { Reveal, StaggerGroup, ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 20 — Hero, Bento Product Grid
 * Split hero: copy + CTA left, a bento-style grid of Pexels placeholder
 * photos right, standing in for a product screenshot mosaic. Tiles stagger in on scale
 * (Effect F wrapping Effect E children).
 */
export default function HeroBento() {
  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            One dashboard
          </Reveal>
          <Reveal effect="A" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Every part of the product, one glance away
          </Reveal>
          <Reveal
            effect="A"
            as="p"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-6 text-lg text-zinc-600"
          >
            A mosaic of tiles instead of one flat screenshot — good for
            products with a few distinct surfaces worth showing off at once.
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

        <StaggerGroup className="grid grid-cols-2 grid-rows-2 gap-4">
          <ScrollReveal effect="E" className="col-span-2 aspect-2/1 overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/265101/pexels-photo-265101.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
              alt="Creative studio desk with a cactus and laptop"
              className="h-full w-full object-cover"
            />
          </ScrollReveal>
          <ScrollReveal effect="E" className="aspect-square overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/36123565/pexels-photo-36123565/free-photo-of-modern-workspace-with-laptop-and-books-on-desk.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
              alt="Modern workspace with a laptop and books"
              className="h-full w-full object-cover"
            />
          </ScrollReveal>
          <ScrollReveal effect="E" className="aspect-square overflow-hidden rounded-2xl">
            <img
              src="https://images.pexels.com/photos/1181473/pexels-photo-1181473.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop"
              alt="Person working at a desktop monitor"
              className="h-full w-full object-cover"
            />
          </ScrollReveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
