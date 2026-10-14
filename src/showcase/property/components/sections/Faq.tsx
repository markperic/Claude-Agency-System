"use client";

import { useState } from "react";
import type { FaqContent } from "@/showcase/property/content";
import { Icon } from "@/showcase/property/components/ui/Icon";

export function Faq({ content }: { content: FaqContent }) {
  const { title, items } = content;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-brand pb-60 pt-50 desk:py-160">
      <div className="mx-gutter-narrow">
        <h2 className="mb-32 text-center text-h2 leading-[1.04] text-paper desk:mb-50 desk:leading-none">{title}</h2>
        <ul className="flex flex-col gap-10">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className={`overflow-hidden bg-paper transition-[border-radius] duration-300 ${isOpen ? "rounded-[2.4rem]" : "rounded-pill"}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex h-90 w-full cursor-pointer items-center justify-between gap-20 pl-30 pr-20 text-left desk:h-80 desk:pl-32 desk:pr-24"
                >
                  <span className="text-question text-ink-alt">{item.question}</span>
                  <span className="flex size-40 shrink-0 items-center justify-center rounded-full border border-ink-alt text-ink-alt desk:size-30">
                    <Icon name={isOpen ? "close" : "plus"} className="size-14" />
                  </span>
                </button>
                <div className={`grid ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="px-30 pb-30 text-lead leading-[1.5] text-coal desk:px-32 desk:pb-40 desk:pr-80">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
