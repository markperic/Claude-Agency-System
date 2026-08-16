import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 06 — Stats Row
 * A row of 3–4 large numbers with labels. Effect: F (Stagger) of Effect A.
 */
const STATS = [
  { value: "300+", label: "Modules to choose from as the library grows" },
  { value: "11", label: "Named animation effects, used consistently" },
  { value: "1", label: "Codebase — no per-project rebuild of the basics" },
];

export default function StatsRow() {
  return (
    <section className="bg-zinc-950 px-6 py-20">
      <StaggerGroup className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
        {STATS.map((stat) => (
          <ScrollReveal effect="A" key={stat.label} className="text-center sm:text-left">
            <div className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{stat.value}</div>
            <div className="mt-2 text-sm text-zinc-400">{stat.label}</div>
          </ScrollReveal>
        ))}
      </StaggerGroup>
    </section>
  );
}
