"use client";
import React, { useState } from "react";
import { buildConfig } from "@/config/build.config";

export default function ReferralLanding({ params }: { params: { code: string } }) {
  const d = buildConfig.dealership;
  const [f, setF] = useState({ buyerName: "", buyerPhone: "", vehicle: "" });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const ready = f.buyerName.trim();

  // Turn the URL slug back into a display name (adam-b -> Adam B.)
  const referrer = params.code.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, referrerSlug: params.code }),
      });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F9FAFB" }}>
      <div className="w-full max-w-[420px] bg-white rounded-xl p-6" style={{ border: "1px solid #E5E7EB" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base" style={{ background: "var(--brand)" }}>R</div>
          <div className="font-bold text-ink">{d.shortName}</div>
        </div>

        {!done ? (
          <>
            <h1 className="text-ink text-xl font-bold m-0 mb-1">You were referred by {referrer}</h1>
            <p className="text-sm text-muted m-0 mb-5">
              Drop your info and {d.shortName} will reach out. Takes 20 seconds.
            </p>
            {[
              { k: "buyerName" as const, label: "Your name", ph: "First and last" },
              { k: "buyerPhone" as const, label: "Phone", ph: "(269) 555-0000" },
              { k: "vehicle" as const, label: "What are you looking for?", ph: "Truck, SUV, budget…" },
            ].map((row) => (
              <label key={row.k} className="block mb-3.5">
                <span className="block text-sm font-semibold text-body mb-1.5">{row.label}</span>
                <input value={f[row.k]} onChange={set(row.k)} placeholder={row.ph}
                  className="w-full px-3 py-2.5 text-sm rounded-lg outline-none text-ink" style={{ border: "1px solid #E5E7EB" }} />
              </label>
            ))}
            <button disabled={!ready || busy} onClick={submit}
              className="w-full py-3 text-[15px] font-bold rounded-lg border-none"
              style={{ cursor: ready && !busy ? "pointer" : "not-allowed", background: ready ? "var(--brand)" : "#E5E7EB", color: ready ? "#fff" : "#6B7280" }}>
              {busy ? "Sending…" : "Send my info"}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-2xl mb-2">✓</div>
            <h1 className="text-ink text-xl font-bold m-0 mb-1">You&apos;re all set</h1>
            <p className="text-sm text-muted m-0">
              {d.shortName} has your info, credited to {referrer}. Someone will reach out shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
