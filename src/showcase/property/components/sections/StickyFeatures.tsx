"use client";

import { useEffect, useRef, useState } from "react";
import type { FeaturesContent } from "@/showcase/property/content";
import { Button } from "@/showcase/property/components/ui/Button";
import { Media } from "@/showcase/property/components/ui/Media";
import { MOTION_DESKTOP, MOTION_MOBILE, useStickyProgress } from "@/showcase/property/hooks/useStickyProgress";
import { gsap, ScrollTrigger } from "@/showcase/property/lib/gsap";

/*
 * Desktop scroll behaviour, derived from reference/out/fine-features-1440.json
 * and reference/capture/probe-features.mjs.
 *
 * The feature list sits at the bottom of a sticky panel inside a container
 * three viewports tall. Scrolling through the container is split into one
 * equal step per feature; scrubbed within step i:
 *   0    → 1     linear        feature i travels from the bottom stack to the top stack
 *   0.21 → 0.70  power1.inOut  its description fades in
 *   0.43 → 0.87  power1.inOut  (of the next step) its description fades out
 *
 * Triggered when a step begins (time-based, not scrubbed):
 *   - the feature's number takes the brand colour (0.5s CSS transition)
 *   - the image on the right swaps with an upward wipe, 1s power4.inOut
 */
const DESC_IN = { at: 0.21, duration: 0.49 };
const DESC_OUT = { at: 0.43, duration: 0.44 };
const WIPE_SECONDS = 1;

