import { Apple, PlayCircle } from "lucide-react";

/**
 * Module 58 — Footer, App Download
 * A footer for a mobile-first product — store badges get top billing
 * above the usual link columns. No entrance animation.
 */
const COLUMNS = [
  { title: "Product", links: ["Features", "Pricing"] },
  { title: "Company", links: ["About", "Careers"] },
];

export default function FooterAppDownload() {
  return (
    <footer className="border-t border-zinc-100 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-2">
          <div className="text-lg font-semibold tracking-tight text-zinc-950">Studio</div>
          <p className="mt-2 max-w-xs text-sm text-zinc-500">Manage your module library from anywhere.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5">
              <Apple className="h-4 w-4 text-zinc-950" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-zinc-500">Download on the</div>
                <div className="text-xs font-medium text-zinc-950">App Store</div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5">
              <PlayCircle className="h-4 w-4 text-zinc-950" />
              <div className="text-left leading-tight">
                <div className="text-[9px] text-zinc-500">Get it on</div>
                <div className="text-xs font-medium text-zinc-950">Google Play</div>
              </div>
            </a>
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
      <div className="mx-auto mt-12 max-w-6xl border-t border-zinc-100 pt-6 text-sm text-zinc-400">
        © {new Date().getFullYear()} Studio. All rights reserved.
      </div>
    </footer>
  );
}
