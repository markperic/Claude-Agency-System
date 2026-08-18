import type { ComponentType } from "react";

import HeroCentered from "@/registry/modules/01-hero-centered";
import HeroSplit from "@/registry/modules/02-hero-split";
import LogoCloud from "@/registry/modules/03-logo-cloud";
import FeatureGrid from "@/registry/modules/04-feature-grid";
import ContentSplit from "@/registry/modules/05-content-split";
import StatsRow from "@/registry/modules/06-stats-row";
import Testimonial from "@/registry/modules/07-testimonial";
import TestimonialGrid from "@/registry/modules/08-testimonial-grid";
import PricingGrid from "@/registry/modules/09-pricing-grid";
import FaqAccordion from "@/registry/modules/10-faq-accordion";
import TeamGrid from "@/registry/modules/11-team-grid";
import CtaBanner from "@/registry/modules/12-cta-banner";
import Newsletter from "@/registry/modules/13-newsletter";
import GalleryScroll from "@/registry/modules/14-gallery-scroll";
import Footer from "@/registry/modules/15-footer";
import HeroMacbookScroll from "@/registry/modules/16-hero-macbook-scroll";
import HeroSpotlight from "@/registry/modules/17-hero-spotlight";
import HeroAurora from "@/registry/modules/18-hero-aurora";
import HeroGrid from "@/registry/modules/19-hero-grid";
import HeroBento from "@/registry/modules/20-hero-bento";
import HeroMarquee from "@/registry/modules/21-hero-marquee";
import HeroTextGenerate from "@/registry/modules/22-hero-text-generate";
import HeroBeams from "@/registry/modules/23-hero-beams";
import HeroDeviceSplit from "@/registry/modules/24-hero-device-split";
import Hero3DTilt from "@/registry/modules/25-hero-3d-tilt";
import ContentTimeline from "@/registry/modules/26-content-timeline";
import ContentComparisonTable from "@/registry/modules/27-content-comparison-table";
import ContentTabs from "@/registry/modules/28-content-tabs";
import ContentVideoEmbed from "@/registry/modules/29-content-video-embed";
import ContentChecklistSplit from "@/registry/modules/30-content-checklist-split";
import SocialCaseStudies from "@/registry/modules/31-social-case-studies";
import SocialPress from "@/registry/modules/32-social-press";
import SocialRatingSummary from "@/registry/modules/33-social-rating-summary";
import SocialTrustBadges from "@/registry/modules/34-social-trust-badges";
import SocialVideoTestimonials from "@/registry/modules/35-social-video-testimonials";
import SocialBigStat from "@/registry/modules/36-social-big-stat";
import PricingTwoTier from "@/registry/modules/37-pricing-two-tier";
import PricingSingleHighlight from "@/registry/modules/38-pricing-single-highlight";
import PricingComparisonTable from "@/registry/modules/39-pricing-comparison-table";
import PricingToggle from "@/registry/modules/40-pricing-toggle";
import PricingEnterpriseCta from "@/registry/modules/41-pricing-enterprise-cta";
import PricingUsageSlider from "@/registry/modules/42-pricing-usage-slider";
import PricingFreemium from "@/registry/modules/43-pricing-freemium";
import PricingMinimalCentered from "@/registry/modules/44-pricing-minimal-centered";
import PricingTestimonialSidebar from "@/registry/modules/45-pricing-testimonial-sidebar";
import CtaSplitVisual from "@/registry/modules/46-cta-split-visual";
import CtaCountdown from "@/registry/modules/47-cta-countdown";
import CtaTwoChoice from "@/registry/modules/48-cta-two-choice";
import CtaTestimonialCombo from "@/registry/modules/49-cta-testimonial-combo";
import CtaSpotlight from "@/registry/modules/50-cta-spotlight";
import CtaMinimalInline from "@/registry/modules/51-cta-minimal-inline";
import CtaAppDownload from "@/registry/modules/52-cta-app-download";
import CtaContactForm from "@/registry/modules/53-cta-contact-form";
import FooterMinimalRow from "@/registry/modules/54-footer-minimal-row";
import FooterNewsletter from "@/registry/modules/55-footer-newsletter";
import FooterMegaSocial from "@/registry/modules/56-footer-mega-social";
import FooterCenteredSimple from "@/registry/modules/57-footer-centered-simple";
import FooterAppDownload from "@/registry/modules/58-footer-app-download";
import FooterDark from "@/registry/modules/59-footer-dark";
import FooterCtaStrip from "@/registry/modules/60-footer-cta-strip";
import FooterBrandTagline from "@/registry/modules/61-footer-brand-tagline";
import FooterSitemap from "@/registry/modules/62-footer-sitemap";
import HeroIlluminatedGlow from "@/registry/modules/63-hero-illuminated-glow";
import ContentCarouselCard from "@/registry/modules/64-content-carousel-card";
import GalleryAccordion from "@/registry/modules/65-gallery-accordion";
import HeroImageStream from "@/registry/modules/66-hero-image-stream";
import HeroContainerScroll from "@/registry/modules/67-hero-container-scroll";
import GalleryMorphSlider from "@/registry/modules/68-gallery-morph-slider";
import GalleryDome from "@/registry/modules/69-gallery-dome";
import ShowcaseSplitFlap from "@/registry/modules/70-showcase-split-flap";
import GalleryDepthCarousel from "@/registry/modules/71-gallery-depth-carousel";
import NavCardMenu from "@/registry/modules/72-nav-card-menu";
import FooterBoxedPanel from "@/registry/modules/73-footer-boxed-panel";
import FooterStatusConsole from "@/registry/modules/74-footer-status-console";
import FooterBoldCard from "@/registry/modules/75-footer-bold-card";
import FooterOversizedWordmark from "@/registry/modules/76-footer-oversized-wordmark";
import FooterPhotoFrame from "@/registry/modules/77-footer-photo-frame";
import ShowcaseScrollManifesto from "@/registry/modules/78-showcase-scroll-manifesto";
import ShowcaseDualMarquee from "@/registry/modules/79-showcase-dual-marquee";
import HeroStatementDark from "@/registry/modules/80-hero-statement-dark";
import StatsBarChart from "@/registry/modules/81-stats-bar-chart";
import ShowcaseBlurExit from "@/registry/modules/82-showcase-blur-exit";
import ContentResourcesStack from "@/registry/modules/84-content-resources-stack";
import CtaRotatingWordCloser from "@/registry/modules/85-cta-rotating-word";
import NavScrollChapterPill from "@/registry/modules/86-nav-scroll-chapter-pill";
import HeroCinematicCurtain from "@/registry/modules/87-hero-cinematic-curtain";
import ContentDragSlider from "@/registry/modules/88-content-drag-slider";
import StatsColumnScroller from "@/registry/modules/89-stats-column-scroller";
import GalleryCounterScrollCases from "@/registry/modules/90-gallery-counter-scroll-cases";
import ServicesTitleRotator from "@/registry/modules/91-services-title-rotator";
import ShowcasePerspectiveExpand from "@/registry/modules/92-showcase-perspective-expand";
import ContentStickySplitScroller from "@/registry/modules/93-content-sticky-split-scroller";
import TeamSplitSlider from "@/registry/modules/94-team-split-slider";
import ContactStatementForm from "@/registry/modules/95-contact-statement-form";
import LocationsTabbedPanel from "@/registry/modules/96-locations-tabbed-panel";
import NavKineticOverlay from "@/registry/modules/97-nav-kinetic-overlay";

