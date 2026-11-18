"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookButton } from "./BookButton";

export type NavChild = { key: string; href: string; label: string };
export type NavItem = { key: string; href: string; label: string; children?: NavChild[] };

/**
 * Ported from the client project's real site header (not the SplitTitle set piece): fixed overlay nav,
 * transparent-over-hero fading to solid on scroll, a dropdown per nav item with children, and a mobile menu.
 * This single-page demo has no sub-routes, so every nav href is "#" — a harmless, inert placeholder that
 * keeps the exact same labels and dropdown structure as the real site's navigation.
 */
export function ClubHeader({ nav, announcement }: { nav: NavItem[]; announcement?: { text?: string; href?: string } }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  const solid = scrolled || mobileOpen;

  useEffect(() => {
    if (!dismissed) return;
    const onMove = (e: PointerEvent) => {
      const li = (e.target as Element | null)?.closest?.("[data-nav-key]");
      if (li?.getAttribute("data-nav-key") !== dismissed) setDismissed(null);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [dismissed]);

  useEffect(() => {
    if (mobileOpen) window.__clubhouseLenis?.stop();
    else window.__clubhouseLenis?.start();
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {announcement?.text && (
        <div className="bg-gold text-center text-[13px] font-semibold text-forest-deep">
          {announcement.href ? (
            <Link href={announcement.href} className="block px-4 py-1.5 hover:underline">
              {announcement.text}
            </Link>
          ) : (
            <p className="px-4 py-1.5">{announcement.text}</p>
          )}
        </div>
      )}
      <div className={`transition-colors duration-300 ${solid ? "bg-forest-deep/95 shadow-lg backdrop-blur" : "bg-gradient-to-b from-black/55 to-transparent"}`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link href="/examples/clubhouse" className="shrink-0 font-display text-xl uppercase tracking-[0.06em] text-cream" aria-label="The Clubhouse home">
            The Clubhouse
          </Link>

          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.key} data-nav-key={item.key} className="group relative">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (!item.children?.length) return;
                      setDismissed(item.key);
                      e.currentTarget.blur();
                    }}
                    className="block rounded-full px-3.5 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/90 transition hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                  {!!item.children?.length && (
                    <div
                      className={`invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition ${
                        dismissed === item.key ? "" : "group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
                      }`}
                    >
                      <ul className="min-w-60 bg-cream p-2 shadow-xl ring-1 ring-black/5">
                        {item.children.map((c) => (
                          <li key={c.key}>
                            <Link
                              href={c.href}
                              onClick={(e) => {
                                setDismissed(item.key);
                                e.currentTarget.blur();
                              }}
                              className="block px-4 py-2.5 text-sm font-medium text-forest hover:bg-sand"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <BookButton className="btn-gold px-5 py-2.5">Book</BookButton>
            <button
              className="ml-1 rounded-full p-2 text-cream lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {mobileOpen ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav data-lenis-prevent className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-white/10 px-4 pb-8 lg:hidden" aria-label="Mobile">
            <ul className="divide-y divide-white/10">
              {nav.map((item) => (
                <li key={item.key} className="py-3">
                  <Link href={item.href} className="font-display text-2xl text-cream">
                    {item.label}
                  </Link>
                  {!!item.children?.length && (
                    <ul className="mt-2 space-y-1 pl-1">
                      {item.children.map((c) => (
                        <li key={c.key}>
                          <Link href={c.href} className="block py-1 text-cream/75">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
