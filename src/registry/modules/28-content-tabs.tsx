"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { cn } from "@/lib/utils";

/**
 * Module 28 — Content, Tabs Showcase
 * Tabbed panel switching between text + visual. The tab switch itself is a
 * local state change (not part of the A–J catalog), but the panel content
 * fades with a plain motion.div — consistent with how module 10's accordion
 * handles its own open/close transition.
 */
const TABS = [
  { key: "design", label: "Design", body: "Pull the layout from a curated source, adapt colors and copy to the client." },
  { key: "build", label: "Build", body: "Point Claude at module numbers and effect letters — the page assembles itself." },
  { key: "ship", label: "Ship", body: "Deploy straight from the repo. No separate CMS migration step required." },
];

export default function ContentTabs() {
  const [active, setActive] = useState(TABS[0].key);
  const activeTab = TABS.find((t) => t.key === active)!;

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Three steps, every time
        </ScrollReveal>

        <ScrollReveal effect="A" className="mt-10 flex justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                active === tab.key ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </ScrollReveal>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 aspect-2/1 w-full rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 p-8"
        >
          <p className="max-w-md text-lg text-zinc-700">{activeTab.body}</p>
        </motion.div>
      </div>
    </section>
  );
}
