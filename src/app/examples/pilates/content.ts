/**
 * Copy and imagery for the Pilates example page.
 *
 * Kept apart from the components so the layout can be judged as a layout —
 * every string here is placeholder content for a fictional studio, and
 * swapping in a real one should never mean opening `sections.tsx`.
 */

const IMAGE_BASE = "/images/pilates";

/**
 * Palette. Defined here rather than in `sections.tsx` because that file is
 * `"use client"`, and a server component importing a plain value out of a
 * client module receives a client-reference proxy instead of the object —
 * every lookup comes back `undefined` and React silently drops the style.
 */
export const TOKENS = {
  bone: "#F7F3EC",
  ink: "#17150F",
  pine: "#14342A",
  rose: "#D95B7F",
  blush: "#F3DCD6",
};

/** All 18 photographs, pre-cropped to 3:4 at 900×1200 (see the build notes). */
export const PHOTOS = [
  "ahmet-kurt-1",
  "ahmet-kurt-2",
  "ahmet-kurt-3",
  "ahmet-kurt-4",
  "alex-shaw-5",
  "amine-ben-mohamed-6",
  "dane-wetton-7",
  "heather-jacoby-8",
  "helen-thomas-9",
  "jade-stephens-10",
  "jade-stephens-11",
  "logan-weaver-lgnwvr-12",
  "margaret-young-13",
  "morgan-petroski-14",
  "roxana-popovici-15",
  "roxana-popovici-16",
  "roxana-popovici-17",
  "roxana-popovici-18",
].map((name) => `${IMAGE_BASE}/${name}.webp`);

/**
 * Curated photo assignments, chosen by measured luminance rather than by
 * index arithmetic.
 *
 * Rec.709 luma of the 18 crops spans 14 to 192 — wide enough that placement
 * matters more than variety. Two rules, both learned from getting it wrong:
 *
 *   Dark sections need bright photographs. A luma-110 crop on the pine
 *   background disappears entirely; it reads as a missing image rather than a
 *   dark one, and no amount of shadow rescues it.
 *
 *   The hero's flip-back images are seen against pine, not bone, because the
 *   background has already turned over by the time the cards flip. They are
 *   selected on the dark-section rule even though the cards start on light.
 *
 * The two darkest crops (luma 25 and 14) are only usable on the light
 * sections, where they become the strongest cards in the set.
 */
export const CASTING = {
  /** Hero, seen on bone. */
  heroFront: [0, 7, 17],
  /** Hero after the flip, seen on pine — brightest available. */
  heroBack: [3, 2, 12],
  /** Team portraits on pine. */
  team: [6, 1, 14, 5],
  /** Carousel on bone; mid and dark crops give it depth. */
  carousel: [4, 16, 11, 9, 15],
  /** Timetable on blush; the darkest crops are the strongest here. */
  classes: [8, 13, 10, 4, 11, 16],
  /** Zoom backdrop, heavily knocked back over pine. */
  zoom: 1,
  /** Full-bleed rest band between 'Why here' and the FAQ; shown at full strength. */
  band: 3,
};

export const STUDIO = {
  /** Used in prose ("At Forma we…"). The studio has a name; the wordmark doesn't have to be it. */
  name: "Forma",
  /** The giant hero lockup and the footer marquee. */
  wordmark: "Pilates",
  eyebrow: "Reformer studio",
  heroLines: ["Strong", "body club"],
};


export const INSTRUCTORS = [
  {
    name: "Elena",
    discipline: "Rehabilitation",
    credential: "Comprehensive certification, ten years alongside physiotherapists.",
  },
  {
    name: "Marcus",
    discipline: "Apparatus",
    credential: "Tower, chair and barrel specialist. Trains the other instructors.",
  },
  {
    name: "Sofia",
    discipline: "Pre & postnatal",
    credential: "Certified in perinatal programming across all three trimesters.",
  },
  {
    name: "June",
    discipline: "Athletic",
    credential: "Works with runners and climbers on load tolerance and control.",
  },
  {
    name: "Ada",
    discipline: "Fundamentals",
    credential: "Teaches every beginner course. Twelve years on the mat.",
  },
];

/** The carousel beat between the zoom and the team. */
export const REASONING = {
  left: ["Train the", "thinking,"],
  right: ["not just", "the body."],
  body:
    "Understanding why a movement is programmed is what makes it transfer out of the studio. We teach the reasoning alongside the repetition.",
};

export const CLASSES = [
  {
    title: "Reformer Flow",
    tags: ["All levels", "50 min"],
    body: "Spring-loaded resistance, continuous transitions. The class most people mean when they say pilates.",
  },
  {
    title: "Mat Fundamentals",
    tags: ["Beginner", "45 min"],
    body: "The original 34 exercises, taught slowly. Where every strong practice actually starts.",
  },
  {
    title: "Tower & Chair",
    tags: ["Intermediate", "50 min"],
    body: "Less familiar apparatus, more honest feedback. Small ranges, unglamorous, extremely effective.",
  },
  {
    title: "Prenatal & Postnatal",
    tags: ["Specialist", "45 min"],
    body: "Programmed around the trimester you're in, and around the months after it.",
  },
  {
    title: "Private 1:1",
    tags: ["Bespoke", "55 min"],
    body: "One body, one plan, one instructor watching it. The fastest route through an injury.",
  },
  {
    title: "Small Group",
    tags: ["Max 6", "50 min"],
    body: "Six reformers, one instructor, real corrections. Close to a private at a fraction of it.",
  },
];

export const PROCESS = [
  { step: "01", title: "Assessment", body: "An hour on your history, your posture and what actually hurts." },
  { step: "02", title: "Programming", body: "A plan written for your body, not for the timetable." },
  { step: "03", title: "Practice", body: "Two or three sessions a week, corrected every single time." },
  { step: "04", title: "Progression", body: "Load and range increase only once the control is there." },
  { step: "05", title: "Review", body: "Every eight weeks we re-measure and rewrite the plan." },
];

export const REASONS = [
  {
    title: "Properly qualified",
    body: "Every instructor holds a full comprehensive certification — mat, reformer and apparatus — not a weekend course.",
  },
  {
    title: "Six to a class",
    body: "No packed studios. Six reformers means the instructor sees your form and says something about it.",
  },
  {
    title: "A real method",
    body: "Assess, programme, progress, review. Repeatable, written down, and the reason people stay for years.",
  },
  {
    title: "Human first",
    body: "Behind every body is a person with a job, an injury and a schedule. We programme around all three.",
  },
];

export const FAQS = [
  {
    q: "I've never done pilates. Where do I start?",
    a: "Mat Fundamentals, then an assessment. Reformer looks like the main event but the control you learn on a mat is what makes it work.",
  },
  {
    q: "How often should I come?",
    a: "Twice a week is the honest minimum for change you can feel. Three is where most people stop noticing their back.",
  },
  {
    q: "Is pilates enough on its own?",
    a: "For strength, control and mobility, yes. Pair it with walking or swimming if you also want cardiovascular fitness.",
  },
  {
    q: "I'm recovering from an injury. Can I train?",
    a: "Usually, and often sooner than you'd expect — but start with a Private 1:1 and bring whatever your physio has written.",
  },
  {
    q: "What should I wear and bring?",
    a: "Fitted clothing so the instructor can see your alignment, and grip socks. Everything else is here.",
  },
  {
    q: "Do you offer trial classes?",
    a: "One introductory week, three classes, at a reduced rate. No membership required to book it.",
  },
];
