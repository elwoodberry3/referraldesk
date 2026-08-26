"use client";
import React, { useEffect, useState, useCallback } from "react";
import { buildConfig, type Referral } from "@/config/build.config";
import { Pill, statusStyle, payoutStyle } from "./ui";

function StatCard({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="bg-white rounded-lg px-4 py-3.5 flex-1 min-w-[130px]" style={{ border: "1px solid #E5E7EB" }}>
      <div className="text-xs text-muted font-semibold">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: tone || "#111827" }}>{value}</div>
    </div>
  );
}

export function Ledger() {
  const d = buildConfig.dealership;
  const [rows, setRows] = useState<Referral[]>(buildConfig.seed);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/referrals", { cache: "no-store" });
      const data = await res.json();
      setRows(data.referrals);
    } catch {
      /* keep seed on failure — demo stays alive */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const advance = async (id: string) => {
    // optimistic
    setRows((rs) => rs.map((r) => {
      if (r.id !== id) return r;
      if (r.status === "New") return { ...r, status: "Showed" };
      if (r.status === "Showed") return { ...r, status: "Sold", payout: "Owed" };
      if (r.status === "Sold" && r.payout === "Owed") return { ...r, payout: "Paid" };
      return r;
    }));
    try {
      await fetch("/api/referrals/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch { /* optimistic state already applied */ }
  };

  const owed = rows.filter((r) => r.payout === "Owed").length * d.payoutAmount;
  const paid = rows.filter((r) => r.payout === "Paid").length * d.payoutAmount;

  // Rooftop roll-up — referrals driven by REFERRERS under Adam
  const referrerRows = rows.filter((r) => r.referrerId);
  const referrerTotal = referrerRows.filter((r) => r.payout !== "Pending").length * d.payoutAmount;

  return (
    <div>
      {/* Rooftop strip — Adam sitting on top of his referrers */}
      <div className="rounded-lg p-4 mb-4 flex items-center gap-4 flex-wrap" style={{ background: "var(--brand)", color: "#fff" }}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ opacity: 0.85 }}>Your referrer network</div>
          <div className="text-sm" style={{ opacity: 0.95 }}>Leads coming up through people referring for you</div>
        </div>
        <div className="ml-auto flex gap-6">
          <div>
            <div className="text-2xl font-bold">{buildConfig.referrers.filter((rf) => rf.agentId === "AG-ADAM").length}</div>
            <div className="text-xs" style={{ opacity: 0.85 }}>referrers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{referrerRows.length}</div>
            <div className="text-xs" style={{ opacity: 0.85 }}>referred leads</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${referrerTotal.toLocaleString()}</div>
            <div className="text-xs" style={{ opacity: 0.85 }}>referrer payouts</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap mb-5">
        <StatCard label="Contacts owned" value={rows.length} />
        <StatCard label="Owed to referrers" value={"$" + owed.toLocaleString()} tone="#B45309" />
        <StatCard label="Paid out" value={"$" + paid.toLocaleString()} tone="#047857" />
      </div>

      <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: 640 }}>
            <thead>
              <tr className="text-left text-muted text-xs uppercase" style={{ background: "#F9FAFB", letterSpacing: "0.04em" }}>
                {["Buyer", "Vehicle", "Referred by", "Status", "Payout", ""].map((h) => (
                  <th key={h} className="px-3.5 py-2.5 font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #E5E7EB" }}>
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-ink">
                      {r.buyerName}
                      {r.mock && (
                        <span title="Sample data — not a real customer"
                          className="ml-1.5 text-[10px] font-bold text-muted bg-canvas rounded px-1 py-0.5 align-middle">MOCK</span>
                      )}
                    </div>
                    <div className="text-xs text-muted">{r.buyerPhone}</div>
                  </td>
                  <td className="px-3.5 py-3 text-body">{r.vehicle}</td>
                  <td className="px-3.5 py-3 text-body">{r.referrerName}</td>
                  <td className="px-3.5 py-3"><Pill label={r.status} style={statusStyle(r.status)} /></td>
                  <td className="px-3.5 py-3">
                    <Pill label={r.payout === "Pending" ? "—" : "$" + d.payoutAmount + " " + r.payout} style={payoutStyle(r.payout)} />
                  </td>
                  <td className="px-3.5 py-3 text-right">
                    {!(r.status === "Sold" && r.payout === "Paid") && r.status !== "Lost" && (
                      <button onClick={() => advance(r.id)}
                        className="rounded-md px-3 py-1.5 text-sm font-semibold cursor-pointer bg-white whitespace-nowrap"
                        style={{ border: "1px solid var(--brand)", color: "var(--brand)" }}>
                        {r.status === "New" ? "Mark shown" : r.status === "Showed" ? "Mark sold" : "Mark paid"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted mt-2.5">
        Advancing a row to <strong>Sold</strong> flips its payout to Owed and adds ${d.payoutAmount} to the running total.
        {loading ? " · syncing…" : ""}
      </p>
    </div>
  );
}
