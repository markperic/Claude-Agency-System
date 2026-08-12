import { ArrowRight } from "lucide-react";

/**
 * Module 60 — Footer, CTA Strip
 * A footer with a closing ask built into the top of it, for pages that
 * skip a separate CTA module. No entrance animation on the footer body,
 * matching module 15's convention.
 */
const COLUMNS = [
  { title: "Product", links: ["Modules", "Pricing"] },
  { title: "Company", links: ["About", "Blog"] },
];

export default function FooterCtaStrip() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 text-center sm:flex-row sm:text-left">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Ready to start building?</h2>
        <a
          href="#"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Get started
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="border-t border-zinc-100 px-6 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-2">
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
        <div className="mx-auto mt-10 max-w-6xl border-t border-zinc-100 pt-6 text-sm text-zinc-400">
          © {new Date().getFullYear()} Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