export function StickyFeatures({ content }: { content: FeaturesContent }) {
  const { intro, items } = content;
  const images = [intro.media, ...items.map((item) => item.media)];
  const steps = items.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const progress = useRef(0);
  const shownImage = useRef(new WeakMap<Element, number>());
  // -1 while the intro is showing, otherwise the index of the active feature
  const [active, setActive] = useState(-1);

  useStickyProgress(containerRef, (p) => {
    progress.current = p;
    timeline.current?.progress(p);
    setActive(p <= 0 ? -1 : Math.min(steps - 1, Math.floor(p * steps)));
  });

  // Scrubbed timeline: list travel + description fades
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_DESKTOP, () => {
      const q = gsap.utils.selector(section);
      const panel = q<HTMLElement>("[data-feature-panel]")[0];
      const rows = q<HTMLElement>("[data-feature]");
      const descs = q<HTMLElement>("[data-feature-desc]");
      // Distance from the bottom stack to the top stack (plus 1px, as measured:
      // the first row ends tucked a pixel under the panel's top edge)
      const travel = () => -(panel.clientHeight - rows.reduce((sum, row) => sum + row.offsetHeight, 0) + 1);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      rows.forEach((row, i) => {
        tl.fromTo(row, { y: 0 }, { y: travel, duration: 1 }, i);
        tl.fromTo(descs[i], { opacity: 0 }, { opacity: 1, duration: DESC_IN.duration, ease: "power1.inOut" }, i + DESC_IN.at);
        if (i < rows.length - 1) {
          tl.to(descs[i], { opacity: 0, duration: DESC_OUT.duration, ease: "power1.inOut" }, i + 1 + DESC_OUT.at);
        }
      });
      tl.set({}, {}, rows.length);
      timeline.current = tl;

      const remeasure = () => {
        tl.invalidate();
        tl.progress(0).progress(progress.current);
      };
      ScrollTrigger.addEventListener("refreshInit", remeasure);
      tl.progress(progress.current);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", remeasure);
        timeline.current = null;
      };
    });

    /*
     * Mobile: our own sequence (the reference's mobile list is static). The
     * panel — image on top, list below — is sticky for 1.5 screens of scroll.
     * Only the active feature's description is open; it changes over the
     * 0.4 units around each step boundary, and the image wipes as on desktop.
     */
    mm.add(MOTION_MOBILE, () => {
      const descs = gsap.utils.selector(section)<HTMLElement>("[data-feature-desc]");
      gsap.set(descs.slice(1), { height: 0, opacity: 0 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power1.inOut", duration: 0.4 } });
      descs.forEach((desc, i) => {
        if (i === 0) return;
        tl.to(descs[i - 1], { height: 0, opacity: 0 }, i - 0.2).to(desc, { height: "auto", opacity: 1 }, i - 0.2);
      });
      tl.set({}, {}, descs.length);
      timeline.current = tl;
      tl.progress(progress.current);
      return () => {
        timeline.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  // Image swap: the seam travels upward — the outgoing image is cut away from
  // the bottom while the incoming one is uncovered beneath it.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tweens: gsap.core.Tween[] = [];

    // Two stacks: desktop (intro image first, offset 1) and mobile (feature images only, offset 0).
    section.querySelectorAll<HTMLElement>("[data-feature-stack]").forEach((stack) => {
      const layers = [...stack.querySelectorAll<HTMLElement>("[data-feature-image]")];
      const from = shownImage.current.get(stack) ?? 0;
      const to = Math.max(active + Number(stack.dataset.offset), 0);
      if (from === to || !layers[to]) return;
      shownImage.current.set(stack, to);

      const settle = () =>
        layers.forEach((layer, i) => {
          layer.style.clipPath = i === to ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)";
        });
      if (reducedMotion) {
        settle();
        return;
      }

      layers.forEach((layer, i) => {
        if (i !== from && i !== to) layer.style.clipPath = "inset(100% 0% 0% 0%)";
      });
      const seam = { y: 100 };
      tweens.push(
        gsap.to(seam, {
          y: 0,
          duration: WIPE_SECONDS,
          ease: "power4.inOut",
          onUpdate: () => {
            layers[from].style.clipPath = `inset(0% 0% ${100 - seam.y}% 0%)`;
            layers[to].style.clipPath = `inset(${seam.y}% 0% 0% 0%)`;
          },
          onComplete: settle,
        }),
      );
    });

    return () => tweens.forEach((tween) => tween.kill());
  }, [active]);

  return (
    // Desktop: overlaps the last 20vh of the hero wrapper.
    <section ref={sectionRef} id="features" className="relative z-2 bg-paper desk:border-b desk:border-line desk:motion-safe:-mt-[20vh]">
      <div className="relative grid desk:grid-cols-[45%_55%] desk:pt-100">
        {/* Clean boundary: a paper-coloured mask pinned above the rule, so nothing (text, the centre divider) shows in the header zone while the section scrolls */}
        <div className="pointer-events-none absolute inset-0 z-2 hidden desk:block">
          <div className="sticky top-0 h-100 bg-paper" />
        </div>

        {/* Rule under the header: starts at the top of the grid and stays stuck there while the section scrolls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(100vh-10rem)] top-100 z-1 hidden desk:block">
          <div className="sticky top-100 h-px bg-line" />
        </div>

        <div className="pt-30 desk:border-r desk:border-line desk:pt-0">
          {/* Intro */}
          <div className="flex flex-col items-start justify-between gap-30 px-20 pt-30 desk:gap-60 desk:p-30">
            <div>
              <h2 className="mb-10 whitespace-pre-line text-h2 desk:mb-24">{intro.title}</h2>
              <p className="max-w-420 whitespace-pre-line text-lead leading-[1.4] text-muted">{intro.description}</p>
            </div>
            <Button link={intro.cta} />
            <div className="relative aspect-[350/306] w-full overflow-hidden rounded-card desk:hidden">
              <Media media={intro.media} sizes="90vw" />
            </div>
          </div>

          {/* Feature list in a sticky panel. Desktop: one viewport of scroll per feature, list pinned to the bottom. Mobile: image above the list. */}
          <div ref={containerRef} className="relative max-desk:motion-safe:h-[250vh] desk:motion-safe:h-[300vh]">
            <div
              data-feature-panel
              className="flex flex-col items-start justify-end overflow-hidden max-desk:motion-safe:sticky max-desk:motion-safe:top-0 max-desk:motion-safe:h-screen max-desk:motion-safe:justify-start max-desk:motion-safe:pt-100 desk:motion-safe:sticky desk:motion-safe:top-100 desk:motion-safe:h-[calc(100vh-10rem)]"
            >
              {/* Mobile image stack: swaps with the active feature */}
              <div
                data-feature-stack
                data-offset="0"
                className="relative mx-20 mb-10 hidden aspect-[35/24] w-[calc(100%-4rem)] shrink-0 overflow-hidden rounded-card max-desk:motion-safe:block"
              >
                {items.map((item, i) => (
                  <div key={i} data-feature-image={i} className={`absolute inset-0 ${i === 0 ? "" : "[clip-path:inset(100%_0%_0%_0%)]"}`}>
                    <Media media={item.media} sizes="90vw" />
                  </div>
                ))}
              </div>
              {items.map((item, i) => (
                <div
                  key={item.title}
                  data-feature={i}
                  className={`flex w-full items-start gap-x-40 rounded-card border-line p-20 max-desk:border-b desk:gap-x-220 ${i > 0 ? "desk:border-t" : ""}`}
                >
                  <span
                    className={`w-24 shrink-0 text-num font-bold transition-colors duration-500 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] desk:w-40 ${active === i ? "text-brand" : "text-ink-alt"}`}
                  >
                    {i + 1}
                  </span>
                  <div className="relative pt-8">
                    <h3 className="text-h3 text-ink-alt">{item.title}</h3>
                    {/* Desktop: laid over the gap below the row and faded in while the feature is active. */}
                    <div data-feature-desc className="max-desk:motion-safe:overflow-hidden desk:motion-safe:absolute desk:motion-safe:left-0 desk:motion-safe:top-full desk:motion-safe:opacity-0">
                      <p className="pt-10 text-muted desk:w-248">
                        {item.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky image stack (desktop only) */}
        <div className="sticky top-100 hidden h-[calc(100vh-10rem)] overflow-hidden p-30 desk:block">
          <div data-feature-stack data-offset="1" className="relative size-full overflow-hidden rounded-card">
            {images.map((media, i) => (
              <div key={i} data-feature-image={i} className={`absolute inset-0 ${i === 0 ? "" : "[clip-path:inset(100%_0%_0%_0%)]"}`}>
                <Media media={media} sizes="55vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
