import Image from "next/image";
import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 11 — Team Grid
 * Photo, name, role, repeated. Effect: F (Stagger) of Effect E (Scale In) — a
 * slightly different feel from the default card stagger used elsewhere.
 */
const TEAM = [
  { name: "Alex Kim", role: "Founder", photo: PLACEHOLDER_IMAGES.person07.src },
  { name: "Sam Okafor", role: "Lead Designer", photo: PLACEHOLDER_IMAGES.person11.src },
  { name: "Riley Chen", role: "Developer", photo: PLACEHOLDER_IMAGES.person08.src },
  { name: "Morgan Lee", role: "Strategist", photo: PLACEHOLDER_IMAGES.person05.src },
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
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image src={person.photo} alt={person.name} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
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
