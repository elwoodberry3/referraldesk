import { NextResponse } from "next/server";
import { addReferral, listReferrals } from "@/lib/store";
import { fireN8nWebhook, writeHubSpotContact, sendConfirmationSms } from "@/lib/integrations";

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

  const { buyerName, referrerName } = body;
  if (!buyerName || !referrerName) {
    return NextResponse.json(
      { error: "Buyer name and referrer are both required." },
      { status: 400 }
    );
  }

  const record = addReferral({
    buyerName,
    buyerPhone: body.buyerPhone || "",
    vehicle: body.vehicle || "",
    referrerName,
  });

  // Fire the automation chain. Each returns demo:true when no key is set,
  // so the whole flow succeeds in demo mode and goes live with credentials.
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
      referrerCredited: { ok: true, demo: false, detail: `${referrerName} credited` },
    },
  });
}
