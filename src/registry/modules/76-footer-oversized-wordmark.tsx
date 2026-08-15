/**
 * Module 76 — Footer, Oversized Wordmark
 * A restrained top half (brand, tagline, bordered nav grid) gives way to
 * an enormous, barely-there brand wordmark cropped off at the bottom
 * edge. No entrance animation.
 */
const COLUMNS = [
  { title: "Explore", links: ["Modules", "Pricing", "Changelog"] },
  { title: "Resources", links: ["Docs", "Guides", "Support"] },
  { title: "Company", links: ["About", "Careers", "Contact"] },
];

export default function FooterOversizedWordmark() {
  return (
    <footer className="bg-black px-6 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-black">S</div>
          <span className="text-lg font-semibold tracking-tight text-white">Studio</span>
        </div>
        <p className="mt-6 max-w-md text-2xl font-medium text-balance text-white">Ship your next site faster, without cutting the polish.</p>

        <div className="mt-12 grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {COLUMNS.map((col) => (
            <div key={col.title} className="p-6">
              <div className="text-sm font-semibold text-white">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-zinc-400 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-zinc-500">Building from the module library since 2024.</p>
      </div>

      <div className="relative mt-8 h-28 overflow-hidden sm:h-40 md:h-52">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 text-center text-[7rem] leading-none font-black tracking-tight text-white/[0.05] select-none sm:text-[11rem] md:text-[14rem]"
        >
          STUDIO
        </div>
      </div>
    </footer>
  );
}
