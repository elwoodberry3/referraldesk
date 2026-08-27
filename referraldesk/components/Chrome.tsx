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

export function Header({
  activeAgentId,
  setActiveAgentId,
}: {
  activeAgentId: string;
  setActiveAgentId: (id: string) => void;
}) {
  const d = buildConfig.dealership;

  // The logged-in user is the rooftop admin (Adam). Only the admin
  // gets the "view as" control — a normal agent would never see it.
  const admin = buildConfig.agents.find((a) => a.isRooftopAdmin);
  const isAdmin = !!admin;
  const activeAgent = buildConfig.agents.find((a) => a.id === activeAgentId);
  const viewingSelf = activeAgentId === admin?.id;

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white flex-wrap gap-3" style={{ borderBottom: "1px solid #E5E7EB" }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-base"
          style={{ background: "var(--brand)" }}>R</div>
        <div>
          <div className="font-bold text-ink text-base leading-tight">ReferralDesk</div>
          <div className="text-xs text-muted">{d.name}</div>
        </div>
      </div>

      {isAdmin ? (
        <div className="flex items-center gap-2">
          {!viewingSelf && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded"
              style={{ background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>
              Viewing as agent
            </span>
          )}
          <label className="text-sm text-muted flex items-center gap-1.5">
            View as:
            <select
              value={activeAgentId}
              onChange={(e) => setActiveAgentId(e.target.value)}
              className="text-sm font-semibold text-ink rounded-md px-2 py-1 cursor-pointer bg-white"
              style={{ border: "1px solid #E5E7EB" }}
            >
              {buildConfig.agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}{a.isRooftopAdmin ? " (you · admin)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <div className="text-sm text-muted">Signed in — {activeAgent?.name}</div>
      )}
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
