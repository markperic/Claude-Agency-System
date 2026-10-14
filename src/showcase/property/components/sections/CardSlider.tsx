"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SliderContent } from "@/showcase/property/content";
import { Button } from "@/showcase/property/components/ui/Button";
import { Icon } from "@/showcase/property/components/ui/Icon";
import { Media } from "@/showcase/property/components/ui/Media";
import { gsap } from "@/showcase/property/lib/gsap";

/*
 * Endless, draggable card slider. Behaviour sampled from the reference
 * (reference/capture/probe-slider.mjs):
 *   - cards follow the pointer at 0.9× and wrap around endlessly
 *   - on release the track settles on the nearest card like a critically
 *     damped spring (it keeps the pointer's speed, so a release mid-movement
 *     carries on briefly before returning); a quick flick lands further along
 *   - the card nearest the centre is the active one (tinted panel), switching
 *     with a 0.5s colour transition after a 0.5s delay
 *   - the reference does not autoplay; `autoplaySeconds` in content.ts is our addition
 */
const DRAG_RATIO = 0.9;
const SPRING = 0.0115; // spring frequency in rad/ms, fitted to the reference's settle curve
const THROW_MS = 250; // how far a flick's speed is projected forward
const MAX_THROW_CARDS = 3;
const CLICK_SLOP = 5; // px of movement before a press counts as a drag
const MIN_LOOP_CARDS = 6; // enough copies to fill the widest layout either side of centre

