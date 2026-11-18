import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { Stats } from "@/showcase/clubhouse/components/showcase/Stats";
import { aboutPage, stats } from "@/showcase/clubhouse/content";

export default function AboutPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="About" title={aboutPage.heading} />
        <TextSection paragraphs={aboutPage.intro} />
        <Stats {...stats} />
        <div id="policies" className="scroll-mt-24">
          <TextSection tone="sand" heading={aboutPage.policies.heading} paragraphs={aboutPage.policies.paragraphs} />
        </div>
      </main>
      <Footer />
    </>
  );
}
