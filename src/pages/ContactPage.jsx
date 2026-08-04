import { useState } from 'react';
import '../styles/shared.css';
import '../styles/contact-page.css';
import '../styles/contact-crystal.css';
import ContactCrystal from '../components/ContactCrystal';

const DROP_PATH = 'M50 2 C56 18 76 43 88 67 C101 93 83 128 50 128 C17 128 -1 93 12 67 C24 43 44 18 50 2 Z';
const DROP_INNER_PATH = 'M50 13 C55 27 72 49 82 70 C93 92 78 119 50 120 C22 119 7 92 18 70 C28 49 45 27 50 13 Z';
const DROP_BOTTOM_PATH = 'M19 88 C26 112 73 121 86 91 C84 112 70 128 50 128 C29 128 14 112 12 91 C14 90 16 89 19 88 Z';
const DROP_GLOSS_PATH = 'M38 24 C29 42 20 60 20 77 C20 94 29 105 39 112 C32 92 31 67 36 45 C39 34 44 21 48 12 C45 15 41 19 38 24 Z';

const CONTACTS = [
	{
		title: 'Email',
		subtitle: 'contact@headinthecloudshaven.com',
		href: 'mailto:contact@headinthecloudshaven.com',
		icon: '✉',
		hue: 'rgba(245,175,210,0.94)',
		size: 188,
		delay: 0,
	},
	{
		title: 'Resume',
		subtitle: 'Download PDF',
		href: '/contact/resume.pdf',
		iconImage: '/contact/resume.png',
		hue: 'rgba(255,217,170,0.94)',
		size: 154,
		delay: -2.2,
	},
	{
		title: 'LinkedIn',
		subtitle: 'Professional profile',
		href: 'https://linkedin.com/in/jacob-grieco',
		iconImage: '/contact/linkedin.png',
		hue: 'rgba(175,220,255,0.94)',
		size: 156,
		delay: -1.6,
	},
	{
		title: 'GitHub',
		subtitle: 'Projects and code',
		href: 'https://github.com/JacobDGrieco',
		iconImage: '/contact/github.png',
		hue: 'rgba(212,193,255,0.94)',
		size: 152,
		delay: -0.7,
	},
];

const FALLBACK_ERROR = 'Something went wrong. Try emailing directly.';

export default function ContactPage() {
	const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
	const [status, setStatus] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

	function handleChange(e) {
		setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setStatus('sending');
		setErrorMessage('');

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			let payload = null;
			try {
				payload = await res.json();
			} catch {
				payload = null;
			}

			if (res.ok && payload?.ok !== false) {
				setStatus('sent');
				return;
			}

			setErrorMessage(payload?.detail || payload?.error || FALLBACK_ERROR);
			setStatus('error');
		} catch (error) {
			setErrorMessage(error?.message || FALLBACK_ERROR);
			setStatus('error');
		}
	}

	return (
		<div className="page-section">
			<div className="page-header">
				<div className="page-title">Contact</div>
				<div className="page-subtitle">let&apos;s connect</div>
			</div>

			<div className="contact-page__cluster-shell">
				<div className="contact-page__cluster">
					<div className="contact-page__contact-list">
						{CONTACTS.map((item) => (
							<div key={item.title} className="contact-page__orbit">
								<ContactCrystal {...item} />
							</div>
						))}
					</div>

					<div className="contact-page__message-core glass-card">
						<div className="contact-page__message-shell">
							<svg className="contact-page__message-vessel" viewBox="0 0 100 132" preserveAspectRatio="none" aria-hidden="true" focusable="false">
								<path className="contact-page__message-body" d={DROP_PATH} />
								<path className="contact-page__message-inner" d={DROP_INNER_PATH} />
								<path className="contact-page__message-bottom" d={DROP_BOTTOM_PATH} />
								<path className="contact-page__message-gloss" d={DROP_GLOSS_PATH} />
								<path className="contact-page__message-rim" d={DROP_PATH} />
							</svg>
							<div className="contact-page__message-content">
								<div className="contact-page__eyebrow">Send a Message</div>
								<div className="contact-page__headshot-frame">
									<img src="/headshot.jpg" alt="Jacob Grieco" width="4254" height="3429" loading="lazy" className="contact-page__headshot" />
								</div>
								{status === 'sent' ? (
									<div className="contact-page__success" role="status" aria-live="polite">Message sent — I&apos;ll be in touch soon</div>
								) : (
									<form onSubmit={handleSubmit} className="contact-page__form">
										<label className="contact-page__field">
											<span className="contact-page__label">Name</span>
											<input name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Jane Grieco" required className="contact-page__input" />
										</label>
										<label className="contact-page__field">
											<span className="contact-page__label">Email</span>
											<input name="email" type="email" autoComplete="email" spellCheck={false} value={form.email} onChange={handleChange} placeholder="jane@example.com" required className="contact-page__input" />
										</label>
										<label className="contact-page__field">
											<span className="contact-page__label">Subject</span>
											<input name="subject" autoComplete="off" value={form.subject} onChange={handleChange} placeholder="Project inquiry" className="contact-page__input" />
										</label>
										<label className="contact-page__field contact-page__field--message">
											<span className="contact-page__label">Message</span>
											<textarea name="message" autoComplete="off" value={form.message} onChange={handleChange} placeholder="Tell me about your project…" required rows={5} className="contact-page__textarea" />
										</label>
										<input
											name="company"
											value={form.company}
											onChange={handleChange}
											tabIndex={-1}
											autoComplete="off"
											className="contact-page__honeypot"
											aria-hidden="true"
										/>
										{status === 'error' && <div className="contact-page__error" role="alert">{errorMessage || FALLBACK_ERROR}</div>}
										<button type="submit" disabled={status === 'sending'} className="contact-page__button">
											{status === 'sending' ? 'Sending…' : 'Send Message'}
										</button>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
