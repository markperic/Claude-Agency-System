import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { EventsSection } from "@/showcase/clubhouse/components/sections/EventsSection";
import { events } from "@/showcase/clubhouse/content";

export default function EventsPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="Entertainment" title="What's On" />
        <EventsSection eyebrow="Events" heading="Coming up at The Clubhouse" events={events} moreHref={null} />
      </main>
      <Footer />
    </>
  );
}
