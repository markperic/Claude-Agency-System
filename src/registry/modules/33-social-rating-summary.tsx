import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { Star } from "lucide-react";

/**
 * Module 33 — Social Proof, Rating Summary
 * A large average rating with review count, plus three short snippets.
 * Effect: B on the score, F (stagger) of Effect A on the snippets.
 */
const SNIPPETS = [
  { name: "Dana R.", quote: "Cut our build time in half and it still looks custom." },
  { name: "Theo B.", quote: "The animation system alone was worth switching for." },
  { name: "Ines V.", quote: "Finally, a component library that stays consistent." },
];

export default function SocialRatingSummary() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <ScrollReveal effect="B" className="flex flex-col items-center">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-zinc-950 text-zinc-950" />
            ))}
          </div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">4.9 / 5</div>
          <p className="mt-1 text-sm text-zinc-500">Based on 214 reviews</p>
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-8 border-t border-zinc-100 pt-12 sm:grid-cols-3">
          {SNIPPETS.map((s) => (
            <ScrollReveal effect="A" key={s.name} className="text-left">
              <p className="text-zinc-700">&ldquo;{s.quote}&rdquo;</p>
              <div className="mt-3 text-sm font-medium text-zinc-950">{s.name}</div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
