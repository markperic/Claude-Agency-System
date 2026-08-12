/**
 * Module 15 — Footer, Multi Column
 * No entrance animation by convention — footers are rarely the first thing
 * in view, and re-animating them on scroll tends to feel gratuitous.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Resources", links: ["Docs", "Support", "Status"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
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
