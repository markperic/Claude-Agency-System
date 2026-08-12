import { ScrollReveal, ShimmerText } from "@/registry/lib/motion-variants";

/**
 * Module 36 — Social Proof, Single Powerful Stat
 * One dramatic number full-width, with a short supporting line. Distinct
 * from module 06's 3-up stats row — this is for a single headline metric.
 * Effect: J (Gradient Shimmer) on the number, since it's the one hero-grade
 * number on the page.
 */
export default function SocialBigStat() {
  return (
    <section className="bg-zinc-950 px-6 py-28 text-center">
      <ScrollReveal effect="A" as="p" className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Trusted at scale
      </ScrollReveal>
      <div className="mt-4 text-6xl font-semibold tracking-tight sm:text-8xl">
        {/* ShimmerText defaults to var(--foreground), which is dark text —
            override with light gradient stops since this section is dark. */}
        <ShimmerText className="bg-[linear-gradient(110deg,#fff_35%,#71717a_50%,#fff_65%)]">
          12,000+
        </ShimmerText>
      </div>
      <ScrollReveal effect="A" as="p" className="mx-auto mt-4 max-w-md text-zinc-400">
        pages shipped from this module library, across studios of every size.
      </ScrollReveal>
    </section>
  );
}
