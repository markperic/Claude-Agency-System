"use client";

/**
 * The animation effect catalog for the module library.
 *
 * This is the "Effect A / Effect B" vocabulary referenced in registry/modules.json
 * and in MODULE-LIBRARY.md. Every animated element in every numbered module pulls
 * its animation from here — nothing improvises its own one-off animation.
 *
 * To change what "Effect B" looks like everywhere it's used, edit it once, here.
 * To add a new effect, add an entry to both `effectCatalog` (the human-readable
 * description Claude reads) and `variants` (the actual Motion values).
 */

import { useRef, type ReactNode, type ElementType } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
  type MotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

export type AnimationEffect = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export const effectCatalog: Record<
  AnimationEffect,
  { name: string; description: string; kind: "entrance" | "scroll" | "hover" }
> = {
  A: { name: "Fade Up", kind: "entrance", description: "Fades in while rising 24px on page load. Default for headings, cards, and CTAs." },
  B: { name: "Fade In", kind: "entrance", description: "Slow, plain opacity fade with no movement. Best for large hero titles that shouldn't feel busy." },
  C: { name: "Slide From Left", kind: "entrance", description: "Enters from the left with a fade. Good for alternating content-split sections." },
  D: { name: "Slide From Right", kind: "entrance", description: "Enters from the right with a fade. Pair with Slide From Left on the opposite section." },
  E: { name: "Scale In", kind: "entrance", description: "Scales up from 92% while fading in. Good for images, logos, badges, icons." },
  F: { name: "Stagger Group", kind: "entrance", description: "Applied to a container (e.g. a grid); each direct child plays Effect A in sequence, ~120ms apart." },
  G: { name: "Scroll Reveal", kind: "scroll", description: "Same motion as Fade Up, but triggers the moment the element scrolls into view instead of on page load. Plays once." },
  H: { name: "Scroll Parallax", kind: "scroll", description: "The element (usually an image) drifts at a different speed than the page as you scroll past it." },
  I: { name: "Hover Lift", kind: "hover", description: "Micro-interaction: lifts 4px and scales to 102% on hover/tap. Use on cards and buttons, not on entrance." },
  J: { name: "Gradient Shimmer", kind: "entrance", description: "An animated gradient sweeps across the text on load. Reserve for one hero title per page — it's a lot if overused." },
};

export const variants: Record<Exclude<AnimationEffect, "H" | "I" | "J">, Variants> = {
  A: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
  B: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
  },
  C: {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
  D: {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
  E: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },
  F: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  },
  G: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
};

type RevealProps = MotionProps & {
  effect?: Exclude<AnimationEffect, "H" | "I" | "J">;
  as?: ElementType;
  className?: string;
  children?: ReactNode;
};

/** Plays its effect once, on page load. Use for above-the-fold content (hero titles, etc). */
export function Reveal({ effect = "A", as = "div", className, children, ...props }: RevealProps) {
  const MotionTag = motion[as as "div"] ?? motion.div;
  return (
    <MotionTag
      initial="hidden"
      animate="show"
      variants={variants[effect]}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/** Plays its effect the moment it scrolls into view. Use for anything below the fold. Effect G is the intended default; A–F also work here. */
export function ScrollReveal({ effect = "G", as = "div", className, children, ...props }: RevealProps) {
  const MotionTag = motion[as as "div"] ?? motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants[effect]}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/** Effect F helper: wrap a grid/row of items in this, give each item <ScrollReveal effect="A"> (or Reveal) and they'll stagger. */
export function StaggerGroup({ className, children, viewport = true }: { className?: string; children: ReactNode; viewport?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      {...(viewport
        ? { whileInView: "show", viewport: { once: true, margin: "-80px" } }
        : { animate: "show" })}
      variants={variants.F}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Effect H — scroll parallax. Wrap an image (or any element) that should drift as the page scrolls past it. */
export function ParallaxImage({
  className,
  strength = 60,
  children,
}: {
  className?: string;
  strength?: number;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Effect I — hover lift. Wrap cards, buttons, anything clickable that should feel responsive. */
export function HoverLift({ className, children, as = "div" }: { className?: string; children: ReactNode; as?: ElementType }) {
  const MotionTag = motion[as as "div"] ?? motion.div;
  return (
    <MotionTag
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** Effect J — gradient shimmer. Use on at most one hero title per page. */
export function ShimmerText({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.span
      initial={{ backgroundPosition: "200% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-[linear-gradient(110deg,var(--foreground)_35%,var(--muted-foreground,#888)_50%,var(--foreground)_65%)] bg-[length:200%_100%] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </motion.span>
  );
}
