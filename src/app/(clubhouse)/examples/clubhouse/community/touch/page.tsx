import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { footer, touchPage } from "@/showcase/clubhouse/content";

export default function TouchPage() {
  const paragraphs = [
    ...touchPage.paragraphs,
    `Contact: ${touchPage.contact.name} · ${touchPage.contact.phone} · ${touchPage.contact.email}`,
  ];
  return (
    <>
      <main>
        <ClubHero slides={touchPage.hero} />
        <TextSection eyebrow={touchPage.eyebrow} heading={touchPage.heading} paragraphs={paragraphs} image={touchPage.image} imagePosition="right" />
        <Statement {...touchPage.statement} />

        {/* Sign up / Join a team — the real site's linkButtonsSection: a numbered index of sign-up routes, ported as inert cards pointing to Contact (no live third-party registration backend for a fictional club). */}
        <section id="sign-up" className="scroll-mt-24 bg-forest py-24 text-cream sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <SplitHeading text={touchPage.signup.heading} className="font-display text-5xl leading-[1.02] text-cream sm:text-6xl lg:text-7xl" mutedClassName="text-cream/40" />
              </div>
              <ol className="lg:col-span-8">
                {touchPage.signup.groups.map((g, i) => (
                  <li key={g.key} className="grid gap-x-6 gap-y-4 border-t-[3px] border-cream/15 py-8 transition-colors hover:border-gold-light sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                    <span className="font-display text-2xl tabular-nums text-gold-light">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-2xl leading-snug text-cream sm:text-3xl">{g.title}</h3>
                      <p className="mt-2 max-w-xl leading-relaxed text-cream/70">{g.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:justify-end">
                      <a href="/examples/clubhouse/contact" className="btn-gold whitespace-nowrap">
                        {g.cta} <span aria-hidden>→</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Location — the real site's mapSection: address only, no live map embed for a fictional club. */}
        <section className="bg-sand py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="eyebrow mb-5 text-gold">Location</p>
            <SplitHeading text="Brindabank / Recreation Reserve" className="font-display text-5xl leading-[1.02] text-forest sm:text-6xl lg:text-7xl" mutedClassName="text-forest/40" />
            <div className="mt-8 h-px w-16 bg-gold" aria-hidden />
            <p className="prose-mg mt-8 text-ink/85">Address: {footer.address}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
