// POST /api/track
// Receives investor activity events and sends an email digest to GSC.
// Body: { event, props, investor, page, ts, referrer, path }

import { sendEmail, CORS_HEADERS } from "./_email.js";

const NOTIFY = process.env.GSC_NOTIFY_EMAIL || "info@greenwichstreetcap.com";

// High-signal events trigger an immediate email. Others are summarized hourly (TODO).
const HIGH_SIGNAL = new Set([
  "gate-accepted",
  "tearsheet-submit",
  "contact-submit",
  "invest-request",
  "invest-call",
  "doc-ppm",
  "doc-model",
  "nav-invest",
]);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).headers(CORS_HEADERS).end();
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method-not-allowed" });

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const { event, props = {}, investor, page, ts, referrer, path } = body;

  // Always log
  console.log("[track]", JSON.stringify({ event, investor, page, props }));

  // Only email on high-signal events
  if (HIGH_SIGNAL.has(event)) {
    const html = `
      <div style="font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; max-width: 520px; color: #11212F;">
        <div style="background: #003262; color: #FDB515; padding: 16px 20px; font-family: Georgia, serif; font-size: 22px; font-weight: 700;">
          GSC &middot; Investor Activity
        </div>
        <div style="padding: 24px 20px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: .18em; color: #B8860B; font-weight: 700; margin-bottom: 8px;">Event</div>
          <div style="font-family: Arial, sans-serif; font-size: 22px; font-weight: 800; color: #003262; margin-bottom: 16px;">${event.replace(/-/g, " ")}</div>
          ${investor ? `
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: .18em; color: #B8860B; font-weight: 700; margin-bottom: 8px;">Investor</div>
            <div style="font-size: 15px; color: #11212F; margin-bottom: 4px;"><strong>${escapeHtml(investor.name || "—")}</strong> &middot; ${escapeHtml(investor.email || "—")}</div>
            ${investor.firm ? `<div style="font-size: 13px; color: #64748B; margin-bottom: 16px;">${escapeHtml(investor.firm)}</div>` : ""}
          ` : ""}
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: .18em; color: #B8860B; font-weight: 700; margin: 16px 0 8px;">Details</div>
          <pre style="background: #F8FAFC; border-left: 3px solid #FDB515; padding: 12px; font-size: 12px; color: #334155; overflow-x: auto; margin: 0;">${escapeHtml(JSON.stringify(props, null, 2))}</pre>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            Page: ${escapeHtml(page || "FlexWorks Denver II")}<br>
            Time: ${escapeHtml(ts || new Date().toISOString())}<br>
            Referrer: ${escapeHtml(referrer || "direct")}
          </div>
        </div>
        <div style="background: #003262; color: #CCD6E0; padding: 10px 20px; font-size: 11px;">
          Sent by deal site backend &middot; Greenwich Street Capital
        </div>
      </div>
    `;
    await sendEmail({
      to: NOTIFY,
      subject: `[GSC Deal] ${event}: ${investor?.name || "anonymous"} (${investor?.email || "no email"})`,
      html,
      replyTo: investor?.email,
    });
  }

  return res.status(200).json({ ok: true });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
