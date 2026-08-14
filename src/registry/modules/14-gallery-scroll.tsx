import Image from "next/image";
import { ScrollReveal, ParallaxImage } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

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
            <Image
              src={PLACEHOLDER_IMAGES.portrait08.src}
              alt={PLACEHOLDER_IMAGES.portrait08.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="scale-125 object-cover"
            />
          </ParallaxImage>
          <ParallaxImage strength={80} className="aspect-3/4 rounded-2xl sm:mt-10">
            <Image
              src={PLACEHOLDER_IMAGES.portrait09.src}
              alt={PLACEHOLDER_IMAGES.portrait09.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="scale-150 object-cover"
            />
          </ParallaxImage>
          <ParallaxImage strength={40} className="aspect-3/4 rounded-2xl">
            <Image
              src={PLACEHOLDER_IMAGES.portrait06.src}
              alt={PLACEHOLDER_IMAGES.portrait06.alt}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="scale-125 object-cover"
            />
          </ParallaxImage>
        </div>
      </div>
    </section>
  );
}
