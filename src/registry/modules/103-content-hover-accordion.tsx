"use client";

import { useId, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PLACEHOLDER_IMAGES } from "@/registry/lib/placeholder-images";
import { RiseTitle } from "@/registry/lib/rise-title";

/**
 * Module 103 — Content, Hover Accordion with Picture
 * A services section: a big title across the top, then a statement and a
 * picture on the left and, on the right, a stack of ruled rows that open when
 * you hover them — each with a + that turns into a − as it opens. The picture
 * follows the open row, crossfading as you switch.
 *
 * Modelled on the disciplines accordion at wulfe.company/disciplines, and
 * lifted from a client's "What we do" services section, with the copy, photos
 * and brand colours replaced by neutral defaults — everything client-specific
 * is a prop.
 *
 * Behaviour:
 *   - one row is open at a time — opening a row closes the one that was open;
 *   - the panel's height animates open and closed (~0.3s, ease-out) while the
 *     icon swaps + for −;
 *   - rows open on hover: moving a mouse onto a row opens it, and the open row
 *     stays open when the pointer leaves, so the accordion never empties
 *     itself;
 *   - keyboard and touch can't hover, so for them pressing a row toggles it. A
 *     mouse press is ignored — hover already opened the row, and a click that
 *     closed it again would fight the hover.
 *
 * The stack is bottom-aligned with the picture, so an opening row grows upward
 * from a fixed bottom edge. That is what makes hover-to-open safe: the pointer
 * stays inside the row it just opened, so layout shifting under a still
 * pointer can't hand the hover to a neighbour and make it flicker.
 *
 * All the pictures stay mounted (stacked, with only opacity changing) so
 * switching never waits on a download. An image with `fit: "contain"` plus a
 * matching `bg` is shown whole on a flat panel instead of cropped; .gif/.webp
 * images are `unoptimized` so Next doesn't flatten an animation.
 *
 * The title is `RiseTitle` (`@/registry/lib/rise-title`): it rises from an
 * invisible horizon as it scrolls into view.
 */

export type HoverAccordionService = {
  name: string;
  tagline: string;
  points: string[];
  image: {
    src: string;
    alt: string;
    /** "cover" (default) fills the panel; "contain" shows the whole image. */
    fit?: "cover" | "contain";
    /** Panel colour behind the image — matters for "contain". */
    bg?: string;
  };
};

