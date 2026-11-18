import { BookButton } from "@/showcase/clubhouse/components/BookButton";
import { GumBranch } from "@/showcase/clubhouse/components/GumBranch";
import { footer as content } from "@/showcase/clubhouse/content";

/** Ported 1:1 from the client project's real site footer: CTA band, three-column visit/about/explore block, copyright bar. */
export function Footer() {
  const tel = content.phone.replace(/[^\d+]/g, "");
  return (
    <footer className="relative isolate overflow-hidden border-t-4 border-gold bg-forest-deep text-cream">
      <GumBranch className="absolute -right-20 -top-10 -z-10 w-[28rem] text-cream/[0.05]" />

      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <p className="eyebrow text-gold-light">Lunch &amp; dinner, 7 days</p>
            <p className="mt-2 font-display text-3xl sm:text-4xl">Pull up a chair at The Clubhouse</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <BookButton />
            <a href="#" className="btn-outline text-cream">
              View the menu
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 text-center sm:px-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
        <div className="space-y-6 md:px-10">
          <p className="eyebrow text-gold-light">Visit</p>
          <div className="space-y-2 text-cream/85">
            <p>{content.address}</p>
            <p>
              <a href={`tel:${tel}`} className="hover:text-gold-light">
                {content.phone}
              </a>
            </p>
          </div>
          <p className="eyebrow pt-4 text-gold-light">Opening hours</p>
          <ul className="mx-auto max-w-64 space-y-1 text-sm text-cream/85">
            {content.openingHours.map((r) => (
              <li key={r.key} className="flex justify-between gap-4">
                <span className="capitalize">{r.day.toLowerCase()}</span>
                <span>{r.hours.replace(/\s*\(.*\)/, "")}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-cream/55">{content.hoursNote}</p>
        </div>

        <div className="flex flex-col items-center gap-6 md:px-10">
          <p className="font-display text-xl uppercase tracking-[0.06em]">The Clubhouse</p>
          <p className="font-display text-2xl">About</p>
          <p className="max-w-xs text-cream/75">{content.tagline}</p>
          <p className="max-w-xs text-sm text-cream/60">{content.about}</p>
          <a
            href={content.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center border border-cream/30 transition hover:border-gold-light hover:text-gold-light"
            aria-label="The Clubhouse on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8h3.3z" />
            </svg>
          </a>
        </div>

        <div className="md:px-10">
          <p className="eyebrow mb-6 text-gold-light">Explore</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm uppercase tracking-[0.14em] text-cream/85">
            {content.footerLinks.map((l) => (
              <li key={l.key}>
                <a href={l.href} className="hover:text-gold-light">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-6 text-center text-xs text-cream/50 sm:flex-row sm:px-6 sm:text-left">
          <p>Copyright © 2026 The Clubhouse - All Rights Reserved</p>
          <p>Please gamble responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
