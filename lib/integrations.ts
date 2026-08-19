/**
 * lib/integrations.ts — the live-integration seam
 * ------------------------------------------------------------
 * Every function here is a no-op that returns { ok, demo:true } UNLESS
 * the matching env var is set. This is what lets the app be:
 *   - fully clickable on Wednesday with no credentials, AND
 *   - live the instant real keys are pasted into Vercel env vars.
 *
 * No secrets live in code. Ever. They come from process.env only.
 */

import { buildConfig } from "@/config/build.config";

type Result = { ok: boolean; demo: boolean; detail: string };

/**
 * Fire the n8n Cloud webhook that owns orchestration + drip state.
 * TODO_N8N_WEBHOOK: set N8N_WEBHOOK_URL in Vercel to go live.
 */
export async function fireN8nWebhook(payload: Record<string, unknown>): Promise<Result> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return { ok: true, demo: true, detail: "n8n webhook simulated (no N8N_WEBHOOK_URL)" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "referraldesk", dealership: buildConfig.dealership.name, ...payload }),
    });
    return { ok: res.ok, demo: false, detail: `n8n responded ${res.status}` };
  } catch (e) {
    return { ok: false, demo: false, detail: `n8n error: ${(e as Error).message}` };
  }
}

/**
 * Write / upsert the buyer as a HubSpot contact (source of truth).
 * TODO_CRM_WRITEBACK: set HUBSPOT_TOKEN to go live.
 * HubSpot Free tier: 10 custom-property ceiling. Uses standard
 * fields + last_message / last_submitted_at / submission_count only.
 */
export async function writeHubSpotContact(input: {
  buyerName: string; buyerPhone: string; vehicle: string; referrerName: string;
}): Promise<Result> {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) return { ok: true, demo: true, detail: "HubSpot write simulated (no HUBSPOT_TOKEN)" };
  try {
    const [firstname, ...rest] = input.buyerName.split(" ");
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        properties: {
          firstname,
          lastname: rest.join(" "),
          phone: input.buyerPhone,
          last_message: `Referral from ${input.referrerName} — interested in ${input.vehicle}`,
          last_submitted_at: new Date().toISOString(),
        },
      }),
    });
    return { ok: res.ok, demo: false, detail: `HubSpot responded ${res.status}` };
  } catch (e) {
    return { ok: false, demo: false, detail: `HubSpot error: ${(e as Error).message}` };
  }
}

/**
 * Send the buyer a confirmation text.
 * TODO_SMS: set SMS_WEBHOOK_URL (Twilio proxy or n8n SMS node) to go live.
 * Kept as a generic webhook so the SMS provider is swappable.
 */
export async function sendConfirmationSms(input: { buyerPhone: string; buyerName: string }): Promise<Result> {
  const url = process.env.SMS_WEBHOOK_URL;
  if (!url) return { ok: true, demo: true, detail: "SMS simulated (no SMS_WEBHOOK_URL)" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: input.buyerPhone,
        body: `Thanks ${input.buyerName.split(" ")[0]} — ${buildConfig.dealership.shortName} got your info and will reach out shortly.`,
      }),
    });
    return { ok: res.ok, demo: false, detail: `SMS responded ${res.status}` };
  } catch (e) {
    return { ok: false, demo: false, detail: `SMS error: ${(e as Error).message}` };
  }
}
