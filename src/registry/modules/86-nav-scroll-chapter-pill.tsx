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
 * chapter — the scan-based approach has no such gap. Placed once, directly
 * in a page's normal flow (not fixed) — CSS `sticky` naturally keeps it
 * pinned at `top-6` for the rest of the page once its own flow position
 * would otherwise scroll above the fold, so no extra "become visible"
 * logic is needed. The host page must give each chapter section a
 * matching `id` attribute for this to have anything to track — pass a
 * `chapters` array to match whatever ids that page uses; the default above
 * is the set used by the "Real Design Wins" example page.
 */
export default function NavScrollChapterPill({
  chapters = DEFAULT_CHAPTERS,
}: {
  chapters?: Chapter[];
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
    <div className="sticky top-6 z-40 flex justify-center px-6">
      <div className="relative">
        <nav className="flex items-center gap-4 rounded-full border border-white/10 bg-zinc-950/80 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md">
          <span>{chapters[active]?.label}</span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close chapters" : "Open chapters"}
            aria-expanded={open}
            className="flex h-6 w-6 items-center justify-center text-zinc-400 transition-colors hover:text-white"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {open && (
          <div className="absolute top-full left-1/2 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-lg">
            {chapters.map((chapter, i) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                onClick={() => setOpen(false)}
                className={`block border-b border-white/5 px-5 py-3 text-sm transition-colors last:border-b-0 hover:bg-white/5 ${
                  i === active ? "text-white" : "text-zinc-400"
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
