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

const ROOT = "/examples/clubhouse";

export const nav: NavItem[] = [
  { key: "home", href: ROOT, label: "Home" },
  {
    key: "dining",
    href: `${ROOT}/dining-and-bars`,
    label: "Dining and Bars",
    children: [
      { key: "kitchen", href: `${ROOT}/dining-and-bars#kitchen`, label: "The Kitchen" },
      { key: "bar", href: `${ROOT}/dining-and-bars#bar`, label: "The Clubhouse Bar" },
      { key: "bottleshop", href: `${ROOT}/dining-and-bars#bottleshop`, label: "The Bottle Shop" },
      { key: "functions", href: `${ROOT}/dining-and-bars#functions`, label: "Functions" },
    ],
  },
  {
    key: "entertainment",
    href: `${ROOT}/entertainment`,
    label: "Entertainment",
    children: [
      { key: "whats-on", href: `${ROOT}/events`, label: "What's On" },
      { key: "lounge", href: `${ROOT}/entertainment#lounge`, label: "The Lounge" },
    ],
  },
  { key: "membership", href: `${ROOT}/membership`, label: "Membership" },
  {
    key: "community",
    href: `${ROOT}/community`,
    label: "Community",
    children: [
      { key: "rugby", href: `${ROOT}/community/rugby-league`, label: "Brindabank Rugby League" },
      { key: "touch", href: `${ROOT}/community/touch`, label: "The Clubhouse Touch" },
      { key: "walking", href: `${ROOT}/community/walking-football`, label: "Over 50s Walking Football" },
    ],
  },
  { key: "about", href: `${ROOT}/about`, label: "About" },
  { key: "contact", href: `${ROOT}/contact`, label: "Contact" },
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
    cta2: { label: "View menu", href: "#menu" },
  },
  {
    key: "bar",
    eyebrow: "Drinks at the",
    heading: "Clubhouse Bar",
    image: P("chapter-bar", 1600, 797, "The Clubhouse Bar"),
    cta: { label: "See what's on", href: "/examples/clubhouse/events" },
  },
  {
    key: "functions",
    eyebrow: "Book now at",
    heading: "The Clubhouse",
    image: P("chapter-functions", 1600, 797, "The Clubhouse function room"),
    cta: { label: "Find out more", href: "/examples/clubhouse/dining-and-bars#functions" },
  },
];

/* ---------------------------------------------------------- splitTitle */

export const splitTitle = {
  left: "Club",
  right: "House",
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
    cta: { label: "Become a member", href: "/examples/clubhouse/membership" },
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
    { key: "rugby", label: "Brindabank Rugby League", meta: "Tue & Thu training · Sunday games", image: P("arc-rugby", 1600, 2209, "Brindabank Rugby League players"), href: "/examples/clubhouse/community/rugby-league" },
    { key: "touch", label: "The Clubhouse Touch", meta: "Monday nights · All ages", image: P("arc-touch", 1600, 2000, "Touch football at The Clubhouse"), href: "/examples/clubhouse/community/touch" },
    { key: "walking", label: "Over 50's Walking Football", meta: "Mon, Wed & Fri mornings", image: P("arc-walking", 1600, 2843, "Over 50's walking football team"), href: "/examples/clubhouse/community/walking-football" },
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
  image: P("textsection-membership-v2", 1200, 1500, "A member being served a shared roast at The Clubhouse, friends raising a glass"),
  imagePosition: "left" as const,
  cta: { label: "Get a membership", href: "/examples/clubhouse/membership" },
};

export const textSectionPlease = {
  heading: "We aim to please!",
  paragraphs: [
    "At The Clubhouse, we understand the importance of making sure that our customers receive the best quality food and the finest meals. Our expectations not only extend to our kitchen, but also to our bar and gaming room, where our staff will do all they can to ensure you have a memorable visit with us.",
    "If at any time you are unsatisfied with anything at our club, please have no hesitation in contacting our manager, and we will do our best to make sure the issue is resolved.",
    "We also ask that if you have had a wonderful time with us, that you tell your friends and family, and give us a top rating on both Google Reviews and Facebook.",
    "Thanks for visiting us!",
  ],
  image: P("textsection-pleaseaim-v2", 1000, 1500, "Members enjoying a quiet conversation at The Clubhouse"),
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
    { key: "dining", href: "/examples/clubhouse/dining-and-bars", label: "Dining and Bars" },
    { key: "recreation", href: "/examples/clubhouse/entertainment", label: "Recreation" },
    { key: "whats-on", href: "/examples/clubhouse/events", label: "What's On" },
    { key: "membership", href: "/examples/clubhouse/membership", label: "Membership" },
    { key: "community", href: "/examples/clubhouse/community", label: "Community" },
    { key: "about", href: "/examples/clubhouse/about", label: "About" },
    { key: "contact", href: "/examples/clubhouse/contact", label: "Contact" },
  ],
};

