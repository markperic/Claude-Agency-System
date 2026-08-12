"use client";

import { useState } from "react";
import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

/**
 * Module 10 — FAQ Accordion
 * Effect: F (Stagger) entrance on the questions; the open/close itself is a
 * simple height/opacity transition (not part of the A–J catalog, since it's
 * a state change, not an entrance).
 */
const FAQS = [
  { q: "Can I add my own modules?", a: "Yes — drop a new numbered file in src/registry/modules and add an entry to modules.json. Claude Code picks it up automatically." },
  { q: "Does this replace a CMS?", a: "No. This solves page assembly and consistency. Pair it with a headless CMS if clients need to self-edit content." },
  { q: "Can I change an effect after the fact?", a: "Yes — effects are just a prop. \"Change module 5's title to effect C\" is a one-line edit." },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950">
          Frequently asked
        </ScrollReveal>

        <StaggerGroup className="mt-10 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
          {FAQS.map((item, i) => (
            <ScrollReveal effect="A" key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-zinc-950">{item.q}</span>
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-zinc-600">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
