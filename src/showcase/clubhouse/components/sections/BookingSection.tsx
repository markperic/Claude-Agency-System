import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { BookButton } from "@/showcase/clubhouse/components/BookButton";
import { Container, RichText } from "./shared";

export function BookingSection({
  heading,
  paragraphs,
  image,
  phone,
}: {
  heading?: string;
  paragraphs: React.ReactNode[];
  image?: Img;
  phone?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest py-20 text-cream sm:py-28">
      {image && (
        <div className="absolute inset-0 -z-10 opacity-25">
          <ClubImage image={image} fill className="object-cover" sizes="100vw" />
        </div>
      )}
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div>
          <p className="eyebrow mb-4 text-gold-light">The Kitchen</p>
          <h2 className="font-display text-4xl sm:text-5xl">{heading || "Restaurant bookings"}</h2>
          <RichText paragraphs={paragraphs} className="prose-mg mt-6 text-cream/85" />
          <div className="mt-8 flex flex-wrap gap-3">
            <BookButton>Enquire about a table</BookButton>
            {phone && (
              <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn-outline text-cream">
                Call {phone}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
