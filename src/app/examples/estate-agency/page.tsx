import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import HeroCinematicCurtain from "@/registry/modules/87-hero-cinematic-curtain";
import NavScrollChapterPill from "@/registry/modules/86-nav-scroll-chapter-pill";
import ContentDragSlider from "@/registry/modules/88-content-drag-slider";
import StatsColumnScroller from "@/registry/modules/89-stats-column-scroller";
import GalleryCounterScrollCases from "@/registry/modules/90-gallery-counter-scroll-cases";
import ServicesTitleRotator from "@/registry/modules/91-services-title-rotator";
import ShowcasePerspectiveExpand from "@/registry/modules/92-showcase-perspective-expand";
import ShowcaseDualMarquee from "@/registry/modules/79-showcase-dual-marquee";
import ContentStickySplitScroller from "@/registry/modules/93-content-sticky-split-scroller";
import TeamSplitSlider from "@/registry/modules/94-team-split-slider";
import ContactStatementForm from "@/registry/modules/95-contact-statement-form";
import LocationsTabbedPanel from "@/registry/modules/96-locations-tabbed-panel";

const CHAPTERS = [
  { id: "about", label: "About" },
  { id: "numbers", label: "By The Numbers" },
  { id: "work", label: "Cases" },
  { id: "services", label: "Services" },
  { id: "why-us", label: "Why Us" },
  { id: "partnership", label: "Partnership" },
  { id: "team", label: "Team" },
  { id: "contact", label: "Contact" },
  { id: "locations", label: "Locations" },
];

/**
 * Example page 2 — "Estate Agency"
 * A wireframe of the scroll architecture used by high-end property agency
 * sites (fame-estate.com as the reference): a long cinematic opening
 * sequence, then an alternating rhythm of pinned scroll-scrubbed sections
 * and normal-flow ones, closing on contact and locations.
 *
 * The point of this page is the *framework* — pin lengths, scrub ranges,
 * and the light/dark alternation — not the copy or the photography, both of
 * which are placeholders meant to be swapped (images all come from
 * PLACEHOLDER_IMAGES, so a real photo library is a one-file change).
 *
 * Section rhythm, which is most of why the reference reads as expensive:
 *   pinned/dark → flow/light → pinned/dark → pinned/dark → flow/dark →
 *   pinned/dark → flow/light → flow/light → flow/dark → flow/light → dark
 * Two pinned sections never sit back to back without the eye getting a
 * flow section or a colour flip in between, and every pin front-loads its
 * travel so there's a hold before it releases.
 *
 * Every section is a numbered catalog module (see MODULE-LIBRARY.md);
 * modules 79 and 86 are reused as-is from the Showcase and Nav categories.
 * The `id` on each wrapper is what module 86's chapter pill scans.
 */
export default function EstateAgencyPage() {
  return (
    <main className="bg-[#0a0a0a]">
      <SiteNav />

      <HeroCinematicCurtain />
      <NavScrollChapterPill chapters={CHAPTERS} mobileAlign="end" />

      <div id="about">
        <ContentDragSlider />
      </div>

      <div id="numbers">
        <StatsColumnScroller />
      </div>

      <div id="work">
        <GalleryCounterScrollCases />
      </div>

      <div id="services">
        <ServicesTitleRotator />
      </div>

      <div id="why-us">
        <ShowcasePerspectiveExpand />
      </div>

      <ShowcaseDualMarquee />

      <div id="partnership">
        <ContentStickySplitScroller />
      </div>

      <div id="team">
        <TeamSplitSlider />
      </div>

      <ContactStatementForm id="contact" />

      <div id="locations">
        <LocationsTabbedPanel />
      </div>

      <SiteFooter />
    </main>
  );
}
