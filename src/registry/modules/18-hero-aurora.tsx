import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 18 — Hero, Aurora Background
 * Large blurred gradient blobs drift slowly behind centered copy via the
 * shared `animate-aurora` keyframe (src/app/globals.css). Title effect: B.
 */
export default function HeroAurora() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-aurora absolute -left-1/4 top-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/30 blur-[100px]" />
        <div className="animate-aurora absolute right-[-15%] top-[10%] h-[450px] w-[450px] rounded-full bg-sky-500/25 blur-[100px] [animation-delay:-4s]" />
        <div className="animate-aurora absolute bottom-[-20%] left-[20%] h-[480px] w-[480px] rounded-full bg-violet-500/25 blur-[100px] [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-400 uppercase">
          Aurora
        </Reveal>

        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Color that moves without asking for attention
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-400">
            Three drifting gradient blobs, slow enough to feel ambient rather
            than distracting behind the headline.
          </Reveal>

          <Reveal effect="A" as="div" className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              View the library
            </a>
          </Reveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
