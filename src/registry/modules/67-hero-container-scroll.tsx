"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 67 — Hero, Container Scroll Reveal
 * A tall sticky section: a plain rounded device frame tilts back in 3D
 * perspective at rest, then straightens and scales up as the page scrolls
 * past, revealing a product image inside. Adapted from Aceternity's
 * Container Scroll Animation, recreated from scratch with motion's scroll
 * hooks — same family and sticky-pin structure as module 16's Macbook
 * Scroll Reveal (so the animation always has room to complete regardless
 * of what surrounds it on the page), but a generic bezel instead of laptop
 * chrome so the two read distinctly in the catalog. scrollYProgress is run
 * through useSpring before driving any transform, same as module 16 — see
 * that file's comment for why (a fast flick can otherwise leave the card
 * stuck on a stale, un-flushed transform). Title translateY and the card's
 * rotate/scale are scroll-linked, not part of the A–J catalog.
 */
export default function HeroContainerScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  const rotate = useTransform(smoothProgress, [0, 0.5], [20, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [0.9, 1.05]);
  const titleY = useTransform(smoothProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={containerRef} className="relative h-[220vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <motion.div style={{ translateY: titleY }} className="mb-8 text-center">
          <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Unleash the power of
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
            Scroll Animations
          </h1>
        </motion.div>

        <div style={{ perspective: 1200 }} className="w-full max-w-5xl">
          <motion.div
            style={{ rotateX: rotate, scale }}
            className="mx-auto rounded-[30px] border-4 border-zinc-400 bg-zinc-300 p-2 shadow-2xl md:p-4"
          >
            <div className="relative h-[20rem] w-full overflow-hidden rounded-2xl bg-zinc-100 md:h-[30rem]">
              <Image
                src={PLACEHOLDER_IMAGES.landscape10.src}
                alt={PLACEHOLDER_IMAGES.landscape10.alt}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
