import { NextResponse } from "next/server";
import { addReferral, listReferrals } from "@/lib/store";
import { fireN8nWebhook, writeHubSpotContact, sendConfirmationSms } from "@/lib/integrations";
import { buildConfig } from "@/config/build.config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ referrals: listReferrals() });
}

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { buyerName } = body;
  if (!buyerName) {
    return NextResponse.json({ error: "Buyer name is required." }, { status: 400 });
  }

  // Resolve the operating referrer (if any) and the OWNING agent.
  // Contact ownership always rolls up to an agent — the referrer owns nothing.
  const referrer = body.referrerSlug
    ? buildConfig.referrers.find((rf) => rf.slug === body.referrerSlug)
    : undefined;

  const ownerAgentId = referrer?.agentId
    || body.ownerAgentId
    || buildConfig.agents.find((a) => a.isRooftopAdmin)?.id
    || buildConfig.agents[0].id;

  const referrerName = referrer?.name || body.referrerName || "Direct";

  const record = addReferral({
    buyerName,
    buyerPhone: body.buyerPhone || "",
    vehicle: body.vehicle || "",
    referrerId: referrer?.id,
    referrerName,
    ownerAgentId,
  });

  const [crm, sms, n8n] = await Promise.all([
    writeHubSpotContact(record),
    sendConfirmationSms(record),
    fireN8nWebhook({ event: "referral.received", record }),
  ]);

  return NextResponse.json({
    record,
    actions: {
      crm,
      sms,
      n8n,
      referrerCredited: { ok: true, demo: false, detail: `${referrerName} operated · contact owned by ${ownerAgentId}` },
    },
  });
}
