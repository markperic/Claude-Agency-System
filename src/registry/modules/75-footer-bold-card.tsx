/**
 * Module 75 — Footer, Bold Color Card
 * A saturated gradient card carries the whole footer — brand, description,
 * socials, and link columns — with the copyright line sitting outside it
 * on the plain page background. No entrance animation.
 */
const COLUMNS = [
  { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Partners"] },
  { title: "Resources", links: ["Documentation", "API Reference", "Help Center"] },
];
const SOCIALS = ["X", "Gh", "In", "Yt"];

export default function FooterBoldCard() {
  return (
    <footer className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 sm:p-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2">
            <div className="text-xl font-semibold tracking-tight text-white">Studio</div>
            <p className="mt-4 max-w-sm text-indigo-100">A component library that ships production-ready sections, trusted by teams building fast.</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-semibold text-indigo-700 transition-transform hover:scale-105"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-sm font-semibold text-white">{col.title}</div>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-indigo-100 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-sm text-zinc-500">© {new Date().getFullYear()} Studio. All rights reserved.</p>
    </footer>
  );
}
