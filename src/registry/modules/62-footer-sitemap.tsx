/**
 * Module 62 — Footer, Sitemap
 * A dense 6-column footer for large sites with a lot to link to. No
 * entrance animation.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Effects", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Resources", links: ["Docs", "Guides", "API", "Status"] },
  { title: "Solutions", links: ["Agencies", "Freelancers", "Enterprise"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
];

export default function FooterSitemap() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-lg font-semibold tracking-tight text-zinc-950">Studio</div>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-6">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm text-zinc-500">Built from the module library.</p>
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
        <div className="mt-12 border-t border-zinc-100 pt-6 text-sm text-zinc-400">
          © {new Date().getFullYear()} Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
