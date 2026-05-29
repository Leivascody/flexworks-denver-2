// Shared email helper using Resend (https://resend.com)
// Set env var RESEND_API_KEY in Vercel project settings.
// Set env var GSC_NOTIFY_EMAIL to the address that should receive activity alerts.

export async function sendEmail({ to, from, subject, html, replyTo, cc, attachments }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not set; skipping send");
    return { ok: false, error: "no-api-key" };
  }
  const body = {
    from: from || "GSC Deal Site <noreply@greenwichstreetcap.com>",
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;
  if (cc) body.cc = Array.isArray(cc) ? cc : [cc];
  if (attachments) body.attachments = attachments;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[email] Resend error:", data);
      return { ok: false, error: data };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] fetch error:", err);
    return { ok: false, error: err.message };
  }
}

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
