import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { ScrollGallery } from "@/showcase/clubhouse/components/showcase/ScrollGallery";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { communityChapters, communityGallery, communityHero, communityPage } from "@/showcase/clubhouse/content";

export default function CommunityPage() {
  return (
    <>
      <main>
        <ClubHero slides={communityHero} />
        <Statement {...communityPage.statement} />
        <Chapters items={communityChapters} />
        <TextSection tone="dark" heading={communityPage.supportHeading} paragraphs={communityPage.supportParagraphs} />
        <ScrollGallery
          eyebrow={communityGallery.eyebrow}
          heading={communityGallery.heading}
          intro={communityGallery.intro}
          tone={communityGallery.tone}
          images={communityGallery.images}
        />
      </main>
      <Footer />
    </>
  );
}
