import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { Branch, Container, Heading, RichText } from "./shared";

type Card = { key: string; title?: string; paragraphs?: React.ReactNode[]; image?: Img };

const toneClass = { light: "bg-cream text-ink", sand: "bg-sand text-ink", dark: "bg-forest text-cream" } as const;

export function CardGridSection({
  eyebrow,
  heading,
  intro,
  cards,
  columns = 3,
  tone = "light",
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  cards: Card[];
  columns?: 2 | 3 | 4;
  tone?: keyof typeof toneClass;
}) {
  const dark = tone === "dark";
  const cols = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <section className={`relative isolate overflow-hidden ${toneClass[tone]} py-24 sm:py-32`}>
      <Branch side="left" dark={dark} />
      <Container>
        <Heading eyebrow={eyebrow} heading={heading} intro={intro} dark={dark} />
        <div className={`grid gap-x-8 gap-y-14 ${cols}`}>
          {cards.map((c) => (
            <article key={c.key} className={`group flex flex-col ${c.image ? "" : dark ? "border-t border-cream/20 pt-8" : "border-t border-forest/20 pt-8"}`}>
              {c.image && (
                <div className="relative mb-7 aspect-[4/3] overflow-hidden">
                  <ClubImage image={c.image} fill className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105" sizes="(min-width: 1024px) 33vw, 100vw" />
                </div>
              )}
              {c.title && <h3 className={`font-display text-2xl leading-snug sm:text-[1.7rem] ${dark ? "text-cream" : "text-forest"}`}>{c.title}</h3>}
              <RichText paragraphs={c.paragraphs} className={`prose-mg mt-3 text-base ${dark ? "text-cream/80" : "text-muted"}`} />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
