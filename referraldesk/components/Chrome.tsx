"use client";
import React from "react";
import { buildConfig } from "@/config/build.config";

export function BrowserBar() {
  const d = buildConfig.dealership;
  return (
    <div className="flex items-center gap-2 px-3.5 py-2" style={{ background: "#E5E7EB" }}>
      <div className="flex gap-1.5">
        {["#F87171", "#FBBF24", "#34D399"].map((c) => (
          <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div className="flex-1 ml-2 text-xs text-muted rounded-md px-3 py-1.5 bg-white">
        🔒 {d.subdomainPreview}
      </div>
    </div>
  );
}

export function Header() {
  const d = buildConfig.dealership;
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base"
          style={{ background: "var(--brand)" }}>R</div>
        <div>
          <div className="font-bold text-ink text-base leading-tight">ReferralDesk</div>
          <div className="text-xs text-muted">{d.name}</div>
        </div>
      </div>
      <div className="text-sm text-muted">Signed in — {d.repName}</div>
    </header>
  );
}

export function Tabs({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const tabs = [
    { k: "ledger", label: "Adam's Ledger" },
    { k: "intake", label: "Rep Intake" },
    { k: "share", label: "Sign-Up Funnel" },
    { k: "agent", label: "Referrer Portal · John Doe" },
  ];
  return (
    <nav className="flex gap-1 px-3.5 bg-white" style={{ borderBottom: "1px solid #E5E7EB" }}>
      {tabs.map((t) => (
        <button key={t.k} onClick={() => setTab(t.k)}
          className="px-4 py-3.5 text-sm font-semibold cursor-pointer bg-transparent border-none"
          style={{
            color: tab === t.k ? "var(--brand)" : "#6B7280",
            borderBottom: "2px solid " + (tab === t.k ? "var(--brand)" : "transparent"),
          }}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
