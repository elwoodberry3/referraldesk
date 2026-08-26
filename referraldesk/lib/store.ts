/**
 * lib/store.ts — data layer (three-tier: Rooftop → Agents → Referrers)
 * ------------------------------------------------------------
 * DEMO MODE: in-memory store, seeded from build.config. Resets on
 * restart. Exists so the app is fully clickable with ZERO credentials.
 *
 * OWNERSHIP RULE (encoded here, not just described):
 *   - Every contact is OWNED BY AN AGENT (ownerAgentId).
 *   - A REFERRER operates a link but owns nothing (referrerId).
 *   - Adam is the rooftop admin: he sees ALL agents' contacts.
 *   - A non-admin agent sees ONLY their own contacts.
 *   - If a referrer leaves, nothing transfers — the agent already owned it.
 *
 * PRODUCTION (TODO_PERSISTENCE): swap bodies for HubSpot as source of
 * truth. Signatures stay the same so nothing upstream changes.
 */

import {
  buildConfig,
  type Referral,
  type ReferralStatus,
  type PayoutStatus,
  type Agent,
  type Referrer,
} from "@/config/build.config";

let referrals: Referral[] = [...buildConfig.seed];

const amount = () => buildConfig.dealership.payoutAmount;

export function listReferrals(): Referral[] {
  return [...referrals].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/**
 * A referrer submits a lead through their public funnel.
 * The contact is written to the OWNING AGENT's book (referrer owns nothing).
 */
export function addReferral(input: {
  buyerName: string;
  buyerPhone: string;
  vehicle: string;
  referrerId?: string;      // who operated the link
  referrerName: string;
  ownerAgentId: string;     // who OWNS the resulting contact
}): Referral {
  const record: Referral = {
    id: "RD-" + Math.floor(1050 + Math.random() * 9000),
    buyerName: input.buyerName.trim(),
    buyerPhone: input.buyerPhone.trim(),
    vehicle: input.vehicle.trim(),
    referrerName: input.referrerName.trim(),
    status: "New",
    payout: "Pending",
    createdAt: new Date().toISOString(),
    ownerAgentId: input.ownerAgentId,
    referrerId: input.referrerId,
  };
  referrals = [record, ...referrals];
  return record;
}

export function advanceReferral(id: string): Referral | null {
  let updated: Referral | null = null;
  referrals = referrals.map((r) => {
    if (r.id !== id) return r;
    let status: ReferralStatus = r.status;
    let payout: PayoutStatus = r.payout;
    if (r.status === "New") status = "Showed";
    else if (r.status === "Showed") { status = "Sold"; payout = "Owed"; }
    else if (r.status === "Sold" && r.payout === "Owed") payout = "Paid";
    updated = { ...r, status, payout };
    return updated;
  });
  return updated;
}

/* ---- Agents ---- */

export function listAgents(): Agent[] {
  return [...buildConfig.agents];
}

export function getAgent(agentId: string): Agent | undefined {
  return buildConfig.agents.find((a) => a.id === agentId);
}

/**
 * What an agent can SEE. Rooftop admin (Adam) sees everything;
 * a normal agent sees only contacts they own. This is the
 * visibility boundary the whole model hangs on.
 */
export function referralsVisibleTo(agentId: string): Referral[] {
  const agent = getAgent(agentId);
  if (agent?.isRooftopAdmin) return listReferrals();
  return listReferrals().filter((r) => r.ownerAgentId === agentId);
}

/** An agent's owned pipeline value. */
export function agentTotals(agentId: string) {
  const mine = referrals.filter((r) => r.ownerAgentId === agentId);
  const owed = mine.filter((r) => r.payout === "Owed").length * amount();
  const paid = mine.filter((r) => r.payout === "Paid").length * amount();
  return { owed, paid, count: mine.length, pipeline: owed + paid };
}

/* ---- Referrers ---- */

export function listReferrers(): Referrer[] {
  return [...buildConfig.referrers];
}

export function referrersForAgent(agentId: string): Referrer[] {
  return buildConfig.referrers.filter((rf) => rf.agentId === agentId);
}

/** One referrer's OWN performance — the number they log in to see. */
export function referrerStats(referrerId: string) {
  const mine = referrals.filter((r) => r.referrerId === referrerId);
  const owed = mine.filter((r) => r.payout === "Owed").length * amount();
  const paid = mine.filter((r) => r.payout === "Paid").length * amount();
  return { owed, paid, count: mine.length, earned: owed + paid };
}

/* ---- Adam's rooftop roll-up (business-case reveal) ---- */

export function rooftopRollup() {
  const byReferrer = referrals.filter((r) => r.referrerId);
  const owed = byReferrer.filter((r) => r.payout === "Owed").length * amount();
  const paid = byReferrer.filter((r) => r.payout === "Paid").length * amount();
  return {
    agentCount: buildConfig.agents.length,
    referrerCount: buildConfig.referrers.length,
    referrerDrivenReferrals: byReferrer.length,
    referrerDrivenTotal: owed + paid,
  };
}
