import { ScrollReveal } from "@/registry/lib/motion-variants";
import { Check } from "lucide-react";

/**
 * Module 38 — Pricing, Single Plan Highlight
 * One plan, centered, no comparison needed — for products with a single
 * price. Effect: E (scale in) on the card.
 */
const FEATURES = [
  "Every module in the catalog",
  "Every animation effect, A through J",
  "Unlimited projects, unlimited seats",
  "Updates for as long as you're subscribed",
];

export default function PricingSingleHighlight() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <ScrollReveal effect="A" as="p" className="mb-3 text-sm font-medium tracking-wide text-zinc-500 uppercase">
          One price, everything included
        </ScrollReveal>
        <ScrollReveal effect="A" as="h2" className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          No tiers to compare
        </ScrollReveal>

        <ScrollReveal effect="E" className="mt-10 rounded-3xl border border-zinc-200 bg-white p-10 text-left shadow-sm">
          <div className="text-5xl font-semibold tracking-tight text-zinc-950">
            $99<span className="text-lg font-normal text-zinc-500">/mo</span>
          </div>
          <ul className="mt-8 space-y-3 text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-zinc-700">
                <Check className="h-4 w-4 shrink-0 text-zinc-950" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-8 flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Start free trial
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
