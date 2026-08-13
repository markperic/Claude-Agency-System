"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 65 — Gallery, Accordion
 * A row of panels where the active one expands and reveals its label; the
 * rest compress, grey out, and tilt slightly away in 3D. Hover a panel (or
 * focus + arrow keys) to make it active. Adapted from ReactBits'
 * AccordionGallery — rebuilt on Motion instead of GSAP so it shares this
 * repo's one animation engine rather than adding a second. Photo URLs are
 * ReactBits' own demo images (picsum.photos), kept as real photos rather
 * than this catalog's usual gradient placeholder, since the panel's
 * color/greyscale toggle is the point and doesn't read on a flat gradient.
 * The 3D rotation and the rounded/clipped corners are deliberately split
 * across a parent/child pair — Chrome fails to clip border-radius on an
 * element that also carries a 3D transform, so rotateY lives on the outer
 * div and overflow-hidden + rounded-2xl live on an untransformed child.
 * Local interactive state, not part of the A–J catalog (same as module
 * 25's mouse-tilt card).
 */
const PANELS = [
  { id: 1, label: "Canyon", image: "https://picsum.photos/id/1015/900/1200" },
  { id: 2, label: "Ridgeline", image: "https://picsum.photos/id/1018/900/1200" },
  { id: 3, label: "Falls", image: "https://picsum.photos/id/1039/900/1200" },
  { id: 4, label: "Harbour", image: "https://picsum.photos/id/1043/900/1200" },
  { id: 5, label: "Skyline", image: "https://picsum.photos/id/1044/900/1200" },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const TILT = 8;

export default function GalleryAccordion() {
  const [active, setActive] = useState(2);

  function step(delta: number) {
    setActive((i) => (i + delta + PANELS.length) % PANELS.length);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  }

  return (
    <section className="bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="h2" className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Recent work, one frame at a time
        </ScrollReveal>

        <div role="list" aria-label="Image accordion gallery" className="mt-12 flex h-[460px] gap-2.5" style={{ perspective: 1400 }}>
          {PANELS.map((panel, i) => {
            const isActive = i === active;
            const rotate = isActive ? 0 : i < active ? TILT : -TILT;
            const shift = isActive ? 0 : i < active ? -24 : 24;

            return (
              <motion.div
                key={panel.id}
                role="listitem"
                tabIndex={0}
                aria-current={isActive || undefined}
                aria-label={panel.label}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={handleKeyDown}
                animate={{ flexGrow: isActive ? PANELS.length - 1 : 1, rotateY: rotate }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative min-w-0 cursor-pointer outline-none"
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <motion.div
                    aria-hidden
                    animate={{ x: shift, filter: isActive ? "grayscale(0)" : "grayscale(1)" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute -inset-x-10 inset-y-0"
                  >
                    <img src={panel.image} alt={panel.label} draggable={false} className="h-full w-full object-cover select-none" />
                  </motion.div>
                  <motion.div
                    aria-hidden
                    animate={{ opacity: isActive ? 0.5 : 0.85 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(6,0,16,0.9)_100%)]"
                  />
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -14 }}
                    transition={{ duration: isActive ? 0.5 : 0.3, ease: EASE }}
                    className="absolute inset-x-5 bottom-5 flex items-center gap-3"
                  >
                    <span className="h-[26px] w-[3px] shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                    <span className="truncate text-base font-semibold text-white sm:text-lg">{panel.label}</span>
                  </motion.div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl outline-2 outline-transparent -outline-offset-2 group-focus-visible:outline-white" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
