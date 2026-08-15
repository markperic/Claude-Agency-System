import Image from "next/image";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 77 — Footer, Photo Frame
 * A full-bleed abstract wallpaper runs behind the entire footer, with
 * a dark gradient scrim (transparent at top, solid by the bottom) instead
 * of a solid panel — centered brand, a slim link row, and social icons,
 * with a two-line meta readout in the legal row. Simplified from the
 * reference's cut-notch card-over-photo treatment: rather than a separate
 * boxed panel with corner cutouts (fragile SVG masking, and still mostly
 * hides the photo behind a solid fill), the photo is the background for
 * the whole section and a gradient carries the legibility instead. No
 * entrance animation.
 */
const NAV_LINKS = ["Book a Session", "Join the Waitlist"];
const SOCIALS = ["Ig", "X", "In"];

export default function FooterPhotoFrame() {
  return (
    <footer className="relative overflow-hidden bg-black">
      <Image src={PLACEHOLDER_IMAGES.wallpaper01.src} alt={PLACEHOLDER_IMAGES.wallpaper01.alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black" />

      <div className="relative px-6 pt-24 pb-10 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Studio</div>

          <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium tracking-wide text-zinc-400 uppercase">
            {NAV_LINKS.map((link, i) => (
              <span key={link} className="flex items-center gap-3">
                <a href="#" className="transition-colors hover:text-white">
                  {link}
                </a>
                {i < NAV_LINKS.length - 1 && <span className="text-zinc-700">–</span>}
              </span>
            ))}
          </nav>

          <div className="mt-6 flex justify-center gap-4">
            {SOCIALS.map((label) => (
              <a
                key={label}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-start sm:justify-between">
          <span>© {new Date().getFullYear()} Studio. All rights reserved.</span>
          <div className="text-left sm:text-right">
            <p>Independent design &amp; engineering</p>
            <p>Est. 2019</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
