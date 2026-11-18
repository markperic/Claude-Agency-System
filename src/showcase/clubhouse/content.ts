// All copy and image references live here — components take these as props.
//
// This is a template: "The Clubhouse" in the fictional suburb of Brindabank is
// a made-up community sports and social club. The design, the page's section
// sequence and every photo were ported from a real club-website client
// project's actual current home page; the name, location, club names, prices
// and figures below are invented so no real club, address or phone number is
// implied. Nav links, the booking CTA and the "See everything on" events link
// point to "#" or the page's own booking section — this is a single static
// page with no sub-routes or booking backend to link to.

import type { Chapter } from "@/showcase/clubhouse/components/showcase/Chapters";
import type { ArcItem } from "@/showcase/clubhouse/components/showcase/ClubArc";
import type { HeroSlide } from "@/showcase/clubhouse/components/ClubHero";
import type { NavItem } from "@/showcase/clubhouse/components/ClubHeader";
import type { ClubEvent } from "@/showcase/clubhouse/components/sections/EventsSection";

const P = (name: string, width: number, height: number, alt: string) => ({
  src: `/showcase/clubhouse/${name}.jpg`,
  width,
  height,
  alt,
});

const BOOK = "#restaurant-bookings";

export const site = {
  name: "The Clubhouse — Dining, Bars & Community in Brindabank",
  description: "The Clubhouse is the perfect venue for food, drinks and fun! Located between Fernlea and Corran Downs, we're open for lunch and dinner, 7 days a week.",
  lang: "en-AU",
};

/* ------------------------------------------------------------- header */

export const nav: NavItem[] = [
  { key: "home", href: "/examples/clubhouse", label: "Home" },
  {
    key: "dining",
    href: "#",
    label: "Dining and Bars",
    children: [
      { key: "kitchen", href: "#", label: "The Kitchen" },
      { key: "bar", href: "#", label: "The Clubhouse Bar" },
      { key: "bottleshop", href: "#", label: "The Bottle Shop" },
      { key: "functions", href: "#", label: "Functions" },
    ],
  },
  {
    key: "entertainment",
    href: "#",
    label: "Entertainment",
    children: [
      { key: "whats-on", href: "#", label: "What's On" },
      { key: "lounge", href: "#", label: "The Lounge" },
    ],
  },
  { key: "membership", href: "#", label: "Membership" },
  {
    key: "community",
    href: "#",
    label: "Community",
    children: [
      { key: "rugby", href: "#", label: "Brindabank Rugby League" },
      { key: "touch", href: "#", label: "The Clubhouse Touch" },
      { key: "walking", href: "#", label: "Over 50s Walking Football" },
    ],
  },
  { key: "about", href: "#", label: "About" },
  { key: "contact", href: "#", label: "Contact" },
];

export const announcement = {
  text: "Open for lunch and dinner, 7 days a week — bookings recommended",
};

/* --------------------------------------------------------------- hero */

export const heroSlides: HeroSlide[] = [
  {
    key: "welcome",
    eyebrow: "Welcome to",
    heading: "The Clubhouse",
    text: "Located between Fernlea and Corran Downs, we are open for lunch and dinner, 7 days a week.",
    image: P("hero-welcome", 1600, 797, "The Clubhouse dining room"),
    cta: { label: "Book a table", href: BOOK },
    cta2: { label: "View menu", href: "#" },
  },
  {
    key: "bar",
    eyebrow: "Drinks at the",
    heading: "Clubhouse Bar",
    image: P("chapter-bar", 1600, 797, "The Clubhouse Bar"),
    cta: { label: "See what's on", href: "#" },
  },
  {
    key: "functions",
    eyebrow: "Book now at",
    heading: "The Clubhouse",
    image: P("chapter-functions", 1600, 797, "The Clubhouse function room"),
    cta: { label: "Find out more", href: "#" },
  },
];

/* ---------------------------------------------------------- splitTitle */

export const splitTitle = {
  left: "The",
  right: "Clubhouse",
  eyebrow: "Brindabank · Since 1968",
  heading: "Everything you need for a great day or night out!",
  text:
    "The Clubhouse is the perfect venue for food, drinks and fun! Located between Fernlea and Corran Downs, we're open for lunch and dinner, 7 days a week. Our kitchen keeps the menu moving with new dishes that are sure to satisfy even the largest appetite!",
  image: P("split-hero", 1600, 797, "The Clubhouse dining room, lit for evening service"),
  cta: { label: "Book a table", href: BOOK },
};

/* ---------------------------------------------------------- chapters */

