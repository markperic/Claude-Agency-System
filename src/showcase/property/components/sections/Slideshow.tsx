import type { SlideshowContent } from "@/showcase/property/content";
import { Media } from "@/showcase/property/components/ui/Media";

export function Slideshow({ content, activeIndex = 0 }: { content: SlideshowContent; activeIndex?: number }) {
  const { title, items } = content;
  return (
    <section id="slideshow" className="relative overflow-hidden py-30 text-paper">
      <div className="relative mx-gutter aspect-[350/720] overflow-hidden rounded-card desk:aspect-[1380/720]">
        <div className="absolute inset-0">
          {items.map((item, i) => (
            <div key={item.label} data-slide={i} className={`absolute inset-0 overflow-hidden ${i === activeIndex ? "z-2" : "z-1"}`}>
              <Media media={item.media} />
            </div>
          ))}
          <div className="absolute inset-0 z-2 bg-scrim" />
        </div>

        <div className="absolute inset-0 z-4 flex flex-col desk:right-auto desk:w-434 desk:p-10">
          <div className="ml-10 mt-10 w-330 rounded-sm bg-paper px-30 py-16 text-center text-h3 text-ink desk:m-0 desk:w-auto desk:p-32 desk:text-left desk:text-title">
            {title}
          </div>
          <ul className="relative z-10 flex flex-1 flex-col justify-end">
            {items.map((item, i) => (
              <li key={item.label} data-slide-item={i}>
                <div className="h-px overflow-hidden bg-line-strong">
                  <div data-slide-progress className="h-full w-0 bg-paper" />
                </div>
                <div className="flex items-center gap-20 px-13 py-28 desk:px-0 desk:py-18">
                  <span className={`size-10 shrink-0 border ${i === activeIndex ? "border-cream bg-cream" : "border-paper"}`} />
                  <span className="overflow-hidden text-[2.4rem] leading-none">{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute inset-y-0 left-434 z-3 hidden w-px bg-line-strong desk:block" />
      </div>
    </section>
  );
}
