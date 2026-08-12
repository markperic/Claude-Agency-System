import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 11 — Team Grid
 * Photo, name, role, repeated. Effect: F (Stagger) of Effect E (Scale In) — a
 * slightly different feel from the default card stagger used elsewhere.
 */
const TEAM = [
  { name: "Alex Kim", role: "Founder" },
  { name: "Sam Okafor", role: "Lead Designer" },
  { name: "Riley Chen", role: "Developer" },
  { name: "Morgan Lee", role: "Strategist" },
];

export default function TeamGrid() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="h2" className="text-3xl font-semibold tracking-tight text-zinc-950">
          The team
        </ScrollReveal>

        <StaggerGroup className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TEAM.map((person) => (
            <ScrollReveal effect="E" key={person.name}>
              <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
              <div className="mt-3 text-sm font-medium text-zinc-950">{person.name}</div>
              <div className="text-sm text-zinc-500">{person.role}</div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
