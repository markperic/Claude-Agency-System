import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import HeroStatementDark from "@/registry/modules/80-hero-statement-dark";
import NavScrollChapterPill from "@/registry/modules/86-nav-scroll-chapter-pill";
import StatsBarChart from "@/registry/modules/81-stats-bar-chart";
import ShowcaseBlurExit from "@/registry/modules/82-showcase-blur-exit";
import ShowcaseScrollManifesto from "@/registry/modules/78-showcase-scroll-manifesto";
import ContentResourcesStack from "@/registry/modules/84-content-resources-stack";
import FaqAccordion from "@/registry/modules/10-faq-accordion";
import CtaRotatingWordCloser from "@/registry/modules/85-cta-rotating-word";

/**
 * Example page 1 — "Real Design Wins"
 * A full page assembled from the module catalog, replicating the layout of
 * https://realfood.gov/ reskinned from food to design — the "processed
 * food vs. real food" contrast becomes "generic templates vs. real,
 * crafted design," a callback to this project's own conversation about the
 * "SaaS-y tell." Every section below is a numbered catalog module like any
 * other page in this repo (see MODULE-LIBRARY.md); modules 78 and 10 are
 * reused as-is from the Showcase and FAQs categories — 78's existing copy
 * already reads as a design philosophy statement, and 10's ("Can I add my
 * own modules?") is literally about the module system this page is built
 * from. The `id` on each wrapper below is what module 86's chapter pill
 * scans as you scroll to decide which chapter label to show.
 */
export default function DesignManifestoPage() {
  return (
    <main>
      <SiteNav />
      <HeroStatementDark />
      <NavScrollChapterPill />

      <div id="state-of-design">
        <StatsBarChart />
      </div>

      <div id="the-solution">
        <ShowcaseBlurExit />
      </div>

      <div id="manifesto">
        <ShowcaseScrollManifesto />
      </div>

      <div id="resources">
        <ContentResourcesStack />
      </div>

      <div id="faqs">
        <FaqAccordion />
      </div>

      <CtaRotatingWordCloser />
      <SiteFooter />
    </main>
  );
}
