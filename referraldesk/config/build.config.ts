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
  // --- ownership model (three tiers) ---
  ownerAgentId: string;  // the AGENT who OWNS this contact (Adam is an agent)
  referrerId?: string;   // the REFERRER who operated the link (owns nothing)
}

// An AGENT owns contacts. Adam is the top agent + rooftop admin.
export interface Agent {
  id: string;
  name: string;
  slug: string;
  joinedAt: string;
  isRooftopAdmin?: boolean; // Adam sees ALL agents' contacts
  mock?: boolean;
}

// A REFERRER operates a public portal under one agent. Owns nothing.
// Their contacts belong to the agent above them.
export interface Referrer {
  id: string;
  name: string;
  slug: string;
  email: string;
  agentId: string;   // which agent they operate under
  joinedAt: string;
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

  /* ---- Three-tier model: Rooftop → Agents → Referrers ---- */
  // AGENTS own contacts. Adam is the top agent AND the rooftop admin
  // (he can see every agent's contacts). Contacts always belong to the
  // agent; referrers operate but own nothing.
  agents: [
    { id: "AG-ADAM", name: "Adam B.", slug: "adam-b", joinedAt: "2026-06-01T00:00:00Z", isRooftopAdmin: true, mock: true },
    { id: "AG-02", name: "Renee Salazar", slug: "renee-s", joinedAt: "2026-08-02T00:00:00Z", mock: true },
  ] as Agent[],

  // REFERRERS operate a public portal under one agent. The demo leads
  // with John Doe, a referrer who signed up under Adam.
  demoReferrer: {
    id: "RF-JOHN",
    name: "John Doe",
    slug: "john-doe",
    email: "john.doe@email.com",
    agentId: "AG-ADAM",
  },

  referrers: [
    { id: "RF-JOHN", name: "John Doe", slug: "john-doe", email: "john.doe@email.com", agentId: "AG-ADAM", joinedAt: "2026-07-30T00:00:00Z", mock: true },
    { id: "RF-MIA", name: "Mia Chen", slug: "mia-chen", email: "mia@email.com", agentId: "AG-ADAM", joinedAt: "2026-08-05T00:00:00Z", mock: true },
    { id: "RF-JANE", name: "Jane Doe", slug: "jane-doe", email: "jane@email.com", agentId: "AG-02", joinedAt: "2026-08-10T00:00:00Z", mock: true },
  ] as Referrer[],
  /* -------------------------------------------------------- */

  todoChips: [
    "Real CRM write-back",
    "Payout via ACH / check run",
    "Self-referral / fraud guard",
    "Referrer email verification",
    "Michigan bird-dog compliance check",
  ],

  seed: [
    // Referrers under ADAM (AG-ADAM) — contacts OWNED BY ADAM
    { id: "RD-1041", buyerName: "Marcus Webb", buyerPhone: "(269) 555-0142", vehicle: "2021 F-150 XLT", referrerName: "John Doe", status: "Sold", payout: "Owed", createdAt: "2026-08-11T15:20:00Z", mock: true, ownerAgentId: "AG-ADAM", referrerId: "RF-JOHN" },
    { id: "RD-1042", buyerName: "Priya Nair", buyerPhone: "(269) 555-0198", vehicle: "2019 Escape SE", referrerName: "John Doe", status: "Showed", payout: "Pending", createdAt: "2026-08-13T18:05:00Z", mock: true, ownerAgentId: "AG-ADAM", referrerId: "RF-JOHN" },
    { id: "RD-1044", buyerName: "Lena Ortiz", buyerPhone: "(269) 555-0163", vehicle: "2021 Edge SEL", referrerName: "John Doe", status: "Sold", payout: "Paid", createdAt: "2026-08-06T14:10:00Z", mock: true, ownerAgentId: "AG-ADAM", referrerId: "RF-JOHN" },
    { id: "RD-1047", buyerName: "Kyle Bennett", buyerPhone: "(269) 555-0134", vehicle: "2022 Escape SEL", referrerName: "Mia Chen", status: "Sold", payout: "Owed", createdAt: "2026-08-12T16:15:00Z", mock: true, ownerAgentId: "AG-ADAM", referrerId: "RF-MIA" },
    { id: "RD-1048", buyerName: "Grace Liu", buyerPhone: "(269) 555-0159", vehicle: "2020 Escape SE", referrerName: "Mia Chen", status: "New", payout: "Pending", createdAt: "2026-08-15T11:00:00Z", mock: true, ownerAgentId: "AG-ADAM", referrerId: "RF-MIA" },
    // Adam's OWN direct referral (no referrer) — still owned by Adam
    { id: "RD-1040", buyerName: "Sofia Alvarez", buyerPhone: "(269) 555-0110", vehicle: "2020 Ranger XLT", referrerName: "Adam B.", status: "Sold", payout: "Paid", createdAt: "2026-08-04T16:00:00Z", mock: true, ownerAgentId: "AG-ADAM" },
    // Referrer under the OTHER agent (AG-02) — contacts OWNED BY RENEE, Adam sees but agent can't cross over
    { id: "RD-1046", buyerName: "Bianca Ford", buyerPhone: "(269) 555-0188", vehicle: "2023 Bronco Sport", referrerName: "Jane Doe", status: "Showed", payout: "Pending", createdAt: "2026-08-14T19:00:00Z", mock: true, ownerAgentId: "AG-02", referrerId: "RF-JANE" },
  ] as Referral[],

  links: {
    github: "https://github.com/elwoodberry3/ias-build-020-referraldesk",
    portfolio: "referraldesk.elwoodberry.com",
    booking: "https://elwoodberry.com/contact",
  },
} as const;

export type BuildConfig = typeof buildConfig;
