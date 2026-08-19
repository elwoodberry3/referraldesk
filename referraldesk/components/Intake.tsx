"use client";
import React, { useState } from "react";
import { buildConfig } from "@/config/build.config";
import { Tip } from "./ui";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-3.5">
      <span className="block text-sm font-semibold text-body mb-1.5">{label}</span>
      <input {...props}
        className="w-full px-3 py-2.5 text-sm rounded-lg outline-none text-ink"
        style={{ border: "1px solid #E5E7EB" }} />
    </label>
  );
}

export function Intake({ onLogged }: { onLogged: () => void }) {
  const d = buildConfig.dealership;
  const [f, setF] = useState({ buyerName: "", buyerPhone: "", vehicle: "", referrerName: "" });
  const [result, setResult] = useState<null | { actions: Record<string, { demo: boolean; detail: string }> }>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const ready = f.buyerName.trim() && f.referrerName.trim();

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ actions: {} });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[520px]">
      <h2 className="text-ink text-xl m-0 mb-1 font-bold">New referral at the desk</h2>
      <p className="text-sm text-muted m-0 mb-5">
        Enter it the moment they sit down. It&apos;s credited and tracked before the test drive.
      </p>
      <div className="bg-white rounded-lg p-5" style={{ border: "1px solid #E5E7EB" }}>
        <Field label="Buyer name" value={f.buyerName} onChange={set("buyerName")} placeholder="e.g. Marcus Webb" />
        <Field label="Buyer phone" value={f.buyerPhone} onChange={set("buyerPhone")} placeholder="(269) 555-0000" />
        <Field label="Vehicle of interest" value={f.vehicle} onChange={set("vehicle")} placeholder="2021 F-150 XLT" />
        <Field label="Referred by" value={f.referrerName} onChange={set("referrerName")} placeholder="Who sent them?" />
        <button disabled={!ready || busy} onClick={submit}
          className="w-full py-3 text-[15px] font-bold rounded-lg border-none mt-1"
          style={{
            cursor: ready && !busy ? "pointer" : "not-allowed",
            background: ready ? "var(--brand)" : "#E5E7EB",
            color: ready ? "#fff" : "#6B7280",
          }}>
          {busy ? "Logging…" : "Log referral"}
        </button>
      </div>

      {result && (
        <div className="mt-4 rounded-lg p-4" style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}>
          <div className="font-bold mb-2" style={{ color: "#047857" }}>Referral logged — here&apos;s what fired:</div>
          <ul className="m-0 pl-4.5 text-body text-sm leading-7" style={{ paddingLeft: 18 }}>
            <li>{f.referrerName} credited for {f.buyerName || "buyer"}</li>
            <li><Tip text={result.actions?.crm?.demo ? "Demo store — real CRM write-back goes live with your HubSpot key" : "Written to HubSpot"}>Buyer written to CRM</Tip></li>
            <li><Tip text={result.actions?.sms?.demo ? "Simulated — live SMS fires when the texting key is set" : "Live text sent"}>Confirmation text to buyer</Tip></li>
            <li>{d.repName} notified of new referral</li>
          </ul>
          <button onClick={onLogged}
            className="mt-3 border-none rounded-md px-3.5 py-2 text-sm font-semibold cursor-pointer text-white"
            style={{ background: "var(--brand)" }}>
            See it on the ledger →
          </button>
        </div>
      )}
    </div>
  );
}
