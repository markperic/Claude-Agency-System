import type { TestimonialsContent } from "@/showcase/property/content";
import { Icon } from "@/showcase/property/components/ui/Icon";
import { Label } from "@/showcase/property/components/ui/Label";
import { Media } from "@/showcase/property/components/ui/Media";

export function Testimonials({ content }: { content: TestimonialsContent }) {
  const { title, label, background, items } = content;
  return (
    <section id="testimonials" className="relative overflow-hidden text-paper">
      <div className="absolute inset-0">
        <Media media={background} />
      </div>

      <div className="relative z-1 grid pb-20 pt-30 desk:h-260 desk:grid-cols-[62.8rem_1px_1fr] desk:p-0">
        <div className="flex items-start desk:p-30">
          <h2 className="border-b border-line-light px-20 pb-20 text-h2 leading-[1.04] desk:border-0 desk:p-0 desk:leading-[1.1]">{title}</h2>
        </div>
        <div className="hidden bg-line-light desk:block" />
        <div className="flex items-start px-20 pb-20 pt-5 desk:items-end desk:px-30 desk:pb-30 desk:pt-0">
          <Label className="mt-16 desk:mt-0">{label}</Label>
        </div>
      </div>
      <div className="relative z-1 hidden h-px bg-line-light desk:block" />

      <div className="relative z-1 mx-20 pb-60 pt-20 desk:mx-auto desk:max-w-[120rem] desk:px-60 desk:pb-125 desk:pt-130">
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item) => (
            <div key={item.name} className="flex w-full flex-col items-center gap-14 rounded-card bg-paper px-30 py-36 desk:w-[calc((100%-1.6rem)/3)] desk:px-36 desk:py-44">
              <div className="flex flex-col items-center gap-2">
                <span className="text-h3 font-medium leading-[1.1] text-ink">{item.name}</span>
                {item.stars ? (
                  <span className="flex h-[1.92rem] items-center text-brand" role="img" aria-label={`${item.stars}/5`}>
                    {Array.from({ length: item.stars }, (_, i) => (
                      <Icon key={i} name="star" className="size-20" />
                    ))}
                  </span>
                ) : (
                  <span className="my-[0.86rem] h-[2px] w-40 bg-brand" />
                )}
              </div>
              <p className="text-center text-name italic leading-[1.4] text-coal">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-1 hidden h-px bg-line-light desk:block" />
    </section>
  );
}
