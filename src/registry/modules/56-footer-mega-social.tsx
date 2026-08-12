/**
 * Module 56 — Footer, Mega with Social
 * A larger 5-column footer with a social icon row. No entrance animation,
 * matching module 15's convention. Social icons are text-initial
 * placeholders (lucide-react doesn't ship brand marks) — swap in real
 * brand icons/SVGs per project.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Effects", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Resources", links: ["Docs", "Guides", "Support", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];
const SOCIALS = ["X", "Gh", "in", "Ig"];

export default function FooterMegaSocial() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-5">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-lg font-semibold tracking-tight text-zinc-950">Studio</div>
          <p className="mt-2 text-sm text-zinc-500">Built from the module library.</p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((label) => (
              <a
                key={label}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              >
                {label}
              </a>
            ))}
          </div>
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
      <div className="mx-auto mt-16 max-w-6xl border-t border-zinc-100 pt-6 text-sm text-zinc-400">
        © {new Date().getFullYear()} Studio. All rights reserved.
      </div>
    </footer>
  );
}
