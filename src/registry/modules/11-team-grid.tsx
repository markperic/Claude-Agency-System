import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 11 — Team Grid
 * Photo, name, role, repeated. Effect: F (Stagger) of Effect E (Scale In) — a
 * slightly different feel from the default card stagger used elsewhere.
 */
const TEAM = [
  { name: "Alex Kim", role: "Founder", photo: "https://images.pexels.com/photos/38581713/pexels-photo-38581713/free-photo-of-confident-businesswoman-in-black-blazer.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" },
  { name: "Sam Okafor", role: "Lead Designer", photo: "https://images.pexels.com/photos/28442318/pexels-photo-28442318/free-photo-of-confident-businessman-in-formal-suit-portrait.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" },
  { name: "Riley Chen", role: "Developer", photo: "https://images.pexels.com/photos/27086922/pexels-photo-27086922/free-photo-of-a-woman-in-a-business-suit-smiling.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" },
  { name: "Morgan Lee", role: "Strategist", photo: "https://images.pexels.com/photos/31880869/pexels-photo-31880869/free-photo-of-professional-portrait-of-a-businessman-in-suit.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" },
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
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 text-sm font-medium text-zinc-950">{person.name}</div>
              <div className="text-sm text-zinc-500">{person.role}</div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
