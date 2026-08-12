import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { ArrowRight, Check } from "lucide-react";

/**
 * Module 41 — Pricing, Plans + Enterprise Contact
 * Two standard plans plus a distinct "talk to us" enterprise card, for
 * products with a sales-assisted top tier instead of a fixed price.
 * Effect: F (stagger) + I (hover lift).
 */
const TIERS = [
  { name: "Starter", price: "$29", features: ["1 site", "Core modules"] },
  { name: "Growth", price: "$79", features: ["5 sites", "Full library", "Priority support"] },
];

export default function PricingEnterpriseCta() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Plans for every stage
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <ScrollReveal effect="A" key={tier.name}>
              <HoverLift className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="text-sm font-medium text-zinc-500">{tier.name}</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  {tier.price}<span className="text-base font-normal text-zinc-400">/mo</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-zinc-700">
                      <Check className="h-4 w-4 shrink-0 text-zinc-950" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Choose {tier.name}
                </a>
              </HoverLift>
            </ScrollReveal>
          ))}

          <ScrollReveal effect="A">
            <HoverLift className="flex h-full flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-white">
              <div>
                <div className="text-sm font-medium text-zinc-400">Enterprise</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">Let&apos;s talk</div>
                <p className="mt-3 text-sm text-zinc-400">
                  Custom modules, SSO, and a dedicated rollout plan for larger teams.
                </p>
              </div>
              <a href="#" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Contact sales
                <ArrowRight className="h-4 w-4" />
              </a>
            </HoverLift>
          </ScrollReveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
