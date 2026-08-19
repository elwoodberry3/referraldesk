"use client";
import React from "react";
import { buildConfig, type ReferralStatus, type PayoutStatus } from "@/config/build.config";

export function statusStyle(s: ReferralStatus) {
  const map: Record<ReferralStatus, { bg: string; text: string }> = {
    New: { bg: "#F3F4F6", text: "#374151" },
    Showed: { bg: "#EFF6FF", text: "#1D4ED8" },
    Sold: { bg: "#ECFDF5", text: "#047857" },
    Lost: { bg: "#FEF2F2", text: "#B91C1C" },
  };
  return map[s];
}

export function payoutStyle(p: PayoutStatus) {
  const map: Record<PayoutStatus, { bg: string; text: string }> = {
    Pending: { bg: "#F3F4F6", text: "#6B7280" },
    Owed: { bg: "#FFFBEB", text: "#B45309" },
    Paid: { bg: "#ECFDF5", text: "#047857" },
  };
  return map[p];
}

export function Pill({ label, style }: { label: string; style: { bg: string; text: string } }) {
  return (
    <span style={{ background: style.bg, color: style.text }}
      className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
      {label}
    </span>
  );
}

export function Tip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span title={text} className="cursor-help" style={{ borderBottom: "1px dotted #6B7280" }}>
      {children}
    </span>
  );
}

export function TodoChips() {
  return (
    <section className="mt-9 pt-5" style={{ borderTop: "1px dashed #E5E7EB" }}>
      <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2.5">
        Not in this demo — production build
      </div>
      <div className="flex flex-wrap gap-2">
        {buildConfig.todoChips.map((t) => (
          <span key={t} className="text-xs font-semibold text-body bg-canvas rounded-md px-2.5 py-1"
            style={{ border: "1px solid #E5E7EB" }}>
            → {t}
          </span>
        ))}
      </div>
    </section>
  );
}
