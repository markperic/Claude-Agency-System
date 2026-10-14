// All copy, links and media live here. Components take these as props and
// contain no hard-coded text — swapping this file (and /public assets) is
// enough to change the site.
//
// This is a template: "Willow Gardens" by "Property Group" is a fictional
// villa development. The layout began as a real development's site; its
// name, address, phone, people, photography and links are all gone.
//
// Media: leave `src` unset to get a flat gradient placeholder in `tone`.
// Set `src` to a file in /public (e.g. "/showcase/property/pool.webp") to use a
// real asset.

import type { IconName } from "@/showcase/property/components/ui/Icon";

export type Tone = "dusk" | "ember" | "stone" | "steel" | "sage" | "sand" | "amber" | "brand";
export type MediaContent =
  | { kind: "image" | "video"; src?: string; poster?: string; alt: string; tone: Tone }
  | { kind: "youtube"; id: string; alt: string; tone: Tone };
export type NavLink = { label: string; href: string };

const P = (name: string) => `/showcase/property/photos/${name}.webp`;
const image = (tone: Tone, alt = "Placeholder image", src?: string): MediaContent => ({ kind: "image", alt, tone, src });

/** Where the template's own enquiry section is. */
const ENQUIRE = "#enquire";
const PHONE = { label: "0400 000 000", href: "tel:+61400000000" };

/* ---------------------------------------------------------------- site */

export const site = {
  name: "Willow Gardens Luxury Villas — Property Group",
  description:
    "A limited collection of 24 private, free standing luxury villas in a secure gated sanctuary.",
  lang: "en-AU",
};

/* -------------------------------------------------------------- header */

export type HeaderContent = {
  logo: { label: string; href: string };
  links: NavLink[];
  dropdown: { label: string; items: NavLink[]; media: MediaContent };
  /** Round icon button next to the main call to action. */
  account: NavLink & { icon: IconName };
  cta: NavLink;
  menuLabel: string;
  closeLabel: string;
};

export const header: HeaderContent = {
  logo: { label: "Property Group", href: "/examples/property" },
  links: [
    { label: "Our Luxury Villas", href: "#villas" },
    { label: "Location", href: "#location" },
  ],
  dropdown: {
    label: "More",
    items: [
      { label: "Lifestyle", href: "#features" },
      { label: "Amenities", href: "#info" },
      { label: "FAQ", href: "#faq" },
    ],
    media: image("sage"),
  },
  account: { label: `Call ${PHONE.label}`, href: PHONE.href, icon: "phone" },
  cta: { label: "Enquiry Here", href: ENQUIRE },
  menuLabel: "Menu",
  closeLabel: "Close menu",
};

/* ---------------------------------------------------------------- hero */

export type HeroContent = {
  /** Visually hidden page heading. */
  heading: string;
  /** Three display phrases: left, centre, right. They slide together on scroll. */
  titles: [string, string, string];
  description: string[];
  /** Bottom-right block: optional star row above one or more short lines. */
  aside: { stars?: number; lines: string[] };
  background: MediaContent;
  video: MediaContent;
  player: { playLabel: string; pauseLabel: string; muteLabel: string; unmuteLabel: string };
};

export const hero: HeroContent = {
  heading: "Discover Your Luxury Retreat Today",
  titles: ["Discover", "your luxury", "retreat today."],
  description: ["Only a few villas remain in Stage 1", "Completion estimated late 2027"],
  aside: { lines: ["24 private luxury villas", "1 Example Avenue, Your Suburb"] },
  // Photo slots: leave `src` unset for a gradient placeholder.
  background: { kind: "image", src: P("hero"), alt: "Willow Gardens Luxury Villas", tone: "dusk" },
  video: { kind: "video", src: "/showcase/property/hero.mp4", poster: "/showcase/property/hero-poster.webp", alt: "Flythrough of Willow Gardens Luxury Villas", tone: "ember" },
  player: { playLabel: "Play video", pauseLabel: "Pause video", muteLabel: "Mute video", unmuteLabel: "Unmute video" },
};

/* ------------------------------------------------------------ features */

export type FeaturesContent = {
  intro: { title: string; description: string; cta: NavLink; media: MediaContent };
  items: { title: string; lines: string[]; media: MediaContent }[];
};

export const features: FeaturesContent = {
  intro: {
    title: "A completely\nnew way\nof living",
    description:
      "Luxury resort-style comfort combined with the freedom to keep your favourite Caravan, RV, boat, or jet ski close at hand.",
    cta: { label: "Register your Interest", href: "#enquire" },
    media: { kind: "image", src: P("beach"), alt: "Resort pool and clubhouse at Willow Gardens", tone: "stone" },
  },
  items: [
    {
      title: "Lifestyle & community",
      lines: ["Gated and secure community", "Pet-friendly lifestyle", "Owner-occupied", "No deferred management fees"],
      media: { kind: "image", src: P("entry"), alt: "Gated entry to Willow Gardens", tone: "sage" },
    },
    {
      title: "Resort-style amenities",
      lines: ["Outdoor heated pool", "Gym and yoga studio", "Outdoor BBQ facilities", "Central garden resort"],
      media: { kind: "image", src: P("terrace"), alt: "Poolside deck at Willow Gardens", tone: "steel" },
    },
    {
      title: "Caravan & boat parking",
      lines: ["Caravan, RV, or Boat parking", "Available to 50% of our villas", "Power outlet to your bay", "No ongoing levies or hidden costs"],
      media: { kind: "image", src: P("beach2"), alt: "Aerial view of Willow Gardens with caravan and boat parking", tone: "sand" },
    },
  ],
};

