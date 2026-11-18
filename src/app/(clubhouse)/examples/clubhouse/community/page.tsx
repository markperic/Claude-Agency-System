import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { ClubArc } from "@/showcase/clubhouse/components/showcase/ClubArc";
import { clubArc, communityPage } from "@/showcase/clubhouse/content";

export default function CommunityPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="Community" title={communityPage.heading} />
        <Statement {...communityPage.statement} />
        <ClubArc {...clubArc} />
      </main>
      <Footer />
    </>
  );
}