export const chapters: Chapter[] = [
  {
    key: "kitchen",
    title: "The Kitchen",
    colour: "paddock",
    kicker: "Restaurant · Lunch & dinner, 7 days",
    text: "Scratch-made pub classics and weekly specials, served all day in a room that looks out over the fields.",
    image: P("chapter-kitchen", 1600, 797, "The Clubhouse kitchen dining room"),
    cta: { label: "Book a table", href: BOOK },
  },
  {
    key: "bar",
    title: "The Clubhouse Bar",
    colour: "clay",
    kicker: "Beer, wine & spirits",
    text: "Cold schooners, a tidy wine list and a crowd that knows every face behind the taps.",
    image: P("chapter-bar", 1600, 797, "The Clubhouse Bar"),
  },
  {
    key: "lounge",
    title: "The Lounge",
    colour: "night",
    kicker: "Gaming lounge",
    text: "Twenty modern machines, comfortable seating and a dedicated host on every shift.",
    image: P("chapter-lounge", 1600, 797, "The Clubhouse gaming lounge"),
  },
  {
    key: "bottleshop",
    title: "The Bottle Shop",
    colour: "gold",
    kicker: "Takeaway drinks",
    text: "Cold beer, wine and spirits to take home, with member pricing on the shelves every day.",
    image: P("chapter-bottleshop", 1600, 797, "The Clubhouse Bottle Shop"),
  },
  {
    key: "functions",
    title: "Functions",
    colour: "eucalyptus",
    kicker: "Catering and event space",
    text: "Birthdays, presentations and wakes — our function room seats up to 120 with in-house catering.",
    image: P("chapter-functions", 1600, 797, "The Clubhouse function room set for an event"),
  },
];

/* --------------------------------------------------------------- events */

export const events: ClubEvent[] = [
  {
    key: "live-music",
    title: "Friday Night Live: The Brindabank Rounders",
    dateLabel: "Fri 27 November · 7 pm",
    day: "27",
    month: "Nov",
    category: "Live music",
    excerpt: "Local four-piece The Brindabank Rounders bring classic Aussie rock covers to the Clubhouse Bar. Free entry, happy hour from 5pm.",
    image: P("chapter-bar", 1600, 797, "Friday Night Live at The Clubhouse Bar"),
    cta: { label: "Find out more", href: BOOK },
  },
  {
    key: "trivia",
    title: "Big Wednesday Trivia Night",
    dateLabel: "Wed 2 December · 7 pm",
    day: "02",
    month: "Dec",
    category: "Trivia",
    excerpt: "Round up your smartest mates for six rounds of general knowledge, music and sport. $100 bar tab for the winning table.",
    image: P("event-trivia", 600, 415, "Trivia night at The Clubhouse"),
    cta: { label: "Find out more", href: BOOK },
  },
  {
    key: "christmas",
    title: "Members' Christmas Party",
    dateLabel: "Sun 13 December · 5 pm",
    day: "13",
    month: "Dec",
    category: "Members",
    excerpt: "Celebrate the year with fellow members — festive canapés, a lucky door prize, a visit from Santa for the kids and live carols.",
    image: P("chapter-functions", 1600, 797, "Members' Christmas Party at The Clubhouse"),
    cta: { label: "Find out more", href: "#" },
  },
];

/* --------------------------------------------------------------- statement */

export const statement = {
  eyebrow: "Our club",
  from: "sand",
  to: "paddock",
  text: "Serving the local community *since 1968* and keeping Brindabank playing Rugby League, Soccer and Touch Football.",
};

/* ----------------------------------------------------------- clubArc */

export const clubArc = {
  eyebrow: "Community",
  heading: "Healthy, Active, / Happy, Connected",
  intro: "The Clubhouse supports each of the sporting codes and groups that use our fields at the Brindabank Recreation Reserve.",
  items: [
    { key: "rugby", label: "Brindabank Rugby League", meta: "Tue & Thu training · Sunday games", image: P("arc-rugby", 1600, 2209, "Brindabank Rugby League players") },
    { key: "touch", label: "The Clubhouse Touch", meta: "Monday nights · All ages", image: P("arc-touch", 1600, 2000, "Touch football at The Clubhouse") },
    { key: "walking", label: "Over 50's Walking Football", meta: "Mon, Wed & Fri mornings", image: P("arc-walking", 1600, 2843, "Over 50's walking football team") },
    { key: "school", label: "School Sports", meta: "Gala days for local schools", image: P("arc-schoolsport", 1600, 2400, "School sports gala day") },
    { key: "dogsport", label: "Brindabank Dog Sports Club", meta: "Monday evenings · Field 3", image: P("arc-dogsport", 1600, 2845, "Dog sports club training") },
    { key: "jiujitsu", label: "Brindabank Jiu Jitsu", meta: "Wednesday nights · All ages", image: P("arc-jiujitsu", 1600, 2400, "Jiu jitsu class") },
    { key: "craft", label: "Craft Club", meta: "Wednesdays from 9am", image: P("arc-craft", 1600, 2000, "Craft club members at a table") },
  ] satisfies ArcItem[],
};

