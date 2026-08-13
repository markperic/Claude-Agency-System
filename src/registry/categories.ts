/**
 * The seven module categories, in the order they should appear everywhere —
 * the homepage's category grid and the site nav both read from this list so
 * the two never drift out of sync.
 */
export const CATEGORIES: { slug: string; navLabel: string; title: string; description: string }[] = [
  { slug: "hero", navLabel: "Hero", title: "Hero sections", description: "Opening sections — the first thing a visitor sees." },
  { slug: "content", navLabel: "Content", title: "Content sections", description: "Feature grids, content splits, FAQs, carousels." },
  { slug: "galleries", navLabel: "Galleries", title: "Galleries", description: "Image-forward sections for showing off a body of work." },
  { slug: "social-proof", navLabel: "Social Proof", title: "Social proof", description: "Logos, stats, testimonials, team grids." },
  { slug: "pricing", navLabel: "Pricing", title: "Pricing sections", description: "Tiered plan comparisons." },
  { slug: "cta", navLabel: "CTA", title: "Calls to action", description: "Closing banners and signup forms." },
  { slug: "footer", navLabel: "Footer", title: "Footers", description: "Site-wide navigation and legal links." },
];
