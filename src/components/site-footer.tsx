import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { CATEGORIES } from "@/registry/categories";

const LINKS = [
  { href: "/", label: "Home" },
  ...CATEGORIES.map((c) => ({ href: `/demo/${c.slug}`, label: c.navLabel })),
];

/**
 * Site chrome, not a numbered catalog module — same reasoning as SiteNav:
 * this is navigation for the site itself, so it lives in src/components
 * rather than src/registry/modules. Every /demo page and the homepage
 * render it directly (there's no shared root layout wrapper for these
 * pages), same as how each of them renders <SiteNav /> individually.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-950">
            Claude Agency System
          </Link>
          <p className="mt-1 max-w-xs text-sm text-zinc-500">A numbered, animated module library for composing marketing sites.</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-600 transition-colors hover:text-zinc-950">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between border-t border-zinc-100 pt-6 text-sm text-zinc-400">
        <span>© {new Date().getFullYear()} Claude Agency System.</span>
        <a href="#" className="inline-flex items-center gap-1.5 text-zinc-500 transition-colors hover:text-zinc-950">
          Back to top
          <ArrowUp className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
