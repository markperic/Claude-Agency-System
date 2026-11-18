import { header } from "@/showcase/clubhouse/content";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
      <a
        href={header.logo.href}
        className="rounded-full bg-forest-deep/85 px-3 py-1.5 font-display text-sm uppercase tracking-[0.06em] text-cream backdrop-blur-sm sm:px-4 sm:py-2 sm:text-lg"
      >
        {header.logo.label}
      </a>
      <a href={header.cta.href} className="btn-gold max-sm:px-4 max-sm:py-2.5 max-sm:text-[10px]">
        {header.cta.label}
      </a>
    </header>
  );
}
