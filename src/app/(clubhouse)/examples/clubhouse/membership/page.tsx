import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { StepsSection } from "@/showcase/clubhouse/components/sections/StepsSection";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import { membershipBenefits, membershipHero, membershipHowToJoin, membershipStatement } from "@/showcase/clubhouse/content";

export default function MembershipPage() {
  return (
    <>
      <main>
        <ClubHero slides={membershipHero} />
        <StepsSection
          eyebrow={membershipHowToJoin.eyebrow}
          heading={membershipHowToJoin.heading}
          intro={membershipHowToJoin.intro}
          paragraphs={membershipHowToJoin.paragraphs}
          items={membershipHowToJoin.items}
          image={membershipHowToJoin.image}
          imagePosition={membershipHowToJoin.imagePosition}
        />
        <Statement {...membershipStatement} />
        <StepsSection
          heading={membershipBenefits.heading}
          intro={membershipBenefits.intro}
          paragraphs={membershipBenefits.paragraphs}
          items={membershipBenefits.items}
          image={membershipBenefits.image}
          imagePosition={membershipBenefits.imagePosition}
          tone={membershipBenefits.tone}
        />
      </main>
      <Footer />
    </>
  );
}
