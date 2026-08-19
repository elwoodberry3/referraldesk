/**
 * build.config.ts — ReferralDesk (IAS Build 020)
 * ------------------------------------------------------------
 * To "install" for a new dealership, change ONLY the `dealership`
 * block below. The subdomain, name, brand color, rep, and payout
 * rule all flow from here into every screen.
 *
 * Governance:
 *  - "Demonstrate, never claim": seed rows are labeled mock in the UI.
 *  - Neutral palette so the tool reads as the DEALERSHIP's, not IAS.
 *  - TODO_ tokens mark real enterprise gaps (the deep-build door).
 */

export type ReferralStatus = "New" | "Showed" | "Sold" | "Lost";
export type PayoutStatus = "Pending" | "Owed" | "Paid";

export interface Referral {
  id: string;
  buyerName: string;
  buyerPhone: string;
  vehicle: string;
  referrerName: string;
  status: ReferralStatus;
  payout: PayoutStatus;
  createdAt: string;
  mock?: boolean;
}

export const buildConfig = {
  buildNumber: 20,
  name: "ReferralDesk",
  sector: "Automotive Retail & Dealership Operations",
  tagline: "Every referral captured, credited, and queued for payout.",

  /* ---- THE ONLY BLOCK YOU CHANGE PER CLIENT ---- */
  dealership: {
    name: "Seelye Ford of Kalamazoo",
    shortName: "Seelye Ford",
    subdomainPreview: "referraldesk.betterseeseelye.com",
    payoutAmount: 200,
    brandColor: "#00529B",
    repName: "Adam B.",
    repSlug: "adam-b",
  },
  /* --------------------------------------------- */

  todoChips: [
    "Real CRM write-back",
    "Payout via ACH / check run",
    "Self-referral / fraud guard",
    "Multi-rep + rooftop separation",
  ],

  seed: [
    { id: "RD-1041", buyerName: "Marcus Webb", buyerPhone: "(269) 555-0142", vehicle: "2021 F-150 XLT", referrerName: "Tanya Brooks", status: "Sold", payout: "Owed", createdAt: "2026-08-11T15:20:00Z", mock: true },
    { id: "RD-1042", buyerName: "Priya Nair", buyerPhone: "(269) 555-0198", vehicle: "2019 Escape SE", referrerName: "Tanya Brooks", status: "Showed", payout: "Pending", createdAt: "2026-08-13T18:05:00Z", mock: true },
    { id: "RD-1043", buyerName: "Dee Coleman", buyerPhone: "(269) 555-0175", vehicle: "2022 Explorer", referrerName: "Marcus Webb", status: "New", payout: "Pending", createdAt: "2026-08-15T13:40:00Z", mock: true },
    { id: "RD-1040", buyerName: "Sofia Alvarez", buyerPhone: "(269) 555-0110", vehicle: "2020 Ranger XLT", referrerName: "James Okafor", status: "Sold", payout: "Paid", createdAt: "2026-08-04T16:00:00Z", mock: true },
  ] as Referral[],

  links: {
    github: "https://github.com/elwoodberry3/ias-build-020-referraldesk",
    portfolio: "referraldesk.elwoodberry.com",
    booking: "https://elwoodberry.com/contact",
  },
} as const;

export type BuildConfig = typeof buildConfig;