/* -------------------------------------------------------------- slider */

export type SliderContent = {
  title: string;
  cards: { title: string; link: NavLink; media: MediaContent }[];
  cta: NavLink;
  dotLabel: string;
  /** Advance one card every N seconds. Pauses on hover, while dragging and off-screen. 0 or omitted = off. */
  autoplaySeconds?: number;
};

const villasLink = { label: "Our luxury villas", href: "#villas" };

export const slider: SliderContent = {
  title: "Five exterior designs, two bespoke interiors",
  cards: [
    { title: "Earth Scheme", link: villasLink, media: { kind: "image", src: P("interior"), alt: "Earth Scheme interior", tone: "sand" } },
    { title: "Sky Scheme", link: villasLink, media: { kind: "image", src: P("cliff"), alt: "Sky Scheme interior", tone: "steel" } },
    { title: "Type A", link: villasLink, media: { kind: "image", src: P("white-sky"), alt: "Villa Type A exterior", tone: "stone" } },
    { title: "Type B", link: villasLink, media: { kind: "image", src: P("teal-a"), alt: "Villa Type B exterior", tone: "stone" } },
    { title: "Type C", link: villasLink, media: { kind: "image", src: P("teal-b"), alt: "Villa Type C exterior", tone: "stone" } },
    { title: "Type D", link: villasLink, media: { kind: "image", src: P("tall"), alt: "Villa Type D exterior", tone: "stone" } },
    { title: "Type E", link: villasLink, media: { kind: "image", src: P("beach"), alt: "Villa Type E exterior", tone: "stone" } },
  ],
  cta: { label: "Our Luxury Villas", href: villasLink.href },
  dotLabel: "Go to slide",
  autoplaySeconds: 5,
};

/* ----------------------------------------------------------- info grid */

export type GridInfoContent = {
  title: string;
  description: string;
  /** Four tiles: wide, narrow / narrow, wide on desktop. */
  items: { label: string; media: MediaContent }[];
};

export const gridInfo: GridInfoContent = {
  title: "A lifestyle of leisure and wellbeing",
  description: "Every detail is designed to evoke the atmosphere of a luxury resort, right at your doorstep.",
  items: [
    { label: "Serene pool", media: image("stone", "Pool", P("teal-a")) },
    { label: "Private gym", media: image("stone", "Gym", P("interior")) },
    { label: "Yoga studio", media: image("stone", "Yoga studio", P("cliff")) },
    { label: "Communal BBQ area", media: image("stone", "BBQ area", P("white-sky")) },
  ],
};

/* ----------------------------------------------------------- slideshow */

export type SlideshowContent = {
  title: string;
  items: { label: string; media: MediaContent }[];
};

export const slideshow: SlideshowContent = {
  title: "Thoughtfully designed for discerning downsizers",
  items: [
    { label: "Freehold strata title", media: image("stone", "Villa exterior", P("teal-b")) },
    { label: "Buy and sell on the open market", media: image("stone", "Villa interior", P("interior")) },
    { label: "No deferred management fees", media: image("stone", "Community", P("beach2")) },
    { label: "Flexible floor plans", media: image("stone", "Floor plan", P("tall")) },
  ],
};

/* ------------------------------------------------------------ CTA list */

export type CtaListContent = {
  title: string;
  cards: { media: MediaContent; cta: NavLink }[];
};

export const ctaPrimary: CtaListContent = {
  title: "Register your Interest",
  cards: [
    { media: image("stone", "Plans and price list", P("beach")), cta: { label: "Request plans and price list", href: ENQUIRE } },
    { media: image("sage", "Virtual display", P("teal-b")), cta: { label: "Book your appointment", href: ENQUIRE } },
  ],
};

export const ctaSecondary: CtaListContent = {
  title: "Visit our Virtual Display",
  cards: [
    { media: image("steel", "Virtual display suite", P("card")), cta: { label: "Book your appointment", href: ENQUIRE } },
    { media: image("stone", "Contact", P("hero")), cta: { label: `Call ${PHONE.label}`, href: PHONE.href } },
  ],
};

/* -------------------------------------------------------- testimonials */
// There are no customer testimonials yet, so these cards carry the
// project's own statements. Add `stars` to a card to show a star row.

export type TestimonialsContent = {
  title: string;
  label: string;
  background: MediaContent;
  items: { name: string; stars?: number; quote: string }[];
};

