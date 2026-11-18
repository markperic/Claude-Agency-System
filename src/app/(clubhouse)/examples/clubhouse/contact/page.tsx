import { PageTitle } from "@/showcase/clubhouse/components/PageTitle";
import { Footer } from "@/showcase/clubhouse/components/Footer";
import { TextSection } from "@/showcase/clubhouse/components/sections/TextSection";
import { HoursSection } from "@/showcase/clubhouse/components/sections/HoursSection";
import { BookingSection } from "@/showcase/clubhouse/components/sections/BookingSection";
import { bookingSection, contactPage, footer, hoursNote, hoursSection, openingHours } from "@/showcase/clubhouse/content";

export default function ContactPage() {
  return (
    <>
      <main>
        <PageTitle eyebrow="Contact" title={contactPage.heading}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/85">{contactPage.intro}</p>
        </PageTitle>
        <HoursSection heading={hoursSection.heading} image={hoursSection.image} hoursNote={hoursNote} openingHours={openingHours} />
        <TextSection
          heading="Visit us"
          paragraphs={[`${footer.address}. Call us on ${footer.phone} — our team is on hand 7 days a week.`]}
        />
        <BookingSection heading={bookingSection.heading} paragraphs={bookingSection.paragraphs} image={bookingSection.image} phone={footer.phone} />
      </main>
      <Footer />
    </>
  );
}