/* ---------------------------------------------------------------- stats */
// Used on the About page (the real site's about-page statsSection), not the home page.

export const stats = {
  eyebrow: "The Clubhouse in numbers",
  heading: "Your local club / in Brindabank",
  colour: "paddock",
  items: [
    { key: "since", value: 1968, label: "Serving the community", note: "A not-for-profit club, supporting local sport" },
    { key: "codes", value: 3, label: "Football codes", note: "Rugby League, Soccer and Touch Football" },
    { key: "machines", value: 20, label: "Modern poker machines", note: "In The Lounge" },
    { key: "days", value: 7, label: "Days a week", note: "Open for lunch and dinner" },
  ],
};

/* =================================================== secondary pages */
// Content for the sub-pages nav links lead to — kept in the same simple
// TextSection/Statement/CardGrid vocabulary as the home page rather than
// inventing new section types for them.

export const diningPage = {
  heading: "Dining and Bars",
  intro:
    "From a sit-down meal in The Kitchen to a quick drink at The Clubhouse Bar, takeaways from The Bottle Shop, or a private function — everything food and drink at The Clubhouse lives under one roof.",
};

export const entertainmentPage = {
  heading: "Entertainment",
  intro: "Live music, trivia nights, members' functions and a modern gaming lounge — there's always something on at The Clubhouse.",
  lounge: chapters.find((c) => c.key === "lounge")!,
};

export const membershipPage = {
  heading: "Membership",
  intro: "Becoming a Clubhouse member is quick, free to apply for, and pays for itself on your first visit.",
  statement: {
    eyebrow: "Why join",
    from: "sand",
    to: "clay",
    text: "Members get *discounted food and drinks*, invitations to member-only nights, reward points on every visit, and first access to functions bookings.",
  },
};

export const communityPage = {
  heading: "Community",
  statement: {
    eyebrow: "Our community",
    from: "cream",
    to: "paddock",
    text: "The Clubhouse exists because of the clubs that call it home — *rugby league, touch, walking football* and everything in between.",
  },
};

export const communityClubs = {
  rugby: {
    eyebrow: "Community · Rugby League",
    heading: "Brindabank / Rugby League",
    paragraphs: [
      "Brindabank Rugby League has trained and played out of The Clubhouse's fields for over two decades, fielding junior, senior and masters sides every season.",
      "Training is open to new players of all levels — come down on a Tuesday or Thursday evening and introduce yourself to the coaching staff.",
    ],
    image: clubArc.items[0].image,
    schedule: clubArc.items[0].meta,
  },
  touch: {
    eyebrow: "Community · Touch Football",
    heading: "The Clubhouse / Touch",
    paragraphs: [
      "The Clubhouse Touch competition runs every Monday night on the club's floodlit fields, with mixed social and competitive grades for all ages.",
      "No need to have a team — register as an individual and we'll place you with a side looking for players.",
    ],
    image: clubArc.items[1].image,
    schedule: clubArc.items[1].meta,
  },
  walking: {
    eyebrow: "Community · Walking Football",
    heading: "Over 50's / Walking Football",
    paragraphs: [
      "A slower-paced, no-running version of football for the over-50s crowd — three mornings a week, with a coffee at The Kitchen afterwards.",
      "All fitness levels welcome; boots and a smile are the only requirements.",
    ],
    image: clubArc.items[2].image,
    schedule: clubArc.items[2].meta,
  },
};

export const aboutPage = {
  heading: "About The Clubhouse",
  intro: [
    "The Clubhouse has been a part of life in Brindabank since 1968 — a not-for-profit community club built around food, sport and the people who show up for both.",
    "What started as a single rugby league clubhouse has grown into a full dining, bar and entertainment venue, while still putting its profits back into the local clubs and groups that use its fields every week.",
  ],
  policies: {
    heading: "Policies",
    paragraphs: [
      "The Clubhouse operates under its liquor and gaming licences in line with Queensland club regulations, including responsible service of alcohol and a voluntary pre-commitment scheme for gaming machines.",
      "Member conduct, privacy and venue-hire policies are available on request at the front desk, or by contacting the club directly.",
    ],
  },
};

export const contactPage = {
  heading: "Contact The Clubhouse",
  intro: "Questions about bookings, membership or functions? Get in touch — we're open 7 days a week.",
};
