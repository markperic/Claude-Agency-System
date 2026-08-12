"use client";

import { useEffect, useState } from "react";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { ArrowRight } from "lucide-react";

/**
 * Module 47 — CTA, Countdown Banner
 * A live countdown to a fixed offer deadline. Genuinely interactive/
 * time-driven, not part of the A–J catalog — the banner itself still
 * enters on Effect G like module 12's plain banner.
 */
const SIX_HOURS_MS = 1000 * 60 * 60 * 6;

/** Target is only computed client-side (in an effect) to avoid an SSR/client mismatch on Date.now(). */
function useCountdown() {
  const [remaining, setRemaining] = useState(SIX_HOURS_MS);
  useEffect(() => {
    const target = Date.now() + SIX_HOURS_MS;
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    hours: String(Math.floor(totalSeconds / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0"),
    seconds: String(totalSeconds % 60).padStart(2, "0"),
  };
}

export default function CtaCountdown() {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section className="px-6 py-20">
      <ScrollReveal
        effect="G"
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 rounded-3xl bg-zinc-950 px-8 py-14 text-center sm:flex-row sm:text-left"
      >
        <div>
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">Founding pricing ends soon</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Lock in the launch price</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-3 font-mono text-3xl font-semibold text-white">
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
          </div>
          <a
            href="#"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            Claim it
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
