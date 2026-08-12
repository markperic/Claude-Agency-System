/**
 * Module 59 — Footer, Dark
 * A dark-background variant of the multi-column footer, for pages that
 * close on a dark note (paired with hero modules like 17/18/23). No
 * entrance animation.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Resources", links: ["Docs", "Support", "Status"] },
];

export default function FooterDark() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-lg font-semibold tracking-tight text-white">Studio</div>
          <p className="mt-2 text-sm text-zinc-500">Built from the module library.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-medium text-white">{col.title}</div>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        © {new Date().getFullYear()} Studio. All rights reserved.
      </div>
    </footer>
  );
}
