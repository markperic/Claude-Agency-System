"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { Branch, Container, Heading } from "./shared";

export type ClubEvent = {
  key: string;
  title: string;
  dateLabel: string;
  day?: string;
  month?: string;
  category?: string;
  excerpt?: string;
  image?: Img;
  cta?: { label: string; href: string };
};

function EventCard({ event, priority }: { event: ClubEvent; priority?: boolean }) {
  return (
    <a href={event.cta?.href ?? "#"} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-forest/10">
        {event.image ? (
          <ClubImage image={event.image} fill className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 46vw, 82vw" priority={priority} />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-4xl text-forest/30">The Clubhouse</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        {event.day && (
          <div className="absolute left-0 top-0 bg-forest-deep px-4 py-3 text-center leading-none text-cream">
            <p className="font-display text-3xl">{event.day}</p>
            <p className="eyebrow mt-1.5 text-[10px] text-gold-light">{event.month}</p>
          </div>
        )}
        {event.category && <span className="eyebrow absolute bottom-4 left-4 bg-cream/95 px-3 py-1.5 text-[10px] text-forest">{event.category}</span>}
      </div>
      <div className="flex flex-1 flex-col pt-6">
        <p className="text-sm font-semibold text-gold">{event.dateLabel}</p>
        <h3 className="mt-2 font-display text-2xl leading-snug text-forest transition group-hover:text-moss">{event.title}</h3>
        {event.excerpt && <p className="mt-2 line-clamp-3 text-muted">{event.excerpt}</p>}
        <span className="link-line mt-auto self-start pt-5 text-forest">
          Find out more <span aria-hidden>→</span>
        </span>
      </div>
    </a>
  );
}

/** Horizontal scroll-snap carousel with arrow buttons; the next card peeks in to invite scrolling. */
function EventsCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const items = Children.toArray(children);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth) + 32), behavior: "smooth" });
  };

  const arrow =
    "grid size-12 place-items-center border border-forest/30 text-forest transition hover:border-forest hover:bg-forest hover:text-cream disabled:pointer-events-none disabled:opacity-25";

  return (
    <div>
      <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6" role="region" aria-roledescription="carousel" aria-label="Upcoming events">
        {items.map((child, i) => (
          <div key={i} data-slide className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-4rem)/3)]">
            {child}
          </div>
        ))}
      </div>
      {(canPrev || canNext) && (
        <div className="mt-8 flex justify-end gap-3">
          <button className={arrow} onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous events">
            ←
          </button>
          <button className={arrow} onClick={() => go(1)} disabled={!canNext} aria-label="Next events">
            →
          </button>
        </div>
      )}
    </div>
  );
}

export function EventsSection({ eyebrow, heading, intro, events }: { eyebrow?: string; heading?: string; intro?: string; events: ClubEvent[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-sand py-24 sm:py-32">
      <Branch side="left" />
      <Container>
        <Heading eyebrow={eyebrow} heading={heading || "What's on"} intro={intro} />
        {events.length ? (
          <EventsCarousel>
            {events.map((e, i) => (
              <EventCard key={e.key} event={e} priority={i === 0} />
            ))}
          </EventsCarousel>
        ) : (
          <p className="border border-forest/15 p-10 text-center text-muted">New events are coming soon — follow us on Facebook for the latest.</p>
        )}
        <div className="mt-14 text-center">
          <a href="#" className="btn-forest">
            See everything on
          </a>
        </div>
      </Container>
    </section>
  );
}
