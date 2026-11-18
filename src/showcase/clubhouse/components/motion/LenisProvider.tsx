"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    /** Live Lenis instance (undefined under reduced motion). Use stop()/start() to lock scroll — overflow:hidden is ignored by Lenis. */
    __clubhouseLenis?: Lenis;
  }
}

/**
 * App-wide inertial smooth scroll, ported from the client project's provider.
 * - Skipped entirely under prefers-reduced-motion (native scroll).
 * - Re-measures on resize/late images/font swap: Lenis caches its scroll limit and otherwise
 *   "hits an invisible floor" when content grows after it measured (late images, font swap).
 * - Same-page anchor links go through Lenis so scroll-linked sections never desync from a native hash jump.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, allowNestedScroll: true, lerp: 0.09 });
    window.__clubhouseLenis = lenis;
    const remeasure = () => lenis.resize();

    const observer = new ResizeObserver(remeasure);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    document.addEventListener("load", remeasure, true);
    window.addEventListener("load", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || !href.startsWith("#") || href === "#") return;
      if (anchor.target && anchor.target !== "_self") return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      event.preventDefault();
      // Measure at click time; offset for the fixed header
      lenis.scrollTo(target.getBoundingClientRect().top + window.scrollY - 90);
      history.pushState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      observer.disconnect();
      document.removeEventListener("load", remeasure, true);
      window.removeEventListener("load", remeasure);
      document.removeEventListener("click", onAnchorClick);
      delete window.__clubhouseLenis;
      lenis.destroy();
    };
  }, []);

  return children;
}
