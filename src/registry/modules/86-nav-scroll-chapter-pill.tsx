"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export type Chapter = { id: string; label: string };

const DEFAULT_CHAPTERS: Chapter[] = [
  { id: "state-of-design", label: "State Of Design" },
  { id: "the-solution", label: "The Solution" },
  { id: "manifesto", label: "The Manifesto" },
  { id: "resources", label: "Resources" },
  { id: "faqs", label: "FAQs" },
];

/**
 * Module 86 — Nav, Scroll Chapter Pill
 * A floating pill that relabels itself as you scroll. Tracks the "current"
 * chapter with a standard scrollspy approach — on every scroll, walk the
 * chapter sections (matched by DOM id) in order and keep the last one
 * whose top edge has crossed a line near the top of the viewport. This is
 * deliberately not IntersectionObserver: isIntersecting only flags a
 * section while it's still crossing the tracked band, so once you scroll
 * past the last chapter entirely (nothing left intersecting) the label
 * would fall back to its initial state instead of staying on the last
 * chapter — the scan-based approach has no such gap. By default it is placed
 * once, directly in a page's normal flow — CSS `sticky` naturally keeps it
 * pinned at `stickyTop` for the rest of the page once its own flow position
 * would otherwise scroll above the fold, so no extra "become visible"
 * logic is needed (see `position` below to float it instead). The host page must give each chapter section a
 * matching `id` attribute for this to have anything to track — pass a
 * `chapters` array to match whatever ids that page uses; the default above
 * is the set used by the "Real Design Wins" example page.
 *
 * `position="fixed"` lifts it out of flow entirely. Sticky is right on a page
 * whose sections stack normally, but this page's hero is a full-bleed pinned
 * stage starting at the very top, and a sticky pill in flow pushes it down by
 * its own height. Fixed costs nothing in layout and floats over the stages.
 *
 * Colours come from CSS custom properties with the original dark values as
 * fallbacks, so pages that set nothing look exactly as before, and a themed
 * page sets --nav-surface / --nav-text / --nav-muted / --nav-border /
 * --nav-rule / --nav-panel / --nav-hover on any ancestor to restyle it
 * without a fork. They are plain custom properties rather than Tailwind
 * opacity modifiers because `/50` cannot compose onto an arbitrary var.
 *
 * `mobileAlign="end"` parks the pill in the top-right corner below `sm` and
 * leaves it centred from `sm` up. Centred is right on a page whose sections
 * start below the fold, but over a full-bleed pinned section the pill sits on
 * top of the content — on a phone it lands squarely on module 92's headline.
 * Clearing it by pushing that content down costs ~128px of a viewport the
 * headline already fills, so the pill moves instead.
 */
export default function NavScrollChapterPill({
  chapters = DEFAULT_CHAPTERS,
  mobileAlign = "center",
  stickyTop = "1.5rem",
  position = "sticky",
}: {
  chapters?: Chapter[];
  mobileAlign?: "center" | "end";
  /** `fixed` floats the pill over the page instead of reserving a line of flow. */
  position?: "sticky" | "fixed";
  /** Where the pill parks itself, as a CSS length. Raise it clear of any site
   *  header that also sticks to the top of the viewport — inline rather than a
   *  Tailwind `top-*` class so a host page can pass its own header's height. */
  stickyTop?: string;
} = {}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const elements = chapters.map((chapter) => document.getElementById(chapter.id)).filter((el): el is HTMLElement => el !== null);

    const updateActive = () => {
      const threshold = window.innerHeight * 0.45;
      let current = 0;
      elements.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= threshold) current = i;
      });
      setActive(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [chapters]);

  return (
    <div
      style={{ top: stickyTop }}
      className={`${position === "fixed" ? "fixed inset-x-0" : "sticky"} z-40 flex px-6 sm:justify-center ${
        mobileAlign === "end" ? "justify-end" : "justify-center"
      }`}
    >
      <div className="relative">
        <nav className="flex items-center gap-4 rounded-full border border-[color:var(--nav-border,rgb(255_255_255_/_0.1))] bg-[color:var(--nav-surface,rgb(9_9_11_/_0.8))] px-5 py-2.5 text-sm font-medium text-[color:var(--nav-text,#fff)] shadow-lg backdrop-blur-md">
          <span>{chapters[active]?.label}</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close chapters" : "Open chapters"}
            aria-expanded={open}
            className="flex h-6 w-6 items-center justify-center text-[color:var(--nav-muted,#a1a1aa)] transition-colors hover:text-[color:var(--nav-text,#fff)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {open && (
          <div
            className={`absolute top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[color:var(--nav-border,rgb(255_255_255_/_0.1))] bg-[color:var(--nav-panel,#09090b)] shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 ${
              mobileAlign === "end" ? "right-0" : "left-1/2 -translate-x-1/2"
            }`}
          >
            {chapters.map((chapter, i) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setOpen(false)}
                className={`block border-b border-[color:var(--nav-rule,rgb(255_255_255_/_0.05))] px-5 py-3 text-sm transition-colors last:border-b-0 hover:bg-[color:var(--nav-hover,rgb(255_255_255_/_0.05))] ${
                  i === active ? "text-[color:var(--nav-text,#fff)]" : "text-[color:var(--nav-muted,#a1a1aa)]"
                }`}
              >
                {chapter.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
