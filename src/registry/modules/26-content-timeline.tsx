import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 26 — Content, Process Timeline
 * Numbered steps, horizontal on desktop, stacked on mobile. Effect: F
 * (Stagger) of Effect A per step.
 */
const STEPS = [
  { n: "01", title: "Describe the page", body: "Tell Claude which modules and effects to use, in plain English." },
  { n: "02", title: "It assembles the sections", body: "Each instruction resolves to a real, numbered component." },
  { n: "03", title: "Adjust and ship", body: "Swap an effect, tweak copy, and the page is ready to deploy." },
];

export default function ContentTimeline() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="h2" className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          From instruction to finished page
        </ScrollReveal>

        <StaggerGroup className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div aria-hidden className="absolute top-5 left-0 hidden h-px w-full bg-zinc-200 sm:block" />
          {STEPS.map((step) => (
            <ScrollReveal effect="A" key={step.n} className="relative">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-medium text-white">
                {step.n}
              </div>
              <h3 className="mt-4 text-lg font-medium text-zinc-950">{step.title}</h3>
              <p className="mt-2 text-zinc-600">{step.body}</p>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
