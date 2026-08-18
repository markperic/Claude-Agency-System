"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type CurtainLink = { label: string; href: string };

/**
 * Every module in the catalog has to render with no props — the /demo pages
 * look each one up by id and mount it bare as `<Component />`, and the lookup
 * is typed `ComponentType`, which admits no required props. A module with a
 * mandatory prop fails the build at type-check, and would render `undefined`
 * at runtime if it slipped past.
 */
const DEFAULT_LINKS: CurtainLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
];

/**
 * Module 98 — Nav, Split Curtain
 *
 * A circular pill that opens a full-screen menu built from two panels closing
 * in from either side. The panel carrying the links is opaque so the type
 * always has solid ground; the other is translucent, leaving the page legible
 * behind it, so the menu reads as laid over the site rather than replacing it.
 *
 * The split is not down the middle. The link panel is sized to its own
 * content — `w-max` plus a gutter each side — and the translucent panel takes
 * whatever is left, so no more of the page is covered than the words actually
 * need. The two are flex siblings for that reason: the remainder has to be
 * computed by layout, since the content width is not knowable in CSS.
 *
 * They still slide in on `x`, which is a transform and so does not feed back
 * into that layout — each panel travels 100% of its own measured width and
 * lands exactly in its flex slot.
 *
 * Colours come from the same --nav-* custom properties module 86 uses, so a
 * page that themes one has themed both.
 */
export default function NavSplitCurtain({
  links = DEFAULT_LINKS,
  trailingOpacity = 0.5,
  openLabel = "Menu",
  closeLabel = "Close",
  trailingLink,
  footer,
}: {
  links?: CurtainLink[];
  /**
   * Opacity of the half that does not carry the links. The link side stays
   * fully opaque — dropping its opacity would take the type down with it, since
   * opacity applies to a whole subtree.
   */
  trailingOpacity?: number;
  openLabel?: string;
  closeLabel?: string;
  /**
   * Small link parked opposite the toggle — a way out of a template page and
   * back to the host site. Styled as a pill like the toggle rather than as bare
   * text, because it has to stay legible over whatever the page background
   * happens to be *and* over the curtain once that is closed.
   *
   * Pass `icon` for the circular form, which matches the toggle exactly and
   * keeps the corner quiet; `label` is still required and becomes the accessible
   * name. Without an icon it falls back to a text pill.
   */
  trailingLink?: { href: string; label: string; icon?: ReactNode };
  /** Optional row pinned to the bottom of the curtain — socials, a phone number. */
  footer?: ReactNode;
} = {}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Lenis owns the scroll position, so hiding overflow does not stop it — it
    // keeps easing toward its target behind the curtain and the page has moved
    // by the time the menu closes. The provider publishes the instance for
    // exactly this.
    const lenis = window.__lenis;
    lenis?.stop();

    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open]);

  const panelEase = [0.76, 0, 0.24, 1] as const;
  const duration = reduced ? 0 : 0.62;

  /* The list sizes itself from its own length rather than taking a fixed clamp,
     because the two failure modes pull opposite ways: a size that suits six
     links overflows at eleven, and one that fits eleven is timid at six.
     `min()` takes whichever bound binds — width on short lists, height on long
     ones — against 70vh of usable column.

     LEADING is 1.08 and cannot go much below 1. Display faces like Anton have
     cap heights near 0.92em, so any leading under that overlaps consecutive
     lines' capitals — a real collision, not tight tracking. */
  const LEADING = 1.08;
  const linkFontSize = `min(7.5vw, calc(70vh / ${links.length} / ${LEADING}))`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="fixed left-[var(--gutter,1.5rem)] top-[var(--gutter,1.5rem)] z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--nav-surface,rgb(9_9_11_/_0.8))] text-[color:var(--nav-text,#fff)] shadow-lg backdrop-blur-md transition-transform hover:scale-105"
      >
        {/* Two bars that cross into an ×, rather than swapping icon sets — it
            keeps the mark continuous through the toggle. Both are centred and
            offset with `y`, not `top`: the bars carry no CSS top, so animating
            that property means interpolating from `auto`, which collapses them
            onto each other and renders as a single dash. */}
        <span className="relative block h-5 w-5" aria-hidden="true">
          <motion.span
            className="absolute left-0 top-1/2 block h-[2px] w-full rounded-full bg-current"
            initial={false}
            animate={open ? { y: -1, rotate: 45 } : { y: -5, rotate: 0 }}
            transition={{ duration: duration * 0.6 }}
          />
          <motion.span
            className="absolute left-0 top-1/2 block h-[2px] w-full rounded-full bg-current"
            initial={false}
            animate={open ? { y: -1, rotate: -45 } : { y: 3, rotate: 0 }}
            transition={{ duration: duration * 0.6 }}
          />
        </span>
      </button>

      {trailingLink && (
        <a
          href={trailingLink.href}
          aria-label={trailingLink.icon ? trailingLink.label : undefined}
          className={`fixed right-[var(--gutter,1.5rem)] top-[var(--gutter,1.5rem)] z-[70] flex h-12 items-center justify-center rounded-full bg-[color:var(--nav-surface,rgb(9_9_11_/_0.8))] text-[color:var(--nav-text,#fff)] shadow-lg backdrop-blur-md transition-transform hover:scale-105 ${
            trailingLink.icon ? "w-12" : "px-5 text-xs font-semibold uppercase tracking-[0.14em]"
          }`}
        >
          {trailingLink.icon ?? trailingLink.label}
        </a>
      )}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex">
            <motion.nav
              className="relative flex w-max max-w-[72vw] shrink-0 flex-col justify-center bg-[color:var(--nav-panel,#09090b)] px-[var(--gutter,1.5rem)]"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration, ease: panelEase }}
            >
              <ul>
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12, transition: { duration: duration * 0.3 } }}
                    transition={{
                      duration: reduced ? 0 : 0.5,
                      // Held until the panels are most of the way in, then
                      // stepped, so the list arrives onto a closed curtain
                      // rather than racing it.
                      delay: reduced ? 0 : duration * 0.55 + i * 0.055,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={{ fontSize: linkFontSize, lineHeight: LEADING }}
                      className="block whitespace-nowrap font-[family-name:var(--font-display)] tracking-[-0.01em] text-[color:var(--nav-text,#fff)] transition-opacity hover:opacity-55"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              {footer && (
                <motion.div
                  /* Absolute so it cannot widen the panel — the panel's width is
                     the link column's, and a long footer row should wrap or
                     overflow rather than stretch the whole curtain. */
                  className="absolute bottom-[var(--gutter,1.5rem)] left-[var(--gutter,1.5rem)] text-[color:var(--nav-muted,#a1a1aa)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : duration * 0.8 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.nav>

            <motion.div
              className="flex-1 bg-[color:var(--nav-panel,#09090b)]"
              style={{ opacity: trailingOpacity }}
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration, ease: panelEase }}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
