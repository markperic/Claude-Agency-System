import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 12 — CTA Banner
 * Full-width closing call to action. Effect: G (Scroll Reveal) on the whole block.
 */
export default function CtaBanner() {
  return (
    <section className="px-6 py-20">
      <ScrollReveal
        effect="G"
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl bg-zinc-950 px-8 py-14 text-center sm:flex-row sm:text-left"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Ready to try it on a real project?</h2>
          <p className="mt-2 text-zinc-400">Start with the starter kit and swap in your own brand.</p>
        </div>
        <a
          href="#"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </a>
      </ScrollReveal>
    </section>
  );
}
