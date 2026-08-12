import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 13 — Newsletter Signup
 * Compact centered form. Effect: A (Fade Up).
 */
export default function Newsletter() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50 px-6 py-16">
      <ScrollReveal effect="A" className="mx-auto max-w-lg text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Get updates when new modules ship</h2>
        <p className="mt-2 text-zinc-600">No spam — just the occasional new component.</p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="you@studio.com"
            className="flex-1 rounded-full border border-zinc-200 px-5 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Subscribe
          </button>
        </form>
      </ScrollReveal>
    </section>
  );
}
