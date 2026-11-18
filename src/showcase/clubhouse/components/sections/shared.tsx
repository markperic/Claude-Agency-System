import { SplitHeading } from "@/showcase/clubhouse/components/motion/SplitHeading";
import { GumBranch } from "@/showcase/clubhouse/components/GumBranch";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Heading({
  eyebrow,
  heading,
  intro,
  center = true,
  dark,
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
}) {
  if (!heading && !eyebrow && !intro) return null;
  return (
    <div className={`mb-14 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${dark ? "text-gold-light" : "text-gold"}`}>{eyebrow}</p>}
      <SplitHeading text={heading} className={`font-display text-4xl leading-[1.08] [text-wrap:balance] sm:text-6xl ${dark ? "text-cream" : "text-forest"}`} />
      {center && heading && (
        <div className="ornament" aria-hidden>
          <span className="size-1.5 rotate-45 bg-current" />
        </div>
      )}
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-cream/80" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

/** Faint eucalyptus line art in a section corner */
export function Branch({ side = "left", dark }: { side?: "left" | "right"; dark?: boolean }) {
  return (
    <GumBranch
      flip={side === "right"}
      className={`absolute -z-10 hidden w-72 md:block lg:w-96 ${side === "left" ? "-left-16 top-10" : "-right-16 bottom-0"} ${dark ? "text-cream/[0.07]" : "text-forest/[0.09]"}`}
    />
  );
}

/** Obys-style numbered index: thick rule, number, title, right-aligned meta. */
export function IndexRows({
  rows,
  dark,
  className = "",
}: {
  rows: { key: string; title: string; meta?: string; sub?: string }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <ol className={className}>
      {rows.map((r, i) => (
        <li
          key={r.key}
          className={`group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t-[3px] py-4 transition-colors sm:grid-cols-[4rem_1fr_auto] ${
            dark ? "border-cream/15 hover:border-gold" : "border-forest/15 hover:border-gold"
          }`}
        >
          <span className={`font-display text-sm tabular-nums ${dark ? "text-gold-light" : "text-gold"}`}>{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span className="font-display text-xl sm:text-2xl">{r.title}</span>
            {r.sub && <span className={`mt-1 block text-xs uppercase tracking-[0.14em] ${dark ? "text-cream/50" : "text-muted"}`}>{r.sub}</span>}
          </span>
          {r.meta && <span className={`text-right text-sm tabular-nums sm:text-base ${dark ? "text-cream/80" : "text-muted"}`}>{r.meta}</span>}
        </li>
      ))}
    </ol>
  );
}

/** Plain-paragraph stand-in for the client project's PortableText-driven RichText. */
export function RichText({ paragraphs, className = "prose-mg" }: { paragraphs?: React.ReactNode[]; className?: string }) {
  if (!paragraphs?.length) return null;
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
