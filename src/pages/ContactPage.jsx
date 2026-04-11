import { useState } from 'react'
import '../styles/shared.css'
import '../styles/contact-page.css'

const LINKS = [
  { label: 'Email', value: 'jacobdgrieco@gmail.com', href: 'mailto:jacobdgrieco@gmail.com', icon: '✉' },
  { label: 'LinkedIn', value: 'linkedin.com/in/jacob-grieco', href: 'https://linkedin.com/in/jacob-grieco', icon: '⬡' },
  { label: 'GitHub', value: 'github.com/JacobDGrieco', href: 'https://github.com/JacobDGrieco', icon: '⬡' },
  { label: 'Resume', value: 'Download PDF', href: '/resume.pdf', icon: '↓' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <div className="page-title">Contact</div>
        <div className="page-subtitle">let&apos;s connect</div>
      </div>

      <div className="contact-page__layout">
        <div className="contact-page__card contact-page__card--links glass-card">
          <div className="contact-page__eyebrow">Direct Links</div>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-page__link"
            >
              <span className="contact-page__link-icon">{link.icon}</span>
              <div>
                <div className="contact-page__link-label">{link.label}</div>
                <div className="contact-page__link-value">{link.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="contact-page__card contact-page__card--form glass-card">
          <div className="contact-page__eyebrow contact-page__eyebrow--spaced">Send a Message</div>
          {status === 'sent' ? (
            <div className="contact-page__success">Message sent — I&apos;ll be in touch soon ☁</div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-page__form">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="contact-page__input" />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Your email" required className="contact-page__input" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message" required rows={4} className="contact-page__textarea" />
              {status === 'error' && <div className="contact-page__error">Something went wrong — try emailing directly.</div>}
              <button type="submit" disabled={status === 'sending'} className="contact-page__button">
                {status === 'sending' ? 'Sending…' : 'Send →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
