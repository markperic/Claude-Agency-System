import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 37 — Pricing, Two Tier
 * Just two plans, larger cards than the 3-tier grid (module 09) since
 * there's more room per card. Effect: F (stagger) + I (hover lift).
 */
const TIERS = [
  { name: "Solo", price: "$19", desc: "For freelancers shipping one project at a time.", features: ["1 site", "Core modules", "Community support"] },
  { name: "Studio", price: "$59", desc: "For small teams running multiple client projects.", features: ["Unlimited sites", "Full module library", "Priority support", "Custom modules"], featured: true },
];

export default function PricingTwoTier() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Pick a plan
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <ScrollReveal effect="A" key={tier.name}>
              <HoverLift
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-8",
                  tier.featured ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white"
                )}
              >
                <div className={cn("text-sm font-medium", tier.featured ? "text-zinc-300" : "text-zinc-500")}>{tier.name}</div>
                <div className="mt-2 text-4xl font-semibold tracking-tight">{tier.price}<span className="text-base font-normal opacity-60">/mo</span></div>
                <p className={cn("mt-3 text-sm", tier.featured ? "text-zinc-400" : "text-zinc-600")}>{tier.desc}</p>
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
