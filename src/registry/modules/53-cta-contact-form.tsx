import { ScrollReveal } from "@/registry/lib/motion-variants";

/**
 * Module 53 — CTA, Contact Form
 * A closing section with an inline contact form instead of a single
 * button — for sales-assisted products. Effect: A on the form block.
 */
export default function CtaContactForm() {
  return (
    <section className="bg-zinc-50 px-6 py-24">
      <div className="mx-auto max-w-lg">
        <ScrollReveal effect="A" className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Talk to us</h2>
          <p className="mt-2 text-zinc-600">Tell us about your project and we&apos;ll get back to you within a day.</p>
        </ScrollReveal>

        <ScrollReveal effect="A" as="form" className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <input
            type="email"
            placeholder="you@studio.com"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <textarea
            placeholder="What are you building?"
            rows={4}
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Send message
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
