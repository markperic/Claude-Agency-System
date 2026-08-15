"use client";

import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import { animate, type Easing } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Reveal } from "@/registry/lib/motion-variants";

/**
 * Module 72 — Nav, Card Menu
 * A collapsed pill nav that expands downward into a row of colored cards,
 * each a themed link group, then collapses back on toggle. Adapted from a
 * community CardNav component. Three real adaptations from the source: the
 * GSAP timeline was rebuilt on `motion/react`'s `animate()` — driving the
 * nav's height and each card's stagger with per-card `delay` in place of
 * `.timeline()` + `stagger`, and the close transition (an `.then()` on the
 * height tween) standing in for `onReverseComplete` — same swap as modules
 * 65/68/71; `react-icons`'s GoArrowUpRight became lucide-react's
 * ArrowUpRight (already a repo dependency, one less icon library); and the
 * large prop-configurable API (logo, items, colors) was collapsed to a
 * fixed default config, same call as modules 68/69/71. The height-measuring
 * logic for the mobile layout (temporarily unhiding the content to read its
 * natural `scrollHeight`) is kept close to verbatim — a real DOM-measurement
 * technique, not boilerplate to simplify. Because this component is
 * genuinely `position: fixed`-at-the-top-of-a-page by design, it's shown
 * here inside a bounded preview frame rather than pinned to the real
 * viewport, so the catalog page around it stays intact. Title effect: A.
 * The menu itself is fully custom (measured expand/collapse + stagger), not
 * part of the A–J catalog.
 */

type NavLink = { label: string; href: string };
type NavCard = { label: string; bgColor: string; textColor: string; links: NavLink[] };

const EASE: Easing = [0.22, 1, 0.36, 1];
const DURATION = 0.4;
const COLLAPSED_HEIGHT = 60;

