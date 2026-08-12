import { ScrollReveal, ParallaxImage } from "@/registry/lib/motion-variants";

/**
 * Module 14 — Gallery, Scroll Parallax
 * A 3-image row where each image drifts at a slightly different scroll speed.
 * This is the module referenced in MODULE-LIBRARY.md's worked example
 * ("add scroll animation to module 14's images") — Effect H is already wired
 * up below; the three `strength` values are what create the staggered
 * parallax feel (change them, or set all three equal to remove it).
 */
export default function GalleryScroll() {
  return (
    <section className="overflow-hidden bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal effect="A" as="h2" className="mb-12 text-3xl font-semibold tracking-tight text-zinc-950">
          Recent work
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <ParallaxImage strength={40} className="aspect-3/4 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
          <ParallaxImage strength={80} className="aspect-3/4 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 sm:mt-10" />
          <ParallaxImage strength={40} className="aspect-3/4 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
        </div>
      </div>
    </section>
  );
}
