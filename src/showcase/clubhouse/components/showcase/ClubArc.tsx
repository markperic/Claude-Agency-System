"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDetached, useIsDesktop } from "@/showcase/clubhouse/lib/motion";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { SplitHeading } from "../motion/SplitHeading";

export type ArcItem = { key: string; label: string; meta?: string; image?: Img; href?: string };

/**
 * Club life arc (Atmos gallery): a fanned deck of photo cards laid on a curve. Scrolling down slides the
 * deck sideways; each card rotates and drops as it travels away from centre. Phones get a swipeable row.
 */
export function ClubArc({ eyebrow, heading, intro, items }: { eyebrow?: string; heading?: string; intro?: string; items: ArcItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useDetached(scrollYProgress);
  const [vw, setVw] = useState(1440);
  useEffect(() => {
    const on = () => setVw(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const head = (
    <div className="max-w-xl">
      {eyebrow && <p className="eyebrow mb-4 text-gold-light">{eyebrow}</p>}
      <SplitHeading text={heading} className="font-display text-5xl leading-[1.02] text-cream sm:text-6xl" mutedClassName="text-cream/40" />
      {intro && <p className="mt-6 max-w-md text-cream/70">{intro}</p>}
    </div>
  );

  if (reduce || !desktop) {
    return (
      <section ref={ref} className="bg-forest-deep py-20">
        <div className="px-4 sm:px-8">{head}</div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-8">
          {items.map((it, i) => (
            <MobileCard key={it.key} it={it} rotate={i % 2 ? 2 : -2} />
          ))}
        </div>
      </section>
    );
  }

  const W = Math.min(380, Math.max(260, vw * 0.22));
  return (
    <section ref={ref} className="relative h-[360svh] bg-forest-deep">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute left-0 top-0 z-10 px-8 pt-32">{head}</div>
        <ArcCounter p={p} n={items.length} />
        {items.map((it, i) => (
          <ArcCard key={it.key} it={it} i={i} n={items.length} p={p} vw={vw} W={W} />
        ))}
      </div>
    </section>
  );
}

function ArcCard({ it, i, n, p, vw, W }: { it: ArcItem; i: number; n: number; p: MotionValue<number>; vw: number; W: number }) {
  const S = W * 1.02;
  const u = useTransform(p, (v) => i - (-1.4 + v * (n - 1 + 2.8)));
  const x = useTransform(u, (u) => vw * 0.56 + u * S - W / 2);
  const y = useTransform(u, (u) => u * u * 30);
  const rotate = useTransform(u, (u) => u * 6.5);
  const scale = useTransform(u, (u) => 1 - Math.min(Math.abs(u), 3) * 0.035);
  const zIndex = useTransform(u, (u) => 50 - Math.round(Math.abs(u) * 4));
  const cardClass = "group relative block aspect-[4/5] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]";

  return (
    <motion.div className="absolute top-[34svh] origin-bottom" style={{ x, y, rotate, scale, zIndex, width: W, willChange: "transform" }}>
      {it.href ? (
        <a href={it.href} className={cardClass}>
          <ClubImage image={it.image} fill className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105" sizes="380px" />
          <CardLabel it={it} />
        </a>
      ) : (
        <div className={cardClass}>
          <ClubImage image={it.image} fill className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105" sizes="380px" />
          <CardLabel it={it} />
        </div>
      )}
    </motion.div>
  );
}

function MobileCard({ it, rotate }: { it: ArcItem; rotate: number }) {
  const cardClass = "relative aspect-[4/5] w-[72vw] max-w-80 shrink-0 snap-center overflow-hidden";
  const style = { transform: `rotate(${rotate}deg)` };
  const inner = (
    <>
      <ClubImage image={it.image} fill className="object-cover" sizes="72vw" />
      <CardLabel it={it} />
    </>
  );
  return it.href ? (
    <a href={it.href} className={cardClass} style={style}>
      {inner}
    </a>
  ) : (
    <div className={cardClass} style={style}>
      {inner}
    </div>
  );
}

function CardLabel({ it }: { it: ArcItem }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 pt-16 text-cream">
      <p className="font-display text-2xl leading-tight">{it.label}</p>
      {it.meta && <p className="eyebrow mt-2 text-[10px] text-gold-light">{it.meta}</p>}
    </div>
  );
}

function ArcCounter({ p, n }: { p: MotionValue<number>; n: number }) {
  const width = useTransform(p, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute bottom-10 left-8 right-8 z-10 flex items-center gap-6 text-cream/60">
      <span className="eyebrow text-[10px]">Club life</span>
      <div className="relative h-px flex-1 bg-cream/15">
        <motion.div className="absolute inset-y-0 left-0 bg-gold" style={{ width }} />
      </div>
      <span className="eyebrow text-[10px]">{String(n).padStart(2, "0")} clubs &amp; groups</span>
    </div>
  );
}
