/**
 * lib/store.ts — data layer
 * ------------------------------------------------------------
 * DEMO MODE: in-memory store, seeded from build.config.
 * This resets on server restart. It exists so the app is fully
 * clickable with ZERO external credentials for the walk-in demo.
 *
 * PRODUCTION (TODO_PERSISTENCE): swap this module for HubSpot as the
 * source of truth (contact store) with n8n Cloud owning drip state.
 * The exported function signatures stay the same so nothing upstream
 * changes — only the body of each function.
 */

import { buildConfig, type Referral, type ReferralStatus, type PayoutStatus } from "@/config/build.config";

let referrals: Referral[] = [...buildConfig.seed];

export function listReferrals(): Referral[] {
  return [...referrals].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addReferral(input: {
  buyerName: string;
  buyerPhone: string;
  vehicle: string;
  referrerName: string;
}): Referral {
  const record: Referral = {
    id: "RD-" + Math.floor(1044 + Math.random() * 9000),
    buyerName: input.buyerName.trim(),
    buyerPhone: input.buyerPhone.trim(),
    vehicle: input.vehicle.trim(),
    referrerName: input.referrerName.trim(),
    status: "New",
    payout: "Pending",
    createdAt: new Date().toISOString(),
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

export function payoutTotals() {
  const amount = buildConfig.dealership.payoutAmount;
  const owed = referrals.filter((r) => r.payout === "Owed").length * amount;
  const paid = referrals.filter((r) => r.payout === "Paid").length * amount;
  return { owed, paid, count: referrals.length };
}
