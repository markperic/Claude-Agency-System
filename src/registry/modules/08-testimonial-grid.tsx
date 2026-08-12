import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";

/**
 * Module 08 — Testimonial Grid
 * 3 short quotes in cards. Effect: F (Stagger) entrance + I (Hover Lift) per card.
 */
const QUOTES = [
  { quote: "The consistency is the whole point — every page feels like it belongs together.", name: "Priya N.", role: "Founder" },
  { quote: "Client sign-off on the wireframe stage alone saved us a week per project.", name: "Owen T.", role: "Agency Lead" },
  { quote: "Animation that actually matches the design system instead of fighting it.", name: "Casey M.", role: "Designer" },
];

export default function TestimonialGrid() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {QUOTES.map((t) => (
            <ScrollReveal effect="A" key={t.name}>
              <HoverLift className="h-full rounded-2xl border border-zinc-200 bg-white p-6">
                <p className="text-zinc-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 text-sm font-medium text-zinc-950">{t.name}</div>
                <div className="text-sm text-zinc-500">{t.role}</div>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
