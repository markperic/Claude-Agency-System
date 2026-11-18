import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { ScrollGallery } from "@/showcase/clubhouse/components/showcase/ScrollGallery";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { rugbyPage } from "@/showcase/clubhouse/content";

export default function RugbyLeaguePage() {
  return (
    <>
      <main>
        <ClubHero slides={rugbyPage.hero} />
        <TextSection eyebrow={rugbyPage.eyebrow} heading={rugbyPage.heading} paragraphs={rugbyPage.paragraphs} image={rugbyPage.image} imagePosition="left" />
        <Statement {...rugbyPage.statement} />
        <ScrollGallery eyebrow={rugbyPage.gallery.eyebrow} heading={rugbyPage.gallery.heading} tone={rugbyPage.gallery.tone} images={rugbyPage.gallery.images} />
      </main>
      <Footer />
    </>
  );
}