const CARDS: NavCard[] = [
  {
    label: "About",
    bgColor: "#15171c",
    textColor: "#fff",
    links: [
      { label: "Company", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    label: "Work",
    bgColor: "#332e91",
    textColor: "#fff",
    links: [
      { label: "Case Studies", href: "#" },
      { label: "Process", href: "#" },
    ],
  },
  {
    label: "Contact",
    bgColor: "#ea580c",
    textColor: "#fff",
    links: [
      { label: "Email", href: "#" },
      { label: "Schedule a Call", href: "#" },
    ],
  },
];

const NAV_CSS = `
.card-nav-container { position: absolute; top: 2em; left: 50%; transform: translateX(-50%); width: 90%; max-width: 640px; z-index: 30; }
.card-nav { display: block; height: ${COLLAPSED_HEIGHT}px; background-color: #fff; border-radius: 0.75rem;
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.25); position: relative; overflow: hidden; will-change: height; }
.card-nav-top { position: absolute; top: 0; left: 0; right: 0; height: ${COLLAPSED_HEIGHT}px; display: flex; align-items: center;
  justify-content: space-between; padding: 0.5rem 0.45rem 0.55rem 1.1rem; z-index: 2; }
.card-nav-menu-btn { height: 40px; width: 40px; display: grid; place-items: center; border: none; border-radius: 999px;
  background: transparent; color: #15171c; cursor: pointer; transition: background-color 0.2s ease; }
.card-nav-menu-btn:hover { background-color: rgba(0, 0, 0, 0.06); }
.card-nav-logo { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  font-weight: 600; letter-spacing: -0.02em; color: #15171c; }
.card-nav-cta-button { background-color: #15171c; color: #fff; border: none; border-radius: 0.5rem; padding: 0 1rem;
  height: 40px; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s ease; }
.card-nav-cta-button:hover { background-color: #33363f; }
.card-nav-content { position: absolute; left: 0; right: 0; top: ${COLLAPSED_HEIGHT}px; bottom: 0; padding: 0.5rem;
  display: flex; align-items: flex-end; gap: 12px; visibility: hidden; pointer-events: none; z-index: 1; }
.card-nav.open .card-nav-content { visibility: visible; pointer-events: auto; }
.nav-card { height: 100%; flex: 1 1 0; min-width: 0; border-radius: 0.55rem; position: relative; display: flex;
  flex-direction: column; padding: 12px 16px; gap: 8px; user-select: none; opacity: 0; transform: translateY(50px); }
.nav-card-label { font-weight: 500; font-size: 18px; letter-spacing: -0.01em; }
.nav-card-links { margin-top: auto; display: flex; flex-direction: column; gap: 2px; }
.nav-card-link { font-size: 14px; text-decoration: none; color: inherit; display: inline-flex; align-items: center;
  gap: 4px; transition: opacity 0.2s ease; }
.nav-card-link:hover { opacity: 0.75; }
.nav-card-link-icon { width: 14px; height: 14px; }
@media (max-width: 640px) {
  .card-nav-container { width: 92%; top: 1.2em; }
  .card-nav-cta-button { display: none; }
  .card-nav-content { flex-direction: column; align-items: stretch; }
  .nav-card { height: auto; min-height: 56px; }
}
`;

export default function NavCardMenu() {
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    const contentEl = contentRef.current;
    if (!navEl || !contentEl) return 260;

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
    if (!isMobile) return 260;

    const prev = { visibility: contentEl.style.visibility, pointerEvents: contentEl.style.pointerEvents, position: contentEl.style.position, height: contentEl.style.height };
    contentEl.style.visibility = "visible";
    contentEl.style.pointerEvents = "auto";
    contentEl.style.position = "static";
    contentEl.style.height = "auto";
    void contentEl.offsetHeight;
    const contentHeight = contentEl.scrollHeight;
    contentEl.style.visibility = prev.visibility;
    contentEl.style.pointerEvents = prev.pointerEvents;
    contentEl.style.position = prev.position;
    contentEl.style.height = prev.height;

    return COLLAPSED_HEIGHT + contentHeight + 16;
  }, []);

  const openMenu = useCallback(() => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      const navEl = navRef.current;
      if (!navEl) return;
      animate(navEl, { height: `${calculateHeight()}px` }, { duration: DURATION, ease: EASE });
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        animate(el, { y: 0, opacity: 1 }, { duration: DURATION, ease: EASE, delay: 0.1 + i * 0.08 });
      });
    });
  }, [calculateHeight]);

  const closeMenu = useCallback(() => {
    const navEl = navRef.current;
    cardRefs.current.forEach((el) => {
      if (!el) return;
      animate(el, { y: 50, opacity: 0 }, { duration: DURATION, ease: EASE });
    });
    if (!navEl) {
      setIsExpanded(false);
      return;
    }
    animate(navEl, { height: `${COLLAPSED_HEIGHT}px` }, { duration: DURATION, ease: EASE }).then(() => setIsExpanded(false));
  }, []);

  const toggleMenu = useCallback(() => {
    if (isExpanded) closeMenu();
    else openMenu();
  }, [isExpanded, openMenu, closeMenu]);

  const onMenuKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    },
    [toggleMenu]
  );

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f4] px-6 py-24 sm:py-32">
      <style>{NAV_CSS}</style>
      <div className="mx-auto max-w-6xl">
        <Reveal effect="A" as="h2" className="mb-10 text-balance text-center text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          A menu that opens into cards
        </Reveal>

        <div className="relative mx-auto h-[26rem] w-full max-w-3xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm sm:h-[30rem]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-10 text-center">
            <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">Page preview</p>
            <p className="max-w-xs text-sm text-zinc-500">This nav sits fixed at the top of a page — open it to see the cards drop down.</p>
          </div>

          <div className="card-nav-container">
            <nav ref={navRef} className={`card-nav ${isExpanded ? "open" : ""}`}>
              <div className="card-nav-top">
                <button
                  type="button"
                  className="card-nav-menu-btn"
                  onClick={toggleMenu}
                  onKeyDown={onMenuKeyDown}
                  aria-label={isExpanded ? "Close menu" : "Open menu"}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <span className="card-nav-logo">Studio</span>

                <button type="button" className="card-nav-cta-button">
                  Get Started
                </button>
              </div>

              <div ref={contentRef} className="card-nav-content" aria-hidden={!isExpanded}>
                {CARDS.map((card, i) => (
                  <div key={card.label} className="nav-card" ref={setCardRef(i)} style={{ backgroundColor: card.bgColor, color: card.textColor }}>
                    <div className="nav-card-label">{card.label}</div>
                    <div className="nav-card-links">
                      {card.links.map((link) => (
                        <a key={link.label} className="nav-card-link" href={link.href}>
                          <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
