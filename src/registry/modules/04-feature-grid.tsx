import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { Layers, Wand2, GitBranch } from "lucide-react";

/**
 * Module 04 — Feature Grid, 3 Column
 * Icon + title + description, repeated. Effect: F (Stagger) of Effect A cards.
 */
const FEATURES = [
  { icon: Layers, title: "Numbered modules", body: "Every section is catalogued by number, so instructions like \"use module 5\" resolve to a real, specific component." },
  { icon: Wand2, title: "Shared animation system", body: "One small set of named effects (A–J) used everywhere, instead of a one-off animation invented per section." },
  { icon: GitBranch, title: "Grows with the project", body: "Add new modules over time from your own designs or curated component sources — the catalog just gets deeper." },
];

export default function FeatureGrid() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="h2" className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Built to stay consistent, project after project
        </ScrollReveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <ScrollReveal effect="A" key={title}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-medium text-zinc-950">{title}</h3>
              <p className="mt-2 text-zinc-600">{body}</p>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
