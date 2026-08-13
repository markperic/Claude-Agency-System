import { ScrollReveal, HoverLift } from "@/registry/lib/motion-variants";
import { Play } from "lucide-react";

/**
 * Module 29 — Content, Video Embed
 * Standalone centered video thumbnail (Pexels placeholder photo) with a play button on Effect I
 * (hover lift). Heading on A, frame scales in on E.
 */
export default function ContentVideoEmbed() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <ScrollReveal effect="A" as="h2" className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          See the module system in motion
        </ScrollReveal>
        <ScrollReveal effect="A" as="p" className="mx-auto mt-3 max-w-xl text-zinc-600">
          A short walkthrough of composing a page from numbered modules and
          named effects, start to finish.
        </ScrollReveal>

        <ScrollReveal
          effect="E"
          className="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl shadow-sm"
        >
          <img
            src="https://images.pexels.com/photos/34804005/pexels-photo-34804005/free-photo-of-laptop-displaying-coding-and-data-analysis-interface.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop"
            alt="Laptop showing a code and data-analysis interface"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <HoverLift as="button" className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
              <Play className="ml-1 h-6 w-6 fill-zinc-950 text-zinc-950" />
            </HoverLift>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
