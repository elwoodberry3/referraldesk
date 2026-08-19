"use client";
import React, { useState } from "react";
import { BrowserBar, Header, Tabs } from "@/components/Chrome";
import { Ledger } from "@/components/Ledger";
import { Intake } from "@/components/Intake";
import { Share } from "@/components/Share";
import { TodoChips } from "@/components/ui";

export default function Page() {
  const [tab, setTab] = useState("ledger");
  return (
    <div className="min-h-screen bg-canvas">
      <BrowserBar />
      <Header />
      <Tabs tab={tab} setTab={setTab} />
      <main className="max-w-[920px] mx-auto px-4.5 pb-16" style={{ paddingTop: 24, paddingLeft: 18, paddingRight: 18 }}>
        {tab === "ledger" && <Ledger />}
        {tab === "intake" && <Intake onLogged={() => setTab("ledger")} />}
        {tab === "share" && <Share />}
        <TodoChips />
      </main>
    </div>
  );
}
