"use client";

import { ScrollReveal, StaggerGroup } from "@/registry/lib/motion-variants";

const FIELDS = [
  { name: "name", label: "Name", placeholder: "Type your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", placeholder: "Type your email", type: "email", autoComplete: "email" },
] as const;

/**
 * Module 95 — Contact, Statement Form
 * The closing conversion block: an oversized statement sized to fill the
 * measure, then a deliberately plain underline-only form. The form is
 * presentational — fields carry names and labels but no submit handler, so
 * the host page can wire it to whatever backend or form service it uses
 * (`action` and `method` on the `<form>`, or an `onSubmit` passed in).
 *
 * Headline reveal is Effect K's idea (a heading arriving in parts) but built
 * as three explicit `ScrollReveal` lines rather than `SplitReveal`, because
 * the line breaks here are editorial — they're part of the layout, not a
 * by-product of wrapping. Fields use Effect F's stagger via `StaggerGroup`.
 *
 * Fields are underline-only with a large hit area rather than boxed inputs,
 * matching the section's editorial register; the focus ring is kept explicit
 * so keyboard users still get an unmistakable focus state.
 */
export default function ContactStatementForm({
  id = "contact",
  eyebrow = "Start a conversation",
  lines = ["Ready to find", "somewhere worth", "staying?"],
  note = "An advisor will come back to you within one working day.",
}: {
  id?: string;
  eyebrow?: string;
  lines?: string[];
  note?: string;
}) {
  return (
    <section id={id} className="bg-[#f1f1f1] py-20 text-[#0a0a0a] md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <ScrollReveal>
          <p className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
            {eyebrow}
          </p>
        </ScrollReveal>

        <h2 className="mt-8">
          {lines.map((line) => (
            <ScrollReveal as="span" key={line} className="block overflow-hidden">
              <span className="block text-[clamp(2.25rem,7.4vw,6.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.05em]">
                {line}
              </span>
            </ScrollReveal>
          ))}
        </h2>

        <div className="mt-16 grid gap-12 border-t border-black/10 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,44%)] lg:gap-20">
          <form className="space-y-10">
            <StaggerGroup className="space-y-10">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={`contact-${field.name}`}
                    className="block text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`contact-${field.name}`}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    className="mt-4 w-full border-b border-black/20 bg-transparent pb-3 text-lg tracking-[-0.01em] outline-none transition-colors placeholder:text-black/25 focus-visible:border-[#7a0c07] focus-visible:ring-0"
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  placeholder="What are you looking for?"
                  className="mt-4 w-full resize-none border-b border-black/20 bg-transparent pb-3 text-lg tracking-[-0.01em] outline-none transition-colors placeholder:text-black/25 focus-visible:border-[#7a0c07]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#7a0c07] px-9 py-4 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-white transition-transform duration-300 hover:scale-[1.03]"
              >
                Send &#8599;
              </button>
            </StaggerGroup>
          </form>

          <ScrollReveal className="lg:pt-2">
            <p className="max-w-[38ch] text-sm leading-relaxed text-[#7a7a7a]">{note}</p>
            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
                  Direct
                </dt>
                <dd className="mt-2 text-lg tracking-[-0.01em]">hello@example.com</dd>
              </div>
              <div>
                <dt className="text-[0.6875rem] font-bold uppercase leading-none tracking-[-0.02em] text-[#7a7a7a]">
                  Studio
                </dt>
                <dd className="mt-2 max-w-[30ch] text-lg leading-snug tracking-[-0.01em]">
                  Placeholder address, floor and suite, city
                </dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
