import { Reveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

const LOGOS = ["Acme", "Globex", "Initech", "Umbrella", "Soylent", "Hooli", "Vandelay", "Stark"];

/**
 * Module 21 — Hero, Marquee Logo Wall
 * Centered headline/CTA, an infinite horizontal logo marquee underneath via
 * the shared `animate-marquee` keyframe — the list is duplicated once so
 * the loop is seamless, and pauses on hover.
 */
export default function HeroMarquee() {
  return (
    <section className="overflow-hidden bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal effect="A" as="p" className="mb-5 text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Trusted everywhere
        </Reveal>

        <Reveal effect="B" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
          Built for teams who ship in public
        </Reveal>

        <Reveal
          effect="A"
          as="div"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>

      <div className="group relative mt-16 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee flex w-max gap-16 group-hover:[animation-play-state:paused]">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span key={`${logo}-${i}`} className="text-lg font-semibold tracking-tight text-zinc-400">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