/* ------------------------------------------------------------ textSections */

export const textSectionMembership = {
  eyebrow: "Membership",
  heading: "Join the club / Members save every visit",
  paragraphs: [
    "Join the club with a Clubhouse membership! Your yearly pass entitles you to discounted food and drinks, member only invites, reward points to use in venue and exclusive giveaway draws, all for a small membership fee.",
  ],
  image: P("textsection-membership", 1600, 797, "The Clubhouse membership cards"),
  imagePosition: "left" as const,
  cta: { label: "Get a membership", href: "#" },
};

export const textSectionPlease = {
  heading: "We aim to please!",
  paragraphs: [
    "At The Clubhouse, we understand the importance of making sure that our customers receive the best quality food and the finest meals. Our expectations not only extend to our kitchen, but also to our bar and gaming room, where our staff will do all they can to ensure you have a memorable visit with us.",
    "If at any time you are unsatisfied with anything at our club, please have no hesitation in contacting our manager, and we will do our best to make sure the issue is resolved.",
    "We also ask that if you have had a wonderful time with us, that you tell your friends and family, and give us a top rating on both Google Reviews and Facebook.",
    "Thanks for visiting us!",
  ],
  image: P("textsection-pleaseaim", 734, 428, "Cheesecake"),
  imagePosition: "right" as const,
};

/* ------------------------------------------------------------ hoursSection */

export const openingHours = [
  { key: "mon", day: "MONDAY", hours: "10:00am – 12:00am" },
  { key: "tue", day: "TUESDAY", hours: "10:00am – 12:00am" },
  { key: "wed", day: "WEDNESDAY", hours: "10:00am – 12:00am" },
  { key: "thu", day: "THURSDAY", hours: "10:00am – 12:00am" },
  { key: "fri", day: "FRIDAY", hours: "10:00am – 12:00am (CLOSED GOOD FRIDAY)" },
  { key: "sat", day: "SATURDAY", hours: "10:00am – 12:00am" },
  { key: "sun", day: "SUNDAY", hours: "10:00am – 12:00am" },
];

export const hoursNote = "Closing hours may vary at management's discretion.";

export const hoursSection = {
  heading: "Opening hours",
  image: P("hours-steak", 734, 428, "Steak"),
};

/* -------------------------------------------------------------- cardGrid */

export const cardGrid = {
  heading: "Recommendations from our Chef",
  intro: "Our Chef has recommended these selections from our menu. Be sure to try them out when you visit us!",
  tone: "sand" as const,
  columns: 3 as const,
  cards: [
    {
      key: "porterhouse",
      title: "Porterhouse Steak",
      paragraphs: ["300g of locally-sourced, tender beef striploin, served with beer battered chips and a garden salad. Cooked to your liking every time!"],
      image: P("card-porterhouse", 734, 428, "Porterhouse Steak"),
    },
    {
      key: "salmon",
      title: "Crispy Skin Salmon",
      paragraphs: ["200g Atlantic salmon fillet, pan seared until crispy, served on garlic mash potato, fresh seasonal vegetables with a salsa verde and a balsamic glaze."],
      image: P("card-salmon", 734, 428, "Crispy Skin Salmon"),
    },
    {
      key: "chicken",
      title: "Chicken Skewers",
      paragraphs: ["Teriyaki marinated chicken on two skewers, char grilled and served on a garden salad with grilled pineapple and a teriyaki plum glaze."],
      image: P("card-chicken", 623, 387, "Chicken Skewers"),
    },
  ],
};

/* ---------------------------------------------------------- bookingSection */

export const bookingSection = {
  heading: "Restaurant Bookings",
  paragraphs: ["For all restaurant bookings, please phone us to speak with one of our friendly staff members."],
  image: P("booking-bg", 1600, 1067, ""),
};

/* -------------------------------------------------------------- footer */

export const footer = {
  address: "12 – 18 Clubhouse Drive, Brindabank, QLD, 4306",
  phone: "(07) 3900 1200",
  openingHours,
  hoursNote,
  tagline: "The Clubhouse has been serving the local community since 1968.",
  about: "A not for profit licensed club and restaurant supporting local sport at the Brindabank Recreation Reserve.",
  facebook: "https://www.facebook.com/theclubhousebrindabank",
  footerLinks: [
    { key: "home", href: "/examples/clubhouse", label: "Home" },
    { key: "dining", href: "#", label: "Dining and Bars" },
    { key: "recreation", href: "#", label: "Recreation" },
    { key: "whats-on", href: "#", label: "What's On" },
    { key: "membership", href: "#", label: "Membership" },
    { key: "community", href: "#", label: "Community" },
    { key: "about", href: "#", label: "About" },
    { key: "contact", href: "#", label: "Contact" },
  ],
};
