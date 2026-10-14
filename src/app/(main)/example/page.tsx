import { SiteNav } from "@/components/site-nav";
import HeroSplit from "@/registry/modules/02-hero-split";
import FeatureGrid from "@/registry/modules/04-feature-grid";
import ContentSplit from "@/registry/modules/05-content-split";
import StatsRow from "@/registry/modules/06-stats-row";
import TestimonialGrid from "@/registry/modules/08-testimonial-grid";
import PricingGrid from "@/registry/modules/09-pricing-grid";
import GalleryScroll from "@/registry/modules/14-gallery-scroll";
import CtaBanner from "@/registry/modules/12-cta-banner";
import Footer from "@/registry/modules/15-footer";

/**
 * Worked example — a full page assembled the way this repo is meant to be
 * used: "use module 2 at the top, then 4, then 5 with its title on effect B,
 * then 6, 8, 9, 14 with scroll animation on the images, then 12 and 15."
 *
 * Every section below is just an import and a line in this list — nothing
 * here is hand-designed one-off; it's all pulled from src/registry/modules.
 * See MODULE-LIBRARY.md for the full catalog and the convention this follows.
 *
 * This used to be the homepage; the catalog index took over that slot once
 * the module count grew past the point where one demo composition could
 * represent the whole system. Kept here at /example since MODULE-LIBRARY.md
 * and README.md still point to it as the worked example.
 */
export default function ExamplePage() {
  return (
    <main className="bg-white">
      <SiteNav />

      <HeroSplit />
      <FeatureGrid />
      <ContentSplit />
      <StatsRow />
      <TestimonialGrid />
      <PricingGrid />
      <GalleryScroll />
      <CtaBanner />
      <Footer />
    </main>
  );
}
