"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/showcase/clubhouse/lib/motion";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Two-tone heading with line-mask reveal (Atmos-style).
 * Split lines with " / " or a newline, e.g. "The Foodery / Homestyle meals".
 * Line 1 takes the main colour, later lines the muted colour. Each line rises out of its own mask when scrolled into view.
 */
export function SplitHeading({
  text,
  as = "h2",
  className = "",
  mutedClassName = "opacity-45",
  delay = 0,
}: {
  text?: string;
  as?: Tag;
  className?: string;
  mutedClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (!text) return null;
  const lines = text.split(/\s+\/\s+|\n/).filter(Boolean);
  const Tag = as;

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${i > 0 ? mutedClassName : ""}`}>
            {l}
          </span>
        ))}
      </Tag>
    );
  }

  const M = motion[Tag];
  return (
    <M
      className={className}
      aria-label={lines.join(" ")}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {lines.map((l, i) => (
        <span key={i} aria-hidden className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${i > 0 ? mutedClassName : ""}`}
            variants={{
              hidden: { y: "110%" },
              shown: { y: "0%", transition: { duration: 1.05, ease: EASE_OUT, delay: delay + i * 0.12 } },
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
