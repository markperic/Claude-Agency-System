import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 49 — CTA, Testimonial + CTA Combo
 * A quote paired directly with the ask, so social proof and conversion
 * happen in the same glance. Effect: G on the whole block.
 */
export default function CtaTestimonialCombo() {
  return (
    <section className="px-6 py-20">
      <ScrollReveal
        effect="G"
        className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-3xl border border-zinc-200 bg-white px-8 py-14 text-center"
      >
        <p className="text-balance text-2xl font-medium tracking-tight text-zinc-950">
          &ldquo;We shipped the client&apos;s site the same week we signed the contract.&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-200" />
          <div className="text-left">
            <div className="text-sm font-medium text-zinc-950">Jamie Rivera</div>
            <div className="text-sm text-zinc-500">Creative Director, Studio Co.</div>
          </div>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </a>
      </ScrollReveal>
    </section>
  );
}
