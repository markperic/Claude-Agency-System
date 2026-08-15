/**
 * Module 73 — Footer, Boxed Panel
 * A footer framed as its own bordered, rounded card rather than a plain
 * full-width band — brand mark, a nav column, a one-line mission
 * statement, and a social row share the top of the panel, with an inline
 * newsletter field and the legal row below. No entrance animation,
 * matching module 15's convention.
 */
const NAV_LINKS = ["Work", "Studio", "Journal", "Contact"];
const SOCIALS = ["X", "Ig", "In"];

export default function FooterBoxedPanel() {
  return (
    <footer className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 p-8 sm:p-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-zinc-950">S</div>
            <div className="mt-4 text-lg leading-tight font-bold tracking-tight text-white uppercase">Studio</div>
          </div>

          <div>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Navigation</div>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm font-medium text-zinc-300 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Who we are</div>
            <p className="mt-3 text-sm font-medium text-zinc-300">A small studio making careful work.</p>
          </div>

          <div>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Socials</div>
            <div className="mt-3 flex gap-2">
              {SOCIALS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Get updates</div>
          <form className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-full border border-white/15 bg-transparent px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/40"
            />
            <button type="submit" className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl flex-col gap-2 px-2 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Studio. A quietly independent practice.</span>
        <div className="flex gap-4">
          <a href="#" className="transition-colors hover:text-white">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
