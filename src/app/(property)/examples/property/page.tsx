import { Footer } from "@/showcase/property/components/layout/Footer";
import { CardSlider } from "@/showcase/property/components/sections/CardSlider";
import { CtaList } from "@/showcase/property/components/sections/CtaList";
import { Faq } from "@/showcase/property/components/sections/Faq";
import { GridInfo } from "@/showcase/property/components/sections/GridInfo";
import { Hero } from "@/showcase/property/components/sections/Hero";
import { Slideshow } from "@/showcase/property/components/sections/Slideshow";
import { StickyFeatures } from "@/showcase/property/components/sections/StickyFeatures";
import { Testimonials } from "@/showcase/property/components/sections/Testimonials";
import * as content from "@/showcase/property/content";

export default function Home() {
  return (
    <>
      <main>
        <Hero content={content.hero} />
        <StickyFeatures content={content.features} />
        <CardSlider content={content.slider} />
        <GridInfo content={content.gridInfo} />
        <Slideshow content={content.slideshow} />
        <CtaList id="enquire" content={content.ctaPrimary} />
        <Testimonials content={content.testimonials} />
        <Faq content={content.faq} />
      </main>
      <Footer content={content.footer} />
    </>
  );
}
