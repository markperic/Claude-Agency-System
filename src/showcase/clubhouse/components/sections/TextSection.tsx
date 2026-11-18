import { ParallaxImage } from "@/showcase/clubhouse/components/motion/ParallaxImage";
import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import type { Img } from "@/showcase/clubhouse/components/ClubImage";
import { Branch, Container, RichText } from "./shared";

const toneClass = { light: "bg-cream text-ink", sand: "bg-sand text-ink", dark: "bg-forest text-cream" } as const;

export function TextSection({
  eyebrow,
  heading,
  paragraphs,
  image,
  imagePosition,
  tone = "light",
  cta,
}: {
  eyebrow?: string;
  heading?: string;
  paragraphs: React.ReactNode[];
  image?: Img;
  imagePosition?: "left" | "right";
  tone?: keyof typeof toneClass;
  cta?: { label: string; href: string };
}) {
  const dark = tone === "dark";
  const lead = `[&>p:first-child]:mb-8 [&>p:first-child]:font-display [&>p:first-child]:text-2xl [&>p:first-child]:leading-snug sm:[&>p:first-child]:text-[1.9rem] ${
    dark ? "[&>p:first-child]:text-cream" : "[&>p:first-child]:text-forest"
  }`;
  const ctaBlock = cta?.label && (
    <div className="mt-10 flex flex-wrap gap-3">
      <a href={cta.href} className="btn-gold">
        {cta.label}
      </a>
    </div>
  );
  const headingBlock = (
    <>
      {eyebrow && <p className={`eyebrow mb-5 ${dark ? "text-gold-light" : "text-gold"}`}>{eyebrow}</p>}
      <SplitHeading
        text={heading}
        className={`font-display text-5xl leading-[1.02] [text-wrap:balance] sm:text-6xl lg:text-7xl ${dark ? "text-cream" : "text-forest"}`}
        mutedClassName={dark ? "text-cream/40" : "text-forest/40"}
      />
    </>
  );

  if (image) {
    const left = imagePosition === "left";
    return (
      <section className={`relative isolate overflow-hidden ${toneClass[tone]} py-24 sm:py-36`}>
        <Container className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className={`lg:col-span-5 ${left ? "lg:order-2 lg:col-start-8" : ""}`}>
            {headingBlock}
            <div className="mt-10">
              <RichText paragraphs={paragraphs} className={`prose-mg ${lead} ${dark ? "text-cream/85" : "text-ink/85"}`} />
              {ctaBlock}
            </div>
          </div>
          <ParallaxImage
            image={image}
            className={`aspect-[4/5] lg:col-span-6 lg:aspect-auto lg:h-[78svh] ${left ? "lg:order-1" : "lg:col-start-7"}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Container>
      </section>
    );
  }

  return (
    <section className={`relative isolate overflow-hidden ${toneClass[tone]} py-24 sm:py-36`}>
      <Branch side="right" dark={dark} />
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">{headingBlock}</div>
        <div className={`lg:col-span-6 lg:col-start-7 ${heading ? "lg:pt-3" : ""}`}>
          <div className={`mb-10 h-px w-16 ${dark ? "bg-gold-light" : "bg-gold"}`} aria-hidden />
          <RichText paragraphs={paragraphs} className={`prose-mg ${lead} ${dark ? "text-cream/85" : "text-ink/85"}`} />
          {ctaBlock}
        </div>
      </Container>
    </section>
  );
}
