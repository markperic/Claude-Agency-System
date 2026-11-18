import { Footer } from "@/showcase/clubhouse/components/Footer";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { ClubArc } from "@/showcase/clubhouse/components/showcase/ClubArc";
import { ScrollGallery } from "@/showcase/clubhouse/components/showcase/ScrollGallery";
import { SplitTitle } from "@/showcase/clubhouse/components/showcase/SplitTitle";
import { Stats } from "@/showcase/clubhouse/components/showcase/Stats";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { chapters, clubArc, gallery, splitTitle, stats, statement } from "@/showcase/clubhouse/content";

export default function ClubhouseExamplePage() {
  return (
    <>
      <main>
        <SplitTitle {...splitTitle} />
        <Chapters items={chapters} />
        <Statement {...statement} />
        <ClubArc {...clubArc} />
        <Stats {...stats} />
        <ScrollGallery {...gallery} />
      </main>
      <Footer />
    </>
  );
}
