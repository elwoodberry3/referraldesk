# ReferralDesk — IAS Build 020
Dealership referral capture, attribution, and payout tracking. Replaces the "ask who referred you, write it on paper, mail the check" workflow with a system that credits the referrer at intake and tracks the payout to paid.

**Sector:** Automotive Retail & Dealership Operations
**Stack:** Next.js 14 (App Router) · Vercel · Tailwind · n8n Cloud · HubSpot · SMS

---

## What it is

Three screens, one config:

- **Payout Ledger** — every referral, its status, and a running owed/paid total.
- **Rep Intake** — log a referral at the desk in seconds; the automation chain fires.
- **Referral Link** — a per-rep link/QR a customer opens; submissions land pre-credited.

Plus a public **`/r/[code]`** landing page — the link a referred buyer actually opens.

## Demo mode vs. live

The app runs fully clickable with **zero credentials** — integrations are simulated and labeled as such in the UI. Set an env var and that integration goes live. See `.env.example`.

| Env var | Turns on |
|---|---|
| `N8N_WEBHOOK_URL` | Real n8n Cloud orchestration + drip |
| `HUBSPOT_TOKEN` | Buyer written to HubSpot (source of truth) |
| `SMS_WEBHOOK_URL` | Live confirmation text to the buyer |

## Install for a new dealership

Change **one block** — `dealership` in `config/build.config.ts`: name, short name, subdomain, brand color, rep, payout amount. Nothing else.

## Deploy to Vercel

```bash
npm install
npm run build          # verify it compiles
```

1. Push to GitHub (`ias-build-020-referraldesk`).
2. Import the repo in Vercel — framework auto-detects as Next.js.
3. Add env vars in Vercel when ready to go live (all optional for demo).
4. Point the subdomain (e.g. `referraldesk.betterseeseelye.com`) via CNAME.

## Known gaps (the deep-build tier)

These are visible on-screen as TODO chips — they are real, not hidden:

- `TODO_PERSISTENCE` — in-memory store resets on restart; production uses
  HubSpot as source of truth with n8n owning drip state.
- `TODO_PAYOUT_DISBURSE` — tracks who's owed $200; does not cut checks (ACH/check run).
- `TODO_FRAUD_GUARD` — no self-referral / duplicate detection yet.
- `TODO_MULTI_TENANT` — single rooftop only; multi-rooftop separation on
  n8n Cloud must be resolved before onboarding a second store.
