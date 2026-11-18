// All copy and image references live here — components take these as props.
//
// This is a template: "The Clubhouse" in the fictional suburb of Brindabank is
// a made-up community sports and social club. The design, every page's hero
// and section sequence, and every photo were ported from a real club-website
// client project's actual current site (queried live from its CMS, not its
// seed script, which is stale) — the name, location, club names, prices,
// phone numbers and figures below are invented so no real club, address or
// phone number is implied. A handful of CMS/backend-only pieces (the live
// booking widget, real third-party sign-up forms, a live map embed, multi-
// page sub-routes this demo doesn't build) get the minimum fictional
// stand-in a static, single-page-per-route demo needs — usually an anchor
// link to the nearest real content, never a bare dead "#".

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

const ROOT = "/examples/clubhouse";
const BOOK = `${ROOT}#restaurant-bookings`;

export const site = {
  name: "The Clubhouse — Dining, Bars & Community in Brindabank",
  description: "The Clubhouse is the perfect venue for food, drinks and fun! Located between Fernlea and Corran Downs, we're open for lunch and dinner, 7 days a week.",
  lang: "en-AU",
};

/* ------------------------------------------------------------- header */

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
    cta2: { label: "View menu", href: `${ROOT}#menu` },
  },
  {
    key: "bar",
    eyebrow: "Drinks at the",
    heading: "Clubhouse Bar",
    image: P("chapter-bar", 1600, 797, "The Clubhouse Bar"),
    cta: { label: "See what's on", href: `${ROOT}/events` },
  },
  {
    key: "functions",
    eyebrow: "Book now at",
    heading: "The Clubhouse",
    image: P("chapter-functions", 1600, 797, "The Clubhouse function room"),
    cta: { label: "Find out more", href: `${ROOT}/dining-and-bars#functions` },
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
// The venue cards, reused as-is on the home page and the Dining and Bars page.

export const chapters: Chapter[] = [
  {
    key: "kitchen",
    title: "The Kitchen",
    colour: "paddock",
    kicker: "Restaurant · Lunch & dinner, 7 days",
    text: "Tucked away at The Clubhouse, The Kitchen is an intimate dining venue for amazing seafood, steak and salads. Bookings recommended.",
    image: P("chef-plating", 1100, 1693, "Our chef plating a dish at The Kitchen"),
    cta: { label: "Book a table", href: BOOK },
  },
  {
    key: "bar",
    title: "The Clubhouse Bar",
    colour: "clay",
    kicker: "Beer, wine & spirits",
    text: "Our casual bar environment is the perfect place to relax. We have a range of domestic and imported beers, spirits and wines.",
    image: P("chapter-bar", 1600, 797, "The Clubhouse Bar"),
  },
  {
    key: "lounge",
    title: "The Lounge",
    colour: "night",
    kicker: "Gaming lounge",
    text: "With 20 modern poker machines available, you'll be sure to find your favourite. Check back regularly for giveaways and promotions.",
    image: P("chapter-lounge-pokies", 1600, 1066, "The Lounge gaming floor at The Clubhouse"),
  },
  {
    key: "bottleshop",
    title: "The Bottle Shop",
    colour: "gold",
    kicker: "Takeaway drinks",
    text: "Take home a few of your favourite beverages — and drop off your empties at our Containers for Change express point.",
    image: P("chapter-bottleshop", 1600, 797, "The Clubhouse Bottle Shop"),
  },
  {
    key: "functions",
    title: "Functions",
    colour: "eucalyptus",
    kicker: "Catering and event space",
    text: "Looking for a location for your next function or event? The Clubhouse can provide the perfect setting and catering for all occasions.",
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
    cta: { label: "Become a member", href: `${ROOT}/membership` },
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
// Home page only — the fanned "club life" deck (the real site's clubArcSection).

export const clubArc = {
  eyebrow: "Community",
  heading: "Healthy, Active, / Happy, Connected",
  intro: "The Clubhouse supports each of the sporting codes and groups that use our fields at the Brindabank Recreation Reserve.",
  items: [
    { key: "rugby", label: "Brindabank Rugby League", meta: "Tue & Thu training · Sunday games", image: P("arc-rugby", 1600, 2209, "Brindabank Rugby League players"), href: `${ROOT}/community/rugby-league` },
    { key: "touch", label: "The Clubhouse Touch", meta: "Monday nights · All ages", image: P("arc-touch", 1600, 2000, "Touch football at The Clubhouse"), href: `${ROOT}/community/touch` },
    { key: "walking", label: "Over 50's Walking Football", meta: "Mon, Wed & Fri mornings", image: P("arc-walking", 1600, 2843, "Over 50's walking football team"), href: `${ROOT}/community/walking-football` },
    { key: "school", label: "School Sports", meta: "Gala days for local schools", image: P("arc-schoolsport", 1600, 2400, "School sports gala day") },
    { key: "dogsport", label: "Brindabank Dog Sports Club", meta: "Monday evenings · Field 3", image: P("arc-dogsport", 1600, 2845, "Dog sports club training") },
    { key: "jiujitsu", label: "Brindabank Jiu Jitsu", meta: "Wednesday nights · All ages", image: P("arc-jiujitsu", 1600, 2400, "Jiu jitsu class") },
    { key: "craft", label: "Craft Club", meta: "Wednesdays from 9am", image: P("arc-craft", 1600, 2000, "Craft club members at a table") },
  ] satisfies ArcItem[],
};

/* ------------------------------------------------------------ textSections */
// Home page only.

export const textSectionMembership = {
  eyebrow: "Membership",
  heading: "Join the club / Members save every visit",
  paragraphs: [
    "Join the club with a Clubhouse membership! Your yearly pass entitles you to discounted food and drinks, member only invites, reward points to use in venue and exclusive giveaway draws, all for a small membership fee.",
  ],
  image: P("textsection-membership-v2", 1200, 1500, "A member being served a shared roast at The Clubhouse, friends raising a glass"),
  imagePosition: "left" as const,
  cta: { label: "Get a membership", href: `${ROOT}/membership` },
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
    { key: "home", href: ROOT, label: "Home" },
    { key: "dining", href: `${ROOT}/dining-and-bars`, label: "Dining and Bars" },
    { key: "recreation", href: `${ROOT}/entertainment`, label: "Recreation" },
    { key: "whats-on", href: `${ROOT}/events`, label: "What's On" },
    { key: "membership", href: `${ROOT}/membership`, label: "Membership" },
    { key: "community", href: `${ROOT}/community`, label: "Community" },
    { key: "about", href: `${ROOT}/about`, label: "About" },
    { key: "contact", href: `${ROOT}/contact`, label: "Contact" },
  ],
};

/* ---------------------------------------------------------------- stats */
// About page — the real site's about-page statsSection.

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

/* =================================================================== */
/* DINING AND BARS — real page: hero(4) + textSection + chaptersSection, */
/* plus a Containers for Change stepsSection appended (see note below).  */
/* =================================================================== */

export const diningHero: HeroSlide[] = [
  {
    key: "bar",
    eyebrow: "You're always welcome",
    heading: "The Clubhouse Bar",
    image: P("hero-middlebar", 1600, 797, "The Clubhouse Bar"),
    cta: { label: "See more", href: `${ROOT}/dining-and-bars#bar` },
  },
  {
    key: "kitchen",
    eyebrow: "Homestyle meals",
    heading: "The Kitchen",
    image: P("chef-plating", 1100, 1693, "Our chef plating a dish at The Kitchen"),
    cta: { label: "Book a table", href: BOOK },
  },
  {
    key: "functions",
    eyebrow: "Book now at",
    heading: "The Clubhouse",
    image: P("chapter-functions", 1600, 797, "The Clubhouse function room"),
    cta: { label: "Find out more", href: `${ROOT}/dining-and-bars#functions` },
  },
  {
    key: "bottleshop",
    eyebrow: "Takeaway drinks",
    heading: "The Bottle Shop",
    image: P("chapter-bottleshop", 1600, 797, "The Bottle Shop"),
    cta: { label: "See specials", href: `${ROOT}/dining-and-bars#bottleshop` },
  },
];

export const diningPage = {
  heading: "Relax at The Clubhouse — superb dining and drinks",
  intro:
    "The Clubhouse is the perfect place to relax with a hearty meal and drink. Our friendly staff are always available to help with menu recommendations, function bookings and making sure your visit to The Clubhouse is a truly great experience.",
};

/**
 * Containers for Change — a brief, real-world QLD container-refund service
 * blurb (the club is an express drop-off point, not the organisation paying
 * the refund itself), ported as a stepsSection the way the real site uses
 * one for short step-by-step explainers.
 */
export const containersForChange = {
  eyebrow: "Containers for Change",
  heading: "The Clubhouse is an / express drop off point",
  intro: "Queensland's container refund scheme, made easy — drop your eligible empties with us and we'll take care of the rest.",
  paragraphs: [
    "The Clubhouse isn't a refund point itself — we're an express drop off point for the official Containers for Change scheme. Bag up your eligible cans and bottles and leave them with us; the scheme processes the refund, not the club.",
  ],
  image: P("containers-for-change", 1100, 1466, "Crushed aluminium cans ready for recycling"),
  items: [
    { key: "head", title: "Head to The Clubhouse", text: "Bring your eligible, empty cans and bottles with you on your next visit." },
    { key: "drop", title: "Drop them off", text: "Leave your bagged containers at our express drop off point — no need to count or sort them first." },
    { key: "rest", title: "We do the rest", text: "We pass your containers on to the scheme, which processes the refund on your behalf." },
  ],
};

/* =================================================================== */
/* ENTERTAINMENT — real page: hero(2) + chaptersSection(2) + eventsSection */
/* =================================================================== */

export const entertainmentHero: HeroSlide[] = [
  {
    key: "pool",
    eyebrow: "Come and have some fun at",
    heading: "The Clubhouse",
    image: P("hero-pool", 1600, 797, "Playing pool at The Clubhouse"),
  },
  {
    key: "football",
    eyebrow: "Come and see the action",
    heading: "The Clubhouse",
    image: P("hero-community2-football", 1600, 797, "Football at The Clubhouse"),
  },
];

export const entertainmentChapters: Chapter[] = [
  {
    key: "whats-on",
    title: "What's On",
    colour: "paddock",
    kicker: "Sport, entertainment & events",
    text: "Find out what you can do at The Clubhouse. We have a range of sports, entertainment and events on during the year, so be sure to know what's coming up!",
    image: P("hero-facility", 1600, 757, "The Clubhouse facility"),
    cta: { label: "See what's happening", href: `${ROOT}/events` },
  },
  {
    key: "lounge",
    title: "The Lounge",
    colour: "night",
    kicker: "Gaming lounge",
    text: "With 20 modern poker machines available, you'll be sure to find your favourite. We have a number of giveaways and promotions throughout the year, so check back regularly to see what's on offer!",
    image: P("chapter-lounge-pokies", 1600, 1066, "The Lounge gaming floor at The Clubhouse"),
  },
];

/* =================================================================== */
/* MEMBERSHIP — real page: hero(1) + stepsSection + statementSection +    */
/* stepsSection                                                          */
/* =================================================================== */

export const membershipHero: HeroSlide[] = [
  {
    key: "membership",
    eyebrow: "Enjoy the membership benefits at",
    heading: "The Clubhouse",
    image: P("hero-membership", 1920, 956, "Membership at The Clubhouse"),
  },
];

export const membershipHowToJoin = {
  eyebrow: "The Clubhouse Membership",
  heading: "How to join / It's simple",
  intro: "Becoming a member of The Clubhouse is simple.",
  paragraphs: [
    "With our membership base continually growing, we know that our members are our most important asset! The Clubhouse is the local area's most exciting club, with new initiatives introduced continually to ensure our members enjoy great facilities and services.",
  ],
  image: P("membership-friends-1", 1100, 1648, "Friends sharing drinks at The Clubhouse"),
  imagePosition: "left" as const,
  items: [
    { key: "form", title: "Grab a form", text: "Ask one of our friendly bar or wait staff for a membership form." },
    { key: "fill", title: "Fill it out", text: "Complete the form and bring it to the club with your current ID. You must be 18 years or older to become a member." },
    { key: "pay", title: "Pay and you're in", text: "Pay the membership fee and your brand new membership card will be issued immediately." },
  ],
};

export const membershipStatement = {
  eyebrow: "Our members",
  from: "cream",
  to: "paddock",
  text: "Our members are our *most important asset!*",
};

export const membershipBenefits = {
  heading: "Membership benefits / Members save every visit",
  intro: "Here are some of the fantastic rewards and exclusive offers you'll receive by becoming a Clubhouse member.",
  paragraphs: ["You can subscribe to our email list or check our Facebook page for the latest offers."],
  image: P("membership-friends-2", 1100, 1325, "Friends laughing together at The Clubhouse"),
  imagePosition: "right" as const,
  tone: "sand" as const,
  items: [
    { key: "meals", title: "Discounted meals at The Kitchen" },
    { key: "drinks", title: "Discounted drinks at The Clubhouse Bar and Bottle Shop" },
    { key: "invites", title: "Exclusive invites to our member events" },
    { key: "gaming", title: "Exclusive gaming promotions" },
    { key: "birthday", title: "Birthday offers" },
  ],
};

/* =================================================================== */
/* COMMUNITY — real page: hero(2) + statementSection + chaptersSection +  */
/* textSection + gallerySection                                          */
/* =================================================================== */

export const communityHero: HeroSlide[] = [
  {
    key: "support",
    eyebrow: "Support your team or group at",
    heading: "The Clubhouse",
    image: P("hero-community2-football", 1600, 797, "Community at The Clubhouse"),
  },
  {
    key: "action",
    eyebrow: "Come and see the action",
    heading: "The Clubhouse",
    image: P("hero-community2-football", 1600, 797, "Football at The Clubhouse"),
  },
];

export const communityPage = {
  statement: {
    eyebrow: "Community",
    from: "cream",
    to: "paddock",
    text: "Healthy, Active, *Happy, Connected.*",
  },
  supportHeading: "How does The Clubhouse / support the sport clubs?",
  supportParagraphs: [
    "The Clubhouse supports each of the sporting codes that use our facilities at the Brindabank Recreation Reserve. The Clubhouse has taken the responsibility of maintaining the sporting fields, the club facilities and security.",
  ],
};

export const communityChapters: Chapter[] = [
  {
    key: "rugby",
    title: "Rugby League",
    colour: "clay",
    kicker: "The Rovers · Under 6's to seniors",
    text: "Brindabank Rugby League, \"The Rovers,\" has teams ranging from under 6's right through to seniors for both boys and girls.",
    image: P("arc-rugby", 1600, 2209, "Brindabank Rugby League"),
    cta: { label: "How to join and play", href: `${ROOT}/community/rugby-league` },
  },
  {
    key: "touch",
    title: "Touch Football",
    colour: "paddock",
    kicker: "Monday nights · All ages",
    text: "The Clubhouse Touch invites you to register to join a team. Or bring your whole team! Come and join the family fun, we have places for everyone.",
    image: P("arc-touch", 1600, 2000, "Touch football at The Clubhouse"),
    cta: { label: "How to join and play", href: `${ROOT}/community/touch` },
  },
  {
    key: "school",
    title: "School Sports",
    colour: "gold",
    kicker: "Gala days & carnivals",
    text: "Local schools in the Brindabank area use The Clubhouse for sporting events and gala days.",
    image: P("arc-schoolsport", 1600, 2400, "School sports gala day"),
  },
  {
    key: "walking",
    title: "Over 50's Walking Football",
    colour: "eucalyptus",
    kicker: "Mon, Wed & Fri mornings",
    text: "Monday, Wednesday and Friday mornings. Come on down and join in the fun and get some exercise at the same time.",
    image: P("arc-walking", 1600, 2843, "Over 50's walking football team"),
    cta: { label: "More details", href: `${ROOT}/community/walking-football` },
  },
];

export const communityGallery = {
  eyebrow: "On the field",
  heading: "Our clubs / in action",
  intro: "Rugby League, Touch and Walking Football at the Brindabank Recreation Reserve.",
  tone: "light" as const,
  images: [
    { key: "g1", ...P("hero-community2-football", 1600, 797, "Brindabank Rovers") },
    { key: "g2", ...P("community-gallery-touch1", 469, 386, "The Clubhouse Touch") },
    { key: "g3", ...P("community-gallery-walking1", 1920, 956, "Over 50's walking football team") },
    { key: "g4", ...P("arc-rugby", 1600, 2209, "Brindabank Rovers") },
    { key: "g5", ...P("community-gallery-walking2", 496, 389, "Over 50's walking football") },
    { key: "g6", ...P("community-gallery-school1", 469, 386, "School sports") },
  ],
};

/* ------------------------------------------------- community sub-pages */

export const rugbyPage = {
  hero: [{ key: "action", eyebrow: "Come and see the action", heading: "The Clubhouse", image: P("hero-community2-football", 1600, 797, "Football at The Clubhouse") }] satisfies HeroSlide[],
  eyebrow: "The Rovers",
  heading: "Brindabank Rugby League / Home since 1989",
  paragraphs: [
    "Brindabank Rugby League Football Club, \"The Rovers,\" have called The Clubhouse home since 1989. They have teams from Under 6's right through to Seniors for both boys and girls, so there is a place for everyone to play in an inclusive, friendly environment.",
    "Want to come and play, help out or just after some information? Come down and have a chat with the coaching staff.",
  ],
  image: P("arc-rugby", 1600, 2209, "Brindabank Rugby League players"),
  schedule: "Tue & Thu training · Sunday games",
  statement: { eyebrow: "Brindabank Rovers", from: "cream", to: "clay", text: "A place for everyone to play in an *inclusive, friendly* environment." },
  gallery: {
    eyebrow: "Brindabank Rovers",
    heading: "The Rovers / in action",
    tone: "dark" as const,
    images: [
      { key: "r1", ...P("arc-rugby", 1600, 2209, "Brindabank Rovers") },
      { key: "r2", ...P("hero-community2-football", 1600, 797, "Brindabank Rovers") },
      { key: "r3", ...P("community-gallery-touch1", 469, 386, "Brindabank Rovers") },
      { key: "r4", ...P("community-gallery-school1", 469, 386, "Brindabank Rovers") },
    ],
  },
};

export const touchPage = {
  hero: [{ key: "signup", eyebrow: "Sign up today for", heading: "Touch Football!", image: P("hero-touch", 1240, 686, "Touch football at The Clubhouse"), cta: { label: "Sign up", href: "#sign-up" } }] satisfies HeroSlide[],
  eyebrow: "Junior and senior teams for boys and girls",
  heading: "The Clubhouse / touch football",
  paragraphs: [
    "Touch Football is Australia's largest social sport, with 700,000 participants around the country. The Clubhouse Touch Football club welcomes participants from both male and female, junior and senior age groups. It's a simple and fun game to play — the only skills you need are being able to run, pass and catch.",
  ],
  contact: { name: "Jordan Hale", phone: "0491 006 755", email: "touch@theclubhouse.example" },
  image: P("arc-touch", 1600, 2000, "Touch football at The Clubhouse"),
  schedule: "Monday nights · All ages",
  statement: {
    eyebrow: "We are looking to fill both junior and senior teams for boys and girls!",
    from: "cream",
    to: "paddock",
    text: "Australia's largest social sport, with *700,000 participants* around the country.",
  },
  signup: {
    heading: "Sign up / Join a team",
    groups: [
      { key: "new-team", title: "Sign up a team", description: "New team", cta: "Register a new team" },
      { key: "returning", title: "Returning players", description: "Players from last term, get in touch and we'll find your team", cta: "Contact us" },
      { key: "player", title: "Sign up as a player", description: "New players seeking a team", cta: "Help me find a team" },
    ],
  },
};

export const walkingPage = {
  hero: [{ key: "walking", eyebrow: "Over 50's Walking Football at", heading: "The Clubhouse", image: P("community-gallery-walking1", 1920, 956, "Over 50's walking football team") }] satisfies HeroSlide[],
  eyebrow: "Monday, Wednesday & Friday mornings",
  heading: "Over 50's / Walking Football",
  paragraphs: [
    "We welcome you to join us on Monday, Wednesday and Friday mornings. Game times: Summer 8am – 10am, Winter 9am – 11am.",
    "Come on down and join in the fun and get some exercise at the same time. Contact Alan on 0400 123 456 for more info, or keep up with us on Facebook.",
  ],
  image: P("arc-walking", 1600, 2843, "Over 50's walking football team"),
  schedule: "Mon, Wed & Fri mornings",
  statement: {
    eyebrow: "Over 50's Walking Football",
    from: "cream",
    to: "eucalyptus",
    text: "Come on down and *join in the fun* and get some exercise at the same time.",
  },
  gallery: {
    eyebrow: "On the pitch",
    heading: "Walking football / at Brindabank",
    tone: "light" as const,
    images: [
      { key: "w1", ...P("community-gallery-walking1", 1920, 956, "Over 50's walking football team") },
      { key: "w2", ...P("community-gallery-walking2", 496, 389, "Over 50's walking football") },
      { key: "w3", ...P("walking-gallery3", 496, 389, "Over 50's walking football") },
      { key: "w4", ...P("walking-gallery4", 496, 389, "Over 50's walking football") },
      { key: "w5", ...P("walking-gallery5", 469, 386, "Over 50's walking football") },
    ],
  },
};

/* =================================================================== */
/* ABOUT — real page: hero(1) + textSection(History) + statsSection +     */
/* textSection(Entry requirements) + textSection(Courtesy bus)           */
/* =================================================================== */

export const aboutHero: HeroSlide[] = [{ key: "about", eyebrow: "Welcoming you to", heading: "The Clubhouse", image: P("hero-about", 1920, 956, "About The Clubhouse") }];

export const aboutPage = {
  history: {
    eyebrow: "About The Clubhouse",
    heading: "History / Since 1968",
    paragraphs: [
      "The Clubhouse has been serving the local community since 1968.",
      "The Clubhouse is a not for profit licensed club and restaurant that supports local sport by providing and maintaining facilities so people can play Rugby League, Soccer and Touch Football.",
    ],
  },
  entryRequirements: {
    heading: "Entry requirements",
    tone: "sand" as const,
    paragraphs: [
      "Membership cards must be presented to staff upon entry and when requested.",
      "Minors must be accompanied by a parent, legal guardian or responsible adult at all times.",
      "Photo identification must be presented by all patrons when requested.",
      "The Clubhouse prides itself on a high standard of dress, behaviour and service. Shoes must be worn at all times; bike pants, swimwear, singlets and offensive t-shirts are not permitted.",
    ],
    cta: { label: "Club policies", href: "#policies" },
  },
  courtesyBus: {
    heading: "Courtesy bus",
    paragraphs: [
      "The Clubhouse no longer runs a courtesy bus service.",
      "The idle courtesy bus was donated to a local charity so they could use it to ferry the elderly to appointments.",
    ],
  },
  policies: {
    heading: "Policies",
    paragraphs: [
      "The Clubhouse operates under its liquor and gaming licences in line with Queensland club regulations, including responsible service of alcohol and a voluntary pre-commitment scheme for gaming machines.",
      "Member conduct, privacy and venue-hire policies are available on request at the front desk, or by contacting the club directly.",
    ],
  },
};

/* =================================================================== */
/* CONTACT — real page: hero(1) + contactSection + mapSection             */
/* =================================================================== */

export const contactHero: HeroSlide[] = [{ key: "contact", eyebrow: "Contact us at", heading: "The Clubhouse", image: P("hero-contact", 1920, 956, "Contact The Clubhouse") }];

export const contactPage = {
  heading: "Get in touch",
  intro: "Our friendly staff will be able to help you with any questions you might have.",
  findUsHeading: "Find us / Brindabank",
};
