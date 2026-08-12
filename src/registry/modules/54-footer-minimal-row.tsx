/**
 * Module 54 — Footer, Minimal Single Row
 * Logo, a handful of inline links, and copyright — all in one row. No
 * entrance animation, matching module 15's convention for footers.
 */
const LINKS = ["Modules", "Pricing", "Docs", "Contact"];

export default function FooterMinimalRow() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm font-semibold tracking-tight text-zinc-950">Studio</div>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {LINKS.map((link) => (
            <a key={link} href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
              {link}
            </a>
          ))}
        </nav>
        <div className="text-sm text-zinc-400">© {new Date().getFullYear()} Studio</div>
      </div>
    </footer>
  );
}
