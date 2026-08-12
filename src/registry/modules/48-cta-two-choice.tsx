import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { ArrowRight, Building2, User } from "lucide-react";

/**
 * Module 48 — CTA, Two Choice
 * Two audience-specific paths side by side instead of one generic CTA.
 * Effect: F (stagger) + I (hover lift) per card.
 */
const CHOICES = [
  { icon: User, title: "For freelancers", body: "One seat, every module, month to month.", cta: "See solo pricing" },
  { icon: Building2, title: "For agencies", body: "Multiple seats, shared library, client billing.", cta: "See team pricing" },
];

export default function CtaTwoChoice() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Which one is you?
        </ScrollReveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CHOICES.map(({ icon: Icon, title, body, cta }) => (
            <ScrollReveal effect="A" key={title}>
              <HoverLift className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-zinc-950">{title}</h3>
                <p className="mt-2 flex-1 text-zinc-600">{body}</p>
                <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-950">
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
