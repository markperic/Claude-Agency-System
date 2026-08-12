import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Catalog" },
];

/**
 * Site chrome, not a numbered catalog module — this is navigation for the
 * site itself, not a marketing-page section, so it doesn't belong in
 * src/registry/modules. Styled as a floating pill (rounded, bordered,
 * blurred), the look popularized by Aceternity-style navbars, rebuilt here
 * in plain Tailwind rather than pulling in their component.
 */
export function SiteNav() {
  return (
    <div className="bg-white px-6 pt-6">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-6 rounded-full border border-zinc-200 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md">
        <span className="text-sm font-semibold tracking-tight text-zinc-950">Claude Agency System</span>
        <div className="flex items-center gap-6 text-sm font-medium">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-zinc-600 transition-colors hover:text-zinc-950">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
