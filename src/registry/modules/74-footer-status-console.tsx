/**
 * Module 74 — Footer, Status Console
 * A dispatch-style newsletter panel — headline, signup, and topic tags on
 * one side, a live status readout on the other — sits above the standard
 * column footer. No entrance animation, matching module 15's convention.
 */
const STATUS_ROWS: { label: string; value: string; live?: boolean }[] = [
  { label: "Status", value: "All systems operational", live: true },
  { label: "Uptime", value: "99.98%, last 90 days" },
  { label: "Latest release", value: "v2.4 — Module 74" },
  { label: "Next update", value: "Friday" },
];
const TAGS = ["Weekly signal", "Release notes", "Roadmap"];
const COLUMNS = [
  { title: "Explore", links: ["Overview", "Modules", "Changelog"] },
  { title: "Build", links: ["Docs", "Examples", "Status"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export default function FooterStatusConsole() {
  return (
    <footer className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_auto_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-zinc-950">S</div>
              <span className="text-sm font-medium text-zinc-400">Studio Dispatch</span>
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-balance tracking-tight text-white sm:text-3xl">
              Product updates, without the standup.
            </h2>
            <p className="mt-3 text-sm text-zinc-400">Release notes and roadmap shifts, delivered every other Friday.</p>

            <form className="mt-6 flex max-w-sm gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-white/40"
              />
              <button type="submit" className="shrink-0 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200">
                Subscribe
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden w-px bg-white/10 sm:block" />

          <div className="flex flex-col justify-center gap-4">
            {STATUS_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-6 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase">{row.label}</span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  {row.live && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="text-lg font-semibold tracking-tight text-white">Studio</div>
          <p className="mt-2 max-w-[16rem] text-sm text-zinc-500">Built from the module library.</p>
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
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-sm text-zinc-500">© {new Date().getFullYear()} Studio. All rights reserved.</div>
    </footer>
  );
}
