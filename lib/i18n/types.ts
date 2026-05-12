import type { Tier } from "@/lib/tiers";

export type Dictionary = {
  htmlLang: string;
  langLabel: string;
  switchTo: string;

  nav: {
    brandA: string;
    brandB: string;
    tagline: string;
    submit: string;
  };

  home: {
    titleA: string;
    titleB: string;
    blurb: string;
    bathroomCount: (n: number) => string;
    voteCount: (n: number) => string;
    addOne: string;
    emptyTitle: string;
    emptyBody: string;
    emptyCta: string;
    rowEmpty: string;
  };

  countdown: {
    headline: string;
    daysLeftTemplate: string;
    ended: string;
  };

  tiers: Record<Tier, string>;

  scoreFlair: Record<number, string>;

  submit: {
    back: string;
    title: string;
    intro: string;
    nameLabel: string;
    namePlaceholder: string;
    schoolLabel: string;
    schoolPlaceholder: string;
    buildingLabel: string;
    buildingPlaceholder: string;
    floorLabel: string;
    floorPlaceholder: string;
    descLabel: string;
    descPlaceholder: string;
    coverImageLabel: string;
    coverImageHint: string;
    contentImagesLabel: string;
    contentImagesHint: string;
    ratingLabel: string;
    reviewLabel: string;
    reviewPlaceholder: string;
    submit: string;
    submitting: string;
  };

  detail: {
    back: string;
    tierBadge: string;
    voteHeading: string;
    reviewsHeading: string;
    noReviews: string;
    yourRating: string;
    leaveReview: string;
    reviewPlaceholder: string;
    vote: string;
    voting: string;
    voteRecorded: string;
    alreadyVoted: string;
    galleryEmpty: string;
    likeAction: string;
    unlikeAction: string;
  };

  footer: {
    left: string;
    right: string;
  };
};
