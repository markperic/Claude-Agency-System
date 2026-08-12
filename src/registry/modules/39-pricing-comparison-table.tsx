import { ScrollReveal } from "@/registry/lib/motion-variants";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 39 — Pricing, Feature Comparison Table
 * A full feature matrix across 3 plans — for products with enough features
 * that cards alone don't communicate the difference. Effect: G (scroll
 * reveal) on the whole table.
 */
const PLANS = ["Starter", "Growth", "Agency"];
const ROWS: { feature: string; values: (boolean | string)[] }[] = [
  { feature: "Sites", values: ["1", "5", "Unlimited"] },
  { feature: "Module library", values: [true, true, true] },
  { feature: "Custom modules", values: [false, true, true] },
  { feature: "Priority support", values: [false, true, true] },
  { feature: "White-label", values: [false, false, true] },
];

export default function PricingComparisonTable() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Compare plans
        </ScrollReveal>

        <ScrollReveal effect="G" className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="py-4 text-left font-medium text-zinc-500">Feature</th>
                {PLANS.map((plan) => (
                  <th key={plan} className="py-4 text-center font-medium text-zinc-950">{plan}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.feature} className={cn(i !== ROWS.length - 1 && "border-b border-zinc-100")}>
                  <td className="py-4 text-zinc-700">{row.feature}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className="py-4 text-center">
                      {typeof v === "string" ? (
                        <span className="text-zinc-700">{v}</span>
                      ) : v ? (
                        <Check className="mx-auto h-4 w-4 text-zinc-950" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-zinc-300" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>
      </div>
    </section>
  );
}
