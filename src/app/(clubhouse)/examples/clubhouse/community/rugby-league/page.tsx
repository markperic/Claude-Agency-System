import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { communityClubs } from "@/showcase/clubhouse/content";

export default function RugbyLeaguePage() {
  const c = communityClubs.rugby;
  return (
    <>
      <main>
        <PageTitle eyebrow={c.eyebrow} title="Brindabank Rugby League">
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">{c.schedule}</p>
        </PageTitle>
        <TextSection heading={c.heading} paragraphs={c.paragraphs} image={c.image} imagePosition="left" />
      </main>
      <Footer />
    </>
  );
}
