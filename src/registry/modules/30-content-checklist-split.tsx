import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { CheckCircle2 } from "lucide-react";

/**
 * Module 30 — Content, Checklist Split
 * Visual left, checklist of benefits right — a variant of module 05's
 * content split with the image on the opposite side and a list instead of
 * a single paragraph. Effect: E on the visual, F (stagger) on the list.
 */
const ITEMS = [
  "No blank-page problem — start from a working section",
  "Animation that's consistent across every project",
  "Easy to extend without breaking what already works",
];

export default function ContentChecklistSplit() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <ScrollReveal effect="E" className="aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 lg:order-1" />

        <div className="lg:order-2">
          <ScrollReveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Why teams switch
          </ScrollReveal>
          <ScrollReveal effect="A" as="h2" className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Fewer decisions, better defaults
          </ScrollReveal>

          <StaggerGroup className="mt-8 space-y-4">
            {ITEMS.map((item) => (
              <ScrollReveal effect="A" key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950" />
                <span className="text-zinc-700">{item}</span>
              </ScrollReveal>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
