"use client";
import React, { useState } from "react";
import { BrowserBar, Header, Tabs } from "@/components/Chrome";
import { Ledger } from "@/components/Ledger";
import { Intake } from "@/components/Intake";
import { Share } from "@/components/Share";
import { ReferrerPortal } from "@/components/ReferrerPortal";
import { TodoChips } from "@/components/ui";
import { buildConfig } from "@/config/build.config";

export default function Page() {
  const [tab, setTab] = useState("ledger");
  // Who the admin is currently "viewing as". Defaults to the admin (Adam).
  const adminId = buildConfig.agents.find((a) => a.isRooftopAdmin)?.id
    || buildConfig.agents[0].id;
  const [activeAgentId, setActiveAgentId] = useState(adminId);

  return (
    <div className="min-h-screen bg-canvas">
      <BrowserBar />
      <Header activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId} />
      <Tabs tab={tab} setTab={setTab} />
      <main className="max-w-[920px] mx-auto px-4.5 pb-16" style={{ paddingTop: 24, paddingLeft: 18, paddingRight: 18 }}>
        {tab === "ledger" && <Ledger activeAgentId={activeAgentId} />}
        {tab === "intake" && <Intake onLogged={() => setTab("ledger")} />}
        {tab === "share" && <Share />}
        {tab === "agent" && <ReferrerPortal />}
        <TodoChips />
      </main>
    </div>
  );
}
