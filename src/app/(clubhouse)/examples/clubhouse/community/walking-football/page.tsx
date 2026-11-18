import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { ScrollGallery } from "@/showcase/clubhouse/components/showcase/ScrollGallery";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { walkingPage } from "@/showcase/clubhouse/content";

export default function WalkingFootballPage() {
  return (
    <>
      <main>
        <ClubHero slides={walkingPage.hero} />
        <TextSection eyebrow={walkingPage.eyebrow} heading={walkingPage.heading} paragraphs={walkingPage.paragraphs} image={walkingPage.image} imagePosition="left" />
        <Statement {...walkingPage.statement} />
        <ScrollGallery eyebrow={walkingPage.gallery.eyebrow} heading={walkingPage.gallery.heading} tone={walkingPage.gallery.tone} images={walkingPage.gallery.images} />
      </main>
      <Footer />
    </>
  );
}
