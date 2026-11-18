import { ParallaxImage } from "@/showcase/clubhouse/components/motion/ParallaxImage";
import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import { visit } from "@/showcase/clubhouse/content";

export function Footer() {
  return (
    <footer id="visit" className="bg-cream py-24 text-ink sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <ParallaxImage image={visit.image} className="aspect-[4/3] lg:aspect-auto lg:h-[60svh]" speed={0.08} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-5 text-gold">{visit.eyebrow}</p>
          <SplitHeading text={visit.heading} className="font-display text-4xl leading-[1.05] text-forest sm:text-5xl" mutedClassName="text-forest/40" />

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3 text-forest/60">Address</p>
              {visit.address.map((line) => (
                <p key={line} className="text-ink/80">
                  {line}
                </p>
              ))}
              <a href={visit.phone.href} className="mt-3 inline-block font-semibold text-forest">
                {visit.phone.label}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3 text-forest/60">Hours</p>
              <ul className="space-y-1.5">
                {visit.hours.map((h) => (
                  <li key={h.label} className="flex justify-between gap-4 text-sm text-ink/80">
                    <span>{h.label}</span>
                    <span>{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a href="#top" className="btn-forest mt-10">
            Back to top
          </a>

          <p className="mt-10 max-w-sm text-xs leading-relaxed text-ink/50">{visit.note}</p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 border-t border-forest/15 pt-8 text-xs text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>The Clubhouse is a fictional club built to showcase a scroll-driven page design — not a real venue.</p>
          <p>Design by Capote Design</p>
        </div>
      </div>
    </footer>
  );
}
