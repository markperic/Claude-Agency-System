"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/registry/categories";

const LINKS = [
  { href: "/", label: "Home" },
  ...CATEGORIES.map((c) => ({ href: `/demo/${c.slug}`, label: c.navLabel })),
];

/**
 * Site chrome, not a numbered catalog module — this is navigation for the
 * site itself, not a marketing-page section, so it doesn't belong in
 * src/registry/modules. Styled as a floating pill (rounded, bordered,
 * blurred), the look popularized by Aceternity-style navbars, rebuilt here
 * in plain Tailwind rather than pulling in their component.
 *
 * Eight links (Home + seven categories) fit inline at desktop width (lg+);
 * below that — tablet and mobile — the link row collapses behind a
 * hamburger button that opens a stacked dropdown under the pill.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-white px-6 pt-6">
      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-6 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
        <span className="shrink-0 text-sm font-semibold tracking-tight text-zinc-950">Claude Agency System</span>

        <div className="hidden items-center gap-5 text-sm font-medium lg:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="shrink-0 text-zinc-600 transition-colors hover:text-zinc-950">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-zinc-600 transition-colors hover:text-zinc-950 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-4xl px-6 lg:hidden">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-zinc-100 px-5 py-3 text-sm font-medium text-zinc-600 transition-colors last:border-b-0 hover:bg-zinc-50 hover:text-zinc-950"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
