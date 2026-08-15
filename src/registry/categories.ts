/**
 * The module categories, in the order they should appear everywhere — the
 * homepage's category grid and the site nav both read from this list so the
 * two never drift out of sync.
 */
export const CATEGORIES: { slug: string; navLabel: string; title: string; description: string }[] = [
  { slug: "nav", navLabel: "Nav", title: "Nav", description: "Site headers and floating navigation menus." },
  { slug: "hero", navLabel: "Hero", title: "Hero sections", description: "Opening sections — the first thing a visitor sees." },
  { slug: "content", navLabel: "Content", title: "Content sections", description: "Feature grids, content splits, carousels." },
  { slug: "galleries", navLabel: "Galleries", title: "Galleries", description: "Image-forward sections for showing off a body of work." },
  { slug: "showcase", navLabel: "Showcase", title: "Showcase", description: "Larger animated set pieces, like the scroll-linked Macbook reveal." },
  { slug: "team", navLabel: "Team", title: "Team", description: "Sections for introducing the people behind the work." },
  { slug: "social-proof", navLabel: "Social Proof", title: "Social proof", description: "Logos, testimonials, case studies, trust badges." },
  { slug: "stats", navLabel: "Stats", title: "Stats", description: "Numbers-forward sections for metrics worth bragging about." },
  { slug: "pricing", navLabel: "Pricing", title: "Pricing sections", description: "Tiered plan comparisons." },
  { slug: "cta", navLabel: "CTAs", title: "Calls to action", description: "Closing banners for the bottom of a page." },
  { slug: "forms", navLabel: "Forms", title: "Forms", description: "Contact and signup forms." },
  { slug: "faqs", navLabel: "FAQs", title: "FAQs", description: "Expandable question lists." },
  { slug: "utility", navLabel: "Utility", title: "Utility", description: "404s, success states, thank-you pages, and other one-off utility screens." },
  { slug: "footer", navLabel: "Footer", title: "Footers", description: "Site-wide navigation and legal links." },
];