export function CardSlider({ content }: { content: SliderContent }) {
  const { title, cards, cta, dotLabel, autoplaySeconds = 0 } = content;
  const copies = Math.max(1, Math.ceil(MIN_LOOP_CARDS / cards.length));
  const loop = Array.from({ length: copies }, () => cards).flat();

  const trackRef = useRef<HTMLDivElement>(null);
  const goTo = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const els = [...track.querySelectorAll<HTMLElement>("[data-slider-card]")];
    const count = els.length;
    const perSet = cards.length;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = els[0].offsetWidth;
    let x = 0; // track offset in px; unbounded, cards wrap around it
    let target = 0;
    let velocity = 0; // px per ms
    let activeIndex = -1;
    let dragging = false;
    let captured = false;
    let startPointer = 0;
    let startX = 0;
    let moved = 0;
    let samples: { t: number; x: number }[] = [];
    let hovered = false;
    let visible = false;
    let autoplay: gsap.core.Tween | undefined;

    const render = () => {
      const total = width * count;
      let nearest = 0;
      let nearestDistance = Infinity;
      els.forEach((el, i) => {
        let pos = (((i * width + x) % total) + total) % total;
        if (pos >= total / 2) pos -= total;
        el.style.transform = `translateX(${pos}px)`;
        if (Math.abs(pos) < nearestDistance) {
          nearestDistance = Math.abs(pos);
          nearest = i;
        }
      });
      if (nearest !== activeIndex) {
        els[activeIndex]?.setAttribute("data-active", "false");
        els[nearest].setAttribute("data-active", "true");
        activeIndex = nearest;
        setActive(nearest % perSet);
      }
    };

    // Critically damped spring towards `target`, integrated in small steps.
    const tick = (_time: number, deltaMs: number) => {
      if (dragging || (x === target && velocity === 0)) return;
      let remaining = Math.min(deltaMs, 50);
      while (remaining > 0) {
        const dt = Math.min(remaining, 8);
        velocity += (SPRING * SPRING * (target - x) - 2 * SPRING * velocity) * dt;
        x += velocity * dt;
        remaining -= dt;
      }
      if (Math.abs(target - x) < 0.05 && Math.abs(velocity) < 0.001) {
        x = target;
        velocity = 0;
      }
      render();
    };

    const snap = (value: number) => Math.round(value / width) * width;

    const scheduleAutoplay = () => {
      autoplay?.kill();
      if (!autoplaySeconds || reducedMotion) return;
      autoplay = gsap.delayedCall(autoplaySeconds, () => {
        if (!dragging && !hovered && visible && !document.hidden) target = snap(target) - width;
        scheduleAutoplay();
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      captured = false;
      startPointer = event.clientX;
      startX = x;
      moved = 0;
      samples = [{ t: event.timeStamp, x: event.clientX }];
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startPointer;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > CLICK_SLOP && !captured) {
        track.setPointerCapture(event.pointerId);
        track.dataset.dragging = "true";
        captured = true;
      }
      x = startX + dx * DRAG_RATIO;
      target = x;
      velocity = 0;
      samples.push({ t: event.timeStamp, x: event.clientX });
      samples = samples.filter((sample) => event.timeStamp - sample.t <= 100);
      render();
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete track.dataset.dragging;
      const first = samples[0];
      const elapsed = event.timeStamp - first.t;
      velocity = elapsed > 0 ? ((event.clientX - first.x) / elapsed) * DRAG_RATIO : 0;
      const limit = MAX_THROW_CARDS * width;
      const thrown = gsap.utils.clamp(-limit, limit, velocity * THROW_MS);
      velocity = gsap.utils.clamp(-6, 6, velocity);
      target = snap(x + thrown);
      scheduleAutoplay();
    };
    // A drag must not also follow the link under the pointer.
    const onClick = (event: MouseEvent) => {
      if (moved > CLICK_SLOP) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const onDragStart = (event: DragEvent) => event.preventDefault();
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };

    goTo.current = (index: number) => {
      let steps = (((index - (activeIndex % perSet)) % perSet) + perSet) % perSet;
      if (steps > perSet / 2) steps -= perSet;
      target = snap(x) - steps * width;
      scheduleAutoplay();
    };

    const resize = new ResizeObserver(() => {
      const next = els[0].offsetWidth;
      if (!next || next === width) return;
      x = (x / width) * next;
      target = (target / width) * next;
      width = next;
      render();
    });
    resize.observe(els[0]);
    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    inView.observe(track);

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("click", onClick, true);
    track.addEventListener("dragstart", onDragStart);
    track.addEventListener("pointerenter", onEnter);
    track.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    render();
    scheduleAutoplay();

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("click", onClick, true);
      track.removeEventListener("dragstart", onDragStart);
      track.removeEventListener("pointerenter", onEnter);
      track.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
      autoplay?.kill();
      resize.disconnect();
      inView.disconnect();
    };
  }, [cards.length, autoplaySeconds]);

  const colour = "transition-colors delay-500 duration-500 ease-[cubic-bezier(0.455,0.03,0.515,0.955)]";

  return (
    <section id="villas" className="overflow-hidden py-90 desk:py-160">
      <div className="mx-gutter mb-40 desk:mb-58">
        <h2 className="text-center text-h2 text-ink-alt desk:mx-332">{title}</h2>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="relative h-382 cursor-grab touch-pan-y select-none data-[dragging=true]:cursor-grabbing desk:h-560"
        >
          {loop.map((card, i) => {
            // Before hydration: first card centred, the rest laid out either side of it.
            const slot = i < loop.length / 2 ? i : i - loop.length;
            const duplicate = i >= cards.length;
            return (
              <div
                key={i}
                data-slider-card
                data-active={i === 0}
                aria-hidden={duplicate || undefined}
                style={{ transform: `translateX(${slot * 100}%)` }}
                className="group absolute left-[calc(50%-17.5rem)] top-0 h-full w-350 border border-line desk:left-[calc(50%-33.7rem)] desk:w-674"
              >
                <div className={`h-full overflow-hidden px-30 pt-30 group-data-[active=true]:bg-cream ${colour}`}>
                  <div className="pointer-events-none relative aspect-[615/405] overflow-hidden rounded-card">
                    <Media media={card.media} sizes="(min-width: 901px) 43vw, 74vw" />
                  </div>
                  <div className="flex h-160 flex-col items-center justify-between gap-20 py-20 desk:h-auto desk:flex-row desk:pb-45 desk:pt-40">
                    <p className="text-title text-ink-alt">{card.title}</p>
                    <Link
                      href={card.link.href}
                      tabIndex={duplicate ? -1 : undefined}
                      className={`flex items-center gap-10 text-small font-medium uppercase text-muted group-data-[active=true]:text-ink-alt ${colour}`}
                    >
                      <span
                        className={`flex size-30 items-center justify-center rounded-full bg-ink text-paper group-data-[active=true]:bg-brand group-data-[active=true]:text-cream ${colour}`}
                      >
                        <Icon name="arrow" className="size-10" />
                      </span>
                      {card.link.label}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 flex justify-center gap-4 desk:hidden">
          {cards.map((card, i) => (
            <button
              key={card.title}
              type="button"
              aria-label={`${dotLabel} ${i + 1}`}
              aria-current={i === active || undefined}
              onClick={() => goTo.current(i)}
              className={`size-8 cursor-pointer rounded-full ${i === active ? "bg-brand" : "bg-ink opacity-20"}`}
            />
          ))}
        </div>

        <div className="mt-30 flex justify-center desk:mt-60">
          <Button link={cta} />
        </div>
      </div>
    </section>
  );
}