const DEFAULT_SERVICES: HoverAccordionService[] = [
  {
    name: "Strategy",
    tagline: "Where you’re headed",
    points: ["Research + Discovery", "Positioning", "Roadmaps", "Measurement"],
    image: { ...PLACEHOLDER_IMAGES.portrait07, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Design",
    tagline: "How you look",
    points: [
      "Identity Systems",
      "Interface Design",
      "Illustration",
      "Motion Design",
      "Packaging",
      "Presentation Design",
      "Design Guidelines",
    ],
    image: { ...PLACEHOLDER_IMAGES.wallpaperPortrait03, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Production",
    tagline: "How it gets made",
    points: ["Photography", "Videography", "Print + Finishing", "Installation", "Prototyping"],
    image: { ...PLACEHOLDER_IMAGES.portrait05, fit: "cover", bg: "#e4e4e7" },
  },
  {
    name: "Growth",
    tagline: "How you’re found",
    points: [
      "Campaign Planning",
      "Social Media",
      "Paid Advertising",
      "Email Marketing",
      "Community",
      "SEO",
      "Analytics + Reporting",
    ],
    image: { ...PLACEHOLDER_IMAGES.portrait02, fit: "cover", bg: "#e4e4e7" },
  },
];

const DEFAULT_STATEMENT =
  "We bring strategy, design, production and growth together to turn potential into impact.";
const DEFAULT_FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** + that turns into − : the vertical bar shrinks away as the row opens. */
function ToggleIcon({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="shrink-0">
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="6"
        y1="1"
        x2="6"
        y2="11"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{
          transformOrigin: "6px 6px",
          transform: open ? "scaleY(0)" : "scaleY(1)",
          transition: reduceMotion ? "none" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </svg>
  );
}

export type ContentHoverAccordionProps = {
  /** The rows, in order. Default: four sample services with placeholder photos. */
  services?: HoverAccordionService[];
  /** The big title, one entry per word group that rises separately. */
  title?: string[];
  /** The line of copy above the picture. */
  statement?: string;
  /** Title (and row-title) colour. */
  accent?: string;
  /** Statement, panel text and rule colour. */
  ink?: string;
  /** Section background. */
  background?: string;
  /** CSS font-family stack. */
  fontFamily?: string;
  /** Widest line of the title in ems (see RiseTitle). Default 7. */
  titleFit?: number;
  /** Optional element id, for in-page nav links. */
  id?: string;
  /** Optional `data-nav-theme` value for sites whose fixed header reads it. */
  navTheme?: string;
};

export default function ContentHoverAccordion({
  services = DEFAULT_SERVICES,
  title = ["Our", "services"],
  statement = DEFAULT_STATEMENT,
  accent = "#1d4ed8",
  ink = "#18181b",
  background = "#f5f4f1",
  fontFamily = DEFAULT_FONT_FAMILY,
  titleFit = 7,
  id,
  navTheme,
}: ContentHoverAccordionProps = {}) {
  const reduceMotion = useReducedMotion() ?? false;
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  // The picture follows the last row that was open, so closing a row doesn't blank it.
  const [shown, setShown] = useState(0);

  const activate = (i: number) => {
    setOpen(i);
    setShown(i);
  };

  // Keyboard and touch can't hover, so for them a press still toggles the row.
  // A mouse press does nothing: hovering already opened the row, and treating
  // the click as a toggle would close it again the moment you clicked it.
  const press = (i: number, e: ReactMouseEvent<HTMLButtonElement>) => {
    if ((e.nativeEvent as PointerEvent).pointerType === "mouse") return;
    if (open === i) setOpen(null);
    else activate(i);
  };

  const ease = [0.22, 1, 0.36, 1] as const;
  const duration = reduceMotion ? 0 : 0.3;

  const vars = {
    "--acc-accent": accent,
    "--acc-ink": ink,
    background,
    color: ink,
    fontFamily,
  } as CSSProperties;
  const current = services[Math.min(shown, services.length - 1)];

  return (
    <section id={id} data-nav-theme={navTheme} style={vars}>
      {/* Full-width above the 1200px grid so the title can be that large. */}
      <div className="px-6 pt-24 text-center sm:pt-32 min-[981px]:px-16">
        <RiseTitle words={title} fit={titleFit} style={{ color: accent }} />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-24 sm:pt-20 sm:pb-32 min-[981px]:px-16">
        <div className="grid gap-y-14 min-[820px]:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] min-[820px]:gap-x-16">
          {/* Left: the statement, then the picture. */}
          <div>
            <p className="max-w-[20em] text-[clamp(1.125rem,1.4vw,1.5rem)] leading-[1.25] font-medium tracking-tight">
              {statement}
            </p>

            <div className="mt-12 min-[820px]:mt-16">
              <div
                className="relative aspect-[4/5] w-[68%] max-w-[360px] overflow-hidden rounded-[8px] transition-colors duration-500 min-[820px]:w-[min(100%,340px)]"
                style={{ backgroundColor: current.image.bg ?? "#e4e4e7" }}
              >
                {services.map((service, i) => (
                  <Image
                    key={service.name}
                    src={service.image.src}
                    alt={i === shown ? service.image.alt : ""}
                    aria-hidden={i !== shown}
                    fill
                    sizes="(min-width: 820px) 340px, 70vw"
                    unoptimized={/\.(gif|webp)$/.test(service.image.src)}
                    className={`transition-opacity duration-500 ${
                      service.image.fit === "contain" ? "object-contain" : "object-cover"
                    } ${i === shown ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: the accordion, bottom-aligned with the picture so an opening row grows upward. */}
          <div className="flex flex-col justify-end">
            <ul className="border-t border-(--acc-ink)">
              {services.map((service, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-panel-${i}`;
                const buttonId = `${baseId}-button-${i}`;
                return (
                  <li
                    key={service.name}
                    className="border-b border-(--acc-ink)"
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") activate(i);
                    }}
                  >
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={(e) => press(i, e)}
                        className="flex w-full cursor-pointer items-center justify-between gap-6 px-2 py-[14px] text-left text-[15px] font-extrabold tracking-[0.04em] text-(--acc-accent) uppercase"
                      >
                        {service.name}
                        <ToggleIcon open={isOpen} reduceMotion={reduceMotion} />
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="panel"
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration, ease }}
                          className="overflow-hidden"
                        >
                          <div className="px-2 pt-2 pb-6">
                            <p className="text-base font-semibold">{service.tagline}</p>
                            <ul className="mt-4 text-base leading-6">
                              {service.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
