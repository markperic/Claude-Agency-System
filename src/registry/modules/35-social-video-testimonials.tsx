import { ScrollReveal, StaggerGroup, HoverLift } from "@/registry/lib/motion-variants";
import { Play } from "lucide-react";

/**
 * Module 35 — Social Proof, Video Testimonial Grid
 * Card grid where each testimonial is framed as a short video, play button
 * on Effect I. Distinct from module 08's text-quote grid.
 */
const VIDEOS = [
  { name: "Priya N.", role: "Founder, Studio Co." },
  { name: "Owen T.", role: "Agency Lead" },
  { name: "Casey M.", role: "Designer" },
];

export default function SocialVideoTestimonials() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Hear it from the teams using it
        </ScrollReveal>

        <StaggerGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VIDEOS.map((v) => (
            <ScrollReveal effect="A" key={v.name}>
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <HoverLift as="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                    <Play className="ml-0.5 h-4 w-4 fill-zinc-950 text-zinc-950" />
                  </HoverLift>
                </div>
              </div>
              <div className="mt-3 text-sm font-medium text-zinc-950">{v.name}</div>
              <div className="text-sm text-zinc-500">{v.role}</div>
            </ScrollReveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
