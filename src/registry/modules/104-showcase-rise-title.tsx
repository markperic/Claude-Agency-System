"use client";

import type { CSSProperties } from "react";
import { RiseTitle } from "@/registry/lib/rise-title";

/**
 * Module 104 — Showcase, Rise Title
 * A big section title that rises out of an invisible horizon as it scrolls
 * into view, with an optional line of copy under it. The title is a single
 * row of caps, sized from its container so it fills the width at any viewport
 * (see `fit` below); each word starts hidden under the heading's bottom edge
 * and rises into place — the first word leading, the next a beat behind —
 * driven by scroll position, so it plays forwards and backwards with the page.
 *
 * The animation itself lives in `@/registry/lib/rise-title` (`RiseTitle`) so
 * other modules can use it for their own headings — module 103 does. This
 * module is the standalone section: the title plus room to scroll it in.
 * Lifted from a client's "What we do" section and reused for its other section
 * titles; client copy and brand colours are replaced with neutral defaults.
 *
 * Extra-bold caps at -0.06em tracking are the look this was built for (it is
 * baked into `RiseTitle`); weight and tracking can be changed there, but `fit`
 * then needs retuning, since it is the title's widest line in ems at that
 * weight and tracking.
 */

export type ShowcaseRiseTitleProps = {
  /** The title, one entry per word group that rises separately. Default ["Our", "work"]. */
  words?: string[];
  /** Optional line of copy under the title. */
  subhead?: string;
  /** Widest line of the title in ems at this weight and tracking (font size = container width / fit). Default 6 suits "OUR WORK"; "OUR PARTNERS" needs ~7. */
  fit?: number;
  /** Title colour. */
  accent?: string;
  /** Subhead colour. */
  ink?: string;
  /** Section background. */
  background?: string;
  /** CSS font-family stack. */
  fontFamily?: string;
  /** Optional element id, for in-page nav links. */
  id?: string;
  /** Optional `data-nav-theme` value for sites whose fixed header reads it. */
  navTheme?: string;
};

export default function ShowcaseRiseTitle({
  words = ["Our", "work"],
  subhead = "Each word rises out of the title's bottom edge as it scrolls into view.",
  fit = 6,
  accent = "#1d4ed8",
  ink = "#18181b",
  background = "#f5f4f1",
  fontFamily = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  id,
  navTheme,
}: ShowcaseRiseTitleProps = {}) {
  const vars = { background, color: ink, fontFamily } as CSSProperties;
  return (
    <section id={id} data-nav-theme={navTheme} style={vars} className="px-6 py-[30vh] text-center min-[981px]:px-16">
      <RiseTitle words={words} fit={fit} style={{ color: accent }} />
      {subhead ? <p className="mx-auto mt-10 max-w-xl text-lg">{subhead}</p> : null}
    </section>
  );
}
