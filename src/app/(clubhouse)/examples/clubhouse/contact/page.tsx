import { ClubHero } from "@/showcase/clubhouse/components/ClubHero";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { HoursSection } from "@/showcase/clubhouse/components/sections/HoursSection";
import { BookingSection } from "@/showcase/clubhouse/components/sections/BookingSection";
import { bookingSection, contactHero, contactPage, footer, hoursNote, hoursSection, openingHours } from "@/showcase/clubhouse/content";

export default function ContactPage() {
  return (
    <>
      <main>
        <ClubHero slides={contactHero} />
        <TextSection heading={contactPage.heading} paragraphs={[contactPage.intro]} />
        <TextSection tone="sand" heading={contactPage.findUsHeading} paragraphs={[`Address: ${footer.address}`, `Phone: ${footer.phone}`]} />
        <HoursSection heading={hoursSection.heading} image={hoursSection.image} hoursNote={hoursNote} openingHours={openingHours} />
        <BookingSection heading={bookingSection.heading} paragraphs={bookingSection.paragraphs} image={bookingSection.image} phone={footer.phone} />
      </main>
      <Footer />
    </>
  );
}
