function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject = '', message, company = '' } = req.body ?? {}

  if (company) {
    return res.status(200).json({ ok: true })
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL
  const fromEmail = process.env.CONTACT_FROM_EMAIL

  if (!resendApiKey || !toEmail || !fromEmail) {
    return res.status(500).json({ error: 'Email service is not configured' })
  }

  const safeName = escapeHtml(name).slice(0, 120)
  const safeEmail = escapeHtml(email).slice(0, 160)
  const safeSubject = escapeHtml(subject).slice(0, 160)
  const safeMessage = escapeHtml(message).slice(0, 4000).replace(/\n/g, '<br />')

  const emailSubject = `HITCH contact${safeSubject ? ` — ${safeSubject}` : ''}`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: emailSubject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.55;color:#2f2342;max-width:640px;margin:0 auto;padding:24px;background:#fff8fc;border:1px solid #f0d6e7;border-radius:16px;">
          <h2 style="margin:0 0 16px;font-size:22px;color:#7f4ea0;">New HITCH contact form message</h2>
          <p style="margin:0 0 12px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:0 0 12px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:0 0 12px;"><strong>Subject:</strong> ${safeSubject || 'None provided'}</p>
          <div style="margin-top:18px;padding:16px;background:#ffffff;border:1px solid #ecd7ea;border-radius:12px;">
            <strong>Message</strong>
            <p style="margin:10px 0 0;white-space:normal;">${safeMessage}</p>
          </div>
        </div>
      `,
      text: `New HITCH contact form message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'None provided'}\n\nMessage:\n${message}`,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Resend error:', errorText)
    return res.status(502).json({ error: 'Failed to send email' })
  }

  return res.status(200).json({ ok: true })
}
