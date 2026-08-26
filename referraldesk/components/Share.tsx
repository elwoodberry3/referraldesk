"use client";
import React, { useState } from "react";
import { buildConfig } from "@/config/build.config";

/**
 * Sign-Up Funnel — the clickable POC moment: John Doe joining Adam.
 * A public referrer (creator/influencer/side-hustler) watches the VSL
 * and signs up. Their email feeds ADAM's CRM — the contact is Adam's.
 * On submit, the system "spins up" their referrer portal + link + QR.
 */
export function Share() {
  const d = buildConfig.dealership;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const ready = name.trim() && email.trim();

  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true);
    // Demo: the public sign-up writes the lead into Adam's CRM and
    // provisions the referrer portal. Simulated unless keys are set.
    try {
      await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: name,          // the signing-up referrer
          buyerPhone: "",
          vehicle: "Referrer sign-up",
          ownerAgentId: "AG-ADAM",  // contact belongs to Adam
          referrerName: "Sign-up funnel",
        }),
      });
      setTimeout(() => { setDone(true); setBusy(false); }, 700);
    } catch {
      setDone(true); setBusy(false);
    }
  };

  if (done) {
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="max-w-[520px]">
        <div className="rounded-lg p-6 text-center bg-white" style={{ border: "1px solid #A7F3D0" }}>
          <div className="text-3xl mb-2">✓</div>
          <h2 className="text-ink text-xl font-bold m-0 mb-1">Your portal is spinning up</h2>
          <p className="text-sm text-muted m-0 mb-4">
            Welcome, {name.split(" ")[0]}. Here&apos;s what the system just provisioned for you:
          </p>
          <ul className="text-left text-sm text-body inline-block m-0" style={{ lineHeight: 1.9 }}>
            <li>✓ Your referrer portal</li>
            <li>✓ Your personal link — <code style={{ background: "#F3F4F6", padding: "1px 5px", borderRadius: 4 }}>/r/{slug}</code></li>
            <li>✓ Your QR code</li>
            <li>✓ Your welcome + nurture emails, queued</li>
          </ul>
          <div className="mt-4 text-xs text-muted" style={{ lineHeight: 1.6 }}>
            Your info was added to {d.shortName}&apos;s system. Open the
            <strong> Referrer Portal · John Doe</strong> tab to see what your portal looks like.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[520px]">
      <h2 className="text-ink text-xl m-0 mb-1 font-bold">Earn ${d.payoutAmount} per referral</h2>
      <p className="text-sm text-muted m-0 mb-5">
        The public sign-up funnel. A creator or side-hustler lands here, watches the pitch,
        and joins — and the system spins up their whole referral kit automatically.
      </p>

      {/* VSL placeholder */}
      <div className="rounded-lg mb-5 flex items-center justify-center" style={{ background: "#111827", aspectRatio: "16/9" }}>
        <div className="text-center" style={{ color: "#9CA3AF" }}>
          <div style={{ fontSize: 34 }}>▶</div>
          <div className="text-xs mt-1">VSL — your pitch to referrers</div>
          <div className="text-[10px] mt-0.5" style={{ opacity: 0.6 }}>(demo placeholder)</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5" style={{ border: "1px solid #E5E7EB" }}>
        <label className="block mb-3.5">
          <span className="block text-sm font-semibold text-body mb-1.5">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe"
            className="w-full px-3 py-2.5 text-sm rounded-lg outline-none text-ink" style={{ border: "1px solid #E5E7EB" }} />
        </label>
        <label className="block mb-3.5">
          <span className="block text-sm font-semibold text-body mb-1.5">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email"
            className="w-full px-3 py-2.5 text-sm rounded-lg outline-none text-ink" style={{ border: "1px solid #E5E7EB" }} />
        </label>
        <button disabled={!ready || busy} onClick={submit}
          className="w-full py-3 text-[15px] font-bold rounded-lg border-none"
          style={{ cursor: ready && !busy ? "pointer" : "not-allowed", background: ready ? "var(--brand)" : "#E5E7EB", color: ready ? "#fff" : "#6B7280" }}>
          {busy ? "Spinning up your portal…" : "Sign up & get my link"}
        </button>
        <p className="text-[11px] text-muted mt-2.5 mb-0" style={{ lineHeight: 1.5 }}>
          By signing up your details are added to {d.shortName}&apos;s system. Payouts are funded
          by completed vehicle sales — there&apos;s no cost to join and no payment for signing up.
        </p>
      </div>
    </div>
  );
}
