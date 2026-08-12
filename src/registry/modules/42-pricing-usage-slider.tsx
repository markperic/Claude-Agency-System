"use client";

import { useState } from "react";
import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 42 — Pricing, Usage-Based Slider
 * A slider drives the displayed price for a usage-based product. Local
 * interactive state, not part of the A–J catalog.
 */
function priceFor(sites: number) {
  return Math.max(19, Math.round(sites * 9.5));
}

export default function PricingUsageSlider() {
  const [sites, setSites] = useState(5);

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <ScrollReveal effect="A" as="h2" className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Pay for what you build
        </ScrollReveal>
        <ScrollReveal effect="A" as="p" className="mt-3 text-zinc-600">
          Drag the slider to see pricing scale with the number of sites you manage.
        </ScrollReveal>

        <ScrollReveal effect="E" className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-10">
          <div className="text-5xl font-semibold tracking-tight text-zinc-950">
            ${priceFor(sites)}<span className="text-lg font-normal text-zinc-500">/mo</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {sites} site{sites === 1 ? "" : "s"}
          </p>

          <input
            type="range"
            min={1}
            max={30}
            value={sites}
            onChange={(e) => setSites(Number(e.target.value))}
            className="mt-8 w-full accent-zinc-950"
          />
          <div className="mt-2 flex justify-between text-xs text-zinc-400">
            <span>1 site</span>
            <span>30 sites</span>
          </div>

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
