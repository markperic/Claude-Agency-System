"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDetached, useScrollValue } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";

export type HeroSlide = {
  key: string;
  eyebrow?: string;
  heading?: string;
  text?: string;
  image: Img;
  cta?: { label: string; href: string };
  cta2?: { label: string; href: string };
};

/**
 * Ported from the client project's real home-page hero (not the SplitTitle set piece further down the
 * page): a full-bleed, autoplaying photo carousel with a Ken Burns drift, scroll-away parallax/fade, and
 * CMS-driven copy per slide. Rebuilt here with static slide data instead of Sanity.
 */
export function ClubHero({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const count = slides.length;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useDetached(scrollYProgress);
  const drift = useScrollValue(p, [0, 1], ["0%", "28%"]);
  const fade = useScrollValue(p, [0, 0.85], [1, 0.25]);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;

  return (
    <section ref={ref} className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-forest-deep" aria-roledescription="carousel">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: drift, opacity: fade }}>
        {slides.map((s, idx) => (
          <div key={s.key} className={`absolute inset-0 transition-opacity duration-[1400ms] ${idx === i ? "opacity-100" : "opacity-0"}`} aria-hidden={idx !== i}>
            <div className={`absolute inset-0 ${idx === i ? "animate-kenburns" : ""}`}>
              <ClubImage image={s.image} fill priority={idx === 0} className="object-cover" sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/25 to-black/30" />
            <div
              className={`relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 transition duration-700 sm:px-6 sm:pb-24 ${
                idx === i ? "translate-y-0 opacity-100 delay-700" : "translate-y-4 opacity-0"
              }`}
            >
              <div className="max-w-3xl text-cream">
                {s.eyebrow && <p className="eyebrow mb-5 text-gold-light">{s.eyebrow}</p>}
                {s.heading && (
                  <p className="font-display text-6xl leading-[0.98] [text-wrap:balance] sm:text-8xl lg:text-[7.5rem]" role="heading" aria-level={1}>
                    {s.heading}
                  </p>
                )}
                {s.text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85 sm:text-xl">{s.text}</p>}
                {(s.cta?.label || s.cta2?.label) && (
                  <div className="mt-10 flex flex-wrap gap-3">
                    {s.cta?.label && (
                      <a href={s.cta.href} className="btn-gold">
                        {s.cta.label}
                      </a>
                    )}
                    {s.cta2?.label && (
                      <a href={s.cta2.href} className="btn-outline text-cream">
                        {s.cta2.label}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/70 sm:flex" aria-hidden>
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="block h-8 w-px animate-scroll-cue bg-cream/70" />
      </div>
      {count > 1 && (
        <div className="absolute bottom-8 right-4 z-20 flex gap-2 sm:right-6">
          {slides.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => setI(idx)}
              className={`box-content h-0.5 bg-clip-content py-3 transition-all ${idx === i ? "w-12 bg-gold" : "w-6 bg-cream/50 hover:bg-cream"}`}
              aria-label={`Show slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
