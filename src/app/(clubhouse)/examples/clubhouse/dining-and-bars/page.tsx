import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { chapters, diningPage } from "@/showcase/clubhouse/content";

export default function DiningAndBarsPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="Dining and Bars" title={diningPage.heading}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">{diningPage.intro}</p>
        </PageTitle>
        <Chapters items={chapters} />
      </main>
      <Footer />
    </>
  );
}
