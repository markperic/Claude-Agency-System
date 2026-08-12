import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 44 — Pricing, Minimal Centered
 * No card, no border, no feature list — just a price and a CTA. For a
 * pricing section that needs to feel understated rather than salesy.
 * Effect: B (fade in) on the price, F (stagger) on the line below.
 */
export default function PricingMinimalCentered() {
  return (
    <section className="bg-white px-6 py-32 text-center">
      <Reveal effect="A" as="p" className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Pricing
      </Reveal>
      <Reveal effect="B" as="div" className="mt-4 text-6xl font-semibold tracking-tight text-zinc-950 sm:text-7xl">
        $39<span className="text-2xl font-normal text-zinc-400">/month</span>
      </Reveal>

      <StaggerGroup className="mt-8 flex flex-col items-center gap-6">
        <Reveal effect="A" as="p" className="text-zinc-600">
          Everything included. Cancel anytime.
        </Reveal>
        <Reveal effect="A" as="div">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Get started
          </a>
        </Reveal>
      </StaggerGroup>
    </section>
  );
}
