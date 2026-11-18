"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import { EASE_OUT, useDetached, useScrollValue } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";

/**
 * Photo that opens from an inset clip as it enters, then drifts slightly against the scroll.
 * The frame (aspect/height) comes from `className`; the image is oversized by `speed` top and bottom so the drift never shows an edge.
 */
export function ParallaxImage({
  image,
  className = "",
  sizes = "100vw",
  speed = 0.1,
  delay = 0,
}: {
  image?: Img;
  className?: string;
  sizes?: string;
  speed?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useDetached(scrollYProgress);
  const y = useScrollValue(p, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  if (!image) return null;
  const bleed = `${-speed * 100}%`;

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reduce ? false : { clipPath: "inset(10% 8% 10% 8%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.4, ease: EASE_OUT, delay }}
    >
      <motion.div
        className="absolute inset-x-0"
        style={{ top: bleed, bottom: bleed, y: reduce ? 0 : y }}
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.8, ease: EASE_OUT, delay }}
      >
        <ClubImage image={image} fill className="object-cover" sizes={sizes} />
      </motion.div>
    </motion.div>
  );
}
