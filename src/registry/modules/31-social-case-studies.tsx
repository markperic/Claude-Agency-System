import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 31 — Social Proof, Case Study Cards
 * Logo placeholder + headline result + link, per card. Effect: F (stagger)
 * entrance, I (hover lift) per card.
 */
const CASES = [
  { company: "Acme", result: "Launched 6 client sites in one quarter", metric: "6x faster" },
  { company: "Globex", result: "Cut design review cycles from weeks to days", metric: "3 days" },
  { company: "Initech", result: "One system across the whole agency roster", metric: "1 codebase" },
];

export default function SocialCaseStudies() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="h2" className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Case studies
        </ScrollReveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {CASES.map((c) => (
            <ScrollReveal effect="A" key={c.company}>
              <HoverLift className="flex h-full flex-col rounded-2xl border border-zinc-200 p-6">
                <div className="text-sm font-semibold tracking-tight text-zinc-950">{c.company}</div>
                <div className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">{c.metric}</div>
                <p className="mt-2 flex-1 text-sm text-zinc-600">{c.result}</p>
                <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-950">
                  Read case study
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
