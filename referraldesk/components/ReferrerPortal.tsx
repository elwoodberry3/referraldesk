"use client";
import React, { useState } from "react";
import { buildConfig, type Referral } from "@/config/build.config";
import { Pill, statusStyle, payoutStyle } from "./ui";

/**
 * Referrer Portal — John Doe's POV.
 * A public referrer (content creator / side-hustler) who signed up
 * under Adam. Leads with THEIR earnings. Honest note: the leads they
 * generate become the AGENT's contacts — the referrer owns nothing.
 */
export function ReferrerPortal() {
  const d = buildConfig.dealership;
  const rf = buildConfig.demoReferrer;
  const owningAgent = buildConfig.agents.find((a) => a.id === rf.agentId);
  const [copied, setCopied] = useState(false);

  const mine: Referral[] = buildConfig.seed.filter((r) => r.referrerId === rf.id);
  const owed = mine.filter((r) => r.payout === "Owed").length * d.payoutAmount;
  const paid = mine.filter((r) => r.payout === "Paid").length * d.payoutAmount;
  const link = `https://${d.subdomainPreview}/r/${rf.slug}`;

  return (
    <div>
      {/* Referrer identity — the "official, representative appearance" */}
      <div className="flex items-center gap-3 mb-5 p-4 rounded-lg bg-white" style={{ border: "1px solid #E5E7EB" }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: "var(--brand)" }}>
          {rf.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div className="font-bold text-ink text-base leading-tight">{rf.name}</div>
          <div className="text-xs text-muted">Referral partner · {d.shortName}</div>
        </div>
        <span className="ml-auto text-[10px] font-bold text-muted bg-canvas rounded px-1.5 py-0.5" style={{ border: "1px solid #E5E7EB" }} title="Sample referrer — demo data">DEMO REFERRER</span>
      </div>

      {/* EARNINGS FIRST — what John logs in for */}
      <div className="rounded-lg p-5 mb-5" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#047857" }}>Your earnings</div>
        <div className="flex items-end gap-2 flex-wrap">
          <div className="text-4xl font-bold" style={{ color: "#065F46" }}>${(owed + paid).toLocaleString()}</div>
          <div className="text-sm mb-1.5" style={{ color: "#047857" }}>
            ${owed.toLocaleString()} owed · ${paid.toLocaleString()} paid
          </div>
        </div>
        <div className="text-xs mt-1.5" style={{ color: "#047857" }}>
          {mine.length} people referred · ${d.payoutAmount} per sale
        </div>
      </div>

      {/* Their referrals */}
      <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">People you referred</div>
      <div className="bg-white rounded-lg overflow-hidden mb-5" style={{ border: "1px solid #E5E7EB" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: 460 }}>
            <thead>
              <tr className="text-left text-muted text-xs uppercase" style={{ background: "#F9FAFB", letterSpacing: "0.04em" }}>
                {["Name", "Looking for", "Status", "Your payout"].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                  <td className="px-3.5 py-3 font-semibold text-ink">{r.buyerName}</td>
                  <td className="px-3.5 py-3 text-body">{r.vehicle}</td>
                  <td className="px-3.5 py-3"><Pill label={r.status} style={statusStyle(r.status)} /></td>
                  <td className="px-3.5 py-3">
                    <Pill label={r.payout === "Pending" ? "—" : "$" + d.payoutAmount + " " + r.payout} style={payoutStyle(r.payout)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Share assets */}
      <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">Your link &amp; QR</div>
      <div className="bg-white rounded-lg p-5 flex gap-5 items-center flex-wrap" style={{ border: "1px solid #E5E7EB" }}>
        <div className="rounded-lg grid p-2.5 gap-[2px]" style={{ width: 96, height: 96, background: "#111827", gridTemplateColumns: "repeat(6,1fr)", gridTemplateRows: "repeat(6,1fr)" }}>
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} style={{ background: (i * 5 + ((i * 11) % 4)) % 3 === 0 ? "#fff" : "transparent", borderRadius: 1 }} />
          ))}
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="text-sm text-body mb-2">Share this anywhere. Anyone who books lands credited to you.</div>
          <div className="flex gap-2 items-center rounded-lg px-2.5 py-2" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            <span className="flex-1 text-sm text-body overflow-hidden text-ellipsis whitespace-nowrap">{link}</span>
            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="border-none rounded-md px-3.5 py-1.5 text-sm font-semibold cursor-pointer text-white" style={{ background: "var(--brand)" }}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Honest ownership note — the referrer owns nothing */}
      <p className="text-xs text-muted mt-3" style={{ lineHeight: 1.6 }}>
        You earn ${d.payoutAmount} for every referral that buys. The customer records you generate
        belong to {owningAgent?.name} at {d.shortName} — you&apos;re driving leads into their book,
        not building your own list.
      </p>
    </div>
  );
}
