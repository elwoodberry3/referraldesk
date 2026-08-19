"use client";
import React, { useState } from "react";
import { buildConfig } from "@/config/build.config";

export function Share() {
  const d = buildConfig.dealership;
  const [copied, setCopied] = useState(false);
  const link = `https://${d.subdomainPreview}/r/${d.repSlug}`;

  return (
    <div className="max-w-[520px]">
      <h2 className="text-ink text-xl m-0 mb-1 font-bold">Your referral link</h2>
      <p className="text-sm text-muted m-0 mb-5">
        Give this to happy customers. Anyone they send lands credited to you — no scratch paper.
      </p>
      <div className="bg-white rounded-lg p-6 text-center" style={{ border: "1px solid #E5E7EB" }}>
        <div className="mx-auto mb-4.5 rounded-lg grid p-3.5 gap-[3px]"
          style={{ width: 150, height: 150, background: "#111827", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: "repeat(7,1fr)", marginBottom: 18 }}>
          {Array.from({ length: 49 }).map((_, i) => (
            <div key={i} style={{ background: (i * 7 + ((i * 13) % 5)) % 3 === 0 ? "#fff" : "transparent", borderRadius: 1 }} />
          ))}
        </div>
        <div className="text-sm text-muted mb-1.5">
          Referred by <strong className="text-ink">{d.repName}</strong> · {d.shortName}
        </div>
        <div className="flex gap-2 items-center rounded-lg px-2.5 py-2" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
          <span className="flex-1 text-sm text-body overflow-hidden text-ellipsis whitespace-nowrap text-left">{link}</span>
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="border-none rounded-md px-3.5 py-1.5 text-sm font-semibold cursor-pointer text-white"
            style={{ background: "var(--brand)" }}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-sm text-body mt-4 text-center">
        When someone opens this link and books, they show up on your ledger already tagged to you.
      </p>
    </div>
  );
}
