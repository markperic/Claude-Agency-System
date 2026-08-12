import { ScrollReveal } from "@/registry/lib/motion-variants";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Module 27 — Content, Comparison Table
 * Two-column "us vs. them" feature comparison. Effect: A on the heading,
 * G (Scroll Reveal) on the table as a whole.
 */
const ROWS = [
  { label: "Numbered, reusable modules", us: true, them: false },
  { label: "Consistent animation vocabulary", us: true, them: false },
  { label: "Built from scratch per project", us: false, them: true },
  { label: "Ships in hours, not weeks", us: true, them: false },
];

export default function ContentComparisonTable() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          The module library vs. starting from scratch
        </ScrollReveal>

        <ScrollReveal effect="G" className="mt-12 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <div className="grid grid-cols-3 border-b border-zinc-200 bg-zinc-50 text-sm font-medium text-zinc-500">
            <div className="px-6 py-4">Feature</div>
            <div className="px-6 py-4 text-center text-zinc-950">This library</div>
            <div className="px-6 py-4 text-center">From scratch</div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={cn("grid grid-cols-3 items-center text-sm", i !== ROWS.length - 1 && "border-b border-zinc-100")}
            >
              <div className="px-6 py-4 text-zinc-700">{row.label}</div>
              <div className="flex justify-center px-6 py-4">
                {row.us ? <Check className="h-4 w-4 text-zinc-950" /> : <X className="h-4 w-4 text-zinc-300" />}
              </div>
              <div className="flex justify-center px-6 py-4">
                {row.them ? <Check className="h-4 w-4 text-zinc-950" /> : <X className="h-4 w-4 text-zinc-300" />}
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
