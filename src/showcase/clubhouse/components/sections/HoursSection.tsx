import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import { ClubImage, type Img } from "@/showcase/clubhouse/components/ClubImage";
import { Container, IndexRows } from "./shared";

export function HoursSection({
  heading,
  image,
  hoursNote,
  openingHours,
}: {
  heading?: string;
  image?: Img;
  hoursNote?: string;
  openingHours: { key: string; day: string; hours: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep py-24 text-cream sm:py-32">
      {image && (
        <div className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 opacity-35 lg:block">
          <ClubImage image={image} fill className="object-cover" sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/40 to-transparent" />
        </div>
      )}
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4 text-gold-light">Visit us</p>
            <SplitHeading
              text={heading ? `${heading} / 7 days a week` : "Opening hours / 7 days a week"}
              className="font-display text-5xl leading-[1.02] sm:text-6xl"
              mutedClassName="text-cream/40"
            />
            {hoursNote && <p className="mt-8 max-w-xs text-sm text-cream/60">{hoursNote}</p>}
          </div>
          <IndexRows
            className="lg:col-span-7 lg:col-start-6"
            dark
            rows={openingHours.map((r) => {
              const [time, note] = r.hours.split(/\s*\(/);
              return { key: r.key, title: r.day.charAt(0) + r.day.slice(1).toLowerCase(), meta: time, sub: note ? note.replace(/\)$/, "") : undefined };
            })}
          />
        </div>
      </Container>
    </section>
  );
}
