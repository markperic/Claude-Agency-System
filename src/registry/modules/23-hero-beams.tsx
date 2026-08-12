import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";

/**
 * Module 23 — Hero, Gradient Beams
 * Dark hero with diagonal blurred gradient beams drifting behind the copy
 * (shared `animate-beam-drift` keyframe), and a CTA button with a spinning
 * gradient ring behind it — recreates Aceternity's "Moving Border" button
 * in pure CSS (a rotating conic-gradient square behind a solid inset
 * button, clipped so only a thin ring shows).
 */
export default function HeroBeams() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-beam-drift absolute left-[-10%] top-[10%] h-32 w-[140%] rounded-full bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent blur-3xl" />
        <div className="animate-beam-drift absolute left-[-10%] top-[55%] h-32 w-[140%] rounded-full bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent blur-3xl [animation-delay:-3s]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-400 uppercase">
          Beams
        </Reveal>

        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Light streaks that never repeat the same way twice
        </Reveal>

        <StaggerGroup className="mt-10 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-400">
            The call-to-action below has its own animated gradient border —
            a spinning ring clipped down to a 1px outline.
          </Reveal>

          <Reveal effect="A" as="div">
            <a href="#" className="group relative inline-block overflow-hidden rounded-full p-[1.5px]">
              <span className="animate-border-spin absolute inset-[-150%] block bg-[conic-gradient(from_0deg,transparent,var(--color-indigo-400),transparent_35%)]" />
              <span className="relative z-10 flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors group-hover:bg-zinc-900">
                Get started
              </span>
            </a>
          </Reveal>
        </StaggerGroup>
      </div>
    </section>
  );
}
