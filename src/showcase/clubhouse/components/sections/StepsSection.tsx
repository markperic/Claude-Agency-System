import { ParallaxImage } from "@/showcase/clubhouse/components/motion/ParallaxImage";
import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import type { Img } from "@/showcase/clubhouse/components/ClubImage";
import { Container, RichText } from "./shared";

const toneClass = { light: "bg-cream text-ink", sand: "bg-sand text-ink", dark: "bg-forest text-cream" } as const;

type Step = { key: string; title?: string; text?: string };

/** Ported from the client project's stepsSection: a numbered list pinned beside a photo — "How to join", benefits lists, step-by-step instructions. */
export function StepsSection({
  eyebrow,
  heading,
  intro,
  paragraphs,
  items,
  image,
  imagePosition = "left",
  tone = "light",
  cta,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  paragraphs?: React.ReactNode[];
  items: Step[];
  image?: Img;
  imagePosition?: "left" | "right";
  tone?: keyof typeof toneClass;
  cta?: { label: string; href: string };
}) {
  const dark = tone === "dark";
  const left = imagePosition !== "right";
  return (
    <section className={`relative ${toneClass[tone]} py-24 sm:py-36`}>
      <Container className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        {image && (
          <div className={`lg:sticky lg:top-28 lg:col-span-5 ${left ? "" : "lg:order-2 lg:col-start-8"}`}>
            <ParallaxImage image={image} className="aspect-[4/5] lg:aspect-auto lg:h-[calc(100svh-9rem)]" speed={0.06} sizes="(min-width: 1024px) 42vw, 100vw" />
          </div>
        )}
        <div className={`min-w-0 [overflow-wrap:anywhere] ${image ? (left ? "lg:col-span-6 lg:col-start-7" : "lg:order-1 lg:col-span-6") : "lg:col-span-8"}`}>
          {eyebrow && <p className={`eyebrow mb-5 ${dark ? "text-gold-light" : "text-gold"}`}>{eyebrow}</p>}
          <SplitHeading
            text={heading}
            className={`font-display text-5xl leading-[1.02] [text-wrap:balance] sm:text-6xl lg:text-7xl ${dark ? "text-cream" : "text-forest"}`}
            mutedClassName={dark ? "text-cream/40" : "text-forest/40"}
          />
          {intro && <p className={`mt-8 font-display text-2xl leading-snug sm:text-[1.9rem] ${dark ? "text-cream" : "text-forest"}`}>{intro}</p>}
          <ol className="mt-14">
            {items.map((it, i) => (
              <li
                key={it.key}
                className={`grid grid-cols-[3.5rem_1fr] gap-x-4 border-t py-8 sm:grid-cols-[5rem_1fr] ${dark ? "border-cream/20" : "border-forest/15"}`}
              >
                <span className={`font-display text-3xl leading-none tabular-nums sm:text-4xl ${dark ? "text-gold-light" : "text-gold"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  {it.title && <h3 className={`font-display text-2xl leading-snug sm:text-3xl ${dark ? "text-cream" : "text-forest"}`}>{it.title}</h3>}
                  {it.text && <p className={`mt-3 leading-relaxed ${dark ? "text-cream/75" : "text-muted"}`}>{it.text}</p>}
                </div>
              </li>
            ))}
          </ol>
          {!!paragraphs?.length && (
            <div className={`border-t pt-8 ${dark ? "border-cream/20" : "border-forest/15"}`}>
              <RichText paragraphs={paragraphs} className={`prose-mg ${dark ? "text-cream/85" : "text-ink/85"}`} />
            </div>
          )}
          {cta?.label && (
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={cta.href} className="btn-gold">
                {cta.label}
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
