import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { EventsSection } from "@/showcase/clubhouse/components/sections/EventsSection";
import { entertainmentChapters, entertainmentHero, events } from "@/showcase/clubhouse/content";

export default function EntertainmentPage() {
  return (
    <>
      <main>
        <ClubHero slides={entertainmentHero} />
        <Chapters items={entertainmentChapters} />
        <EventsSection eyebrow="Events" heading="What's on / at The Clubhouse" events={events} />
      </main>
      <Footer />
    </>
  );
}
