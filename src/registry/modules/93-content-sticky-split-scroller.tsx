"use client";

import { ScrollReveal } from "@/registry/lib/motion-variants";

type Block = { label: string; figure?: string; body: string; align: "left" | "right" };

const BLOCKS: Block[] = [
  {
    label: "Guarantee",
    align: "right",
    body: "Every buyer is verified through partner banks before an offer goes in, which removes the financing risk and shortens the path to completion.",
  },
  {
    label: "Share of revenue",
    figure: "32%",
    align: "left",
    body: "Of monthly revenue originates inside the partner network rather than from paid acquisition.",
  },
  {
    label: "Partners",
    align: "right",
    body: "Retail and private banks, agencies across four continents, design studios, and relocation operators — the reason qualified demand arrives before a listing does.",
  },
  {
    label: "Coverage",
    figure: "24/7",
    align: "left",
    body: "Advisors on call in the time zones our clients actually live in, not only the one the office sits in.",
  },
];

/**
 * Module 93 — Content, Sticky Split Scroller
 * A two-column section where the left column pins — label, oversized
 * statement, and a standing CTA — while the right column scrolls a series
 * of short blocks past it, alternating flush-left and flush-right so the
 * eye keeps moving down the page instead of settling into a single rail.
 *
 * Deliberately built on plain CSS `position: sticky` plus Effect G on each
 * block rather than a scroll-scrubbed pin: nothing here needs to reverse or
 * scrub, so the cheaper mechanism is the right one. Compare module 92,
 * which does need scrubbing and pays for a `useScroll` pin to get it.
 *
 * Collapses to a single stacked column below `lg`, where a sticky rail would
 * eat most of the viewport.
 */
export default function ContentStickySplitScroller({
  eyebrow = "Partnership",
  title = "The network is the product",
  ctaLabel = "Let's discuss",
  ctaHref = "#contact",
}: {
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section className="bg-[#f1f1f1] py-20 text-[#0a0a0a] md:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
        {/* Pinned column */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
            {eyebrow}
          </p>
          <h2 className="mt-6 max-w-[14ch] text-[clamp(2rem,4.4vw,3.75rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
            {title}
          </h2>
          <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-[#7a7a7a]">
            Partner institutions send us clients who are already financially vetted. That removes most of
            the risk from a transaction and compresses the time it takes to close one.
          </p>
          <a
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#7a0c07] px-7 py-3.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:scale-[1.03]"
          >
            {ctaLabel} &#8599;
          </a>
        </div>

        {/* Scrolling column */}
        <div className="space-y-16 lg:space-y-28 lg:pt-10">
          {BLOCKS.map((block) => (
            <ScrollReveal
              key={block.label}
              className={block.align === "right" ? "lg:ml-auto lg:max-w-[26rem]" : "lg:max-w-[26rem]"}
            >
              {block.figure ? (
                <p className="text-[clamp(2.75rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.05em]">
                  {block.figure}
                </p>
              ) : null}
              <p className="mt-4 text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a0c07]">
                {block.label}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[#3f3f3f]">{block.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
