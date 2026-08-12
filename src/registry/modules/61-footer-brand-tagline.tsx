/**
 * Module 61 — Footer, Brand + Tagline
 * A bigger brand mark and mission statement get their own row above the
 * link columns, for studios that want the footer to carry some identity.
 * No entrance animation.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Careers"] },
  { title: "Resources", links: ["Docs", "Support"] },
];

export default function FooterBrandTagline() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl border-b border-zinc-100 pb-12">
        <div className="text-2xl font-semibold tracking-tight text-zinc-950">Studio</div>
        <p className="mt-3 max-w-md text-zinc-600">
          A small, fixed catalog of well-designed modules — so quality
          doesn&apos;t swing from project to project.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3">
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
