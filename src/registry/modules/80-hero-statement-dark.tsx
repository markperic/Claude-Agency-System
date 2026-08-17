"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal, SplitReveal, HoverLift } from "@/registry/lib/motion-variants";
import { Play } from "lucide-react";

/**
 * Module 80 — Hero, Statement Dark
 * A flat, austere dark hero: eyebrow, huge two-line statement (Effect K),
 * subhead paragraph, no CTA buttons. The video facade reuses module 29's
 * pattern (thumbnail from YouTube's own CDN, iframe only mounted on click)
 * and its same video ID, just restyled dark.
 *
 * The video sits in its own pinned section (`h-[200vh]` + `sticky`, the
 * same pin technique modules 78/82/83 use): as you scroll, it zooms up and
 * loses its rounded corners over the first ~35% of that section's scroll
 * range, then HOLDS at full size, pinned in the viewport, for the
 * remainder of the pin — so there's real dwell time to actually watch it at
 * near-fullscreen before it releases and scrolls away, matching the
 * reference site's hero video rather than a plain scale-in-place that
 * scrolls past immediately. That dwell is the point, but note what sets its
 * length: the pin lasts `height - 100vh`, while the zoom consumes 35% of
 * `height`, so the static stretch grows twice as fast as the section does.
 * At 250vh it ran past a full viewport of unchanging video, which stopped
 * reading as dwell and started reading as dead space ahead of the next
 * section. Keep the zoom's share below the pin's share when retuning. Bespoke scroll wiring, not part of the A-K
 * catalog, same reasoning as those other modules. The sticky video
 * container stays centered (`items-center`), but the video itself starts
 * pulled up via a `y` transform — closing the gap between the hero copy
 * and the video at rest — and eases back down to true center over the same
 * ~35% of scroll that it zooms and squares off its corners over, so by the
 * time it's at full size it's landed centered in the viewport rather than
 * zooming in place from an off-center start.
 */
const YOUTUBE_ID = "u31qwQUeGuM";

export default function HeroStatementDark() {
  const [playing, setPlaying] = useState(false);
  const videoSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: videoSectionRef, offset: ["start start", "end start"] });
  const videoScale = useTransform(scrollYProgress, [0, 0.35, 1], [1, 1.6, 1.6]);
  const videoRadiusPx = useTransform(scrollYProgress, [0, 0.35, 1], [24, 0, 0]);
  const videoRadius = useTransform(videoRadiusPx, (r) => `${r}px`);
  const videoY = useTransform(scrollYProgress, [0, 0.35, 1], [-180, 0, 0]);

  return (
    <>
      <section className="bg-zinc-950 px-6 pt-28 pb-6 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal effect="A" as="p" className="mb-6 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            A Claude Agency System Manifesto
          </Reveal>

          <SplitReveal as="h1" className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Real Design Wins
          </SplitReveal>

          <Reveal
            effect="A"
            as="p"
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400"
          >
            The internet is the greatest publishing platform on Earth. And the
            most generic. Endless templates have hollowed out brand identity,
            flattening ambition into sameness. The truth is simple: real
            design restores meaning.
          </Reveal>
        </div>
      </section>

      <section ref={videoSectionRef} className="relative h-[200vh] bg-zinc-950">
        <div className="sticky top-0 flex h-screen items-center justify-center px-6">
          <motion.div
            style={{ scale: videoScale, borderRadius: videoRadius, y: videoY }}
            className="relative aspect-video w-full max-w-4xl overflow-hidden"
          >
            {playing ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1`}
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full cursor-pointer" aria-label="Play the manifesto">
                <Image
                  src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-zinc-950/50" />
                <HoverLift className="absolute inset-0 flex items-center justify-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                    <Play className="ml-1 h-6 w-6 fill-zinc-950 text-zinc-950" />
                  </span>
                  <span className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
                    Watch the manifesto
                  </span>
                </HoverLift>
              </button>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
