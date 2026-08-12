/**
 * Module 55 — Footer, Newsletter Row
 * An embedded email signup above the standard column layout. No entrance
 * animation, matching module 15's convention.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Resources", links: ["Docs", "Support", "Status"] },
];

export default function FooterNewsletter() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 border-b border-zinc-100 pb-12 sm:flex-row">
        <div>
          <div className="text-lg font-semibold tracking-tight text-zinc-950">Get updates</div>
          <p className="mt-1 text-sm text-zinc-500">New modules and effects, roughly monthly.</p>
        </div>
        <form className="flex w-full max-w-sm gap-2">
          <input
            type="email"
            placeholder="you@studio.com"
            className="flex-1 rounded-full border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Subscribe
          </button>
        </form>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-lg font-semibold tracking-tight text-zinc-950">Studio</div>
          <p className="mt-2 text-sm text-zinc-500">Built from the module library.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-medium text-zinc-950">{col.title}</div>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-950">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-zinc-100 pt-6 text-sm text-zinc-400">
        © {new Date().getFullYear()} Studio. All rights reserved.
      </div>
    </footer>
  );
}
