"use client";

import { CATEGORIES } from "@/registry/categories";
import { KineticOverlayNav, type KineticNavLink } from "@/registry/modules/97-nav-kinetic-overlay";

const LINKS: KineticNavLink[] = [
  { href: "/", label: "Home" },
  ...CATEGORIES.map((c) => ({ href: `/demo/${c.slug}`, label: c.navLabel })),
];

/**
 * Site chrome, not a numbered catalog module — this is navigation for the
 * site itself, not a marketing-page section, so it doesn't belong in
 * src/registry/modules. It does, however, *render* one: module 97's
 * `KineticOverlayNav`, so the site is dogfooding the catalog rather than
 * keeping a parallel implementation of the same thing.
 *
 * This replaced a floating pill with sixteen links laid out inline. That row
 * never really fit — it needed a hidden horizontal scroller as a safety net at
 * xl+ and collapsed to a hamburger below it — and sixteen links is exactly the
 * case module 97's `dense` layout exists for, so they now live in the overlay
 * panel in two columns at every breakpoint instead of being squeezed into the
 * bar. The pill itself is kept (white, bordered, blurred) rather than taking
 * the module's bare-header treatment, because SiteNav sits over both the light
 * /demo pages and the dark hero on /examples/design-manifesto, and the pill is
 * what makes it legible on both.
 *
 * Rendered per-page (each page calls <SiteNav /> itself) rather than from the
 * root layout, same as SiteFooter — see that file for why. Pass `overlay` on
 * pages that open on a full-bleed hero (e.g. /examples/estate-agency) so the
 * header floats over it instead of reserving a band above it.
 */
export function SiteNav({ overlay = false }: { overlay?: boolean }) {
  return <KineticOverlayNav wordmark="Claude Agency System" links={LINKS} overlay={overlay} />;
}
