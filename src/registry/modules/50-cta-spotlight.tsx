import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 50 — CTA, Spotlight Banner
 * A dramatic dark closing section reusing the spotlight-glow treatment
 * from hero module 17, scaled down to a banner. Effect: B on the title.
 */
export default function CtaSpotlight() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/15 blur-[100px]"
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal effect="B" as="h2" className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Stop rebuilding the same sections
        </Reveal>
        <StaggerGroup className="mt-8 flex flex-col items-center gap-6">
          <Reveal effect="A" as="p" className="max-w-md text-zinc-400">
            Everything in this catalog is ready to compose today.
          </Reveal>
          <Reveal effect="A" as="div">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
