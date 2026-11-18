// All copy and image references live here — components take these as props.
//
// This is a template: "The Clubhouse" in the fictional suburb of Brindabank is
// a made-up community sports and social club. The design and every photo were
// ported from a real club-website client project; the name, location, club
// names and figures below are invented so no real club or address is implied.

import type { Chapter } from "@/showcase/clubhouse/components/showcase/Chapters";
import type { ArcItem } from "@/showcase/clubhouse/components/showcase/ClubArc";

const P = (name: string, width: number, height: number, alt: string) => ({
  src: `/showcase/clubhouse/${name}.jpg`,
  width,
  height,
  alt,
});

export const site = {
  name: "The Clubhouse — Dining, Bars & Community in Brindabank",
  description: "A fictional suburban sports and social club, built to showcase a Lenis-smooth-scroll, scroll-driven set-piece design system.",
  lang: "en-AU",
};

export const header = {
  logo: { label: "The Clubhouse", href: "/examples/clubhouse" },
  cta: { label: "Book a table", href: "#visit" },
};

/* -------------------------------------------------------------- hero */

export const splitTitle = {
  left: "The",
  right: "Clubhouse",
  eyebrow: "Brindabank · Since 1968",
  heading: "Everything you need for a great day or night out!",
  text:
    "The Clubhouse is the perfect venue for food, drinks and fun! Located between Fernlea and Corran Downs, we're open for lunch and dinner, 7 days a week. Our kitchen keeps the menu moving with new dishes that are sure to satisfy even the largest appetite!",
  image: P("split-hero", 1600, 797, "The Clubhouse dining room, lit for evening service"),
  cta: { label: "Book a table", href: "#visit" },
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
    cta: { label: "Book a table", href: "#visit" },
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

/* --------------------------------------------------------- statement */

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

/* ------------------------------------------------------------- stats */

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

/* ----------------------------------------------------------- gallery */

export const gallery = {
  eyebrow: "Inside the club",
  heading: "Life at / The Clubhouse",
  intro: "From the front bar to the function room — a look inside The Clubhouse.",
  tone: "light" as const,
  images: [
    { key: "tap", ...P("gallery-tap", 1600, 1067, "A beer being poured from the tap") },
    { key: "toast", ...P("gallery-toast", 1600, 2400, "Friends raising a toast at the bar") },
    { key: "bartaps", ...P("gallery-bartaps", 1600, 1067, "Beer taps behind the bar") },
    { key: "diningtables", ...P("gallery-diningtables", 1600, 1067, "Tables set for a formal dinner") },
    { key: "guesttoast", ...P("gallery-guesttoast", 1600, 1067, "Guests raising a toast") },
    { key: "floral", ...P("gallery-floral", 1600, 1067, "Reception tables with floral centrepieces") },
  ],
};

/* -------------------------------------------------------------- visit */

export const visit = {
  eyebrow: "Visit us",
  heading: "Open 7 days, / lunch and dinner",
  image: P("gallery-diningtables", 1600, 1067, "The Clubhouse dining room set for service"),
  address: ["2 Clubhouse Drive", "Brindabank"],
  hours: [
    { label: "Mon – Thu", value: "11am – 10pm" },
    { label: "Fri – Sat", value: "11am – 12am" },
    { label: "Sun", value: "11am – 9pm" },
  ],
  phone: { label: "(07) 5500 0000", href: "tel:+61755000000" },
  cta: { label: "Book a table", href: "#visit" },
  note: "The Clubhouse is a registered community club — members and guests welcome.",
};
