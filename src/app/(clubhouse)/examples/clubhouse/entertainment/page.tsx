import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { EventsSection } from "@/showcase/clubhouse/components/sections/EventsSection";
import { entertainmentPage, events } from "@/showcase/clubhouse/content";

export default function EntertainmentPage() {
  const lounge = entertainmentPage.lounge;
  return (
    <>
      <main>
        <PageTitle eyebrow="Entertainment" title={entertainmentPage.heading}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">{entertainmentPage.intro}</p>
        </PageTitle>
        <div id="lounge" className="scroll-mt-24">
          <TextSection eyebrow={lounge.kicker} heading={lounge.title} paragraphs={[lounge.text ?? ""]} image={lounge.image} imagePosition="right" tone="dark" />
        </div>
        <EventsSection eyebrow="Events" heading="What's on at The Clubhouse" events={events} />
      </main>
      <Footer />
    </>
  );
}
