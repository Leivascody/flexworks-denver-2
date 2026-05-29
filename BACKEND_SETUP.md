# Deployment & Backend Setup

The deal site is a **single static `index.html`** plus two serverless functions for email tracking and tear-sheet delivery. Total deployment time: **~15 minutes**.

---

## What gets you live

1. **Static site** — `index.html` + `assets/`. Renders anywhere.
2. **`/api/track`** — receives investor activity events (gate acceptance, doc requests, contact-form submissions, calculator interactions). High-signal events trigger an immediate email to GSC.
3. **`/api/tearsheet`** — when an investor enters their amount + email in the Calculator, this generates a branded HTML tear sheet and emails it both to them and to GSC.

---

## Step 1 — Get accounts (5 min)

You need three free accounts:

| Service | Why | Free tier |
|---|---|---|
| **[Resend](https://resend.com)** | Email API — sends activity alerts to GSC and tear sheets to investors | 3,000 emails/month |
| **[Vercel](https://vercel.com)** | Hosts the static site + serverless functions | Hobby tier covers ~100k function calls/mo |
| **[Mapbox](https://mapbox.com)** | Interactive submarket map | 50,000 map loads/month |

Sign up for each. For Resend, also **add and verify your domain** (`greenwichstreetcap.com`) so emails send "from" you, not from `resend.dev`.

---

## Step 2 — Deploy to Vercel (5 min)

### Option A — GitHub (recommended)

1. Push the entire `1800-E-69th-Denver/` folder to a new GitHub repo (e.g. `gsc-deal-denver-ii`).
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Framework Preset: **Other** (it's a static site with serverless functions — Vercel auto-detects `/api/*.js`).
4. Click **Deploy**. You'll get a URL like `gsc-deal-denver-ii.vercel.app` within ~60 seconds.

### Option B — Vercel CLI

```bash
cd "1800-E-69th-Denver"
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 3 — Set environment variables (3 min)

In Vercel → your project → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | The API key from Resend (starts with `re_`) |
| `GSC_NOTIFY_EMAIL` | `info@greenwichstreetcap.com` (or whichever inbox should receive activity alerts) |

After adding env vars, **redeploy** from the Vercel dashboard (Deployments → ⋯ → Redeploy) so the functions pick up the new values.

---

## Step 4 — Wire the frontend to your APIs (2 min)

Open `index.html`. Near the bottom, find the `window.GSC_CONFIG` block:

```js
window.GSC_CONFIG = {
  MAPBOX_TOKEN: "",                         // ← paste your Mapbox public token here
  API_BASE: "",                              // ← paste your Vercel URL here, no trailing slash
  CALENDLY_URL: "https://calendly.com/...", // ← your real Calendly link
  ...
};
```

Fill in:
- `MAPBOX_TOKEN` — from mapbox.com → Account → Access Tokens (use a public/restricted token, not your secret token)
- `API_BASE` — your Vercel URL, e.g. `"https://gsc-deal-denver-ii.vercel.app"` (or your custom domain)
- `CALENDLY_URL` — Conner's Calendly booking link

Commit and push (or `vercel --prod` again) to pick up the change.

---

## Step 5 — Point a custom domain (optional, 3 min)

In Vercel → Settings → Domains, add e.g. `deals.greenwichstreetcap.com`. Vercel walks you through the DNS records (a single `CNAME`).

Suggested URL pattern: `deals.greenwichstreetcap.com/denver-ii` (so future deals live at `/houston-westchase`, `/austin-east`, etc.).

---

## Step 6 — Test the flow (2 min)

1. Open your live site.
2. Submit the access gate with a test name + email — you should receive an email at `GSC_NOTIFY_EMAIL` titled `[GSC Deal] gate-accepted: <name> (<email>)`.
3. Scroll to the Calculator. Click any preset, then click **Email Me My Projection**. Fill in your email. You should receive a beautifully branded tear sheet within 30 seconds; GSC should receive a separate alert email.
4. Click various tracked CTAs (Invest, Request Materials, doc rows). Each high-signal event triggers an email.

---

## What gets emailed to GSC

The backend filters to **high-signal events only** to avoid noise:

- `gate-accepted` — someone passed the accredited-investor gate
- `tearsheet-submit` — someone requested a personalized projection
- `contact-submit` — contact form submission
- `invest-request`, `invest-call` — clicked "Request Materials" or "Schedule a Call"
- `doc-ppm`, `doc-model` — requested access to the PPM or operating model
- `nav-invest` — clicked the top-nav "Invest" button

All other clicks (calculator preset changes, slider movement, photo views) are logged to Vercel function logs but **not** emailed. You can view the full log stream in Vercel → your project → Logs.

If you want a daily digest of low-signal events, add a Vercel Cron Job that posts the day's logs to your email — happy to add later.

---

## Customizing the tear-sheet PDF

The current implementation sends a polished HTML "tear sheet" via Resend (renders inline in Gmail/Outlook). To send a **real PDF attachment** instead:

1. Add `pdf-lib` or `@react-pdf/renderer` to `package.json` dependencies.
2. In `api/tearsheet.js`, replace the `renderTearsheet()` HTML generator with a PDF generator that returns a base64 buffer.
3. Pass the buffer to Resend's `attachments` array (the helper already supports this).

For the level of polish in the HTML version, most LPs won't notice the difference. Recommend shipping HTML first, adding PDF if specifically requested.

---

## Costs

| Service | Free tier | Typical month for 1 active deal | Paid tier if exceeded |
|---|---|---|---|
| Vercel Hobby | 100k function invocations | ~2-5k (covered) | Pro $20/mo |
| Resend | 3,000 emails/mo | ~50-200 emails (covered) | $20/mo for 50k |
| Mapbox | 50k map loads/mo | ~1-3k (covered) | $5 per 1k after |

**Likely cost: $0/mo for the first 2-3 deals.**

---

## Updating content

For copy or number changes on the live site: edit `index.html` → commit/push (or `vercel --prod`). Live within 30 seconds.

For brand changes (colors, fonts): edit `assets/tokens.css` and `assets/components.css` — these are copies from the central `Brand/05_Web_Resources/`. To sync from the master: `cp ../../Brand/05_Web_Resources/*.css assets/`.

---

## Cloning for a future deal

```bash
cp -r 1800-E-69th-Denver Houston-Westchase
cd Houston-Westchase
# Edit index.html — find/replace property name, address, KPI numbers
# Drop new property photos into assets/images/property/
# Update OG meta tags at top of index.html
# Update CONFIG.PROPERTY_COORDS for the new map pin
git init && vercel --prod
```

The brand system, components, calculator, sensitivity explorer, tearsheet generator — all work unchanged. Estimated time to clone for a new deal: **~90 minutes** (most of which is content editing, not engineering).

---

*Greenwich Street Capital · Deal Site v2 · Issued May 2026*
