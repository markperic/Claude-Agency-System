import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 43 — Pricing, Freemium Callout
 * Free vs. Pro, deliberately asymmetric — the free card is visually
 * smaller/quieter, Pro is the obvious upgrade. Effect: F (stagger) + I.
 */
const FREE = ["3 modules per project", "Community support", "Claude Agency System watermark"];
const PRO = ["Full 60+ module library", "Every animation effect", "Priority support", "No watermark"];

export default function PricingFreemium() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Start free, upgrade when you&apos;re ready
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
          <ScrollReveal effect="A">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 opacity-80">
              <div className="text-sm font-medium text-zinc-500">Free</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">$0</div>
              <ul className="mt-6 space-y-3 text-sm">
                {FREE.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-zinc-600">
                    <Check className="h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-zinc-400">
                  <X className="h-4 w-4 shrink-0" />
                  Custom modules
                </li>
              </ul>
              <a
                href="#"
                className="mt-8 flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50"
              >
                Start free
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal effect="A">
            <HoverLift className={cn("rounded-2xl border border-zinc-950 bg-zinc-950 p-6 text-white shadow-xl")}>
              <div className="text-sm font-medium text-zinc-300">Pro</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">$49<span className="text-base font-normal opacity-60">/mo</span></div>
              <ul className="mt-6 space-y-3 text-sm">
                {PRO.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="mt-8 flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Upgrade to Pro
              </a>
            </HoverLift>
          </ScrollReveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
