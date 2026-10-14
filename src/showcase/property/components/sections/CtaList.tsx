import type { CtaListContent } from "@/showcase/property/content";
import { Button } from "@/showcase/property/components/ui/Button";
import { Media } from "@/showcase/property/components/ui/Media";

type CtaListProps = {
  content: CtaListContent;
  id?: string;
  /** Drop the top padding when the section follows a full-bleed block. */
  flushTop?: boolean;
};

export function CtaList({ content, id, flushTop = false }: CtaListProps) {
  const { title, cards } = content;
  return (
    <section id={id} className={`relative z-2 bg-paper pb-60 desk:pb-160 ${flushTop ? "" : "pt-60 desk:pt-130"}`}>
      <div className="mx-gutter">
        <h2 className="mb-40 text-center text-h2 desk:mx-332 desk:mb-60">{title}</h2>
        <div className="flex flex-col justify-center gap-16 desk:flex-row desk:gap-10">
          {cards.map((card) => (
            <div key={card.cta.label} className="flex flex-col overflow-hidden rounded-card bg-cream p-10 desk:w-424">
              <div className="relative aspect-[404/190] overflow-hidden">
                <Media media={card.media} sizes="(min-width: 901px) 28vw, 85vw" />
              </div>
              <div className="flex h-130 items-end desk:h-169">
                <Button link={card.cta} theme="paper" block />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
