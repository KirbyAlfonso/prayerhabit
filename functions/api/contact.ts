// Cloudflare Pages Function: POST /api/contact
// No database. Sends the message by email through Resend, then forgets it.
// Env vars (Pages > Settings > Variables and Secrets):
//   RESEND_API_KEY  (secret)  your Resend API key
//   CONTACT_TO                where messages are delivered, e.g. you@gmail.com
//   CONTACT_FROM              verified sender, e.g. "Prayer Habit <noreply@prayerhabit.com>"

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const done = (ok: boolean, error?: string, status = ok ? 200 : 400) =>
    wantsJson
      ? json(ok ? { ok: true } : { ok: false, error }, status)
      : Response.redirect(new URL(`/contact-us/?${ok ? 'sent' : 'error'}=1`, request.url).toString(), 303);

  // Same-origin only
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return done(false, 'Forbidden', 403);

  let form: FormData;
  try { form = await request.formData(); } catch { return done(false, 'Invalid request'); }

  // Honeypot: pretend success so bots move on
  if ((form.get('website') as string)?.trim()) return done(true);

  const name = String(form.get('name') ?? '').trim().slice(0, 100);
  const email = String(form.get('email') ?? '').trim().slice(0, 200);
  const subject = String(form.get('subject') ?? '').trim().slice(0, 150);
  const message = String(form.get('message') ?? '').trim().slice(0, 5000);

  if (!name || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return done(false, 'Please fill in all fields with a valid email address.');
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return done(false, 'The form is not configured yet.', 500);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `[Prayer Habit] ${subject.replace(/[\r\n]+/g, ' ')}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
    }),
  });

  if (!res.ok) return done(false, 'We could not send your message. Please try again later.', 502);
  return done(true);
};

// Anything other than POST
export const onRequest = async () => json({ ok: false, error: 'Method not allowed' }, 405);
