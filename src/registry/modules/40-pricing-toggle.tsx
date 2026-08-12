"use client";

import { useState } from "react";
import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 40 — Pricing, Monthly/Annual Toggle
 * A local toggle switches the displayed price — genuinely interactive
 * state, not part of the A–J entrance/scroll/hover catalog, the same way
 * module 10's accordion open state isn't either.
 */
const TIERS = [
  { name: "Starter", monthly: 29, annual: 24, features: ["1 site", "Core modules"] },
  { name: "Growth", monthly: 79, annual: 65, features: ["5 sites", "Full library", "Priority support"], featured: true },
  { name: "Agency", monthly: 199, annual: 165, features: ["Unlimited sites", "White-label"] },
];

export default function PricingToggle() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Simple pricing, save on annual
        </ScrollReveal>

        <ScrollReveal effect="A" className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm font-medium", !annual ? "text-zinc-950" : "text-zinc-400")}>Monthly</span>
          <button
            onClick={() => setAnnual((a) => !a)}
            className="relative h-7 w-12 rounded-full bg-zinc-950 transition-colors"
            aria-label="Toggle annual pricing"
          >
            <span
              className={cn(
                "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
                annual ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn("text-sm font-medium", annual ? "text-zinc-950" : "text-zinc-400")}>
            Annual <span className="text-zinc-500">(save ~20%)</span>
          </span>
        </ScrollReveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <ScrollReveal effect="A" key={tier.name}>
              <HoverLift
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-6",
                  tier.featured ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white"
                )}
              >
                <div className={cn("text-sm font-medium", tier.featured ? "text-zinc-300" : "text-zinc-500")}>{tier.name}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  ${annual ? tier.annual : tier.monthly}
                  <span className="text-base font-normal opacity-60">/mo</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={cn(
                    "mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                    tier.featured ? "bg-white text-zinc-950 hover:bg-zinc-100" : "bg-zinc-950 text-white hover:bg-zinc-800"
                  )}
                >
                  Choose {tier.name}
                </a>
              </HoverLift>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
