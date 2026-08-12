import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 32 — Social Proof, Press Mentions
 * "As featured in" row with a pull-quote per outlet, distinct from module
 * 03's plain logo cloud. Effect: F (stagger) of Effect A.
 */
const PRESS = [
  { outlet: "The Verge", quote: "“A genuinely faster way to ship marketing sites.”" },
  { outlet: "TechCrunch", quote: "“Consistency as a feature, not an afterthought.”" },
  { outlet: "Fast Company", quote: "“What a design system should have felt like all along.”" },
];

export default function SocialPress() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="p" className="mb-10 text-center text-sm font-medium tracking-wide text-zinc-500 uppercase">
          As featured in
        </ScrollReveal>
        <StaggerGroup className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {PRESS.map((p) => (
            <ScrollReveal effect="A" key={p.outlet} className="text-center">
              <div className="text-lg font-semibold tracking-tight text-zinc-400">{p.outlet}</div>
              <p className="mt-2 text-sm text-zinc-600">{p.quote}</p>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
