import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 09 — Pricing Grid, 3 Tier
 * Effect: F (Stagger) entrance + I (Hover Lift) per card. Middle tier highlighted.
 */
const TIERS = [
  { name: "Starter", price: "$29", features: ["1 site", "Core modules", "Email support"] },
  { name: "Growth", price: "$79", features: ["5 sites", "Full module library", "Priority support", "Custom modules"], featured: true },
  { name: "Agency", price: "$199", features: ["Unlimited sites", "Full module library", "Dedicated support", "White-label"] },
];

export default function PricingGrid() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Simple pricing
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <ScrollReveal effect="A" key={tier.name}>
              <HoverLift
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-6",
                  tier.featured ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white"
                )}
              >
                <div className={cn("text-sm font-medium", tier.featured ? "text-zinc-300" : "text-zinc-500")}>{tier.name}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{tier.price}<span className="text-base font-normal opacity-60">/mo</span></div>
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
