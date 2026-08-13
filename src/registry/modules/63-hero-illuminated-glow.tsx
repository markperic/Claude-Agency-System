import { Reveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 63 — Hero, Illuminated Glow
 * Full-viewport black hero: two warm/cool blurred glow blobs fade+scale in
 * on load behind centered copy, and the highlighted headline line carries a
 * layered text-shadow "neon" glow. Adapted from 21st.dev's Illuminated Hero
 * (sshahaider) — the source's inline SVG feGaussianBlur filter was replaced
 * with a stacked text-shadow, and its bespoke onload CSS keyframes with the
 * shared --animate-glow-in utility (src/app/globals.css), to match this
 * repo's motion-variants + globals.css conventions. Title effect: B.
 */
export default function HeroIlluminatedGlow() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-28 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[110vh] w-[110vh] -translate-x-1/2 -translate-y-1/2">
          <div className="animate-glow-in h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(255,190,130,0.55)_0%,rgba(255,170,110,0.42)_40%,rgba(255,150,90,0.22)_62%,rgba(255,150,90,0.07)_80%,transparent_92%)] blur-[20px]" />
        </div>
        <div className="absolute bottom-0 left-1/2 h-[110vh] w-[110vh] -translate-x-1/2 translate-y-1/2">
          <div className="animate-glow-in h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(150,180,220,0.42)_0%,rgba(140,170,210,0.32)_40%,rgba(140,170,210,0.16)_62%,rgba(140,170,210,0.05)_80%,transparent_92%)] blur-[20px] [animation-delay:0.15s]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Introducing
          <br />
          <span
            className="inline-block bg-gradient-to-b from-[#fffaf6] to-[#dfe5ee] bg-clip-text text-transparent"
            style={{
              textShadow:
                "0 0 12px rgba(255,196,140,0.85), 0 0 28px rgba(255,150,90,0.6), 0 0 60px rgba(255,120,60,0.4)",
            }}
          >
            Illuminated glow text.
          </span>
          <br />
          Highlight the main focus text.
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-col items-center gap-8">
          <Reveal effect="A" as="p" className="max-w-xl text-lg text-zinc-400">
            A new way to draw attention to key elements with stunning{" "}
            <span className="font-semibold text-zinc-200">illuminated text</span> —
            bold enough to make a statement, controlled enough not to fight
            the rest of the page.
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
