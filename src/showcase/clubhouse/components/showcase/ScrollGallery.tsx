"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDetached, useIsDesktop } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { SplitHeading } from "../motion/SplitHeading";

type GalleryImg = Img & { key: string };

/**
 * Side-scrolling gallery (Obys grid feel): the section pins and vertical scroll drives a horizontal
 * strip — a heading panel, then photos at their natural proportions, staggered up and down.
 * Phones and reduced motion get a swipeable snap row instead.
 */
export function ScrollGallery({
  eyebrow,
  heading,
  intro,
  images,
  tone = "light",
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  images?: GalleryImg[];
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop("(min-width: 1024px)");
  const [dist, setDist] = useState(0);
  const distRef = useRef(0);

  useEffect(() => {
    if (!track.current) return;
    const measure = () => {
      const d = Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
      distRef.current = d;
      setDist(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop, reduce]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useDetached(scrollYProgress);
  const x = useTransform(p, (v) => -v * distRef.current);

  const dark = tone === "dark";
  const colours = dark ? "bg-forest-deep text-cream" : "bg-cream text-forest";
  if (!images?.length) return null;

  const head = (
    <div className="shrink-0 lg:w-[30vw] lg:pr-10">
      {eyebrow && <p className={`eyebrow mb-5 ${dark ? "text-gold-light" : "text-gold"}`}>{eyebrow}</p>}
      <SplitHeading text={heading} className="font-display text-5xl leading-[1.02] [text-wrap:balance] sm:text-6xl lg:text-7xl" mutedClassName="opacity-40" />
      {intro && <p className={`mt-6 max-w-md text-lg leading-relaxed ${dark ? "text-cream/75" : "text-muted"}`}>{intro}</p>}
      <p className={`eyebrow mt-10 hidden lg:block ${dark ? "text-cream/50" : "text-forest/50"}`}>
        Scroll <span aria-hidden>→</span>
      </p>
    </div>
  );

  if (!desktop || reduce) {
    return (
      <section ref={ref} className={`${colours} py-20 sm:py-28`}>
        <div className="px-4 sm:px-8">{head}</div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-8">
          {images.map((img, i) => (
            <figure key={img.key} className="relative h-[56svh] max-h-[520px] shrink-0 snap-center overflow-hidden" style={{ aspectRatio: ratio(img) }}>
              <ClubImage image={img} fill className="object-cover" sizes="85vw" />
              <Caption i={i} n={images.length} alt={img.alt} />
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`relative ${colours}`} style={{ height: dist ? `calc(100svh + ${dist}px)` : "300svh" }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-center gap-10 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-[8vw] pt-16" style={{ x }}>
          {head}
          {images.map((img, i) => (
            <figure
              key={img.key}
              className={`relative h-[62svh] shrink-0 overflow-hidden ${i % 2 ? "translate-y-[6svh]" : "-translate-y-[4svh]"}`}
              style={{ aspectRatio: ratio(img) }}
            >
              <ClubImage image={img} fill className="object-cover" sizes="60vw" />
              <Caption i={i} n={images.length} alt={img.alt} />
            </figure>
          ))}
        </motion.div>
        <div className={`absolute inset-x-6 bottom-8 h-px lg:inset-x-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] ${dark ? "bg-cream/15" : "bg-forest/15"}`}>
          <motion.div className={`h-full origin-left ${dark ? "bg-gold-light" : "bg-gold"}`} style={{ scaleX: p }} />
        </div>
      </div>
    </section>
  );
}

function ratio(img: GalleryImg) {
  const r = img.width / img.height;
  return String(Math.min(1.6, Math.max(0.7, r)));
}

function Caption({ i, n, alt }: { i: number; n: number; alt?: string }) {
  return (
    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12 text-cream">
      <span className="text-sm">{alt}</span>
      <span className="font-display text-sm tabular-nums opacity-80">
        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </span>
    </figcaption>
  );
}
