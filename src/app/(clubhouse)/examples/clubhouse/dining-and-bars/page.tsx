import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { StepsSection } from "@/showcase/clubhouse/components/sections/StepsSection";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { chapters, containersForChange, diningHero, diningPage } from "@/showcase/clubhouse/content";

export default function DiningAndBarsPage() {
  return (
    <>
      <main>
        <ClubHero slides={diningHero} />
        <TextSection heading={diningPage.heading} paragraphs={[diningPage.intro]} />
        <Chapters items={chapters} />
        <div id="containers-for-change" className="scroll-mt-24">
          <StepsSection
            eyebrow={containersForChange.eyebrow}
            heading={containersForChange.heading}
            intro={containersForChange.intro}
            paragraphs={containersForChange.paragraphs}
            items={containersForChange.items}
            image={containersForChange.image}
            imagePosition="left"
            tone="sand"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
