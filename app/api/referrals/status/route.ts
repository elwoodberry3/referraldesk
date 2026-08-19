import { NextResponse } from "next/server";
import { advanceReferral } from "@/lib/store";
import { fireN8nWebhook } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Referral id is required." }, { status: 400 });
  }

  const updated = advanceReferral(body.id);
  if (!updated) {
    return NextResponse.json({ error: "Referral not found." }, { status: 404 });
  }

  // When a referral becomes Owed, notify the payout side via n8n.
  if (updated.payout === "Owed") {
    await fireN8nWebhook({ event: "referral.owed", record: updated });
  }

  return NextResponse.json({ record: updated });
}
