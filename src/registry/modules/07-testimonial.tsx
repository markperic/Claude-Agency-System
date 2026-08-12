import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 07 — Testimonial, Single Quote
 * Large centered quote with attribution. Effect: G (Scroll Reveal).
 */
export default function Testimonial() {
  return (
    <section className="bg-white px-6 py-24">
      <ScrollReveal effect="G" className="mx-auto max-w-3xl text-center">
        <p className="text-balance text-2xl font-medium tracking-tight text-zinc-950 sm:text-3xl">
          &ldquo;We stopped reinventing the hero section every project. Now we
          pick, place, and adjust — the quality never dips.&rdquo;
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-200" />
          <div className="text-left">
            <div className="text-sm font-medium text-zinc-950">Jamie Rivera</div>
            <div className="text-sm text-zinc-500">Creative Director, Studio Co.</div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
