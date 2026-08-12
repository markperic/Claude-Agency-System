/**
 * Module 57 — Footer, Centered Simple
 * Everything centered — logo, links, copyright — for a quieter, more
 * editorial closing than the column layouts. No entrance animation.
 */
const LINKS = ["Modules", "Pricing", "Docs", "Blog", "Contact"];

export default function FooterCenteredSimple() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-16 text-center">
      <div className="mx-auto max-w-xl">
        <div className="text-lg font-semibold tracking-tight text-zinc-950">Studio</div>
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a key={link} href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
              {link}
            </a>
          ))}
        </nav>
        <div className="mt-8 text-sm text-zinc-400">© {new Date().getFullYear()} Studio. All rights reserved.</div>
      </div>
    </footer>
  );
}
