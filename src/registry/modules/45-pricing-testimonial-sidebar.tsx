import { ScrollReveal } from "@/registry/lib/motion-variants";
import { Check } from "lucide-react";

/**
 * Module 45 — Pricing, Testimonial Sidebar
 * A single pricing card paired with a quote that reinforces the value —
 * useful when price alone doesn't tell the story. Effect: A on the card,
 * C (slide from left) on the quote for a bit of directional contrast.
 */
const FEATURES = ["Full module library", "Every animation effect", "Priority support", "Cancel anytime"];

export default function PricingTestimonialSidebar() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <ScrollReveal effect="A" className="rounded-2xl border border-zinc-200 bg-white p-8">
          <div className="text-sm font-medium text-zinc-500">Studio plan</div>
          <div className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
            $79<span className="text-base font-normal text-zinc-400">/mo</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-zinc-700">
                <Check className="h-4 w-4 shrink-0 text-zinc-950" />
                {f}
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-8 flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Start free trial
          </a>
        </ScrollReveal>

        <ScrollReveal effect="C">
          <p className="text-balance text-2xl font-medium tracking-tight text-zinc-950">
            &ldquo;Paid for itself on the first client project.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-200" />
            <div>
              <div className="text-sm font-medium text-zinc-950">Jamie Rivera</div>
              <div className="text-sm text-zinc-500">Creative Director, Studio Co.</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
