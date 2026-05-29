// POST /api/tearsheet
// Generates a personalized one-page PDF projection for the investor and emails it.
// Body: { name, email, amount, deal }
// Returns: { ok: true } and sends two emails — one to investor (with PDF), one to GSC.

import { sendEmail, CORS_HEADERS } from "./_email.js";

const NOTIFY = process.env.GSC_NOTIFY_EMAIL || "info@greenwichstreetcap.com";
const BASE_FLOWS = [-250000, 2888, 19269, 19417, 21620, 434364]; // $250K base case
const BASE_AMOUNT = 250000;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).headers(CORS_HEADERS).end();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method-not-allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { name, email, amount, deal = "FlexWorks Denver II" } = body;
  if (!name || !email || !amount) return res.status(400).json({ ok: false, error: "missing-fields" });

  // Scale flows
  const scale = amount / BASE_AMOUNT;
  const flows = BASE_FLOWS.map(f => Math.round(f * scale));
  const totalDist = flows.slice(1).reduce((a, b) => a + b, 0);
  const profit = totalDist - amount;

  // Generate PDF via Browserless / playwright would be heavy in a serverless function.
  // Approach: generate a clean HTML tear sheet, deliver as an inline HTML email + PDF link.
  // The PDF generation itself can be added later by integrating @vercel/og or pdf-lib;
  // for now we send a polished HTML "tear sheet" as the email body.
  const tearsheetHtml = renderTearsheet({ name, email, amount, flows, totalDist, profit, deal });

  // Email 1: to the investor
  const r1 = await sendEmail({
    to: email,
    subject: `Your FlexWorks Denver II projection · $${amount.toLocaleString()} investment`,
    html: tearsheetHtml,
    replyTo: NOTIFY,
  });

  // Email 2: notify GSC
  await sendEmail({
    to: NOTIFY,
    subject: `[GSC Deal] Tear sheet sent: ${name} · $${amount.toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #11212F;">
        <h2 style="color: #003262;">Tear sheet sent</h2>
        <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) just generated a projection for <strong>$${amount.toLocaleString()}</strong> on <strong>${escapeHtml(deal)}</strong>.</p>
        <p>Projected net distributions: <strong>$${totalDist.toLocaleString()}</strong> (profit: $${profit.toLocaleString()}).</p>
        <p>Recommend following up within 24 hours.</p>
      </div>
    `,
    replyTo: email,
  });

  return res.status(200).json({ ok: true, sent: r1.ok });
}

function renderTearsheet({ name, email, amount, flows, totalDist, profit, deal }) {
  const flowRows = flows.slice(1).map((f, i) =>
    `<tr><td style="padding:8px 12px;color:#FDB515;font-weight:700;font-family:Arial,sans-serif;font-size:13px;">Year ${i+1}</td><td style="padding:8px 12px;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#fff;">$${f.toLocaleString()}</td></tr>`
  ).join("");

  return `
  <div style="background: #F8FAFC; padding: 40px 20px; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,50,98,.08);">
      <!-- Header -->
      <div style="background: #003262; color: #fff; padding: 28px 32px; border-top: 4px solid #FDB515;">
        <div style="font-family: Georgia, serif; font-size: 32px; font-weight: 700; color: #FDB515; letter-spacing: -.02em; line-height: 1;">GSC</div>
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: .15em; color: #CCD6E0; margin-top: 8px;">Personalized Investor Projection</div>
        <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 900; color: #fff; margin-top: 12px;">${escapeHtml(deal)}</div>
        <div style="font-size: 13px; color: #CCD6E0; margin-top: 4px;">Prepared for ${escapeHtml(name)}</div>
      </div>

      <!-- Headline metrics -->
      <div style="padding: 32px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
          <div style="padding: 14px; border-left: 3px solid #FDB515; background: #F8FAFC;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .15em; color: #64748B; font-weight: 700;">Your Investment</div>
            <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 900; color: #003262; margin-top: 4px;">$${amount.toLocaleString()}</div>
          </div>
          <div style="padding: 14px; border-left: 3px solid #FDB515; background: #F8FAFC;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .15em; color: #64748B; font-weight: 700;">Net Investor IRR</div>
            <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 900; color: #003262; margin-top: 4px;">16.6%</div>
          </div>
          <div style="padding: 14px; border-left: 3px solid #FDB515; background: #F8FAFC;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .15em; color: #64748B; font-weight: 700;">Total Profit</div>
            <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 900; color: #137752; margin-top: 4px;">$${profit.toLocaleString()}</div>
          </div>
          <div style="padding: 14px; border-left: 3px solid #FDB515; background: #F8FAFC;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .15em; color: #64748B; font-weight: 700;">Equity Multiple</div>
            <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 900; color: #003262; margin-top: 4px;">2.0x</div>
          </div>
        </div>

        <!-- Year-by-year cash flow -->
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: .15em; color: #B8860B; font-weight: 700; margin-bottom: 8px;">Projected Cash Flows</div>
        <table style="width: 100%; border-collapse: collapse; background: #003262; border-radius: 4px; overflow: hidden;">
          <thead><tr><th style="padding: 8px 12px; text-align: left; font-family: Arial, sans-serif; font-size: 11px; color: #CCD6E0; text-transform: uppercase; letter-spacing: .08em;">Year</th><th style="padding: 8px 12px; text-align: right; font-family: Arial, sans-serif; font-size: 11px; color: #CCD6E0; text-transform: uppercase; letter-spacing: .08em;">Distribution</th></tr></thead>
          <tbody>${flowRows}</tbody>
          <tfoot><tr style="border-top: 2px solid #FDB515; background: rgba(253,181,21,.1);"><td style="padding: 10px 12px; color: #FDB515; font-weight: 800; font-family: Arial, sans-serif; font-size: 14px;">Total Distributions</td><td style="padding: 10px 12px; text-align: right; color: #fff; font-weight: 800; font-family: Arial, sans-serif; font-size: 14px;">$${totalDist.toLocaleString()}</td></tr></tfoot>
        </table>

        <!-- CTA -->
        <div style="margin-top: 32px; padding: 20px; background: #003262; border-radius: 4px; text-align: center;">
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #FDB515; font-weight: 800; margin-bottom: 8px;">Ready to take the next step?</div>
          <div style="font-size: 13px; color: #CCD6E0; margin-bottom: 16px;">Conner Thomas will follow up within 24 hours, or:</div>
          <a href="https://calendly.com/conner-thomas-gsc/30min" style="display: inline-block; background: #FDB515; color: #003262; padding: 12px 22px; text-decoration: none; font-family: Arial, sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .04em; border-radius: 2px;">Schedule a Call</a>
        </div>

        <!-- Disclaimer -->
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #F1F5F9; font-size: 10px; color: #64748B; line-height: 1.55;">
          Projections shown are estimates based on the underwriting in the Confidential Investment Memorandum (April 2026). Actual results will differ. Past performance is not a guarantee. This is not an offer to sell or solicitation of an offer to buy securities. Any offering will only be made pursuant to a definitive Private Placement Memorandum. Please review the full disclaimer in the deal materials.
        </div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 16px; font-size: 11px; color: #64748B;">Greenwich Street Capital · greenwichstreetcap.com</div>
  </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
