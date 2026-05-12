import type { Dictionary } from "./types";

const en: Dictionary = {
  htmlLang: "en",
  langLabel: "EN",
  switchTo: "中文",

  nav: {
    brandA: "King of ",
    brandB: "Shit",
    tagline: "/ the uni bathroom tier list",
    submit: "+ Submit a bathroom",
  },

  home: {
    titleA: "The Uni Bathroom ",
    titleB: "Tier List",
    blurb:
      "Crowd-sourced rankings of every campus toilet worth visiting (and a few you should burn down). Rate 1–10 — the average determines the tier. No login. No mercy.",
    bathroomCount: (n) => `${n} bathroom${n === 1 ? "" : "s"}`,
    voteCount: (n) => `${n} vote${n === 1 ? "" : "s"}`,
    addOne: "Add one →",
    emptyTitle: "No bathrooms yet.",
    emptyBody: "Be the first to nominate a porcelain throne (or a war crime).",
    emptyCta: "Submit the first one",
    rowEmpty: "empty — nominate one",
  },

  countdown: {
    headline:
      "I will personally visit the #1 and last-place bathrooms when voting closes.",
    daysLeftTemplate: "{n} days left to vote",
    ended: "Voting closed. Pilgrimage incoming.",
  },

  tiers: {
    S: "porcelain throne — life-changing flush",
    A: "would poop here again",
    B: "respectable, no complaints",
    C: "mid. holds liquid.",
    D: "use only if desperate",
    F: "biohazard. condemn the building.",
  },

  scoreFlair: {
    1: "war crime",
    2: "biohazard",
    3: "rough",
    4: "questionable",
    5: "mid",
    6: "fine, i guess",
    7: "solid",
    8: "great",
    9: "elite",
    10: "porcelain throne",
  },

  submit: {
    back: "← back to tier list",
    title: "Submit a bathroom",
    intro: "Drop a new toilet into the list — your rating starts the average.",
    nameLabel: "Bathroom name / nickname *",
    namePlaceholder: 'e.g. "The 3rd Floor Stinkpit"',
    schoolLabel: "School / University *",
    schoolPlaceholder: "e.g. University of Melbourne",
    buildingLabel: "Building",
    buildingPlaceholder: "e.g. Old Arts",
    floorLabel: "Floor / location",
    floorPlaceholder: "e.g. 3rd floor, west wing",
    descLabel: "Vibe / description",
    descPlaceholder: "Describe the ambiance. Be honest.",
    coverImageLabel: "Cover image",
    coverImageHint: "Headline shot — shows on the tier card. JPG/PNG/WEBP up to 8MB.",
    contentImagesLabel: "More photos",
    contentImagesHint: "Up to 8 photos — gallery on the detail page.",
    ratingLabel: "Your rating *",
    reviewLabel: "Quick review (optional)",
    reviewPlaceholder: '"Soft lighting, hard truths." Tell us what you saw.',
    submit: "Submit & rate 🚽",
    submitting: "Submitting...",
  },

  detail: {
    back: "← back to tier list",
    tierBadge: "tier",
    voteHeading: "Cast your vote",
    reviewsHeading: "Reviews",
    noReviews: "No written reviews yet.",
    yourRating: "Your rating",
    leaveReview: "Leave a review (optional)",
    reviewPlaceholder: "What was the experience like?",
    vote: "Cast your vote",
    voting: "Voting...",
    voteRecorded: "Vote recorded. Flush counted.",
    alreadyVoted: "You've already voted on this stall.",
    galleryEmpty: "No photos yet.",
    likeAction: "👍 Like",
    unlikeAction: "👍 Liked",
  },

  footer: {
    left: "made for the people. flush responsibly.",
    right: "no login. no judgement (except of the toilets).",
  },
};

export default en;
