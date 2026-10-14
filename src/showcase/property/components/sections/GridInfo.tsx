import type { GridInfoContent } from "@/showcase/property/content";
import { Label } from "@/showcase/property/components/ui/Label";
import { Media } from "@/showcase/property/components/ui/Media";

// Desktop placement of the four tiles: wide + narrow, then narrow + wide.
const SPANS = ["desk:col-span-2", "", "", "desk:col-span-2"];

export function GridInfo({ content }: { content: GridInfoContent }) {
  const { title, description, items } = content;
  return (
    <section id="info" className="bg-cream pb-20 pt-30 desk:pb-30 desk:pt-90">
      <div className="mx-gutter mb-20 flex flex-col items-start justify-between gap-20 desk:mb-60 desk:flex-row desk:items-end desk:gap-40">
        <h2 className="text-h2 desk:max-w-600">{title}</h2>
        <p className="w-327 text-lead desk:w-393 desk:shrink-0">{description}</p>
      </div>

      <div className="mx-gutter grid auto-rows-[35rem] gap-grid-gap desk:auto-rows-[40rem] desk:grid-cols-[4209fr_5182fr_4209fr]">
        {items.map((item, i) => (
          <div key={item.label} className={`relative overflow-hidden rounded-card ${SPANS[i] ?? ""}`}>
            <Media media={item.media} sizes="(min-width: 901px) 66vw, 90vw" />
            <Label className="absolute left-20 top-18 text-paper">{item.label}</Label>
          </div>
        ))}
      </div>
    </section>
  );
}
