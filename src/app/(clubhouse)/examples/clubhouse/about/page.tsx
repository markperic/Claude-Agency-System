import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { Stats } from "@/showcase/clubhouse/components/showcase/Stats";
import { aboutHero, aboutPage, stats } from "@/showcase/clubhouse/content";

export default function AboutPage() {
  return (
    <>
      <main>
        <ClubHero slides={aboutHero} />
        <TextSection eyebrow={aboutPage.history.eyebrow} heading={aboutPage.history.heading} paragraphs={aboutPage.history.paragraphs} />
        <Stats {...stats} />
        <TextSection tone={aboutPage.entryRequirements.tone} heading={aboutPage.entryRequirements.heading} paragraphs={aboutPage.entryRequirements.paragraphs} cta={aboutPage.entryRequirements.cta} />
        <TextSection heading={aboutPage.courtesyBus.heading} paragraphs={aboutPage.courtesyBus.paragraphs} />
        <div id="policies" className="scroll-mt-24">
          <TextSection tone="sand" heading={aboutPage.policies.heading} paragraphs={aboutPage.policies.paragraphs} />
        </div>
      </main>
      <Footer />
    </>
  );
}
