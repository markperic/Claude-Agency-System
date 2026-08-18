"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, type Easing } from "motion/react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 97 — Nav, Kinetic Overlay
 * A header pill whose "Menu" label rolls over to "Close" and whose plus icon
 * spins 315° as a full-height panel flies in from the right — three coloured
 * backdrop layers staggered behind each other, then the links themselves
 * swinging up from below with a slight rotation. Hovering a link raises a set
 * of ambient SVG shapes behind the panel, one arrangement per link.
 *
 * Adapted from the 21st.dev "sterling gate kinetic navigation" component.
 * Four real adaptations from the source. (1) The GSAP timeline was rebuilt on
 * `motion/react`'s `animate()` — same swap modules 65/68/71/72 made — with
 * per-element `delay` standing in for `stagger`, a `.then()` on the closing
 * tween standing in for the timeline's terminal `.set(display, "none")`, and
 * GSAP's `CustomEase.create("main", "0.65, 0.01, 0.05, 0.99")` expressed
 * directly as the cubic-bezier array motion already takes. That drops `gsap`
 * and `CustomEase` as dependencies rather than adding a second animation
 * engine beside motion. (2) The source shipped markup against a stylesheet it
 * did not include — every class it reaches for (`.nav-overlay-wrapper`,
 * `.backdrop-layer`, `.menu-content`, `.nav-link`…) had no rules behind it —
 * so the visual design here is authored, in Tailwind, from what the timeline
 * implies: panels entering at `xPercent: 101`, links clipped at
 * `yPercent: 140`, a light resting panel under those translucent shape fills.
 * (3) The source's link hover — ambient SVG shape arrangements popping in
 * behind the panel, driven by `addEventListener` + `classList` with a
 * hand-rolled `_cleanup` property stashed on each DOM node — was dropped for
 * sibling dimming: the hovered link holds full black and slides right while
 * every other link recedes to 20%. Quieter, and it survives a sixteen-link
 * panel where sixteen separate shape arrangements would not. The dim and the
 * nudge are CSS transitions off a `hovered` index rather than `animate()`
 * calls, so they cannot fight the entrance tween still running on the same
 * link. (4) A
 * `links` prop replaced the five hard-coded anchors, and past eight links the
 * panel switches to a denser two-column layout, which is what lets the site
 * chrome in `src/components/site-nav.tsx` render this with all fourteen
 * category links. Title effect: A. The nav itself is a custom timeline, not
 * part of the A–K catalog.
 *
 * Site-wide, the overlay and header take a stacking tier of their own —
 * `z-[1000]` / `z-[1010]` — rather than competing in the range page modules
 * use. Chrome that can be outranked by whatever section happens to be mounted
 * below it is chrome with a bug waiting: module 86's chapter pill is `sticky
 * top-6 z-40`, identical to the overlay's old `z-40`, so on /demo/nav it won
 * on DOM order alone and painted straight over the open menu. Modules top out
 * around `z-50` in Tailwind classes; the two raw `z-index: 3000` / `9999`
 * values in modules 69 and 71 sit inside their own sections' stacking
 * contexts, so they never reach this tier. `contained` keeps the old `z-40` /
 * `z-50`, deliberately *below* the site chrome, since the catalog demo is page
 * content and should lose to the real nav.
 *
 * The header sits above the overlay, which is load-bearing
 * rather than arbitrary: the whole point of the "Menu" → "Close" roll and the
 * icon's 315° spin is that you watch them happen, and at the overlay's own
 * stacking level the pill is buried behind the backdrop the moment it opens —
 * the animation plays where nobody can see it, and the menu has no visible
 * close control. Site-wide the header is `sticky top-0` so the menu is
 * reachable from anywhere down the page rather than only from the top of it;
 * `contained` stays absolutely positioned inside its preview frame, where
 * there is nothing to stick to.
 *
 * `overlay` cancels the header's reserved height with a matching negative
 * bottom margin, so the section under it starts at the very top of the viewport
 * and the pill floats over it — for pages that open on a full-bleed hero. The
 * element stays in flow and therefore stays sticky; only the space it takes up
 * is given back. Pages whose first section is ordinary content should leave it
 * off and keep the reserved band.
 *
 * Past `CONDENSE_AT` the pill condenses: it docks closer to the top, loses a
 * few px of height, drops its shadow, and fades to 60% so it stops competing
 * with full-bleed page content on a long scroll. It returns to full opacity on
 * hover, on `focus-within`, and whenever the menu is open — a nav control left
 * permanently half-visible reads as broken rather than as restraint, and the
 * label needs its contrast back the moment anyone reaches for it.
 *
 * One trap worth knowing about, since every module here animates transforms:
 * the resting offsets (menu at 100%, panels at 101%, link text at 140% + 10°)
 * are inline `transform` styles, not Tailwind's `translate-x-full` /
 * `translate-y-[140%]`. Tailwind v4 compiles those utilities to the *independent*
 * `translate` property, which composes with — rather than being overridden by —
 * the `transform` motion writes. Using the classes here left the panel sitting
 * a full width off-screen for the whole timeline while `animate()` dutifully ran
 * against a `transform` nothing could see.
 *
 * `contained` swaps the overlay from `fixed` to `absolute` so the catalog can
 * show it inside a bounded preview frame instead of over the whole viewport,
 * the same framing module 72 uses for a nav that is fixed-by-design.
 */

export type KineticNavLink = { label: string; href: string };

/** GSAP's CustomEase "main" — 0.65, 0.01, 0.05, 0.99 — as a bezier array. */
const MAIN: Easing = [0.65, 0.01, 0.05, 0.99];
const DURATION = 0.7;
const PANEL_DURATION = 0.575;
/** Scroll distance, in px, before the header condenses. */
const CONDENSE_AT = 32;

const DEMO_LINKS: KineticNavLink[] = [
  { label: "About us", href: "#" },
  { label: "Our work", href: "#" },
  { label: "Services", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact us", href: "#" },
];

/** Slide in behind each other; the last one is the surface the links sit on. */
const BACKDROP_LAYERS = ["#6366f1", "#262626", "#f5f5f5"];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function KineticOverlayNav({
  wordmark = "Sterling Gate",
  links = DEMO_LINKS,
  hint,
  contained = false,
  overlay = false,
}: {
  wordmark?: string;
  links?: KineticNavLink[];
  hint?: string;
  contained?: boolean;
  overlay?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  /** Which link is under the cursor//focus, so the rest can recede. */
  const [hovered, setHovered] = useState<number | null>(null);
  /** Past the threshold the header condenses — see the wrapper's fixed height. */
  const [scrolled, setScrolled] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const iconRef = useRef<SVGSVGElement>(null);
  /** Which open/closed state the timeline last played, so it plays once each. */
  const playedRef = useRef<boolean | null>(null);

  const dense = links.length > 8;

  // Mounting and opening are set together, from the event handler rather than
  // from an effect reacting to `isOpen` — React batches the two into a single
  // render, so the overlay is already displayed by the time the timeline below
  // runs. That's the source's `.set(navWrap, { display: "block" })` at the head
  // of the open timeline; the matching `display: "none"` is deferred to the
  // closing tween's `.then()`.
  const open = useCallback(() => {
    setRendered(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setHovered(null);
  }, []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, close, open]);

  useEffect(() => {
    if (!rendered || playedRef.current === isOpen) return;
    playedRef.current = isOpen;

    const reduced = prefersReducedMotion();
    const duration = reduced ? 0 : DURATION;
    const panelDuration = reduced ? 0 : PANEL_DURATION;
    const stagger = reduced ? 0 : 1;

    const overlay = overlayRef.current;
    const menu = menuRef.current;
    const icon = iconRef.current;

    if (isOpen) {
      labelRefs.current.forEach((el, i) => {
        if (el) animate(el, { y: ["0%", "-100%"] }, { duration, ease: MAIN, delay: i * 0.2 * stagger });
      });
      if (icon) animate(icon, { rotate: 315 }, { duration, ease: MAIN });
      if (overlay) animate(overlay, { opacity: [0, 1] }, { duration, ease: MAIN });
      if (menu) animate(menu, { x: "0%" }, { duration: 0 });

      panelRefs.current.forEach((el, i) => {
        if (el) animate(el, { x: ["101%", "0%"] }, { duration: panelDuration, ease: MAIN, delay: i * 0.12 * stagger });
      });
      linkRefs.current.forEach((el, i) => {
        if (el) animate(el, { y: ["140%", "0%"], rotate: [10, 0] }, { duration, ease: MAIN, delay: (0.35 + i * 0.05) * stagger });
      });
      return;
    }

    labelRefs.current.forEach((el) => {
      if (el) animate(el, { y: ["-100%", "0%"] }, { duration, ease: MAIN });
    });
    if (icon) animate(icon, { rotate: 0 }, { duration, ease: MAIN });
    if (overlay) animate(overlay, { opacity: 0 }, { duration, ease: MAIN });

    if (!menu) {
      setRendered(false);
      return;
    }
    // Only unmount if the menu is still closed by the time the tween lands —
    // reopening mid-close leaves this promise in flight, and unguarded it would
    // pull the overlay out from under the reopening timeline.
    animate(menu, { x: "120%" }, { duration, ease: MAIN }).then(() => {
      if (playedRef.current === false) setRendered(false);
    });
  }, [isOpen, rendered]);

  // Escape closes, matching the source's window keydown listener.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Lock the page behind a full-viewport overlay. Padding compensates for the
  // scrollbar the lock removes, which would otherwise shift the whole page —
  // the site has no `scrollbar-gutter` reserved. Lenis re-measures off the
  // provider's ResizeObserver, so nothing needs telling here.
  useEffect(() => {
    if (contained || !isOpen) return;
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, [contained, isOpen]);

  // Condense once the page has moved. Read through rAF rather than calling the
  // handler straight from the effect body, which would be a synchronous setState
  // in an effect — the initial read still lands before first paint.
  useEffect(() => {
    if (contained) return;
    const onScroll = () => setScrolled(window.scrollY > CONDENSE_AT);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, [contained]);

  const condensed = scrolled && !contained;

  return (
    <>
      {/*
        The wrapper's height is fixed at the header's resting height and the pill
        shrinks *inside* it. A sticky element still occupies flow, so letting the
        wrapper size to a shrinking pill would pull the page up by ~28px exactly
        as the threshold is crossed — which moves the scroll position, which can
        re-cross the threshold. Fixed height keeps flow identical to the resting
        layout at every scroll position. The docking offset is this wrapper's own
        padding, not a margin on the pill: `box-sizing: border-box` keeps padding
        inside the fixed height, whereas the pill's top margin collapses straight
        through the wrapper and shifts everything below it by the 16px the offset
        changes by. It is pointer-transparent so the dead space beside the
        condensed pill doesn't eat clicks meant for the page.
      */}
      <div
        className={
          contained
            ? "absolute inset-x-0 top-0 z-50 px-6 pt-6"
            : `pointer-events-none sticky top-0 z-[1010] h-[4.375rem] px-6 transition-[padding] duration-300 ease-out motion-reduce:transition-none ${
                overlay ? "-mb-[4.375rem]" : ""
              } ${condensed ? "pt-2" : "pt-6"}`
        }
      >
        <nav
          className={`pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border border-zinc-200 bg-white/80 px-6 shadow-sm backdrop-blur-md transition-[padding,opacity,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
            contained ? "py-3" : condensed ? "py-1.5 shadow-none" : "py-3"
          } ${
            condensed && !isOpen
              ? "opacity-60 hover:opacity-100 focus-within:opacity-100"
              : "opacity-100"
          }`}
        >
          <span className="shrink-0 text-sm font-semibold tracking-tight text-zinc-950">{wordmark}</span>

          <div className="flex shrink-0 items-center gap-4">
            {hint && <span className="hidden text-xs tracking-widest text-zinc-400 uppercase sm:block">{hint}</span>}

            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="flex items-center gap-2 text-sm font-medium text-zinc-950"
            >
              <span className="relative block h-5 overflow-hidden leading-5">
                <span ref={(el) => { labelRefs.current[0] = el; }} className="block" aria-hidden="true">
                  Menu
                </span>
                <span ref={(el) => { labelRefs.current[1] = el; }} className="block" aria-hidden="true">
                  Close
                </span>
              </span>

              <svg ref={iconRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <div
        ref={wrapRef}
        data-nav={isOpen ? "open" : "closed"}
        style={{ display: rendered ? "block" : "none" }}
        className={contained ? "absolute inset-0 z-40" : "fixed inset-0 z-[1000]"}
      >
        <div ref={overlayRef} onClick={close} className="absolute inset-0 bg-[#131313]/40 opacity-0 backdrop-blur-[2px]" />

        <nav
          ref={menuRef}
          aria-label="Main"
          aria-hidden={!isOpen}
          style={{ transform: "translateX(100%)" }}
          className={`absolute inset-y-0 right-0 w-full ${
            dense ? "sm:w-[36rem] lg:w-[48rem]" : "sm:w-[32rem] lg:w-[40rem]"
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            {BACKDROP_LAYERS.map((color, i) => (
              <div
                key={color}
                ref={(el) => { panelRefs.current[i] = el; }}
                style={{ backgroundColor: color, transform: "translateX(101%)" }}
                className="absolute inset-0"
              />
            ))}
                    </div>

          <div className="relative flex h-full flex-col justify-center overflow-y-auto px-8 py-24 sm:px-14 lg:px-20">
            <ul className={dense ? "grid grid-cols-1 gap-x-10 sm:grid-cols-2" : "flex flex-col"}>
              {links.map((link, i) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    onClick={close}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered(null)}
                    className={`relative -mx-3 flex overflow-hidden px-3 py-1 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.65,0.01,0.05,0.99)] ${
                      hovered === null || hovered === i ? "opacity-100" : "opacity-20"
                    } ${hovered === i ? "translate-x-3" : "translate-x-0"}`}
                    tabIndex={isOpen ? undefined : -1}
                  >
                    <span
                      ref={(el) => { linkRefs.current[i] = el; }}
                      style={{ transform: "translateY(140%) rotate(10deg)" }}
                      className={`relative block font-semibold tracking-tight text-[#131313] ${
                        dense ? "text-[clamp(1.15rem,2.4vw,1.75rem)]" : "text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.1]"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default function NavKineticOverlay() {
  return (
    <section className="relative overflow-hidden bg-[#f5f5f4] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal effect="A" as="h2" className="mb-10 text-center text-3xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-4xl">
          A menu that flies in as a kinetic curtain
        </Reveal>

        <div className="relative mx-auto h-[30rem] w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:h-[34rem]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center">
            <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">Page preview</p>
            <p className="max-w-xs text-sm text-zinc-500">
              This nav sits at the top of a page — open it to send the panels in, then hover a link.
            </p>
          </div>

          <KineticOverlayNav contained hint="click me" />
        </div>
      </div>
    </section>
  );
}
