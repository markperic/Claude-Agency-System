"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal, HoverLift } from "@/registry/lib/motion-variants";
import { Play } from "lucide-react";

/**
 * Module 29 — Content, Video Embed
 * A real YouTube embed behind a click-to-play facade: the thumbnail (pulled
 * from YouTube's own img.youtube.com CDN) and play button render first, and
 * the iframe itself — YouTube's embed JS is not light — is only mounted
 * once clicked. Swap YOUTUBE_ID for the client's own video ID; everything
 * else adapts automatically since the thumbnail comes from the same ID.
 * youtube-nocookie.com is used for the embed so no tracking cookie is set
 * until a visitor actually presses play. Heading on A, frame scales in on E.
 */
const YOUTUBE_ID = "5sx4assgd3Q";

export default function ContentVideoEmbed() {
  const [playing, setPlaying] = useState(false);

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
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1`}
              title="Embedded video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full cursor-pointer" aria-label="Play video">
              <Image
                src={`https://img.youtube.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`}
                alt="Video thumbnail"
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-zinc-950/20" />
              <HoverLift className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                  <Play className="ml-1 h-6 w-6 fill-zinc-950 text-zinc-950" />
                </span>
              </HoverLift>
            </button>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
