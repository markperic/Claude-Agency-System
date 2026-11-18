import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { membershipPage, textSectionMembership } from "@/showcase/clubhouse/content";

export default function MembershipPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="Membership" title={membershipPage.heading}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">{membershipPage.intro}</p>
        </PageTitle>
        <TextSection
          eyebrow={textSectionMembership.eyebrow}
          heading={textSectionMembership.heading}
          paragraphs={textSectionMembership.paragraphs}
          image={textSectionMembership.image}
          imagePosition={textSectionMembership.imagePosition}
          cta={textSectionMembership.cta}
        />
        <Statement {...membershipPage.statement} />
      </main>
      <Footer />
    </>
  );
}
