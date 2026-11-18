"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const COLS = 5;
const COVER_MS = 520;

type Phase = "idle" | "cover" | "reveal";

/**
 * Obys-style column wipe between pages, ported from the client project's provider.
 * Internal link clicks are intercepted (capture phase, before Next's <Link> sees them): five columns
 * drop in over the page, the route changes underneath, then the columns lift away. Only client
 * navigations animate — the first page load never waits on it. Skipped under reduced motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const pending = useRef<string | null>(null);
  const failsafe = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reveal = useCallback(() => {
    clearTimeout(failsafe.current);
    window.__clubhouseLenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    window.__clubhouseLenis?.start();
    setPhase("reveal");
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) setTimeout(() => window.__clubhouseLenis?.scrollTo(el.getBoundingClientRect().top + window.scrollY - 90) ?? el.scrollIntoView(), 650);
    }
  }, []);

  // Route changed underneath the cover → lift it
  useEffect(() => {
    if (phase === "cover" && pending.current && pathname === pending.current.split(/[?#]/)[0]) {
      pending.current = null;
      requestAnimationFrame(() => requestAnimationFrame(reveal));
    }
  }, [pathname, phase, reveal]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page (incl. hash links) — let Lenis/Next handle it

      e.preventDefault();
      const dest = url.pathname + url.search + url.hash;
      pending.current = url.pathname;
      window.__clubhouseLenis?.stop();
      setPhase("cover");
      setTimeout(() => router.push(dest, { scroll: false }), COVER_MS);
      clearTimeout(failsafe.current);
      failsafe.current = setTimeout(reveal, 6000); // never leave the screen covered
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reveal]);

  return (
    <>
      {children}
      <AnimatePresence>
        {phase !== "idle" && (
          <div key="wipe" className="pointer-events-auto fixed inset-0 z-[100] flex" aria-hidden>
            {Array.from({ length: COLS }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-full flex-1 ${i % 2 ? "bg-forest" : "bg-forest-deep"}`}
                style={{ transformOrigin: phase === "cover" ? "bottom" : "top" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: phase === "cover" ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: i * 0.05 }}
                onAnimationComplete={() => {
                  if (phase === "reveal" && i === COLS - 1) setPhase("idle");
                }}
              />
            ))}
            <motion.div
              className="absolute inset-0 grid place-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "cover" ? 1 : 0 }}
              transition={{ duration: 0.3, delay: phase === "cover" ? 0.3 : 0 }}
            >
              <span className="font-display text-xl uppercase tracking-[0.2em] text-cream/90">The Clubhouse</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
