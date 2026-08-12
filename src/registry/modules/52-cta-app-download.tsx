import { Reveal, ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";
import { Apple, PlayCircle } from "lucide-react";

/**
 * Module 52 — CTA, App Download
 * Split closing section for a mobile app: copy + store badges left, phone
 * mockup right. Effect: A on copy, E on the phone.
 */
export default function CtaAppDownload() {
  return (
    <section className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Now on mobile
          </Reveal>
          <Reveal effect="A" as="h2" className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Preview and tweak modules from your phone
          </Reveal>
          <StaggerGroup className="mt-8 flex flex-wrap gap-3">
            <Reveal effect="A">
              <a href="#" className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-white">
                <Apple className="h-5 w-5" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-zinc-400">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>
            </Reveal>
            <Reveal effect="A">
              <a href="#" className="flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-white">
                <PlayCircle className="h-5 w-5" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-zinc-400">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
            </Reveal>
          </StaggerGroup>
        </div>

        <ScrollReveal
          effect="E"
          className="mx-auto aspect-9/16 w-48 rounded-[2rem] border-4 border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl"
        />
      </div>
    </section>
  );
}
