import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 51 — CTA, Minimal Inline
 * A single thin bar — one line of copy and a text link, no card, no
 * padding-heavy banner. For pages that already have a strong CTA above
 * and just need a quiet closing nudge. Effect: A.
 */
export default function CtaMinimalInline() {
  return (
    <section className="border-y border-zinc-100 bg-white px-6 py-8">
      <ScrollReveal
        effect="A"
        className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
      >
        <p className="text-zinc-700">Ready to see it on a real project?</p>
        <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-950">
          Get started
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </ScrollReveal>
    </section>
  );
}