/**
 * The full id → component lookup for every module in src/registry/modules.json.
 * Shared by every /demo category page so the import list only lives once.
 */
/*
 * `ComponentType`, not `ElementType`, and the distinction is load-bearing.
 *
 * `ElementType` also covers every key of `JSX.IntrinsicElements`. React Three
 * Fiber augments that interface globally the moment it is imported anywhere in
 * the program — which /examples/pilates-ring now does — adding ~100 three.js
 * element types to it. `<Component />` below passes no props, so it has to
 * satisfy every member of the union at once, and the intersection across that
 * many unrelated element types collapses to `never`. The error surfaces here,
 * in a file that has nothing to do with 3D.
 *
 * Every value in this map is a real React component, so narrowing the
 * annotation is both the fix and the more accurate type.
 */
export const MODULE_COMPONENTS: Record<number, ComponentType> = {
  1: HeroCentered,
  2: HeroSplit,
  3: LogoCloud,
  4: FeatureGrid,
  5: ContentSplit,
  6: StatsRow,
  7: Testimonial,
  8: TestimonialGrid,
  9: PricingGrid,
  10: FaqAccordion,
  11: TeamGrid,
  12: CtaBanner,
  13: Newsletter,
  14: GalleryScroll,
  15: Footer,
  16: HeroMacbookScroll,
  17: HeroSpotlight,
  18: HeroAurora,
  19: HeroGrid,
  20: HeroBento,
  21: HeroMarquee,
  22: HeroTextGenerate,
  23: HeroBeams,
  24: HeroDeviceSplit,
  25: Hero3DTilt,
  26: ContentTimeline,
  27: ContentComparisonTable,
  28: ContentTabs,
  29: ContentVideoEmbed,
  30: ContentChecklistSplit,
  31: SocialCaseStudies,
  32: SocialPress,
  33: SocialRatingSummary,
  34: SocialTrustBadges,
  35: SocialVideoTestimonials,
  36: SocialBigStat,
  37: PricingTwoTier,
  38: PricingSingleHighlight,
  39: PricingComparisonTable,
  40: PricingToggle,
  41: PricingEnterpriseCta,
  42: PricingUsageSlider,
  43: PricingFreemium,
  44: PricingMinimalCentered,
  45: PricingTestimonialSidebar,
  46: CtaSplitVisual,
  47: CtaCountdown,
  48: CtaTwoChoice,
  49: CtaTestimonialCombo,
  50: CtaSpotlight,
  51: CtaMinimalInline,
  52: CtaAppDownload,
  53: CtaContactForm,
  54: FooterMinimalRow,
  55: FooterNewsletter,
  56: FooterMegaSocial,
  57: FooterCenteredSimple,
  58: FooterAppDownload,
  59: FooterDark,
  60: FooterCtaStrip,
  61: FooterBrandTagline,
  62: FooterSitemap,
  63: HeroIlluminatedGlow,
  64: ContentCarouselCard,
  65: GalleryAccordion,
  66: HeroImageStream,
  67: HeroContainerScroll,
  68: GalleryMorphSlider,
  69: GalleryDome,
  70: ShowcaseSplitFlap,
  71: GalleryDepthCarousel,
  72: NavCardMenu,
  73: FooterBoxedPanel,
  74: FooterStatusConsole,
  75: FooterBoldCard,
  76: FooterOversizedWordmark,
  77: FooterPhotoFrame,
  78: ShowcaseScrollManifesto,
  79: ShowcaseDualMarquee,
  80: HeroStatementDark,
  81: StatsBarChart,
  82: ShowcaseBlurExit,
  84: ContentResourcesStack,
  85: CtaRotatingWordCloser,
  86: NavScrollChapterPill,
  87: HeroCinematicCurtain,
  88: ContentDragSlider,
  89: StatsColumnScroller,
  90: GalleryCounterScrollCases,
  91: ServicesTitleRotator,
  92: ShowcasePerspectiveExpand,
  93: ContentStickySplitScroller,
  94: TeamSplitSlider,
  95: ContactStatementForm,
  96: LocationsTabbedPanel,
  97: NavKineticOverlay,
};

/** The label bar + module pairing used on every /demo category page. */
export function ModuleRow({ id, name, category }: { id: number; name: string; category: string }) {
  const Component = MODULE_COMPONENTS[id];
  return (
    <div>
      <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-2.5 font-mono text-xs text-zinc-500">
        Module {String(id).padStart(2, "0")} — {name}
        <span className="text-zinc-400"> · {category}</span>
      </div>
      <Component />
    </div>
  );
}
