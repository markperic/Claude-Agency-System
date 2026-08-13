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
          <ParallaxImage strength={40} className="aspect-3/4 rounded-2xl">
            <img
              src="https://images.pexels.com/photos/2081184/pexels-photo-2081184.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
              alt="Triangular skylight casting light across a stairwell"
              className="h-full w-full scale-125 object-cover"
            />
          </ParallaxImage>
          <ParallaxImage strength={80} className="aspect-3/4 rounded-2xl sm:mt-10">
            <img
              src="https://images.pexels.com/photos/3747070/pexels-photo-3747070.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
              alt="Laptop on a desk in front of an industrial-style window"
              className="h-full w-full scale-150 object-cover"
            />
          </ParallaxImage>
          <ParallaxImage strength={40} className="aspect-3/4 rounded-2xl">
            <img
              src="https://images.pexels.com/photos/3062948/pexels-photo-3062948.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
              alt="Minimal white architectural interior"
              className="h-full w-full scale-125 object-cover"
            />
          </ParallaxImage>
        </div>
      </div>
    </section>
  );
}
