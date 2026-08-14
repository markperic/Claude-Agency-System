import Image from "next/image";
import { ScrollReveal } from "@/registry/lib/motion-variants";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";

/**
 * Module 05 — Content Split, Image Right
 * A mid-page content section: eyebrow, title, body copy, left; visual, right.
 * This is the module referenced in MODULE-LIBRARY.md's worked example.
 *
 * Title effect: B (Fade In) — deliberately calm, since this sits mid-page
 * rather than as the first thing a visitor sees. Swap the `effect="B"` prop
 * on the <Reveal> below to try a different one from the catalog.
 */
export default function ContentSplit() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <ScrollReveal effect="E" className="relative order-2 aspect-4/3 w-full overflow-hidden rounded-2xl lg:order-1">
          <Image
            src={PLACEHOLDER_IMAGES.landscape03.src}
            alt={PLACEHOLDER_IMAGES.landscape03.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </ScrollReveal>

        <div className="order-1 lg:order-2">
          <ScrollReveal effect="A" as="p" className="mb-4 text-sm font-medium tracking-wide text-zinc-500 uppercase">
            Why it works
          </ScrollReveal>

          {/* Title — currently Effect B (Fade In) */}
          <ScrollReveal effect="B" as="h2" className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            One well-designed module beats ten improvised ones
          </ScrollReveal>

          <ScrollReveal effect="A" as="p" className="mt-6 text-lg text-zinc-600">
            When Claude composes from a fixed, vetted library instead of
            inventing a layout from a screenshot, every project starts from
            the same quality bar — and stays consistent as the site grows.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
