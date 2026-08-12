import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 03 — Logo Cloud
 * Social proof row. Swap the placeholder blocks for real client/partner logos.
 * Effect: F (Stagger) on scroll into view.
 */
const LOGOS = ["Acme", "Globex", "Initech", "Umbrella", "Soylent", "Hooli"];

export default function LogoCloud() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="p" className="mb-8 text-center text-sm font-medium text-zinc-500">
          Trusted by teams at
        </ScrollReveal>
        <StaggerGroup className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 grayscale">
          {LOGOS.map((logo) => (
            <span key={logo} className="text-lg font-semibold tracking-tight text-zinc-500">
              {logo}
            </span>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