export const testimonials: TestimonialsContent = {
  title: "Downsize without compromise",
  label: "Willow Gardens",
  background: image("brand", "Willow Gardens", P("white-sky")),
  items: [
    {
      name: "Our vision",
      quote:
        "“We created an innovative resort for a vibrant generation who refuse to settle for outdated lifestyles.”",
    },
    {
      name: "Stage 1",
      quote: "Only a few villas remain in Stage 1, with completion now estimated for late 2027.",
    },
    {
      name: "24 villas",
      quote:
        "A limited collection of 24 private and free standing luxury villas set within a secure gated resort-style sanctuary.",
    },
    {
      name: "Freehold",
      quote:
        "You own your villa and land as freehold, sharing the common areas through the body corporate.",
    },
    {
      name: "Adaptable",
      quote:
        "Generous villas and flexible floor plans allow for future adaptability, including in-home care.",
    },
  ],
};

/* ----------------------------------------------------------------- FAQ */
// Template answers: a placeholder FAQ for a downsizer villa community.

export type FaqContent = {
  title: string;
  items: { question: string; answer: string }[];
};

export const faq: FaqContent = {
  title: "FAQ",
  items: [
    {
      question: "Who is Willow Gardens designed for?",
      answer:
        "Willow Gardens has been thoughtfully designed for discerning downsizers—particularly those over 50—who value a high-quality, resort-style community without the restrictions.",
    },
    {
      question: "Is Willow Gardens limited to over-50s?",
      answer:
        "While not limited exclusively to over-50s, this is our target market, and the community is designed to attract like-minded, owner-occupier residents—people who want to downsize without compromise.",
    },
    {
      question: "What title are the villas offered under?",
      answer:
        "The villas are offered under Freehold Strata Title. This means you own your villa and land as freehold, while also sharing ownership and responsibility for the common areas through the body corporate. It provides the best of both worlds: the security and autonomy of freehold ownership with the benefits of shared maintenance of community facilities.",
    },
    {
      question: "Are there deferred management fees?",
      answer:
        "Here, you enjoy the freedom to buy and sell on the open market, with no deferred management fees, additional charges, or restrictive rules.",
    },
    {
      question: "How many bedrooms do the villas have?",
      answer: "3 Bedrooms plus Multi-Purpose Room (MPR) or 4 bedrooms (your choice).",
    },
    {
      question: "Can I personalise my villa?",
      answer:
        "Willow Gardens presents a choice of five distinctive exterior designs and two bespoke interior schemes. Our interior designer has curated two distinct style palettes. The Earth Scheme embraces warm, natural tones for a grounded, inviting feel, while the Sky Scheme features cooler hues for a sleek, contemporary atmosphere.",
    },
    {
      question: "Can I keep my caravan or boat on site?",
      answer:
        "At Willow Gardens, select villas offer the rare advantage of dedicated caravan and boat parking. As an optional upgrade, you can secure your exclusive caravan or boat parking bay, complete with a power outlet for added convenience.",
    },
    {
      question: "Is there room for a live-in carer?",
      answer:
        "With additional bedrooms and ample internal space, there is also capacity to accommodate a live-in carer or caretaker, providing long-term flexibility without compromising independence or ownership.",
    },
    {
      question: "When will Stage 1 be complete?",
      answer: "Completion now estimated late 2027 for Stage 1.",
    },
  ],
};

/* -------------------------------------------------------------- footer */

export type FooterContent = {
  photo: MediaContent;
  menu: { label: string; links: NavLink[] };
  address: { label: string; text: string };
  contact: { label: string; email: NavLink; phone: NavLink };
  social: { label: string; links: (NavLink & { icon: IconName })[] };
  actions: { label: string; buttons: NavLink[] };
  /** Second address block at the bottom of the last column. */
  note?: { label: string; text: string };
  legal: NavLink[];
};

export const footer: FooterContent = {
  photo: image("sage", "Willow Gardens Luxury Villas", P("hero")),
  menu: {
    label: "Menu",
    links: [
      { label: "Our Luxury Villas", href: "#villas" },
      { label: "Lifestyle", href: "#features" },
      { label: "Amenities", href: "#info" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  address: { label: "Willow Gardens Location", text: "1 Example Avenue\nYour Suburb, 4000" },
  contact: {
    label: "Contact",
    email: { label: "hello@propertygroup.example", href: "mailto:hello@propertygroup.example" },
    phone: PHONE,
  },
  social: {
    label: "Follow",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/", icon: "social-a" },
      { label: "Facebook", href: "https://www.facebook.com/", icon: "social-b" },
    ],
  },
  actions: {
    label: "Enquiry",
    buttons: [
      { label: "Enquiry Here", href: ENQUIRE },
      { label: "Our Villas", href: "#villas" },
    ],
  },
  note: { label: "Virtual Display Location", text: "2 Example Street, Your Suburb, 4000\nProperty Group Office" },
  legal: [],
};
