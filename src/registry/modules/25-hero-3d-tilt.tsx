"use client";

import { type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Reveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

/**
 * Module 25 — Hero, 3D Tilt Card
 * A product-card visual that tilts in 3D perspective toward the cursor,
 * recreating Aceternity's 3D Card Effect from scratch with motion's
 * useMotionValue/useSpring. First module that needs "use client" itself
 * (own mouse handlers), rather than just rendering client children.
 */
export default function Hero3DTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Move your mouse
          </Reveal>
          <Reveal effect="A" as="h1" className="text-balance text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            A card that leans toward you
          </Reveal>
          <Reveal
            effect="A"
            as="p"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mt-6 text-lg text-zinc-600"
          >
            The panel on the right tracks the cursor and tilts in 3D
            perspective, springing back to flat when you move away.
          </Reveal>
          <Reveal
            effect="A"
            as="div"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              See how it works
              <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div style={{ perspective: 1000 }}>
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-xl"
          >
            <Image
              src={PLACEHOLDER_IMAGES.wallpaperPortrait01.src}
              alt={PLACEHOLDER_IMAGES.wallpaperPortrait01.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
            <div style={{ transform: "translateZ(40px)" }} className="relative flex h-full flex-col justify-end p-8">
              <div className="h-3 w-2/3 rounded bg-white/80" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
