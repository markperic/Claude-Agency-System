import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { BookingSection } from "@/showcase/clubhouse/components/sections/BookingSection";
import { CardGridSection } from "@/showcase/clubhouse/components/sections/CardGridSection";
import { EventsSection } from "@/showcase/clubhouse/components/sections/EventsSection";
import { HoursSection } from "@/showcase/clubhouse/components/sections/HoursSection";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { Chapters } from "@/showcase/clubhouse/components/showcase/Chapters";
import { ClubArc } from "@/showcase/clubhouse/components/showcase/ClubArc";
import { SplitTitle } from "@/showcase/clubhouse/components/showcase/SplitTitle";
import { Statement } from "@/showcase/clubhouse/components/showcase/Statement";
import {
  bookingSection,
  cardGrid,
  chapters,
  clubArc,
  events,
  footer as footerContent,
  heroSlides,
  hoursNote,
  hoursSection,
  openingHours,
  splitTitle,
  statement,
  textSectionMembership,
  textSectionPlease,
} from "@/showcase/clubhouse/content";

/**
 * The Clubhouse — a 1:1 port of the client project's actual current home page:
 * same section sequence (queried live from its Sanity dataset, not guessed from
 * seed data), same components, same design. Only branding/copy is swapped and
 * the handful of CMS/backend-only pieces (live booking widget, multi-page nav)
 * are the minimum fictional stand-ins a static, single-page demo needs.
 */
export default function ClubhouseExamplePage() {
  return (
    <>
      <main>
        <ClubHero slides={heroSlides} />
        <SplitTitle {...splitTitle} />
        <Chapters items={chapters} />
        <EventsSection eyebrow="Events" heading="What's on at The Clubhouse" events={events} />
        <Statement {...statement} />
        <ClubArc {...clubArc} />
        <TextSection eyebrow={textSectionMembership.eyebrow} heading={textSectionMembership.heading} paragraphs={textSectionMembership.paragraphs} image={textSectionMembership.image} imagePosition={textSectionMembership.imagePosition} cta={textSectionMembership.cta} />
        <TextSection heading={textSectionPlease.heading} paragraphs={textSectionPlease.paragraphs} image={textSectionPlease.image} imagePosition={textSectionPlease.imagePosition} />
        <HoursSection heading={hoursSection.heading} image={hoursSection.image} hoursNote={hoursNote} openingHours={openingHours} />
        <div id="menu" className="scroll-mt-24">
          <CardGridSection heading={cardGrid.heading} intro={cardGrid.intro} tone={cardGrid.tone} columns={cardGrid.columns} cards={cardGrid.cards} />
        </div>
        <div id="restaurant-bookings" className="scroll-mt-24">
          <BookingSection heading={bookingSection.heading} paragraphs={bookingSection.paragraphs} image={bookingSection.image} phone={footerContent.phone} />
        </div>
      </main>
      <Footer />
    </>
  );
}
